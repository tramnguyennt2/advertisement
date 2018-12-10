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

    getGraphRecommend: function () {
        const graph = new ug.Graph();
        return new Promise(function (resolve, reject) {
            let users = [];
            let r = {};
            handle_file.readDocsFile(docTrainFileACs).then(d => {
                let items = [], views = [];
                for (let index in d) {
                    users.push(index);
                    let user = graph.createNode("user", {id: index});
                    let user_items = d[index];
                    for (let i = 0; i < user_items.length; i++) {
                        let item;
                        let item_id = user_items[i].viewed_ad;
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
        let results = {};
        return new Promise(function (resolve, reject) {
            handle_file.readDocsFile(docTrainFileACs).then(trainData => {
                trainData = JSON.parse(JSON.stringify(trainData));
                handle_file.readDocsFile(resultACsCF).then(cfResultData => {
                    cfResultData = JSON.parse(JSON.stringify(cfResultData));
                    let results = {};
                    for (let index in cfResultData) {
                        let user_id = index;
                        results[user_id] = [];
                        let cf_results = cfResultData[index];
                        //find content-based
                        let items = trainData[user_id];
                        items.forEach(item => {
                            recommender.getContentBasedResult(item.viewed_ad).then(cb_results => {
                                let output = cb_results.filter(function (obj) {
                                    return obj.score >= 0.15;
                                });
                                cf_results.forEach(item => output.push(item));
                                results[user_id].push({
                                    item: item.viewed_ad,
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
