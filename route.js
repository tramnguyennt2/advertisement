let express = require('express');
let router = express.Router();
const kafka = require('kafka-node');
const ContentBasedRecommender = require('content-based-recommender');
const recommender = new ContentBasedRecommender({
    minScore: 0.1,
    maxSimilarDocuments: 100
});
const nano = require('nano')('http://huyentk:Huyen1312@localhost:5984');
const db = nano.use('advertisement');

router.post('/catch-event', function (req, res, next) {
    let data = req.body;
    console.log(data);
    let Producer = kafka.Producer,
        KeyedMessage = kafka.KeyedMessage,
        client = new kafka.Client(),
        producer = new Producer(client),
        payloads = [
            {topic: 'behavior', messages: JSON.stringify(data), partition: 0}
        ];
    producer.on('ready', function () {
        producer.send(payloads, function (err, data) {
            console.log("Response from kafka server");
            console.log(data);
        })
    });
    producer.on('error', function (err) {
    });
});
router.get('/', function (req, res, next) {
    let documents = [];
    const q = {
        selector: {
            type: {"$eq": "item"}
        },
        fields: ["_id", "title"]
    };
    db.find(q).then((docs) => {
        for (let i = 0; i < docs.docs.length; i++) {
            let obj = {id: docs.docs[i]._id, content: docs.docs[i].title};
            documents.push(obj);
        }
    }).then(() => {
        recommender.train(documents);
        const similarDocuments = recommender.getSimilarDocuments('2443fef9-57fd-43ff-82a5-54d5324706d2', 0, 10);
        console.log(similarDocuments);
        res.send(similarDocuments);
    });
});
module.exports = router;

