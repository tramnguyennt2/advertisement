let express = require("express");
let router = express.Router();
const fs = require("fs");

const recommender_e = require("../evaluation/evaluation");
const handle_file = require("../utils/handle_file");

// ---------------------- RESULT FILE ------------------------
const resultFile = "evaluation/results/result_ua_k30.txt";

const docTestFile = "evaluation/test/doc_test_ua.txt";
const testFile = "evaluation/ml-100k/ua.test";

router.get("/read-file", function (req, res, next) {
    handle_file.createReadTrainStream(testFile, docTestFile).then(data => {
        res.send("Done!");
    });
});

router.get("/evaluation-cf-mls/", function (req, res, next) {
    recommender_e.getCFResult().then(result => {
        res.send(result);
        fs.writeFile(resultFile, JSON.stringify(result), function (err) {
            if (err) return console.log(err);
            console.log("The file was saved!");
        });
    });
});

module.exports = router;