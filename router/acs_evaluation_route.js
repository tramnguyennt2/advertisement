let express = require("express");
let router = express.Router();
const fs = require("fs");
const recommender_e = require("../evaluation/evaluation");
const handle_file = require("../utils/handle_file");

// ---------------------- USER FILE ------------------------
const userTestFile = "evaluation/test/adclicks/user_ad_test.user";

// ---------------------- SPLIT DATA FROM u1.test ------------------------
const testAdFile = "evaluation/test/adclicks/ad_test.test";

// ----------------- REFORMAT TEST AND TRAINING FILE -------------------
const docTrainFile = "evaluation/train/adclicks/doc_train_ad.txt";
const docTrainFileForCF = "evaluation/train/adclicks/doc_train_ad_cf.txt";
const docTestFile = "evaluation/test/adclicks/doc_test_ad.txt";
const trainAdFile = "evaluation/train/adclicks/ad_train.base";

// ---------------------- RESULT FILE ------------------------
const resultAdClickFileCF = "evaluation/results/adclicks/result_ad_cf.txt";
const resultAdClickFileCB = "evaluation/results/adclicks/result_ad_cb.txt";
const resultAdClickFileHybrid = "evaluation/results/adclicks/result_ad_hybrid.txt";

router.get("/read-ad-file", function (req, res, next) {
    handle_file.readTrainACs(trainAdFile, docTrainFile).then(data => {
        handle_file.readTrainACsCF(trainAdFile, docTrainFileForCF).then(data => {
            res.send("Done!");
        });
    });
});

router.get("/read-ad-test-file", function (req, res, next) {
    handle_file.readTrainACs(testAdFile, docTestFile).then(data => {
        res.send("Done!");
    });
});

router.get("/evaluation-cf-acs/", function (req, res, next) {
    recommender_e.getCFResultACs().then(result => {
        res.send(result);
        fs.writeFile(resultAdClickFileCF, JSON.stringify(result), function (err) {
            if (err) return console.log(err);
            console.log("The file was saved!");
        });
    });
});

router.get("/map-cf/", function (req, res, next) {
    handle_file.readUserStream(userTestFile).then(users => {
        handle_file.readDocsFile(resultAdClickFileCF).then(d => {
            let results = JSON.parse(JSON.stringify(d));
            let total_ap = 0, map = 0, length = 0;
            handle_file.readDocsFile(docTestFile).then(d => {
                let testData = JSON.parse(JSON.stringify(d));
                for (let i = 0; i < users.length; i++) {
                    if (results[users[i]].length !== undefined) {
                        let recommendedItems = results[users[i]];
                        let k = recommendedItems.length;
                        let relevantItems = testData[users[i]];
                        let num_relevant = relevantItems.length;
                        let arr = [], precisions = [];
                        for (let j = 0; j < k; j++) {
                            let flag = 0;
                            relevantItems.forEach(item => {
                                if (item.clicked_ad === recommendedItems[j].id || item.viewed_ad === recommendedItems[j].id) flag = 1;
                            });
                            if (flag === 0) arr.push(0);
                            else arr.push(1);
                        }
                        length++;
                        let min = num_relevant;
                        if (num_relevant > k) min = k;
                        for (let a = 0; a < arr.length; a++) {
                            if (arr[a] === 0) precisions.push(0);
                            else {
                                let temp_arr = arr.slice(0, a + 1);
                                let count = temp_arr.filter(x => {
                                    return x === 1;
                                }).length;
                                precisions.push((count / (a + 1)) * (1 / min));
                            }
                        }

                        let ap = 0;
                        precisions.forEach(x => {
                            ap += x;
                        });
                        total_ap += ap;
                    }
                }
                map = total_ap / length;
                res.send("map is " + map);
            }).catch(err => res.send(err));
        }).catch(err => res.send(err));
    });
});

router.get("/get-cb-result/", function (req, res, next) {
    recommender_e.getContentBased().then(result => {
        res.send(result);
    });
});

router.get("/evaluation-cb/", function (req, res, next) {
    recommender_e.getCBEvaluation().then(result => {
        res.send(result);
        fs.writeFile(resultAdClickFileCB, JSON.stringify(result), function (err) {
            if (err) return console.log(err);
            console.log("The file was saved!");
        });
    });
});

router.get("/map-cb/", function (req, res, next) {
    handle_file.readUserStream(userTestFile).then(users => {
        handle_file.readDocsFile(resultAdClickFileCB).then(d => {
            let results = JSON.parse(JSON.stringify(d));
            let total_ap = 0, map = 0;
            handle_file.readDocsFile(docTestFile).then(d => {
                let testData = JSON.parse(JSON.stringify(d));
                for (let i = 0; i < users.length; i++) {
                    let user_id = users[i];
                    let items = results[user_id];
                    let relevantItems = testData[user_id];
                    let num_relevant = relevantItems.length;
                    let sub = 0;
                    items.forEach(item => {
                        let recommendedItems = item.recommend_items;
                        let k = recommendedItems.length;
                        let arr = [], precisions = [];
                        for (let j = 0; j < k; j++) {
                            let flag = 0;
                            relevantItems.forEach(item => {
                                if ('ad-' + item.clicked_ad === recommendedItems[j].id || 'ad-' + item.viewed_ad === recommendedItems[j].id)
                                    flag = 1;
                            });
                            if (flag === 0) arr.push(0);
                            else arr.push(1);
                        }
                        let min = num_relevant;
                        if (num_relevant > k) min = k;
                        for (let a = 0; a < arr.length; a++) {
                            if (arr[a] === 0) precisions.push(0);
                            else {
                                let temp_arr = arr.slice(0, a + 1);
                                let count = temp_arr.filter(x => {
                                    return x === 1;
                                }).length;
                                precisions.push((count / (a + 1)) * (1 / min));
                            }
                        }
                        let ap = 0;
                        precisions.forEach(x => {
                            ap += x;
                        });
                        sub += ap;
                    });
                    total_ap += sub / items.length;
                    console.log(user_id, sub / items.length);
                }
                map = total_ap / users.length;
                res.send("map is " + map);
            }).catch(err => res.send(err));
        }).catch(err => res.send(err));
    });
});

router.get("/evaluation-hybrid/", function (req, res, next) {
    recommender_e.getHybridRecommend().then(result => {
        res.send(result);
        fs.writeFile(resultAdClickFileHybrid, JSON.stringify(result), function (err) {
            if (err) return console.log(err);
            console.log("The file was saved!");
        });
    });
});

router.get("/map-hybrid/", function (req, res, next) {
    handle_file.readUserStream(userTestFile).then(users => {
        handle_file.readDocsFile(resultAdClickFileHybrid).then(d => {
            let results = JSON.parse(JSON.stringify(d));
            let total_ap = 0, map = 0;
            handle_file.readDocsFile(docTestFile).then(d => {
                let testData = JSON.parse(JSON.stringify(d));
                for (let i = 0; i < users.length; i++) {
                    let user_id = users[i];
                    let items = results[user_id];
                    let relevantItems = testData[user_id];
                    let num_relevant = relevantItems.length;
                    let sub = 0;
                    items.forEach(item => {
                        let recommendedItems = item.recommend_items;
                        let k = recommendedItems.length;
                        let arr = [], precisions = [];
                        for (let j = 0; j < k; j++) {
                            let flag = 0;
                            relevantItems.forEach(item => {
                                if ('ad-' + item.clicked_ad === recommendedItems[j].id || 'ad-' + item.viewed_ad === recommendedItems[j].id)
                                    flag = 1;
                            });
                            if (flag === 0) arr.push(0);
                            else arr.push(1);
                        }

                        let min = num_relevant;
                        if (num_relevant > k) min = k;
                        for (let a = 0; a < arr.length; a++) {
                            if (arr[a] === 0) precisions.push(0);
                            else {
                                let temp_arr = arr.slice(0, a + 1);
                                let count = temp_arr.filter(x => {
                                    return x === 1;
                                }).length;
                                precisions.push((count / (a + 1)) * (1 / min));
                            }
                        }
                        let ap = 0;
                        precisions.forEach(x => {
                            ap += x;
                        });
                        sub += ap;
                    });
                    total_ap += sub / items.length;
                }
                map = total_ap / users.length;
                res.send("map is " + map);
            }).catch(err => res.send(err));
        }).catch(err => res.send(err));
    });
});

module.exports = router;