import * as deasync from "deasync";

let express = require("express");
let router = express.Router();
import precisionRecall from "precision-recall";

const recommender = require("./recommender/recommender");
const recommender_e = require("./evaluation/recommender_evaluation");
const fs = require("fs");
const parse = require("csv-parse");
const ContentBasedRecommender = require("./recommender/content-based-recommender");
const content_based = new ContentBasedRecommender({
    maxSimilarDocuments: 10,
    minScore: 0,
    debug: false
});
const userFile = "evaluation/ux_user.user";
const testFile = "evaluation/ux_test.test";
const trainFile = "evaluation/ux_train.train";

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
    console.log(content_based.getTokensFromString(req.body.content));
    res.send(content_based.getTokensFromString(req.body.content));
});


router.get("/evaluation-cf/", function (req, res, next) {
    let item_arr = [], r = [], user_arr = [];
    let docs = {};
    readUserStream(userFile).then(users => {
        createReadTrainStream(trainFile).then(data => {
            for (let i = 0; i < users.length; i++) {
                let retrieved = [];
                console.log("recommending for user ", users[i]);
                recommender_e.getCollaborativeFilteringResult(data, users, users[i])
                    .then(similarDocuments => {
                        retrieved.push(similarDocuments[i].id);
                    }).then(() => {
                    createReadStream(testFile, users[i]).then(
                        relevant => {
                            r.push(precisionRecall(relevant, retrieved));
                            console.log("r: ", r);
                        }
                    );
                }).catch(err => res.send(err));
            }
        }).catch(err => res.send(err));
    }).catch(err => res.send(err));
});

module.exports = router;

function createReadStream(filename, id) {
    return new Promise(function (resolve, reject) {
        let relevant = [];
        fs.createReadStream(filename)
            .pipe(parse({delimiter: "\t"}))
            .on("data", function (data) {
                console.log("data", data);
                if (data[0] === id) {
                    if (data[2] > 2) {
                        relevant.push(data[1]);
                    }
                }
            })
            .on("end", function () {
                resolve(relevant);
            });
    });
}

function createReadTrainStream(filename) {
    return new Promise(function (resolve, reject) {
        let docs = {};
        fs.createReadStream(filename).pipe(parse({delimiter: '\t'})).on('data', function (data) {
            try {
                let obj = {};
                obj.item = data[1];
                obj.rating = data[2];
                if (data[0] in docs) docs[data[0]].push(obj);
                else docs[data[0]] = [obj];
            } catch (e) {
                reject(e);
            }
        }).on('end', function () {
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
