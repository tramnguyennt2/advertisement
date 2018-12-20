const neighbor_num = 8;

module.exports = {
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
                for (let j = 0; j < items.length; j++) items[j].rating = items[j].rating - value / items.length;
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
                if (user_id === '2') {
                    console.log(item_need_to_recommend);
                }
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