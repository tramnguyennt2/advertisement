let express = require("express");
let router = express.Router();
const recommender = require("../recommender/recommender");

router.get("/content-based/:id", function (req, res, next) {
    console.log("content-based " + req.params.id);
    recommender.getContentBasedResult(req.params.id).then(
        similarDocuments => res.send(similarDocuments)
    ).catch(err => {
        res.send(err);
    });
});

router.get("/cf/:id", function (req, res, next) {
    recommender.getCollaborativeFilteringResult(req.params.id)
        .then(similarDocuments => res.send(similarDocuments))
        .catch(err => {
            res.send(err);
        });
});

router.get("/hybrid/:user_id/:item_id", function (req, res, next) {
    recommender.getHybridRecommend(req.params.user_id, req.params.item_id)
        .then(similarDocuments => res.send(similarDocuments))
        .catch(err => {
            res.send(err);
        });
});

router.get("/graph/:user_id", function (req, res, next) {
    recommender.getGraphRecommend(req.params.user_id)
        .then(similarDocuments => {
            similarDocuments = similarDocuments.map(item => {
                return {id: item.properties.id};
            });
            res.send(similarDocuments);
        }).catch(err => {
        res.send(err);
    });
});

router.post("/get-token", function (req, res, next) {
    res.send(content_based.getTokensFromString(req.body.content));
});

module.exports = router;
