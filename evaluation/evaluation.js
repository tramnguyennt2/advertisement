const fs = require("fs");
const nano = require("nano")("http://huyentk:Huyen1312@localhost:5984");
const db = nano.use("advertisement");
const ContentBasedRecommender = require("../recommender/content-based-recommender/index");
const content_based = new ContentBasedRecommender({
    maxSimilarDocuments: 10,
    minScore: 0,
    debug: false
});

const recommender = require('../recommender/recommender');
const evaluation_cf = require('./evaluation_cf_multiple_user');
const handle_file = require('../utils/handle_file');

// ---------------------- USER FILE ------------------------
const userTrainFileMLs = "evaluation/train/movielens/user_train_ua.user";
const userTrainFileACs = "evaluation/train/adclicks/user_train_ad.user";

// ----------------- REFORMAT TEST AND TRAINING FILE -------------------
const docTrainFileMLs = "evaluation/train/movielens/doc_train_ua.txt";
const docTrainFileAcsCF = "evaluation/train/adclicks/doc_train_ad_cf.txt";
const docTrainFileAcsCF300 = "evaluation/train/adclicks/doc_train_ad_cf_300.txt";

const maxSimilarDocuments = 10;

const resultACsCF = "evaluation/results/adclicks/result_ad_cf.txt";
const resultACsCF300 = "evaluation/results/adclicks/result_ad_cf_300.txt";

const resultACsCB = "evaluation/results/adclicks/result_cb.txt";

module.exports = {
    getCFResult: function () {
        return new Promise(function (resolve, reject) {
            handle_file.readUserStream(userTrainFileMLs).then(users => {
                handle_file.readDocsFile(docTrainFileMLs).then(d => {
                    let docs = JSON.parse(JSON.stringify(d));
                    evaluation_cf.normalizeDocsE(docs, users).then(avgs => {
                        // Step 2: get cosin similarity
                        evaluation_cf.getCosinSimilarityE(docs, users).then(sims => {
                            // Step 3: get item need to recommend
                            evaluation_cf.getItemNeedToRecommendE(docs, sims, users).then(item_need_to_recommends => {
                                // Step 4: predict
                                evaluation_cf.predictE(item_need_to_recommends, avgs, users).then(results => {
                                    let final_results = {};
                                    for (let i = 0; i < users.length; i++) {
                                        let user_id = users[i];
                                        let result = results[user_id];
                                        evaluation_cf.sortE(result, user_id).then(result => {
                                            if (result.length > maxSimilarDocuments) result = result.splice(0, maxSimilarDocuments);
                                            final_results[user_id] = result;
                                        });
                                    }
                                    resolve(final_results);
                                });
                            });
                        });
                    }).catch(err => reject(err));
                });
            });
        });
    },

    getCFResultACs: function () {
        return new Promise(function (resolve, reject) {
            handle_file.readUserStream(userTrainFileACs).then(users => {
                handle_file.readDocsFile(docTrainFileAcsCF300).then(d => {
                    let docs = JSON.parse(JSON.stringify(d));
                    evaluation_cf.normalizeDocsE(docs, users).then(avgs => {
                        // Step 2: get cosin similarity
                        evaluation_cf.getCosinSimilarityE(docs, users).then(sims => {
                            // Step 3: get item need to recommend
                            evaluation_cf.getItemNeedToRecommendE(docs, sims, users).then(item_need_to_recommends => {
                                // Step 4: predict
                                evaluation_cf.predictE(item_need_to_recommends, avgs, users).then(results => {
                                    let final_results = {};
                                    for (let i = 0; i < users.length; i++) {
                                        let user_id = users[i];
                                        let result = results[user_id];
                                        evaluation_cf.sortE(result, user_id).then(result => {
                                            console.log(result.length);
                                            if (result.length > maxSimilarDocuments) {
                                                result = result.splice(0, maxSimilarDocuments);
                                            } else {
                                                for (let i = result.length; i < maxSimilarDocuments; i++) {
                                                    result.push({
                                                        id: generateRandomNumber(1, 3000).toString(),
                                                        score: 0
                                                    })
                                                }
                                            }
                                            final_results[user_id] = result;
                                        });
                                    }
                                    resolve(final_results);
                                });
                            });
                        });
                    }).catch(err => reject(err));
                });
            });
        });
    },

    getContentBased: function () {
        return new Promise(function (resolve, reject) {
            let item_arr = [], cb = {};
            handle_file.readDocsFile(docTrainFileAcsCF300).then(trainData => {
                trainData = JSON.parse(JSON.stringify(trainData));
                handle_file.readUserStream(userTrainFileACs).then(users => {
                    users.forEach(user => {
                        let items = trainData[user];
                        items.forEach(item => {
                            if (item_arr.indexOf(item.item) <= -1) {
                                item_arr.push(item.item);
                            }
                        });
                    });
                    setTimeout(function () {
                        let count = 0;
                        item_arr.forEach(item => {
                            cb[item] = [];
                            recommender.getContentBasedResult("ad-" + item).then(cb_results => {
                                count++;
                                cb[item].push(cb_results);
                                fs.writeFile(resultACsCB300, JSON.stringify(cb), function (err) {
                                    if (err) {
                                        return console.log(err);
                                    }
                                    console.log(count);
                                });
                            });

                        });
                    }, 60000);
                });
            });
        });
    },

    getHybridRecommend: function () {
        return new Promise(function (resolve, reject) {
            // get unique item of user
            handle_file.readDocsFile(docTrainFileAcsCF300).then(trainData => {
                let weight = 0.3;
                trainData = JSON.parse(JSON.stringify(trainData));
                handle_file.readDocsFile(resultACsCF300).then(cfResultData => {
                    handle_file.readDocsFile(resultACsCB).then(cbResultData => {
                        cfResultData = JSON.parse(JSON.stringify(cfResultData));
                        cbResultData = JSON.parse(JSON.stringify(cbResultData));
                        let results = {};
                        for (let user_id in cfResultData) {
                            results[user_id] = [];
                            let cf_results = cfResultData[user_id];
                            cf_results.forEach(item => {
                                item.id = "ad-" + item.id;
                                item.score = (item.score - 1) / 3;
                            });
                            //find content-based
                            let train_items = trainData[user_id];
                            train_items.forEach(item => {
                                let output = [];
                                let cb_results = cbResultData[item.item][0];
                                let unique_arr = [];
                                cb_results.forEach(cb_item => {
                                    if (unique_arr.indexOf(cb_item.id) <= -1)
                                        unique_arr.push(cb_item.id);
                                });
                                cf_results.forEach(cf_item => {
                                    if (unique_arr.indexOf(cf_item.id) <= -1)
                                        unique_arr.push(cf_item.id);
                                });
                                unique_arr.forEach(u_item => {
                                    let cb_score = 0, cf_score = 0;
                                    let cb_found = cb_results.filter(function (el) {
                                        return el.id === u_item;
                                    });
                                    if (cb_found.length > 0) {
                                        cb_score = cb_found[0].score;
                                    }
                                    let cf_found = cf_results.filter(function (el) {
                                        return el.id === u_item;
                                    });
                                    if (cf_found.length > 0) {
                                        cf_score = cf_found[0].score;
                                    }
                                    output.push({
                                        id: u_item,
                                        score: (weight * cb_score + cf_score) / (weight + 1)
                                    })
                                });
                                sort(output).then(result => {
                                    if (result.length > 10)
                                        result = result.splice(0, 10);
                                    results[user_id].push({
                                        item: item.item,
                                        recommend_items: result
                                    });
                                });
                            });
                        }
                        setTimeout(function () {
                            resolve(results);
                        }, 60000);
                    });
                });
            });
        });
    },

    getCBEvaluation: function () {
        return new Promise(function (resolve, reject) {
            // get unique item of user
            handle_file.readDocsFile(docTrainFileAcsCF300).then(trainData => {
                trainData = JSON.parse(JSON.stringify(trainData));
                handle_file.readUserStream(userTrainFileACs).then(users => {
                    handle_file.readDocsFile(resultACsCB).then(cbResultData => {
                        cbResultData = JSON.parse(JSON.stringify(cbResultData));
                        let results = {};
                        users.forEach(user_id => {
                            console.log(user_id);
                            results[user_id] = [];
                            let train_items = trainData[user_id];
                            train_items.forEach(item => {
                                let output = cbResultData[item.item][0];
                                sort(output).then(result => {
                                    if (result.length > 10)
                                        result = result.splice(0, 10);
                                    results[user_id].push({
                                        item: item.item,
                                        recommend_items: result
                                    });
                                });
                            });
                        });
                        setTimeout(function () {
                            resolve(results);
                        }, 60000);
                    });
                });
            });
        });
    },

    getContentBasedSaveFile: function () {
        return new Promise(function (resolve, reject) {
            let itemSave = {};
            db.view("items", "all-item-e", {
                include_docs: true
            }).then(body => {
                let documents = [];
                body.rows.forEach(doc => {
                    let obj = {
                        id: doc.doc._id,
                        content: doc.doc.content,
                        token: doc.doc.token
                    };
                    documents.push(obj);
                });
                return documents;
            }).then(function (documents) {
                documents.forEach(item => {
                    console.time("content-based " + item.id);
                    content_based.trainOpt(documents, item.id);
                    const similarDocuments = content_based.getSimilarDocuments(
                        item.id,
                        0,
                        10
                    );
                    console.timeEnd("content-based " + item.id);
                    itemSave[item.id] = similarDocuments;
                });
                resolve(itemSave);
            }).catch(function (err) {
                reject(new Error(err));
            });
        });
    }
};

function sort(arr) {
    return new Promise(function (resolve, reject) {
        resolve(arr.sort(compare));
    });
}

function compare(a, b) {
    const ratingA = a.score;
    const ratingB = b.score;
    let comparison = 0;
    if (ratingA > ratingB) {
        comparison = -1;
    } else if (ratingA < ratingB) {
        comparison = 1;
    }
    return comparison;
}

function generateRandomNumber(min_value, max_value) {
    return Math.floor(Math.random() * (max_value - min_value + 1)) + min_value;
}