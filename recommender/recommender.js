const ContentBasedRecommender = require("./content-based-recommender/index");
const maxSimilarDocuments = 5;
const content_based = new ContentBasedRecommender({
    maxSimilarDocuments: maxSimilarDocuments,
    minScore: 0,
    debug: false
});
const ug = require("ug");
const nano = require("nano")("http://huyentk:Huyen1312@localhost:5984");
// const nano = require("nano")("http://admin:1@localhost:5984");
const db = nano.use("advertisement");
const neighbor_num = 2;

module.exports = {
    getContentBasedResult: function (item_id) {
        return new Promise(function (resolve, reject) {
            db.view("items", 'all-item?key="' + item_id + '"', {
                include_docs: true
            }).then(body => {
                let documents = [];
                if (body.rows.length === 0) {
                    db.get(item_id).then((item) => {
                        documents.push({id: item._id, content: item.content, token: item.token})
                    })
                }
                db.view("items", "all-item", {
                    include_docs: true
                }).then(body => {
                    body.rows.forEach(doc => {
                        let obj = {id: doc.doc._id, content: doc.doc.content, token: doc.doc.token};
                        documents.push(obj);
                    });
                    return documents;
                }).then(function (documents) {
                    console.time("content-based " + item_id);
                    content_based.trainOpt(documents, item_id);
                    const similarDocuments = content_based.getSimilarDocuments(item_id, 0, maxSimilarDocuments);
                    console.timeEnd("content-based " + item_id);
                    resolve(similarDocuments);
                }).catch(function (err) {
                    reject(new Error(err));
                });
            });

        });
    },

    getContentBasedForHybridResult: function (item_id, all_item) {
        return new Promise(function (resolve, reject) {
            db.view("items", 'all-item?key="' + item_id + '"', {
                include_docs: true
            }).then(body => {
                return getItem(body.rows.length, item_id, all_item).then(documents => {
                    return documents;
                });
            }).then(function (documents) {
                console.log("3: ", documents.length);
                console.time("content-based " + item_id);
                content_based.trainOpt(documents, item_id);
                const similarDocuments = content_based.getSimilarDocuments(item_id, 0, maxSimilarDocuments);
                console.timeEnd("content-based " + item_id);
                resolve(similarDocuments);
            }).catch(function (err) {
                reject(new Error(err));
            });
        });
    },

    getCollaborativeFilteringResult: function (user_id) {
        return new Promise(function (resolve, reject) {
            let item_arr = [], user_arr = [];
            let docs = {};
            let user_idx = 0;
            db.view("ratings", "all-rating", {include_docs: true}).then(body => {
                console.time("cf " + user_id);
                for (let i = 0; i < body.total_rows; i++) {
                    if (user_arr.indexOf(body.rows[i].doc.user_id) <= -1)
                        user_arr.push(body.rows[i].doc.user_id);
                    if (item_arr.indexOf(body.rows[i].doc.item_id) <= -1)
                        item_arr.push(body.rows[i].doc.item_id);
                    let obj = {};
                    obj.item = body.rows[i].doc.item_id;
                    obj.rating = body.rows[i].doc.rating;
                    if (body.rows[i].doc.user_id in docs) docs[body.rows[i].doc.user_id].push(obj);
                    else docs[body.rows[i].doc.user_id] = [obj];
                }
            }).then(() => {
                user_idx = user_arr.indexOf(user_id);
                if (user_idx <= -1) reject("user has not rated any item in recommended item list.");
                // Step 1: normalize rating by subtract row mean
                normalizeDocs(docs, user_arr, user_id).then(avg_user => {
                    // Step 2: get cosin similarity
                    const user_items = docs[user_id];
                    getCosinSimilarity(docs, user_items, user_arr, user_id).then(similarity => {
                        // Step 3: get item need to recommend
                        getItemNeedToRecommend(docs, similarity, user_items).then(item_need_to_recommend => {
                            // Step 4: predict
                            predict(item_need_to_recommend, avg_user).then(result => {
                                sort(result).then(result => {
                                    if (result.length > maxSimilarDocuments) {
                                        result = result.splice(0, maxSimilarDocuments);
                                    }
                                    console.timeEnd("cf " + user_id);
                                    resolve(result);
                                });
                            });
                        });
                    });
                });
            }).catch(function (err) {
                reject(new Error(err));
            });
        });
    },

    getHybridRecommend: function (user_id) {
        return new Promise(function (resolve, reject) {
            db.view("items", "all-item", {
                include_docs: true
            }).then(body => {
                console.time("hybrid " + user_id);
                module.exports.getCollaborativeFilteringResult(user_id).then(cf_results => {
                    getCBResult(cf_results, body).then(hybrid_result => {
                        console.timeEnd("hybrid " + user_id);
                        resolve(hybrid_result);
                    })
                }).catch(function (err) {
                    reject(new Error(err));
                });
            });
        });
    },

    getGraphRecommend: function (user_id) {
        const graph = new ug.Graph();
        return new Promise(function (resolve, reject) {
            let q = {
                selector: {
                    type: {$eq: "rating"}
                }
            };
            let users = [];
            let items = [];
            let views = [];
            db.find(q)
                .then(docs => {
                    for (let i = 0; i < docs.docs.length; i++) {
                        let user_id = docs.docs[i].user_id;
                        let item_id = docs.docs[i].item_id;
                        let userIdx = users.indexOf(user_id);
                        let itemIdx = items.indexOf(item_id);
                        let user, item;
                        if (userIdx <= -1) {
                            users.push(user_id);
                            user = graph.createNode("user", {id: user_id});
                        } else
                            user = graph
                                .nodes("user")
                                .query()
                                .filter({id: user_id})
                                .first();
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
                    if (users.indexOf(user_id) <= -1) {
                        reject("user does not in graph");
                    }
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
    }
};

async function getItem(length, item_id, all_item) {
    let documents = [];
    if (length === 0) {
        await db.get(item_id).then((item) => {
            documents.push({id: item._id, content: item.content, token: item.token});
        })
    }
    all_item.rows.forEach(doc => {
        let obj = {id: doc.doc._id, content: doc.doc.content, token: doc.doc.token};
        documents.push(obj);
    });
    return documents;
}

function predict(item_need_to_recommend, avg_user) {
    return new Promise(function (resolve) {
        let result = [];
        for (let i = 0; i < item_need_to_recommend.length; i++) {
            const users = item_need_to_recommend[i].users;
            if (users.length >= neighbor_num) {
                let r = 0, v = 0;
                for (let j = 0; j < neighbor_num; j++) {
                    r += users[j].sim * users[j].rating;
                    v += Math.abs(users[j].sim);
                }
                result.push({
                    item: item_need_to_recommend[i].item,
                    rating: (r / v) + avg_user
                });
            }
        }
        resolve(result);
    });
}

function getItemNeedToRecommend(docs, similarity, user_items) {
    return new Promise(function (resolve) {
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
                    let obj = item_need_to_recommend.find(obj => obj.item === uniqueResultOne[j].item);
                    if (obj === undefined) item_need_to_recommend.push({
                        item: uniqueResultOne[j].item,
                        users: [{user: user, sim: sim, rating: uniqueResultOne[j].rating}]
                    });
                    else obj.users.push({user: user, sim: sim, rating: uniqueResultOne[j].rating});
                }
            }
        }
        resolve(item_need_to_recommend);
    })
}

function getCosinSimilarity(docs, user_items, user_arr, user_id) {
    return new Promise(function (resolve) {
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
                        let item_rating = user_items.filter((item) => {
                            if (item.item === same[k].item) return item.rating;
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
            let keyA = a.sim, keyB = b.sim;
            if (keyA < keyB) return 1;
            if (keyA > keyB) return -1;
            return 0;
        });
        resolve(similarity);
    })
}

function normalizeDocs(docs, user_arr, user_id) {
    return new Promise(function (resolve) {
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
        resolve(avg_user);
    });
}

function sort(arr) {
    return new Promise(function (resolve, reject) {
        resolve(arr.sort(compare));
    });
}

function compare(a, b) {
    const ratingA = a.rating;
    const ratingB = b.rating;
    let comparison = 0;
    if (ratingA > ratingB) {
        comparison = -1;
    } else if (ratingA < ratingB) {
        comparison = 1;
    }
    return comparison;
}

async function getCBResult(cf_results, all_items) {
    let hybrid_results = [];
    for (let i = 0; i < cf_results.length; i++) {
        hybrid_results.push(cf_results[i]);
        await module.exports.getContentBasedForHybridResult(cf_results[i].item, all_items).then(cb_results => {
            for (let j = 0; j < cb_results.length; j++) {
                if (cb_results[j].score > 0.2) {
                    let obj = hybrid_results.find(obj => obj.item === cb_results[j].id);
                    if (obj === undefined) hybrid_results.push(cb_results[j]);
                }
            }
        });
    }
    return hybrid_results;
}