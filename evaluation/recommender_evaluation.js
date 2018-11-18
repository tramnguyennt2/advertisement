const maxSimilarDocuments = 50;
const fs = require('fs');
const parse = require('csv-parse');
const neighbor_num = 2;

module.exports = {
    //user-based
    getCollaborativeFilteringResult: function (docs, user_arr, user_id) {
        return new Promise(function (resolve, reject) {
            console.time("cf " + user_id);
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

function predict(item_need_to_recommend, avg_user) {
    return new Promise(function (resolve, reject) {
        try {
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
                        id: item_need_to_recommend[i].item,
                        score: (r / v) + avg_user
                    });
                }
            }
            resolve(result);
        } catch (e) {
            console.log("predict error ", e);
            reject(e);
        }
    });
}

function getItemNeedToRecommend(docs, similarity, user_items) {
    return new Promise(function (resolve, reject) {
        try {
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
        } catch (e) {
            console.log("getItemNeedToRecommend error", e);
            reject(e);
        }
    })
}

function getCosinSimilarity(docs, user_items, user_arr, user_id) {
    return new Promise(function (resolve, reject) {
        try {
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
                        let prod = 0;
                        for (let k = 0; k < same.length; k++) {
                            let item_rating = user_items.filter((item) => {
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
                let keyA = a.sim, keyB = b.sim;
                if (keyA < keyB) return 1;
                if (keyA > keyB) return -1;
                return 0;
            });
            resolve(similarity);
        } catch (e) {
            console.log("getCosinSimilarity error ", e);
            reject(e);
        }
    })
}

function normalizeDocs(docs, user_arr, user_id) {
    return new Promise(function (resolve, reject) {
        try {
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
        } catch (e) {
            console.log("normalizeDocs error: ", e);
            reject(e);
        }

    });
}

function sort(arr) {
    return new Promise(function (resolve, reject) {
        try {
            resolve(arr.sort(compare));
        } catch (e) {
            console.log("sort error ", e);
            reject(e);
        }
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