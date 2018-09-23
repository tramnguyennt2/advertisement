const ContentBasedRecommender = require("content-based-recommender");
const maxSimilarDocuments = 5;
const content_based = new ContentBasedRecommender({
    minScore: 0.1,
    maxSimilarDocuments: maxSimilarDocuments,
    debug: false
});
const nano = require("nano")("http://huyentk:Huyen1312@localhost:5984");
const db = nano.use("advertisement");
const k = 5;

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
                        let obj = {
                            user_id: docs.docs[i].user_id,
                            item_id: docs.docs[i].item_id,
                            rating: docs.docs[i].rating
                        };
                        documents.push(obj);
                    }
                    for (let i = 0; i < documents.length; i++) {
                        if (user_arr.includes(documents[i].user_id)) {
                            continue;
                        }
                        user_arr.push(documents[i].user_id);
                    }
                    user_idx = user_arr.indexOf(user_id);
                    if (user_idx <= -1) {
                        console.log(
                            "user has not rated any item in recommended item list."
                        );
                        reject("user has not rated any item in recommended item list.");
                    }
                    for (let i = 0; i < documents.length; i++) {
                        if (item_arr.indexOf(documents[i].item_id) > -1) {
                            continue;
                        }
                        item_arr.push(documents[i].item_id);
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
                        inputMatrix[rating_arr[j][0]][rating_arr[j][1]] = rating_arr[j][2];
                    }
                    inputMatrix.filter(function (arr) {
                        for (let k = 0; k < arr.length; k++) {
                            if (arr[k] === undefined) arr[k] = 0;
                        }
                    });
                    return inputMatrix;
                })
                .then(inputMatrix => {
                    let item_need_to_recommend_index = [];
                    for (let i = 0; i < inputMatrix.length; i++) {
                        if (inputMatrix[i][user_idx] !== 0)
                            continue;
                        item_need_to_recommend_index.push(i);
                    }
                    let item_need_to_recommend_id = [];
                    for (let i = 0; i < item_need_to_recommend_index.length; i++) {
                        item_need_to_recommend_id.push(item_arr[item_need_to_recommend_index[i]]);
                    }
                    // buoc 1: normalize rating by subtract row mean
                    restructArrayWithMean(inputMatrix).then((avg) => {
                        getResult(inputMatrix, user_idx, avg, item_need_to_recommend_index, k).then(item_result => {
                            getResultWithItemId(item_result, item_need_to_recommend_id).then(result => {
                                sort(result).then(result => {
                                    if (result.length > maxSimilarDocuments) {
                                        result = result.splice(0, maxSimilarDocuments);
                                    }
                                    resolve(result);
                                });
                            });
                        });
                    });
                }).catch(function (err) {
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
    }
};

function sort(arr) {
    return new Promise(function (resolve, reject) {
        resolve(arr.sort(compare));
    })
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
        sortWithIndeces(itemCosinMatrix)
            .then(itemCosinMatrix => {
                    let itemCosinIndex = itemCosinMatrix.sortIndices;
                    itemCosinIndex = itemCosinIndex.splice(0, k);
                    itemCosinMatrix = itemCosinMatrix.splice(0, k);
                    let user_arr = [];
                    for (let i = 0; i < ratings.length; i++) {
                        if (i === item_index)
                            continue;
                        user_arr.push(ratings[i][user_index]);
                    }
                    let x = [];
                    for (let i = 0; i < itemCosinIndex.length; i++) {
                        x.push(user_arr[itemCosinIndex[i]])
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
                }
            );
    });
}

function getResultWithItemId(item_result, item_need_to_recommend_id) {
    return new Promise(function (resolve) {
        let result = [];
        for (let i = 0; i < item_result.length; i++) {
            result.push({
                id: item_need_to_recommend_id[i],
                rating: item_result[i]
            })
        }
        resolve(result);
    });
}

async function getResult(inputMatrix, user_idx, avg, item_need_to_recommend_index, k) {
    let item_result = [];
    for (let i = 0; i < item_need_to_recommend_index.length; i++) {
        const item_index = item_need_to_recommend_index[i];
        // buoc 2: pearson correlation
        await pearsonCorrelation(inputMatrix, item_index)
            .then((itemCosinMatrix) => {
                // buoc 3: tinh rating prediction
                getRatingPrediction(inputMatrix, itemCosinMatrix, user_idx, item_index, avg, k)
                    .then(result => {
                        item_result.push(Math.round(result));
                    });
            });
    }
    return item_result;
}