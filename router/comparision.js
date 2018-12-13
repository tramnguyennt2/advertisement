let express = require("express");
let router = express.Router();

const comparision = require("../recommender/comparision");

router.get("/ori-content-based/:id", function (req, res, next) {
    console.log("content-based " + req.params.id);
    comparision.getContentBasedOriginResult(req.params.id).then(
        similarDocuments => res.send(similarDocuments)
    ).catch(err => {
        res.send(err);
    });
});

router.get("/opt-content-based/:id", function (req, res, next) {
    console.log("content-based " + req.params.id);
    comparision.getContentBasedOptResult(req.params.id).then(
        similarDocuments => res.send(similarDocuments)
    ).catch(err => {
        res.send(err);
    });
});

module.exports = router;