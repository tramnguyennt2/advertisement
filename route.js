let express = require("express");
let router = express.Router();
const recommender = require("./recommender");

router.get("/content-based/:id", function(req, res, next) {
  recommender
    .getContentBasedResult(req.params.id)
    .then(similarDocuments => res.send(similarDocuments))
    .catch(err => {
      res.send(err);
    });
});

router.get("/cf/:id", function(req, res, next) {
  recommender
    .getCollaborativeFilteringResult(req.params.id)
    .then(similarDocuments => res.send(similarDocuments))
    .catch(err => {
      res.send(err);
    });
});

router.get("/hybrid/:user_id/:item_id", function(req, res, next) {
  recommender
    .getHybridRecommender(req.params.user_id, req.params.item_id)
    .then(similarDocuments => res.send(similarDocuments))
    .catch(err => {
      res.send(err);
    });
});

module.exports = router;
