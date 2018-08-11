let express = require('express');
let router = express.Router();
const kafka = require('kafka-node');

router.post('/catch-event', function (req, res, next) {
    let data = req.body;
    console.log("Go to route.js");
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

module.exports = router;

