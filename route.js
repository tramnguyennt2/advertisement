let express = require("express");
let router = express.Router();
const recommender = require("./recommender");
const recommender_e = require("./recommender_evaluation");
import precisionRecall from 'precision-recall';

const fs = require('fs');
const parse = require('csv-parse');

router.get("/content-based/:id", function (req, res, next) {
    recommender
        .getContentBasedResult(req.params.id)
        .then(similarDocuments => res.send(similarDocuments))
        .catch(err => {
            res.send(err);
        });
});

router.get("/test-content-based/:id", function (req, res, next) {
    recommender_e
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

router.get("/test-cf/:id", function (req, res, next) {
    readUserStream("ml-100k/u.user").then(users => {
        // let sents = [];
        // for (let i = 0; i < users.length; i++) {
        let retrieved = [];
        recommender_e
            .getCollaborativeFilteringResult(req.params.id)
            .then(similarDocuments => {
                // console.log("similarDocuments: ", similarDocuments);
                for (let i = 0; i < similarDocuments.length; i++)
                    if (similarDocuments[i].rating > 2.5)
                        retrieved.push(similarDocuments[i].id);
            })
            .then(() => {
                createReadStream("ml-100k/ua.test", req.params.id).then((relevant) => {
                    console.log("relevant: ", relevant);
                    console.log("retrieved:", retrieved);
                    const sentences = precisionRecall(relevant, retrieved);
                    res.send(sentences)
                    // sents.push(precisionRecall(relevant, retrieved));
                })
            })
            .catch(err => {
                res.send(err);
            });
        // }
    })
});

router.get("/hybrid/:user_id/:item_id", function (req, res, next) {
    recommender
        .getHybridRecommender(req.params.user_id, req.params.item_id)
        .then(similarDocuments => res.send(similarDocuments))
        .catch(err => {
            res.send(err);
        });
});

router.get("/graph/:user_id", function (req, res, next) {
    recommender
        .getGraphRecommender(req.params.user_id)
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

module.exports = router;


function createReadStream(filename, id) {
    return new Promise(function (resolve, reject) {
        let relevant = [];
        fs.createReadStream(filename).pipe(parse({delimiter: '\t'})).on('data', function (data) {
            if (data[0] === id) {
                if (data[2] > 2.5) {
                    relevant.push(data[1]);
                }
            }
        }).on('end', function () {
            resolve(relevant);
        });
    });
}

function readUserStream(filename) {
    return new Promise(function (resolve, reject) {
        let users = [];
        fs.createReadStream(filename).pipe(parse({delimiter: '|'})).on('data', function (data) {
            users.push(data[0]);
        }).on('end', function () {
            resolve(users);
        });
    });
}