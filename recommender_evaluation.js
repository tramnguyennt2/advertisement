const ContentBasedRecommender = require("content-based-recommender");
const maxSimilarDocuments = 100;
const content_based = new ContentBasedRecommender({
    minScore: 0.1,
    maxSimilarDocuments: maxSimilarDocuments,
    debug: false
});
const ug = require("ug");
const k = 10;
const fs = require('fs');
const parse = require('csv-parse');
const moviesFile = 'ml-100k/u.item';
const ratingsFile = 'ml-100k/ua (copy).base';

module.exports = {
    getContentBasedResult: function (item_id) {
        return new Promise(function (resolve, reject) {
            let documents = [];
            fs.createReadStream(moviesFile).pipe(parse({delimiter: '|'}))
                .on('error', function (err) {
                    console.log("err", err);
                })
                .on('data', function (data) {
                    try {
                        documents.push({
                            id: data[0],
                            content: data[1]
                        });
                    }
                    catch (err) {
                        console.log("err", err);
                    }
                })
                .on('end', function () {
                    console.time("content-based alg");
                    // optimization
                    content_based.trainOpt(documents, item_id);
                    // content_based.train(documents);
                    const similarDocuments = content_based.getSimilarDocuments(
                        item_id,
                        0,
                        5
                    );
                    console.timeEnd("content-based alg");
                    resolve(similarDocuments);
                });
        });
    },

    getCollaborativeFilteringResult: function (user_id) {
        return new Promise(function (resolve, reject) {
            let documents = [];
            let user_arr = [];
            let item_arr = [];
            let rating_arr = [];
            let user_idx = 0;
            createReadStream(ratingsFile, documents, user_arr, item_arr).then(data => {
                documents = data[0];
                user_arr = data[1];
                item_arr = data[2];
            }).then(() => {
                user_idx = user_arr.indexOf(user_id);
                for (let i = 0; i < documents.length; i++) {
                    let item_idx = item_arr.indexOf(documents[i].item_id);
                    let user_idx = user_arr.indexOf(documents[i].user_id);
                    rating_arr.push([item_idx, user_idx, documents[i].rating]);
                }
            }).then(() => {
                let inputMatrix = new Array(item_arr.length);
                for (let i = 0; i < inputMatrix.length; i++) inputMatrix[i] = new Array(user_arr.length);
                for (let j = 0; j < rating_arr.length; j++) inputMatrix[rating_arr[j][0]][rating_arr[j][1]] = parseInt(rating_arr[j][2]);
                inputMatrix.filter(function (arr) {
                    for (let k = 0; k < arr.length; k++) if (arr[k] === undefined) arr[k] = 0;
                });
                return inputMatrix;
            }).then((inputMatrix) => {
                let item_need_to_recommend_index = [];
                let item_need_to_recommend_id = [];
                for (let i = 0; i < inputMatrix.length; i++) {
                    if (inputMatrix[i][user_idx] !== 0) continue;
                    item_need_to_recommend_index.push(i);
                }
                for (let i = 0; i < item_need_to_recommend_index.length; i++) {
                    item_need_to_recommend_id.push(item_arr[item_need_to_recommend_index[i]]);
                }
                console.time("cf");
                // buoc 1: normalize rating by subtract row mean
                restructArrayWithMean(inputMatrix).then(avg => {
                    getResult(inputMatrix, user_idx, avg, item_need_to_recommend_index, k).then(item_result => {
                        getResultWithItemId(item_result, item_need_to_recommend_id).then(
                            result => {
                                sort(result).then(result => {
                                    if (result.length > maxSimilarDocuments) result = result.splice(0, maxSimilarDocuments);
                                    console.timeEnd("cf");
                                    resolve(result);
                                });
                            }
                        );
                    })
                });
            }).catch(function (err) {
                reject(new Error(err));
            });
        })
    }
};

function createReadStream(filename) {
    let documents = [];
    let user_arr = [];
    let item_arr = [];

    return new Promise(function (resolve, reject) {
        fs.createReadStream(filename).pipe(parse({delimiter: '\t'})).on('data', function (data) {
            try {
                if (user_arr.indexOf(data[0]) <= -1) user_arr.push(data[0]);
                if (item_arr.indexOf(data[1]) <= -1) item_arr.push(data[1]);
                documents.push({
                    user_id: data[0],
                    item_id: data[1],
                    rating: data[2]
                });
            } catch (e) {
                reject(e);
            }
        }).on('end', function () {
            resolve([documents, user_arr, item_arr]);
        });
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
            let rating = ratings[i];
            // tim trung binh
            let sum = 0;
            let count = 0;
            for (let j = 0; j < rating.length; j++) {
                if (rating[j] !== 0) {
                    sum += rating[j];
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
