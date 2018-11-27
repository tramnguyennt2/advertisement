let express = require("express");
let router = express.Router();

const ug = require("ug");
const recommender = require("./recommender/recommender");
const cf_item_based = require("./recommender/redundant");
const recommender_e = require("./evaluation/recommender_evaluation");
const fs = require("fs");
const parse = require("csv-parse");
const ContentBasedRecommender = require("./recommender/content-based-recommender");
const content_based = new ContentBasedRecommender({
    maxSimilarDocuments: 10,
    minScore: 0,
    debug: false
});

// ---------------------- USER FILE ------------------------
const userTrainFile = "evaluation/train/user_ua_train.user";
const userTestFile = "evaluation/test/user_test.user";

// ---------------------- SPLIT DATA FROM u1.test ------------------------
// const testFile = "evaluation/test/test.test";
// const trainFile = "evaluation/train/train.base";
const testFile = "evaluation/ml-100k/ua.test";
const trainFile = "evaluation/ml-100k/ua.base";

// ----------------- REFORMAT TEST AND TRAINING FILE -------------------
// reformat by user_id: [{item: "item", rating: "rating"}] of trainFile
// const docTrainFile = "evaluation/train/doc_train.txt";
const docTrainFile = "evaluation/train/doc_train_ua.txt";
// reformat by user_id: [{item: "item", rating: "rating"}] of testFile
const docTestFile = "evaluation/test/doc_test.txt";

// ---------------------- RESULT FILE ------------------------
// result of user-based CF.
const resultFile = "evaluation/results/result_ml.txt";

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
    createReadTrainStream(trainFile, docTrainFile).then(data => {
        res.send("Done!");
    });
});

router.get("/evaluation-cf/", function (req, res, next) {
    readUserStream(userTrainFile)
        .then(users => {
            readDocsFile(docTrainFile).then(d => {
                let data = JSON.parse(JSON.stringify(d));
                for (let i = 0; i < users.length; i++) {
                    recommender_e.getCollaborativeFilteringResult(data, users, users[i])
                        .then(results => {
                            let obj = {};
                            obj[users[i]] = results;
                            fs.appendFileSync(resultFile, JSON.stringify(obj));
                        })
                        .catch(err => res.send(err));
                }
                //res.send("Done");
            }).catch(err => res.send(err));
        })
        .catch(err => res.send(err));
});

router.get("/map-cf/", function (req, res, next) {
    readUserStream(userTestFile).then(users => {
        readDocsFile(resultFile)
            .then(d => {
                let results = JSON.parse(JSON.stringify(d));
                let total_ap = 0,
                    map = 0,
                    length = 0;
                readDocsFile(docTestFile)
                    .then(d => {
                        let testData = JSON.parse(JSON.stringify(d));
                        for (let i = 0; i < users.length; i++) {
                            if (results[users[i]].length !== undefined) {
                                let recommendedItems = results[users[i]].sort(compare);
                                let k = recommendedItems.length;
                                // let recommendedItems = result.slice(0, k);
                                let test = testData[users[i]];
                                let relevantItems = test.filter(function (item) {
                                    return item.rating > 1;
                                });
                                let num_relevant = relevantItems.length;
                                // let recommendedItems = [1, 2, 3, 4, 5, 6, 7];
                                // let relevantItems = [1, 4, 5, 6];
                                let arr = [],
                                    precisions = [];
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
                                // if (users[i] === "13") {
                                //     console.log("recommendedItems", recommendedItems);
                                //     console.log("relevantItems", relevantItems);
                                //     console.log("ap ", ap);
                                // }
                                total_ap += ap;
                            }
                        }
                        map = total_ap / length;
                        console.log("length", length);
                        console.log("map", map);
                    })
                    .catch(err => res.send(err));
            })
            .catch(err => res.send(err));
    });
});

function sort(arr) {
    return new Promise(function (resolve, reject) {
        try {
            resolve(arr.sort(compare2));
        } catch (e) {
            console.log("sort error ", e);
            reject(e);
        }
    });
}

function compare2(a, b) {
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

function createReadTrainStreamToGraph(file1, graph) {
    return new Promise(function (resolve, reject) {
        let users = [],
            items = [],
            views = [];
        fs.createReadStream(file1)
            .pipe(parse({delimiter: "\t"}))
            .on("data", function (data) {
                try {
                    let user_id = data[0];
                    let item_id = data[1];
                    let userIdx = users.indexOf(user_id);
                    let itemIdx = items.indexOf(item_id);
                    let user, item;
                    if (userIdx <= -1) {
                        users.push(user_id);
                        user = graph.createNode("user", {id: user_id});
                    } else {
                        user = graph
                            .nodes("user")
                            .query()
                            .filter({id: user_id})
                            .first();
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
                } catch (e) {
                    reject(e);
                }
            })
            .on("end", function () {
                resolve([users, items, views, graph]);
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
