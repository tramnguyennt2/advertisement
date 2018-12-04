let express = require("express");
let router = express.Router();

const recommender = require("./recommender/recommender");
const recommender_e = require("./evaluation/evaluation");

const fs = require("fs");
const parse = require("csv-parse");
const ContentBasedRecommender = require("./recommender/content-based-recommender");
const content_based = new ContentBasedRecommender({
    maxSimilarDocuments: 10,
    minScore: 0,
    debug: false
});

// ---------------------- USER FILE ------------------------
const userTestFile = "evaluation/test/user_ad_test.user";

// ---------------------- SPLIT DATA FROM u1.test ------------------------
const testAdFile = "evaluation/test/ad_test.test";
const testFile = "evaluation/ml-100k/ua.test";

// ----------------- REFORMAT TEST AND TRAINING FILE -------------------
// reformat by user_id: [{item: "item", rating: "rating"}] of testFile
// const docTestFile = "evaluation/test/doc_test_ua.txt";
const docTrainFile = "evaluation/train/doc_train_ad.txt";
const docTrainFileForCF = "evaluation/train/doc_train_ad_cf.txt";
const docTestFile = "evaluation/test/doc_test_ad.txt";
const docTestFileForCF = "evaluation/test/doc_test_ad_cf.txt";

const trainAdFile = "evaluation/train/ad_train.base";
// ---------------------- RESULT FILE ------------------------
// result of user-based CF.
const resultFile = "evaluation/results/result_ua_k30.txt";
const resultAdClickFileCF = "evaluation/results/result_ad_cf.txt";
const resultAdClickFileGraph = "evaluation/results/result_ad_graph.txt";
const resultAdClickFileHybrid = "evaluation/results/result_ad_hybrid.txt";

router.get("/content-based/:id", function (req, res, next) {
    console.log("content-based " + req.params.id);
    recommender
        .getContentBasedResult(req.params.id)
        .then(similarDocuments => res.send(similarDocuments))
        .catch(err => {
            res.send(err);
        });
});

router.get("/cf/:id", function (req, res, next) {
    recommender
        .getCollaborativeFilteringResult(req.params.id)
        .then(similarDocuments => res.send(similarDocuments))
        .catch(err => {
            res.send(err);
        });
});

router.get("/hybrid/:user_id/:item_id", function (req, res, next) {
    recommender
        .getHybridRecommend(req.params.user_id, req.params.item_id)
        .then(similarDocuments => res.send(similarDocuments))
        .catch(err => {
            res.send(err);
        });
});

router.get("/graph/:user_id", function (req, res, next) {
    recommender
        .getGraphRecommend(req.params.user_id)
        .then(similarDocuments => {
            similarDocuments = similarDocuments.map(item => {
                return {id: item.properties.id};
            });
            res.send(similarDocuments);
        })
        .catch(err => {
            res.send(err);
        });
});

router.post("/get-token", function (req, res, next) {
    res.send(content_based.getTokensFromString(req.body.content));
});

router.get("/read-file", function (req, res, next) {
    createReadTrainStream(testFile, docTestFile).then(data => {
        res.send("Done!");
    });
});

router.get("/read-ad-file", function (req, res, next) {
    createReadTrainStreamAdClicks(testAdFile, docTestFile).then(data => {
        createReadTrainStreamAdClicksForCF(testAdFile, docTestFileForCF).then(data => {
            res.send("Done!");
        });
    });
});

router.get("/read-ad-test-file", function (req, res, next) {
    createReadTrainStreamAdClicks(testAdFile, docTestFile).then(data => {
        createReadTestStreamAdClicksForCF(testAdFile, docTestFileForCF).then(data => {
            res.send("Done!");
        });
    });
});

// movielens
router.get("/evaluation-cf/", function (req, res, next) {
    recommender_e.getCollaborativeFilteringResult().then(result => {
        res.send(result);
        fs.writeFile(resultFile, JSON.stringify(result), function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
    });
});

// adclicks
router.get("/evaluation-cf-2/", function (req, res, next) {
    recommender_e.getCollaborativeFilteringResultAdClicks().then(result => {
        res.send(result);
        fs.writeFile(resultAdClickFileCF, JSON.stringify(result), function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
    });
});

// adclicks
router.get("/evaluation-graph/", function (req, res, next) {
    recommender_e.getGraphRecommend().then(result => {
        res.send(result);
        fs.writeFile(resultAdClickFileGraph, JSON.stringify(result), function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
    });
});

// adclicks
router.get("/evaluation-hybrid/", function (req, res, next) {
    recommender_e.getHybridRecommend().then(result => {
        res.send(result);
        fs.writeFile(resultAdClickFileHybrid, JSON.stringify(result), function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
    });
});

router.get("/map-cf/", function (req, res, next) {
    readUserStream(userTestFile).then(users => {
        readDocsFile(resultAdClickFileCF).then(d => {
            let results = JSON.parse(JSON.stringify(d));
            let total_ap = 0, map = 0, length = 0;
            readDocsFile(docTestFile).then(d => {
                let testData = JSON.parse(JSON.stringify(d));
                for (let i = 0; i < users.length; i++) {
                    if (results[users[i]].length !== undefined) {
                        let recommendedItems = results[users[i]];
                        let k = recommendedItems.length;
                        let relevantItems = testData[users[i]];
                        let num_relevant = relevantItems.length;
                        // let recommendedItems = [1, 2, 3, 4, 5, 6, 7];
                        // let relevantItems = [1, 4, 5, 6];
                        let arr = [], precisions = [];
                        for (let j = 0; j < k; j++) {
                            let flag = 0;
                            relevantItems.forEach(item => {
                                if (item.item === recommendedItems[j].id) {
                                    flag = 1;
                                }
                            });
                            if (flag === 0) arr.push(0);
                            else arr.push(1);
                        }
                        length++;
                        let min = num_relevant;
                        if (num_relevant > k) min = k;
                        for (let a = 0; a < arr.length; a++) {
                            if (arr[a] === 0) {
                                precisions.push(0);
                            } else {
                                let temp_arr = arr.slice(0, a + 1);
                                let count = temp_arr.filter(x => {
                                    return x === 1;
                                }).length;
                                precisions.push((count / (a + 1)) * (1 / min));
                            }
                        }
                        let ap = 0;
                        precisions.forEach(x => {
                            ap += x;
                        });
                        total_ap += ap;
                    }
                }
                map = total_ap / length;
                console.log("map", map);
            }).catch(err => res.send(err));
        }).catch(err => res.send(err));
    });
});

router.get("/map-graph/", function (req, res, next) {
    readUserStream(userTestFile).then(users => {
        readDocsFile(resultAdClickFileGraph).then(d => {
            let results = JSON.parse(JSON.stringify(d));
            let total_ap = 0, map = 0, length = 0;
            readDocsFile(docTestFile).then(d => {
                let testData = JSON.parse(JSON.stringify(d));
                for (let i = 0; i < users.length; i++) {
                    if (results[users[i]].length !== undefined) {
                        let recommendedItems = results[users[i]];
                        let k = recommendedItems.length;
                        let relevantItems = testData[users[i]];
                        let num_relevant = relevantItems.length;
                        // let recommendedItems = [1, 2, 3, 4, 5, 6, 7];
                        // let relevantItems = [1, 4, 5, 6];
                        let arr = [], precisions = [];
                        for (let j = 0; j < k; j++) {
                            let flag = 0;
                            relevantItems.forEach(item => {
                                if (item.item === recommendedItems[j].id) {
                                    flag = 1;
                                }
                            });
                            if (flag === 0) arr.push(0);
                            else arr.push(1);
                        }
                        length++;
                        let min = num_relevant;
                        if (num_relevant > k) min = k;
                        for (let a = 0; a < arr.length; a++) {
                            if (arr[a] === 0) {
                                precisions.push(0);
                            } else {
                                let temp_arr = arr.slice(0, a + 1);
                                let count = temp_arr.filter(x => {
                                    return x === 1;
                                }).length;
                                precisions.push((count / (a + 1)) * (1 / min));
                            }
                        }
                        let ap = 0;
                        precisions.forEach(x => {
                            ap += x;
                        });
                        total_ap += ap;
                    }
                }
                map = total_ap / length;
                console.log("map", map);
            }).catch(err => res.send(err));
        }).catch(err => res.send(err));
    });
});

router.get("/map-hybrid/", function (req, res, next) {
    readUserStream(userTestFile).then(users => {
        readDocsFile(resultAdClickFileHybrid).then(d => {
            let results = JSON.parse(JSON.stringify(d));
            let total_ap = 0, map = 0, length = 0;
            readDocsFile(docTestFile).then(d => {
                let testData = JSON.parse(JSON.stringify(d));
                for (let i = 0; i < users.length; i++) {
                    let items = results[users[i]];
                    let relevantItems = testData[users[i]];
                    let num_relevant = relevantItems.length;
                    let sub = 0;
                    items.forEach(item => {
                        let recommendedItems = item.recommend_items;
                        let k = recommendedItems.length;
                        let arr = [], precisions = [];
                        for (let j = 0; j < k; j++) {
                            let flag = 0;
                            relevantItems.forEach(item => {
                                if (item.item === recommendedItems[j].id) {
                                    flag = 1;
                                }
                            });
                            if (flag === 0) arr.push(0);
                            else arr.push(1);
                        }
                        length++;
                        let min = num_relevant;
                        if (num_relevant > k) min = k;
                        for (let a = 0; a < arr.length; a++) {
                            if (arr[a] === 0) {
                                precisions.push(0);
                            } else {
                                let temp_arr = arr.slice(0, a + 1);
                                let count = temp_arr.filter(x => {
                                    return x === 1;
                                }).length;
                                precisions.push((count / (a + 1)) * (1 / min));
                            }
                        }
                        let ap = 0;
                        precisions.forEach(x => {
                            ap += x;
                        });
                        sub += ap;
                        console.log(users[i], item.item, ap)
                    });
                    total_ap += sub/items.length;
                }
                map = total_ap / length;
                console.log("map", map);
            }).catch(err => res.send(err));
        }).catch(err => res.send(err));
    });
});

module.exports = router;

function compare(a, b) {
    if (a.score < b.score) return 1;
    if (a.score > b.score) return -1;
    return 0;
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

function createReadTestStreamAdClicksForCF(file1, file) {
    return new Promise(function (resolve, reject) {
        console.time("readFile");
        let docs = {};
        fs.createReadStream(file1)
            .pipe(parse({delimiter: "\t"}))
            .on("data", function (data) {
                try {
                    let rating = parseInt(data[3]);
                    let obj = {};
                    obj.item = data[2];
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

function createReadTrainStreamAdClicks(file1, file) {
    return new Promise(function (resolve, reject) {
        console.time("readAdFile");
        let docs = {};
        fs.createReadStream(file1).pipe(parse({delimiter: "\t"})).on("data", function (data) {
            try {
                let obj = {};
                obj.viewed_ad = data[1];
                obj.clicked_ad = data[2];
                obj.num_click = data[3];
                if (data[0] in docs) docs[data[0]].push(obj);
                else docs[data[0]] = [obj];
            } catch (e) {
                reject(e);
            }
        }).on("end", function () {
            fs.writeFile(file, JSON.stringify(docs), function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("The ad file was saved!");
            });
            console.timeEnd("readAdFile");
            resolve(docs);
        });
    });
}

function createReadTrainStreamAdClicksForCF(file1, file) {
    return new Promise(function (resolve, reject) {
        console.time("readFile");
        let docs = {};
        fs.createReadStream(file1)
            .pipe(parse({delimiter: "\t"}))
            .on("data", function (data) {
                try {
                    let rating = parseInt(data[3]);
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
