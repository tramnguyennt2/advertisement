import * as deasync from "deasync";

const ContentBasedRecommender = require("./content-based-recommender/index");
const maxSimilarDocuments = 10;
const content_based = new ContentBasedRecommender({
    maxSimilarDocuments: maxSimilarDocuments,
    minScore: 0,
    debug: false
});
const ug = require("ug");
const nano = require("nano")("http://huyentk:Huyen1312@localhost:5984");
const db = nano.use("advertisement");
const neighbor_num = 2;

module.exports = {
    getContentBasedResult: function (item_id) {
        return new Promise(function (resolve, reject) {
            // db.view("items", 'all-item-e?key="' + item_id + '"', {
            //     include_docs: true
            // }).then(body => {
            //     let documents = [];
            //     if (body.rows.length === 0) {
            //         db.get(item_id).then(item => {
            //             documents.push({
            //                 id: item._id,
            //                 content: item.content,
            //                 token: item.token
            //             });
            //         });
            //     }
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
                console.time("content-based " + item_id);
                content_based.trainOpt(documents, item_id);
                const similarDocuments = content_based.getSimilarDocuments(
                    item_id,
                    0,
                    10
                );
                console.timeEnd("content-based " + item_id);
                resolve(similarDocuments);
            }).catch(function (err) {
                reject(new Error(err));
            });
        });
        // });
    },

    //user-based
    getCollaborativeFilteringResult: function (user_id) {
        return new Promise(function (resolve, reject) {
            let user_arr = [];
            let docs = {};
            let user_idx = 0;
            db.view("ratings", "all-rating", {include_docs: true})
                .then(body => {
                    console.time("cf " + user_id);
                    for (let i = 0; i < body.total_rows; i++) {
                        if (user_arr.indexOf(body.rows[i].doc.user_id) <= -1)
                            user_arr.push(body.rows[i].doc.user_id);
                        let obj = {};
                        obj.item = body.rows[i].doc.item_id;
                        obj.rating = body.rows[i].doc.rating;
                        if (body.rows[i].doc.user_id in docs)
                            docs[body.rows[i].doc.user_id].push(obj);
                        else docs[body.rows[i].doc.user_id] = [obj];
                    }
                })
                .then(() => {
                    user_idx = user_arr.indexOf(user_id);
                    if (user_idx <= -1)
                        reject("user has not rated any item in recommended item list.");
                    // Step 1: normalize rating by subtract row mean
                    module.exports.normalizeDocs(docs, user_arr, user_id)
                        .then(avg_user => {
                            // Step 2: get cosin similarity
                            const user_items = docs[user_id];
                            module.exports.getCosinSimilarity(docs, user_items, user_arr, user_id)
                                .then(similarity => {
                                    // Step 3: get item need to recommend
                                    module.exports.getItemNeedToRecommend(docs, similarity, user_items, user_id)
                                        .then(item_need_to_recommend => {
                                            // Step 4: predict
                                            module.exports.predict(item_need_to_recommend, avg_user, user_id)
                                                .then(result => {
                                                    module.exports.sort(result).then(result => {
                                                        if (result.length > maxSimilarDocuments)
                                                            result = result.splice(0, maxSimilarDocuments);
                                                        console.timeEnd("cf " + user_id);
                                                        resolve(result);
                                                    });
                                                });
                                        });
                                });
                        });
                })
                .catch(function (err) {
                    reject(new Error(err));
                });
        });
    },

    getHybridRecommend: function (user_id, item_id) {
        return new Promise(function (resolve, reject) {
            let output = [], ref_items = [], ref_user_items;
            console.time("hybrid " + user_id);
            output = joinAndReturn(user_id, item_id);
            //Find values that are in both result1 n result2
            ref_user_items = output[0].filter(function (obj) {
                return output[1].some(function (obj2) {
                    return obj.id === obj2.id;
                });
            });
            if (ref_user_items.length > 0) {
                for (let i = 0; i < ref_user_items.length; i++) {
                    const index0 = output[0].indexOf(ref_user_items[i]);
                    output[0].splice(index0, 1);
                    const removeIndex = output[1].map(function (item) {
                        return item.id;
                    }).indexOf(ref_user_items[i].id);
                    output[1].splice(removeIndex, 1);
                }
                for (let i = 0; i < output[1].length; i++) {
                    ref_user_items.push(output[1][i]);
                }
                ref_items = output[0];
            } else {
                ref_items = output[0];
                ref_user_items = output[1];
            }
            let result = {
                ref_items: ref_items,
                ref_user_items: ref_user_items
            };
            console.timeEnd("hybrid " + user_id);
            resolve(result);
        });
    },

    getGraphRecommend: function (user_id) {
        const graph = new ug.Graph();
        return new Promise(function (resolve, reject) {
            let users = [], items = [], views = [];
            db.view("ratings", "all-rating", {include_docs: true})
                .then(body => {
                    console.time("graph " + user_id);
                    for (let i = 0; i < body.total_rows; i++) {
                        let user_id = body.rows[i].doc.user_id;
                        let item_id = body.rows[i].doc.item_id;
                        let userIdx = users.indexOf(user_id);
                        let itemIdx = items.indexOf(item_id);
                        let user, item;
                        if (userIdx > -1) {
                            user = graph
                                .nodes("user")
                                .query()
                                .filter({id: user_id})
                                .first();
                        } else {
                            users.push(user_id);
                            user = graph.createNode("user", {id: user_id});
                        }
                        if (itemIdx <= -1) {
                            items.push(item_id);
                            item = graph.createNode("item", {id: item_id});
                        } else
                            item = graph
                                .nodes("item")
                                .query()
                                .filter({id: item_id})
                                .first();
                        views.push(graph.createEdge("view").link(user, item));
                    }
                })
                .then(() => {
                    if (users.indexOf(user_id) <= -1) reject("user does not in graph");
                })
                .then(() => {
                    let user = graph
                        .nodes("user")
                        .query()
                        .filter({id: user_id})
                        .first();
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
                    resolve(resultNodes);
                });
        });
    },

    predict(item_need_to_recommend, avg_user, user_id) {
        return new Promise(function (resolve) {
            console.time("predict " + user_id);
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
            console.timeEnd("predict " + user_id);
            resolve(result);
        });
    },

    getItemNeedToRecommend(docs, similarity, user_items, user_id) {
        return new Promise(function (resolve) {
            console.time("getItemNeedToRecommend " + user_id);
            let item_need_to_recommend = [];
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
            console.timeEnd("getItemNeedToRecommend " + user_id);
            resolve(item_need_to_recommend);
        });
    },

    getCosinSimilarity(docs, user_items, user_arr, user_id) {
        return new Promise(function (resolve) {
            console.time("getCosinSimilarity " + user_id);
            let similarity = [];
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
            console.timeEnd("getCosinSimilarity " + user_id);
            resolve(similarity);
        });
    },

    normalizeDocs(docs, user_arr, user_id) {
        return new Promise(function (resolve) {
            console.time("normalizeDocs " + user_id);
            let avg_user = 0;
            for (let i = 0; i < user_arr.length; i++) {
                let items = docs[user_arr[i]];
                let value = 0;
                for (let j = 0; j < items.length; j++) {
                    value += items[j].rating;
                }
                if (user_arr[i] === user_id) {
                    avg_user = value / items.length;
                }
                for (let j = 0; j < items.length; j++) {
                    items[j].rating = items[j].rating - value / items.length;
                }
            }
            console.timeEnd("normalizeDocs " + user_id);
            resolve(avg_user);
        });
    },

    sort(arr) {
        return new Promise(function (resolve, reject) {
            resolve(arr.sort(compare));
        });
    }
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

function doAlgorithms(user_id, item_id) {
    return Promise.all([
        new Promise(function (resolve, reject) {
            module.exports
                .getContentBasedResult(item_id)
                .then(cb_results => {
                    return resolve(cb_results);
                })
                .catch(function (err) {
                    reject(new Error(err));
                });
        }),

        new Promise(function (resolve, reject) {
            module.exports
                .getCollaborativeFilteringResult(user_id)
                .then(cf_results => {
                    return resolve(cf_results);
                })
                .catch(function (err) {
                    reject(new Error(err));
                });
        })
    ]);
}

function joinAndReturn(user_id, item_id) {
    let done = false;
    let result = [], unique_arr = [], output = [];
    doAlgorithms(user_id, item_id).then(results => {
        // result.push(results[0]);
        // result.push(results[1]);
        let cb_results = results[1], cf_results = results[2];
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
        sort(output).then(r => {
            if (result.length > 10)
                result = r.splice(0, 10);
        });
        done = true;
    });
    deasync.loopWhile(function () {
        return !done;
    });
    return result;
}
