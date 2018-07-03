let express = require('express');
let router = express.Router();
const kafka = require('kafka-node');

router.post('/catch-event', function (req, res, next) {
    let data = req.body;
    console.log(data);
    let Producer = kafka.Producer,
        KeyedMessage = kafka.KeyedMessage,
        client = new kafka.Client(),
        producer = new Producer(client),
        payloads = [
            {topic: 'welcome-message', messages: data, partition: 0}
        ];
    producer.on('ready', function () {
        producer.send(payloads, function (err, data) {
            console.log(data);
        })
    });
    producer.on('error', function (err) {
    });
});
router.get('/abc', function (req, res) {
   console.log("hello");
});
module.exports = router;

