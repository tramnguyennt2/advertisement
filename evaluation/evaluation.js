const fs = require("fs");
const ug = require("ug");

const recommender = require('../recommender/recommender');
const evaluation_cf = require('./evaluation_cf_multiple_user');
const handle_file = require('../utils/handle_file');

// ---------------------- USER FILE ------------------------
const userTrainFileMLs = "evaluation/train/movielens/user_train_ua.user";
const userTrainFileACs = "evaluation/train/adclicks/user_train_ad.user";

// ----------------- REFORMAT TEST AND TRAINING FILE -------------------
// reformat by user_id: [{item: "item", rating: "rating"}] of trainFile
const docTrainFileMLs = "evaluation/train/movielens/doc_train_ua.txt";
const docTrainFileACs = "evaluation/train/adclicks/doc_train_ad.txt";
const docTrainFileAcsCF = "evaluation/train/adclicks/doc_train_ad_cf.txt";

const maxSimilarDocuments = 10;

const resultACsCF = "evaluation/results/adclicks/result_ad_cf.txt";
const resultACsGraph = "evaluation/results/adclicks/result_ad_graph.txt";
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
                handle_file.readDocsFile(docTrainFileAcsCF).then(d => {
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

    getContentBased: function () {
        return new Promise(function (resolve, reject) {
            let item_arr = [], cb = {};
            handle_file.readDocsFile(docTrainFileAcsCF).then(trainData => {
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
                                fs.writeFile(resultACsCB, JSON.stringify(cb), function (err) {
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

    getGraphRecommend: function () {
        const graph = new ug.Graph();
        return new Promise(function (resolve, reject) {
            let users = [];
            let r = {};
            handle_file.readDocsFile(docTrainFileAcsCF).then(d => {
                let items = [], views = [];
                for (let index in d) {
                    users.push(index);
                    let user = graph.createNode("user", {id: index});
                    let user_items = d[index];
                    for (let i = 0; i < user_items.length; i++) {
                        let item;
                        let item_id = user_items[i].item;
                        let itemIdx = items.indexOf(item_id);
                        if (itemIdx <= -1) {
                            items.push(item_id);
                            item = graph.createNode("item", {id: item_id});
                        } else item = graph.nodes("item").query().filter({id: item_id}).first();
                        views.push(graph.createEdge("view").link(user, item));
                    }
                }
            }).then(() => {
                users.forEach(user_id => {
                    let user = graph.nodes("user").query().filter({id: user_id}).first();
                    let results = graph.closest(user, {
                        compare: function (node) {
                            return node.entity === "item";
                        },
                        minDepth: 3,
                        count: maxSimilarDocuments
                    });
                    // results is now an array of Paths, which are each traces from your starting node to your result node...
                    let resultNodes = results.map(function (path) {
                        return path.end();
                    });
                    r[user_id] = resultNodes.map(result => {
                        return result.properties
                    });
                });
                resolve(r);
            });
        })
    },

    getHybridRecommend: function () {
        return new Promise(function (resolve, reject) {
            // get unique item of user
            handle_file.readDocsFile(docTrainFileAcsCF).then(trainData => {
                trainData = JSON.parse(JSON.stringify(trainData));
                handle_file.readDocsFile(resultACsCF).then(cfResultData => {
                    handle_file.readDocsFile(resultACsCB).then(cbResultData => {
                        cfResultData = JSON.parse(JSON.stringify(cfResultData));
                        cbResultData = JSON.parse(JSON.stringify(cbResultData));
                        let results = {};
                        for (let user_id in cfResultData) {
                            results[user_id] = [];
                            let cf_results = cfResultData[user_id];
                            //find content-based
                            let items = trainData[user_id];
                            items.forEach(item => {
                                // recommender.getContentBasedResult("ad-" + item.item).then(cb_results => {
                                let cb_results = cbResultData[item.item][0];
                                let output = cb_results.filter(function (obj) {
                                    return obj.score >= 0.2;
                                });
                                cf_results.forEach(item => output.push({
                                    id: 'ad-' + item.id,
                                    score: item.score
                                }));
                                results[user_id].push({
                                    item: item.item,
                                    recommend_items: output.slice(0, 10)
                                });
                                // }).catch(function (err) {
                                //     reject(new Error(err));
                                // });
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

    getHybridRecommend2: function () {
        return new Promise(function (resolve, reject) {
            // get unique item of user
            handle_file.readDocsFile(docTrainFileAcsCF).then(trainData => {
                trainData = JSON.parse(JSON.stringify(trainData));
                handle_file.readDocsFile(resultACsGraph).then(graphResultData => {
                    graphResultData = JSON.parse(JSON.stringify(graphResultData));
                    let results = {};
                    for (let user_id in graphResultData) {
                        results[user_id] = [];
                        let cf_results = graphResultData[user_id];
                        //find content-based
                        let items = trainData[user_id];
                        items.forEach(item => {
                            recommender.getContentBasedResult("ad-" + item.item).then(cb_results => {
                                let output = cb_results.filter(function (obj) {
                                    return obj.score >= 0.1;
                                });
                                cf_results.forEach(item => output.push({
                                    id: 'ad-' + item.id,
                                    score: item.score
                                }));
                                results[user_id].push({
                                    item: item.item,
                                    recommend_items: output
                                });
                            }).catch(function (err) {
                                reject(new Error(err));
                            });
                        });
                    }
                    setTimeout(function () {
                        resolve(results);
                    }, 60000);
                });
            });
        });
    }
};
