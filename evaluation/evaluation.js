const fs = require("fs");
const parse = require("csv-parse");
const recommender = require('../recommender/recommender');

// ---------------------- USER FILE ------------------------
const userTrainFile = "evaluation/train/user_ua_train.user";
const userTrainFileAdClicks = "evaluation/train/user_ad_train.user";
const ug = require("ug");
// ----------------- REFORMAT TEST AND TRAINING FILE -------------------
// reformat by user_id: [{item: "item", rating: "rating"}] of trainFile
const docTrainFile = "evaluation/train/doc_train_ua.txt";
const docTrainFileAdClicks = "evaluation/train/doc_train_ad.txt";
const docTrainFileAdClicksCF = "evaluation/train/doc_train_ad_cf.txt";
const neighbor_num = 2;
const maxSimilarDocuments = 10;

const resultCFFile = "evaluation/results/result_ad_cf.txt";

module.exports = {
    getCollaborativeFilteringResult: function () {
        return new Promise(function (resolve, reject) {
            readUserStream(userTrainFile).then(users => {
                readDocsFile(docTrainFile).then(d => {
                    let docs = JSON.parse(JSON.stringify(d));
                    module.exports.normalizeDocsE(docs, users).then(avgs => {
                        // Step 2: get cosin similarity
                        module.exports.getCosinSimilarityE(docs, users).then(sims => {
                            // Step 3: get item need to recommend
                            module.exports.getItemNeedToRecommendE(docs, sims, users).then(item_need_to_recommends => {
                                // Step 4: predict
                                module.exports.predictE(item_need_to_recommends, avgs, users).then(results => {
                                    let final_results = {};
                                    for (let i = 0; i < users.length; i++) {
                                        let user_id = users[i];
                                        let result = results[user_id];
                                        module.exports.sortE(result, user_id).then(result => {
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

    getCollaborativeFilteringResultAdClicks: function () {
        return new Promise(function (resolve, reject) {
            readUserStream(userTrainFileAdClicks).then(users => {
                readDocsFile(docTrainFileAdClicksCF).then(d => {
                    let docs = JSON.parse(JSON.stringify(d));
                    module.exports.normalizeDocsE(docs, users).then(avgs => {
                        // Step 2: get cosin similarity
                        module.exports.getCosinSimilarityE(docs, users).then(sims => {
                            // Step 3: get item need to recommend
                            module.exports.getItemNeedToRecommendE(docs, sims, users).then(item_need_to_recommends => {
                                // Step 4: predict
                                module.exports.predictE(item_need_to_recommends, avgs, users).then(results => {
                                    let final_results = {};
                                    for (let i = 0; i < users.length; i++) {
                                        let user_id = users[i];
                                        let result = results[user_id];
                                        module.exports.sortE(result, user_id).then(result => {
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
            readDocsFile(docTrainFileAdClicks).then(d => {
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
            readDocsFile(docTrainFileAdClicks).then(trainData => {
                trainData = JSON.parse(JSON.stringify(trainData));
                readDocsFile(resultCFFile).then(cfResultData => {
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
                    setTimeout(function(){ resolve(results); }, 60000);
                });
            });
        });
    },

    normalizeDocsE(docs, user_arr) {
        return new Promise(function (resolve) {
            console.time("normalizeDocs");
            let avgs = {};
            for (let i = 0; i < user_arr.length; i++) {
                let items = docs[user_arr[i]];
                let value = 0;
                for (let j = 0; j < items.length; j++) {
                    value += items[j].rating;
                }
                avgs[user_arr[i]] = value / items.length;
                for (let j = 0; j < items.length; j++) {
                    items[j].rating = items[j].rating - value / items.length;
                }
            }
            console.timeEnd("normalizeDocs");
            resolve(avgs);
        });
    },

    getCosinSimilarityE(docs, user_arr) {
        console.time("getCosinSimilarity");
        let sims = {};
        return new Promise(function (resolve) {
            for (let n = 0; n < user_arr.length; n++) {
                let similarity = [];
                let user_id = user_arr[n];
                let user_items = docs[user_id];
                let r1 = 0;
                for (let i = 0; i < user_items.length; i++)
                    r1 += user_items[i].rating * user_items[i].rating;

                const sqrt_user_rating = Math.sqrt(r1);
                for (let i = 0; i < user_arr.length; i++) {
                    if (user_arr[i] !== user_id) {
                        let other_user_items = docs[user_arr[i]];
                        let same = other_user_items.filter(function (obj) {
                            return user_items.some(function (obj2) {
                                return obj.item === obj2.item;
                            });
                        });
                        if (same.length > 0) {
                            let r2 = 0;
                            for (let j = 0; j < other_user_items.length; j++)
                                r2 += other_user_items[j].rating * other_user_items[j].rating;
                            const sqrt_other_rating = Math.sqrt(r2);
                            let a = 0;
                            let prod = 0;
                            for (let k = 0; k < same.length; k++) {
                                let item_rating = user_items.filter(item => {
                                    if (item.item === same[k].item) return item;
                                });
                                prod += item_rating[0].rating * same[k].rating;
                            }
                            if (prod !== 0) {
                                let sim = prod / (sqrt_other_rating * sqrt_user_rating);
                                similarity.push({
                                    user: user_arr[i],
                                    sim: sim
                                });
                            }
                        }
                    }
                }
                similarity.sort(function (a, b) {
                    let keyA = a.sim,
                        keyB = b.sim;
                    if (keyA < keyB) return 1;
                    if (keyA > keyB) return -1;
                    return 0;
                });
                sims[user_id] = similarity;
            }
            console.timeEnd("getCosinSimilarity");
            resolve(sims);
        });
    },

    getItemNeedToRecommendE(docs, sims, user_arr) {
        return new Promise(function (resolve) {
            let item_need_to_recommends = {};
            console.time("getItemNeedToRecommend");
            for (let n = 0; n < user_arr.length; n++) {
                let user_id = user_arr[n];
                let user_items = docs[user_id];
                let item_need_to_recommend = [];
                let similarity = sims[user_id];
                for (let i = 0; i < similarity.length; i++) {
                    // Find values that are in docs[similarity[i].user] but not in user_items
                    let uniqueResultOne = docs[similarity[i].user].filter(function (obj) {
                        return !user_items.some(function (obj2) {
                            return obj.item === obj2.item;
                        });
                    });
                    const user = similarity[i].user;
                    const sim = similarity[i].sim;
                    if (uniqueResultOne.length > 0) {
                        for (let j = 0; j < uniqueResultOne.length; j++) {
                            let obj = item_need_to_recommend.find(
                                obj => obj.item === uniqueResultOne[j].item
                            );
                            if (obj === undefined)
                                item_need_to_recommend.push({
                                    item: uniqueResultOne[j].item,
                                    users: [
                                        {user: user, sim: sim, rating: uniqueResultOne[j].rating}
                                    ]
                                });
                            else
                                obj.users.push({
                                    user: user,
                                    sim: sim,
                                    rating: uniqueResultOne[j].rating
                                });
                        }
                    }
                }
                item_need_to_recommends[user_id] = item_need_to_recommend;
            }
            console.timeEnd("getItemNeedToRecommend");
            resolve(item_need_to_recommends);
        });
    },

    predictE(item_need_to_recommends, avgs, user_arr) {
        return new Promise(function (resolve) {
            console.time("predict");
            let results = {};
            for (let n = 0; n < user_arr.length; n++) {
                let user_id = user_arr[n];
                let avg_user = avgs[user_id];
                let item_need_to_recommend = item_need_to_recommends[user_id];
                let result = [];
                for (let i = 0; i < item_need_to_recommend.length; i++) {
                    const users = item_need_to_recommend[i].users;
                    if (users.length >= neighbor_num) {
                        let r = 0,
                            v = 0;
                        for (let j = 0; j < neighbor_num; j++) {
                            r += users[j].sim * users[j].rating;
                            v += Math.abs(users[j].sim);
                        }
                        result.push({
                            id: item_need_to_recommend[i].item,
                            score: r / v + avg_user
                        });
                    }
                }
                results[user_id] = result;
            }
            console.timeEnd("predict");
            resolve(results);
        });
    },

    sortE(arr) {
        return new Promise(function (resolve, reject) {
            resolve(arr.sort(compare));
        });
    },
};

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

function readUserStream(filename) {
    return new Promise(function (resolve, reject) {
        let users = [];
        fs.createReadStream(filename)
            .pipe(parse({delimiter: "|"}))
            .on("data", function (data) {
                users.push(data[0]);
            })
            .on("end", function () {
                resolve(users);
            });
    });
}

function readDocsFile(docsFile) {
    return new Promise(function (resolve, reject) {
        const fs = require("fs");
        resolve(JSON.parse(fs.readFileSync(docsFile, "utf8")));
    });
}

// save docs file: /evaluation/docs.json
function createReadTrainStream(file1, file) {
    return new Promise(function (resolve, reject) {
        console.time("readFile");
        let docs = {};
        fs.createReadStream(file1)
            .pipe(parse({delimiter: "\t"}))
            .on("data", function (data) {
                try {
                    let rating = parseInt(data[2]);
                    let obj = {};
                    obj.item = data[1];
                    obj.rating = rating;
                    if (data[0] in docs) docs[data[0]].push(obj);
                    else docs[data[0]] = [obj];
                } catch (e) {
                    reject(e);
                }
            })
            .on("end", function () {
                fs.writeFile(file, JSON.stringify(docs), function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("The file was saved!");
                });
                console.timeEnd("readFile");
                resolve(docs);
            });
    });
}