const ContentBasedRecommender = require("content-based-recommender");
const maxSimilarDocuments = 5;
const content_based = new ContentBasedRecommender({
    minScore: 0.1,
    maxSimilarDocuments: maxSimilarDocuments,
    debug: false
});
const ug = require("ug");
const nano = require("nano")("http://huyentk:Huyen1312@localhost:5984");
const db = nano.use("advertisement");
const k = 2;

module.exports = {
    getContentBasedResult: function (item_id) {
        return new Promise(function (resolve, reject) {
            let documents = [];
            const q = {
                selector: {
                    type: {$eq: "item"}
                }
            };
            db.find(q)
                .then(docs => {
                    for (let i = 0; i < docs.docs.length; i++) {
                        let obj = {id: docs.docs[i]._id, content: docs.docs[i].title};
                        documents.push(obj);
                    }
                })
                .then(() => {
                    content_based.train(documents, item_id);
                    const similarDocuments = content_based.getSimilarDocuments(
                        item_id,
                        0,
                        5
                    );
                    resolve(similarDocuments);
                })
                .catch(function (err) {
                    reject(new Error(err));
                });
        });
    },

    getCollaborativeFilteringResult: function (user_id, item_input = []) {
        return new Promise(function (resolve, reject) {
            let documents = [];
            let user_arr = [];
            let item_arr = [];
            let rating_arr = [];
            let user_idx = 0;
            let q;
            if (item_input.length === 0) {
                q = {
                    selector: {
                        type: {$eq: "rating"}
                    }
                };
            } else {
                q = {
                    selector: {
                        type: {$eq: "rating"},
                        $or: item_input
                    }
                };
            }
            db.find(q)
                .then(docs => {
                    for (let i = 0; i < docs.docs.length; i++) {
                        if (user_arr.indexOf(docs.docs[i].user_id) <= -1) user_arr.push(docs.docs[i].user_id);
                        if (item_arr.indexOf(docs.docs[i].item_id) <= -1) item_arr.push(docs.docs[i].item_id);
                        let obj = {
                            user_id: docs.docs[i].user_id,
                            item_id: docs.docs[i].item_id,
                            rating: docs.docs[i].rating
                        };
                        documents.push(obj);
                    }
                    user_idx = user_arr.indexOf(user_id);
                    if (user_idx <= -1) {
                        console.log(
                            "user has not rated any item in recommended item list."
                        );
                        reject("user has not rated any item in recommended item list.");
                    }
                    for (let i = 0; i < documents.length; i++) {
                        let item_idx = item_arr.indexOf(documents[i].item_id);
                        let user_idx = user_arr.indexOf(documents[i].user_id);
                        rating_arr.push([item_idx, user_idx, documents[i].rating]);
                    }
                })
                .then(() => {
                    let inputMatrix = new Array(item_arr.length);
                    for (let i = 0; i < inputMatrix.length; i++) {
                        inputMatrix[i] = new Array(user_arr.length);
                    }
                    for (let j = 0; j < rating_arr.length; j++) {
                        inputMatrix[rating_arr[j][0]][rating_arr[j][1]] = parseInt(rating_arr[j][2]);
                    }
                    inputMatrix.filter(function (arr) {
                        for (let k = 0; k < arr.length; k++) {
                            if (arr[k] === undefined) arr[k] = 0;
                        }
                    });
                    // user_arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
                    // item_arr = [1, 2, 3, 4, 5, 6];
                    // user_idx = 4;
                    //
                    // inputMatrix = [
                    //     [1, 0, 3, 0, 0, 5, 0, 0, 5, 0, 4, 0],
                    //     [0, 0, 5, 4, 0, 0, 4, 0, 0, 2, 1, 3],
                    //     [2, 4, 0, 1, 2, 0, 3, 0, 4, 3, 5, 0],
                    //     [0, 2, 4, 0, 5, 0, 0, 4, 0, 0, 2, 0],
                    //     [0, 0, 4, 3, 4, 2, 0, 0, 0, 0, 2, 5],
                    //     [1, 0, 3, 0, 3, 0, 0, 2, 0, 0, 4, 0]
                    // ];
                    return inputMatrix;
                })
                .then(inputMatrix => {
                    let item_need_to_recommend_index = [];
                    for (let i = 0; i < inputMatrix.length; i++) {
                        if (inputMatrix[i][user_idx] !== 0) continue;
                        item_need_to_recommend_index.push(i);
                    }
                    let item_need_to_recommend_id = [];
                    for (let i = 0; i < item_need_to_recommend_index.length; i++) {
                        item_need_to_recommend_id.push(
                            item_arr[item_need_to_recommend_index[i]]
                        );
                    }
                    // buoc 1: normalize rating by subtract row mean
                    restructArrayWithMean(inputMatrix).then(avg => {
                        getResult(
                            inputMatrix,
                            user_idx,
                            avg,
                            item_need_to_recommend_index,
                            k
                        ).then(item_result => {
                            getResultWithItemId(item_result, item_need_to_recommend_id).then(
                                result => {
                                    sort(result).then(result => {
                                        if (result.length > maxSimilarDocuments) {
                                            result = result.splice(0, maxSimilarDocuments);
                                        }
                                        resolve(result);
                                    });
                                }
                            );
                        });
                    });
                })
                .catch(function (err) {
                    reject(new Error(err));
                });
        });
    },

    getHybridRecommender: function (user_id, item_id) {
        return new Promise(function (resolve, reject) {
            module.exports
                .getContentBasedResult(item_id)
                .then(similarDocuments => {
                    let or = [];
                    for (let i = 0; i < similarDocuments.length; i++) {
                        or.push({item_id: similarDocuments[i].id});
                    }
                    module.exports
                        .getCollaborativeFilteringResult(user_id, or)
                        .then(result => {
                            if (result.length === 0) {
                                console.log("Result after CF is null");
                                resolve(similarDocuments);
                            }
                            resolve(result);
                        })
                        .catch(function (err) {
                            if (err === -1) {
                                resolve(similarDocuments);
                            }
                            reject(new Error(err));
                        });
                })
                .catch(function (err) {
                    reject(new Error(err));
                });
        });
    },

    getGraphRecommender: function (user_id) {
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
                        }
                        else
                            user = graph.nodes("user").query().filter({id: user_id}).first();
                        if (itemIdx <= -1) {
                            items.push(item_id);
                            item = graph.createNode("item", {id: item_id});
                        }
                        else
                            item = graph.nodes("item").query().filter({id: item_id}).first();
                        views.push(graph.createEdge("view").link(user, item));
                    }
                })
                .then(() => {
                    if (users.indexOf(user_id) <= -1) {
                        reject("user does not in graph");
                    }
                })
                .then(() => {
                    let user = graph.nodes("user").query().filter({id: user_id}).first();
                    let results = graph.closest(user, {
                            compare: function (node) {
                                return node.entity === 'item';
                            },
                            minDepth: 3,
                            count: maxSimilarDocuments
                        }
                    );
                    // results is now an array of Paths, which are each traces from your starting node to your result node...
                    let resultNodes = results.map(function (path) {
                        return path.end();
                    });
                    resolve(resultNodes);
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

function sortWithIndeces(toSort) {
    return new Promise(function (resolve, reject) {
        for (let i = 0; i < toSort.length; i++) {
            toSort[i] = [toSort[i], i];
        }
        toSort.sort(function (left, right) {
            return left[0] > right[0] ? -1 : 1;
        });
        toSort.sortIndices = [];
        for (let j = 0; j < toSort.length; j++) {
            toSort.sortIndices.push(toSort[j][1]);
            toSort[j] = toSort[j][0];
        }
        resolve(toSort);
    });
}

function restructArrayWithMean(ratings) {
    return new Promise(function (resolve) {
        let avg = [];
        for (let i = 0; i < ratings.length; i++) {
            // tim trung binh
            let sum = 0;
            let count = 0;
            for (let j = 0; j < ratings[i].length; j++) {
                if (ratings[i][j] !== 0) {
                    sum += ratings[i][j];
                    count++;
                }
            }
            let mean = sum / count;
            avg.push(mean);
            for (let j = 0; j < ratings[i].length; j++) {
                if (ratings[i][j] !== 0) {
                    ratings[i][j] = ratings[i][j] - mean;
                }
            }
        }
        resolve(avg);
    });
}

function pearsonCorrelation(ratings, item_index) {
    return new Promise(function (resolve) {
        let itemCosinMatrix = Array(ratings.length);
        let itemVector = ratings[item_index];
        let mauItemVector = 0;
        for (let i = 0; i < itemVector.length; i++) {
            mauItemVector += itemVector[i] * itemVector[i];
        }
        mauItemVector = Math.sqrt(mauItemVector);
        // cosin similarity
        for (let i = 0; i < ratings.length; i++) {
            if (i === item_index) {
                itemCosinMatrix[i] = 1;
                continue;
            }
            // similarity giua itemVector voi cac vector khac
            let tu = 0;
            let mau = 0;
            for (let j = 0; j < ratings[i].length; j++) {
                tu += itemVector[j] * ratings[i][j];
                mau += ratings[i][j] * ratings[i][j];
            }
            mau = Math.sqrt(mau);
            if (tu === 0) {
                itemCosinMatrix[i] = 0;
            } else {
                itemCosinMatrix[i] = tu / (mauItemVector * mau);
            }
        }
        resolve(itemCosinMatrix);
    });
}

function getRatingPrediction(ratings, itemCosinMatrix, user_index, item_index, avg, k) {
    return new Promise(function (resolve) {
        // lay ra k item gan nhat
        itemCosinMatrix.splice(item_index, 1);
        sortWithIndeces(itemCosinMatrix).then(itemCosinMatrix => {
            let itemCosinIndex = itemCosinMatrix.sortIndices;
            itemCosinIndex = itemCosinIndex.splice(0, k);
            itemCosinMatrix = itemCosinMatrix.splice(0, k);
            let user_arr = [];
            for (let i = 0; i < ratings.length; i++) {
                if (i === item_index) continue;
                user_arr.push(ratings[i][user_index]);
            }
            let x = [];
            for (let i = 0; i < itemCosinIndex.length; i++) {
                x.push(user_arr[itemCosinIndex[i]]);
            }
            // tinh rating prediction
            let mau_result = 0;
            let tu_result = 0;
            for (let i = 0; i < itemCosinMatrix.length; i++) {
                mau_result += Math.abs(itemCosinMatrix[i]);
            }
            for (let i = 0; i < x.length; i++) {
                tu_result += itemCosinMatrix[i] * x[i];
            }
            let result1 = 0;
            if (tu_result !== 0) {
                result1 = tu_result / mau_result;
            }
            resolve(avg[item_index] + result1);
        });
    });
}

function getResultWithItemId(item_result, item_need_to_recommend_id) {
    return new Promise(function (resolve) {
        let result = [];
        for (let i = 0; i < item_result.length; i++) {
            result.push({
                id: item_need_to_recommend_id[i],
                rating: item_result[i]
            });
        }
        resolve(result);
    });
}

async function getResult(inputMatrix, user_idx, avg, item_need_to_recommend_index, k) {
    let item_result = [];
    for (let i = 0; i < item_need_to_recommend_index.length; i++) {
        const item_index = item_need_to_recommend_index[i];
        // buoc 2: pearson correlation
        await pearsonCorrelation(inputMatrix, item_index).then(itemCosinMatrix => {
            // buoc 3: tinh rating prediction
            getRatingPrediction(inputMatrix, itemCosinMatrix, user_idx, item_index, avg, k).then(result => {
                item_result.push(result);
            });
        });
    }
    return item_result;
}
