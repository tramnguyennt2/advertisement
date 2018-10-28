let express = require("express");
let router = express.Router();
const recommender = require("./recommender/recommender");
// const recommender_e = require("./recommender_evaluation");
import precisionRecall from "precision-recall";

const fs = require("fs");
const parse = require("csv-parse");
const ContentBasedRecommender = require("./recommender/content-based-recommender");
const content_based = new ContentBasedRecommender({
    maxSimilarDocuments: 10,
    minScore: 0,
    debug: false
});

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

// router.get("/test-cf/:id", function (req, res, next) {
//     readUserStream("ml-100k/u (copy).user").then(users => {
//         let sents = [];
//         for (let i = 0; i < users.length; i++) {
//             let retrieved = [];
//             recommender_e
//                 .getCollaborativeFilteringResult(users[i])
//                 .then(similarDocuments => {
//                     for (let i = 0; i < similarDocuments.length; i++)
//                         if (similarDocuments[i].rating > 1)
//                             retrieved.push(similarDocuments[i].id);
//                 })
//                 .then(() => {
//                     createReadStream("ml-100k/ua (copy).test", req.params.id).then(
//                         relevant => {
//                             // console.log("relevant: ", relevant);
//                             // console.log("retrieved:", retrieved);
//                             sents.push(precisionRecall(relevant, retrieved));
//                             console.log("sent: ", sents);
//                         }
//                     );
//                 })
//                 .catch(err => {
//                     res.send(err);
//                 });
//         }
//     });
// });

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

router.post("/get-token", function (req, res, next) {
    console.log(content_based.getTokensFromString(req.body.content));
    res.send(content_based.getTokensFromString(req.body.content));
});

module.exports = router;

function createReadStream(filename, id) {
    return new Promise(function (resolve, reject) {
        let relevant = [];
        fs.createReadStream(filename)
            .pipe(parse({delimiter: "\t"}))
            .on("data", function (data) {
                if (data[0] === id) {
                    if (data[2] > 1) {
                        relevant.push(data[1]);
                    }
                }
            })
            .on("end", function () {
                resolve(relevant);
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
