const maxSimilarDocuments = 50;
const fs = require('fs');
const parse = require('csv-parse');
const neighbor_num = 5;
const ug = require("ug");
const rs = require("../recommender/recommender");

module.exports = {
    // user-based
    getCollaborativeFilteringResult: function (docs, user_arr, user_id) {
        return new Promise(function (resolve, reject) {
            console.time("cf " + user_id);
            // Step 1: normalize rating by subtract row mean
            rs.normalizeDocs(docs, user_arr, user_id).then(avg_user => {
                // Step 2: get cosin similarity
                const user_items = docs[user_id];
                rs.getCosinSimilarity(docs, user_items, user_arr, user_id).then(similarity => {
                    // Step 3: get item need to recommend
                    rs.getItemNeedToRecommend(docs, similarity, user_items, user_id).then(item_need_to_recommend => {
                        // Step 4: predict
                        rs.predict(item_need_to_recommend, avg_user, user_id).then(result => {
                            rs.sort(result, user_id).then(result => {
                                if (result.length > maxSimilarDocuments) result = result.splice(0, maxSimilarDocuments);
                                console.timeEnd("cf " + user_id);
                                resolve(result);
                            });
                        });
                    });
                });
            }).catch(err => reject(err));
        });
    },

    getGraphRecommend: function (docs, user_arr, user_id) {
        const graph = new ug.Graph();
        return new Promise(function (resolve, reject) {
            let users = [], items = [], views = [];
            db.view("ratings", "all-rating", {include_docs: true}).then(body => {
                console.time("graph " + user_id);
                for (let i = 0; i < body.total_rows; i++) {
                    let user_id = body.rows[i].doc.user_id;
                    let item_id = body.rows[i].doc.item_id;
                    let userIdx = users.indexOf(user_id);
                    let itemIdx = items.indexOf(item_id);
                    let user, item;
                    if (userIdx <= -1) {
                        users.push(user_id);
                        user = graph.createNode("user", {id: user_id});
                    } else {
                        user = graph.nodes("user").query().filter({id: user_id}).first();
                    }
                    if (itemIdx <= -1) {
                        items.push(item_id);
                        item = graph.createNode("item", {id: item_id});
                    } else item = graph.nodes("item").query().filter({id: item_id}).first();
                    views.push(graph.createEdge("view").link(user, item));
                }
            }).then(() => {
                if (users.indexOf(user_id) <= -1) reject("user does not in graph");
            }).then(() => {
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
                resolve(resultNodes);
            });
        });
    }
};

function createReadStream(filename) {
    return new Promise(function (resolve, reject) {
        let item_arr = [], user_arr = [];
        let docs = {};
        fs.createReadStream(filename).pipe(parse({delimiter: '\t'})).on('data', function (data) {
            try {
                if (user_arr.indexOf(data[0]) <= -1) user_arr.push(data[0]);
                if (item_arr.indexOf(data[1]) <= -1) item_arr.push(data[1]);
                docs.push({
                    user_id: data[0],
                    item_id: data[1],
                    rating: data[2]
                });
                let obj = {};
                obj.item = data[1];
                obj.rating = data[2];
                if (data[0] in docs) docs[data[0]].push(obj);
                else docs[data[0]] = [obj];
            } catch (e) {
                reject(e);
            }
        }).on('end', function () {
            resolve([docs, user_arr, item_arr]);
        });
    });
}