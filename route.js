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
// const userFile = "evaluation/ux_user_2.user";
const userFile = "evaluation/ux_user.user";
const testFile = "evaluation/ux_test.test";
const trainFile = "evaluation/ux_train.train";
// when write file, change to docs.txt and re-change docs.json
const docsFile = "evaluation/docs.json";
const resultsFile = "evaluation/results.json";

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
    readUserStream(userFile).then(users => {
        // createReadTrainStream(trainFile).then(data => {
        readDocsFile().then(d => {
            let data = JSON.parse(JSON.stringify(d));
            for (let i = 0; i < users.length; i++) {
                let retrieved = [];
                recommender_e.getCollaborativeFilteringResult(data, users, users[i])
                    .then(results => {
                        console.log("results for user ", users[i], results);
                    })
                    // .then(() => {
                    // createReadStream(testFile, users[i]).then(
                    //     relevant => {
                    //         r.push(precisionRecall(relevant, retrieved));
                    //         console.log("r: ", r);
                    //     }
                    // );
                    // })
                    .catch(err => res.send(err));
                data = JSON.parse(JSON.stringify(d));
            }
        }).catch(err => res.send(err));
    }).catch(err => res.send(err));
});

module.exports = router;

// save docs file: /evaluation/docs.json
function createReadTrainStream(filename) {
    return new Promise(function (resolve, reject) {
        let docs = {};
        fs.createReadStream(filename).pipe(parse({delimiter: '\t'})).on('data', function (data) {
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
        }).on('end', function () {
            fs.writeFile(docsFile, JSON.stringify(docs), function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            });
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

function readDocsFile() {
    return new Promise(function (resolve, reject) {
        const fs = require('fs');
        resolve(JSON.parse(fs.readFileSync(docsFile, 'utf8')));
    });
}