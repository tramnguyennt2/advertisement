let express = require("express");
let router = express.Router();
const kafka = require("kafka-node");
const ContentBasedRecommender = require("content-based-recommender");
const content_based = new ContentBasedRecommender({
  minScore: 0.1,
  maxSimilarDocuments: 100
});
const nano = require("nano")("http://huyentk:Huyen1312@localhost:5984");
const db = nano.use("advertisement");
const recommender = require("recommender");

router.post("/catch-event", function(req, res, next) {
  let data = req.body;
  console.log(data);
  let Producer = kafka.Producer,
    KeyedMessage = kafka.KeyedMessage,
    client = new kafka.Client(),
    producer = new Producer(client),
    payloads = [
      { topic: "behavior", messages: JSON.stringify(data), partition: 0 }
    ];
  producer.on("ready", function() {
    producer.send(payloads, function(err, data) {
      console.log("Response from kafka server");
      console.log(data);
    });
  });
  producer.on("error", function(err) {});
});

router.get("/content-based/:id", function(req, res, next) {
  let documents = [];
  const q = {
    selector: {
      type: { $eq: "item" }
    }
  };
  db.find(q)
    .then(docs => {
      for (let i = 0; i < docs.docs.length; i++) {
        let obj = { id: docs.docs[i]._id, content: docs.docs[i].title };
        documents.push(obj);
      }
    })
    .then(() => {
      content_based.train(documents);
      const similarDocuments = content_based.getSimilarDocuments(
        req.params.id,
        0,
        10
      );
      res.send(similarDocuments);
    });
});

router.get("/cf", function(req, res, next) {
  let inputMatrix = [
    [4, 0, 0, 1, 1, 0, 0],
    [5, 5, 4, 0, 0, 0, 0],
    [0, 0, 0, 2, 4, 5, 0],
    [3, 0, 0, 0, 0, 0, 3]
  ];
  let movieIndex = 1;
  let userIndex = 0;
  var predictedRating = recommender.getRatingPrediction(
    inputMatrix,
    movieIndex,
    userIndex,
    predictedRating => {
      console.log(predictedRating);
    }
  );
  res.send(predictedRating);
});
module.exports = router;
