let express = require("express");
let router = express.Router();

const ug = require("ug");
const recommender = require("./recommender/recommender");
const cf_item_based = require("./recommender/redundant");
const recommender_e = require("./evaluation/recommender_evaluation");
const fs = require("fs");
const parse = require("csv-parse");
const ContentBasedRecommender = require("./recommender/content-based-recommender");
const content_based = new ContentBasedRecommender({
  maxSimilarDocuments: 10,
  minScore: 0,
  debug: false
});

// ---------------------- USER FILE ------------------------
const userTrainFile = "evaluation/train/user_train.user";
const userTestFile = "evaluation/test/user_test.user";

// ---------------------- SPLIT DATA FROM u1.test ------------------------
const testFile = "evaluation/test/test.test";
const trainFile = "evaluation/train/train.base";

// ----------------- REFORMAT TEST AND TRAINING FILE -------------------
// when write file, change to docs.txt and re-change docs.json
// reformat by user_id: [{item: "item", rating: "rating"}] of trainFile
const docTrainFile = "evaluation/train/doc_train.txt";
// reformat by user_id: [{item: "item", rating: "rating"}] of testFile
const docTestFile = "evaluation/test/doc_test.txt";

// ---------------------- RESULT FILE ------------------------
// result of user-based CF.
const resultFile = "evaluation/results/result.txt";

router.get("/content-based/:id", function(req, res, next) {
  console.log("content-based " + req.params.id);
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

router.get("/cf-i/:id", function(req, res, next) {
  cf_item_based
    .getCollaborativeFilteringResultI(req.params.id)
    .then(similarDocuments => res.send(similarDocuments))
    .catch(err => {
      res.send(err);
    });
});

router.get("/hybrid/:user_id/:item_id", function(req, res, next) {
  recommender
    .getHybridRecommend(req.params.user_id, req.params.item_id)
    .then(similarDocuments => res.send(similarDocuments))
    .catch(err => {
      res.send(err);
    });
});

router.get("/graph/:user_id", function(req, res, next) {
  recommender
    .getGraphRecommend(req.params.user_id)
    .then(similarDocuments => {
      similarDocuments = similarDocuments.map(item => {
        return { id: item.properties.id };
      });
      res.send(similarDocuments);
    })
    .catch(err => {
      res.send(err);
    });
});

router.post("/get-token", function(req, res, next) {
  res.send(content_based.getTokensFromString(req.body.content));
});

router.get("/evaluation-cf/", function(req, res, next) {
  readUserStream(userTrainFile)
    .then(users => {
      //   createReadTrainStream(trainFile, docTrainFile)
      //     .then(data => {
      readDocsFile(docTrainFile)
        .then(d => {
          let data = JSON.parse(JSON.stringify(d));
          for (let i = 0; i < users.length; i++) {
            recommender_e
              .getCollaborativeFilteringResult(data, users, users[i])
              .then(results => {
                let obj = {};
                obj[users[i]] = results;
                fs.appendFileSync(resultFile, JSON.stringify(obj));
              })
              .catch(err => res.send(err));
            data = JSON.parse(JSON.stringify(d));
          }
          //res.send("Done");
        })
        .catch(err => res.send(err));
    })
    .catch(err => res.send(err));
});

router.get("/evaluation-graph/", function(req, res, next) {
  const graph = new ug.Graph();
  let users = [],
    items = [],
    views = [];
  createReadTrainStreamToGraph(trainFile, graph)
    .then(data => {
      users = data[0];
      items = data[1];
      views = data[2];
      let graph = data[3];
      for (let i = 0; i < users.length; i++) {
        let user = graph
          .nodes("user")
          .query()
          .filter({ id: users[i] })
          .first();
        let results = graph.closest(user, {
          compare: function(node) {
            return node.entity === "item";
          },
          minDepth: 3,
          count: 10
        });

        // results is now an array of Paths, which are each traces from your starting node to your result node...
        let resultNodes = results.map(function(path) {
          return path.end();
        });
        let obj = {};
        obj[users[i]] = resultNodes.map(item => {
          return { id: item.properties.id };
        });
        fs.appendFileSync(resultsGraphFile, JSON.stringify(obj));
      }
    })
    .catch(err => res.send(err));
});

router.get("/map-cf/", function(req, res, next) {
  readUserStream(userTestFile).then(users => {
    readDocsFile(resultsFileJson)
      .then(d => {
        let results = JSON.parse(JSON.stringify(d));
        let total_ap = 0;
        let map = 0;
        readDocsFile(docsTestFile)
          .then(d => {
            let testData = JSON.parse(JSON.stringify(d));
            for (let i = 0; i < users.length; i++) {
              let result = results[users[i]];
              let test = testData[users[i]];
              let relevantItems = test.filter(function(item) {
                return item.rating > 2;
              });
              let recommendedItems = result.slice(0, 10);
              let arr = [],
                precisions = [];
              let num_relevant = 0;
              for (let j = 0; j < recommendedItems.length; j++) {
                let flag = 0;
                relevantItems.forEach(item => {
                  if (item.item === recommendedItems[j].id) {
                    flag = 1;
                  }
                });
                if (flag === 0) {
                  arr.push(0);
                } else {
                  num_relevant++;
                  arr.push(1);
                }
              }
              for (let k = 0; k < arr.length; k++) {
                if (arr[k] === 0) {
                  precisions.push(0);
                } else {
                  let temp_arr = arr.slice(0, k + 1);
                  let count = temp_arr.filter(x => {
                    return x === 1;
                  }).length;
                  precisions.push(count / (k + 1));
                }
              }
              let total_precision = 0;
              precisions.forEach(x => {
                total_precision += x;
              });
              let ap = 0;
              if (num_relevant !== 0) {
                ap = total_precision / num_relevant;
              }
              total_ap += ap;
            }
            map = total_ap / users.length;
            console.log("map2", total_ap / users.length);
          })
          .catch(err => res.send(err));
      })
      .catch(err => res.send(err));
  });
});

router.get("/map-graph/", function(req, res, next) {
  readUserStream(userTestFile).then(users => {
    readDocsFile(resultsGraphFileJson)
      .then(d => {
        let results = JSON.parse(JSON.stringify(d));
        readDocsFile(docsTestFile)
          .then(d => {
            let total_ap = 0;
            let testData = JSON.parse(JSON.stringify(d));
            for (let i = 0; i < users.length; i++) {
              let result = results[users[i]].sort(compare);
              let test = testData[users[i]];
              let relevantItems = test.filter(function(item) {
                return item.rating > 2;
              });
              let recommendedItems = result.slice(0, 10);
              let arr = [],
                precisions = [];
              let num_relevant = 0;
              for (let j = 0; j < recommendedItems.length; j++) {
                let flag = 0;
                relevantItems.forEach(item => {
                  if (item.item === recommendedItems[j].id) {
                    flag = 1;
                  }
                });
                if (flag === 0) {
                  arr.push(0);
                } else {
                  num_relevant++;
                  arr.push(1);
                }
              }
              for (let k = 0; k < arr.length; k++) {
                if (arr[k] === 0) {
                  precisions.push(0);
                } else {
                  let temp_arr = arr.slice(0, k + 1);
                  let count = temp_arr.filter(x => {
                    return x === 1;
                  }).length;
                  precisions.push(count / (k + 1));
                }
              }
              let total_precision = 0;
              precisions.forEach(x => {
                total_precision += x;
              });
              let ap = 0;
              if (num_relevant !== 0) {
                ap = total_precision / num_relevant;
              }
              total_ap += ap;
            }
            console.log("map", total_ap / users.length);
          })
          .catch(err => res.send(err));
      })
      .catch(err => res.send(err));
  });
});

module.exports = router;

function compare(a, b) {
  if (a.score < b.score) return 1;
  if (a.score > b.score) return -1;
  return 0;
}

// save docs file: /evaluation/docs.json
function createReadTrainStream(file1, file) {
  return new Promise(function(resolve, reject) {
    let docs = {};
    fs.createReadStream(file1)
      .pipe(parse({ delimiter: "\t" }))
      .on("data", function(data) {
        try {
          let rating = parseInt(data[2]);
          let obj = {};
          obj.item = data[1];
          obj.rating = rating;
          if (data[0] in docs) docs[data[0]].push(obj);
          else docs[data[0]] = [obj];
        } catch (e) {
          reject(e);
        }
      })
      .on("end", function() {
        fs.writeFile(file, JSON.stringify(docs), function(err) {
          if (err) {
            return console.log(err);
          }
          console.log("The file was saved!");
        });
        resolve(docs);
      });
  });
}

function createReadTrainStreamToGraph(file1, graph) {
  return new Promise(function(resolve, reject) {
    let users = [],
      items = [],
      views = [];
    fs.createReadStream(file1)
      .pipe(parse({ delimiter: "\t" }))
      .on("data", function(data) {
        try {
          let user_id = data[0];
          let item_id = data[1];
          let userIdx = users.indexOf(user_id);
          let itemIdx = items.indexOf(item_id);
          let user, item;
          if (userIdx <= -1) {
            users.push(user_id);
            user = graph.createNode("user", { id: user_id });
          } else {
            user = graph
              .nodes("user")
              .query()
              .filter({ id: user_id })
              .first();
          }
          if (itemIdx <= -1) {
            items.push(item_id);
            item = graph.createNode("item", { id: item_id });
          } else
            item = graph
              .nodes("item")
              .query()
              .filter({ id: item_id })
              .first();
          views.push(graph.createEdge("view").link(user, item));
        } catch (e) {
          reject(e);
        }
      })
      .on("end", function() {
        resolve([users, items, views, graph]);
      });
  });
}

function readUserStream(filename) {
  return new Promise(function(resolve, reject) {
    let users = [];
    fs.createReadStream(filename)
      .pipe(parse({ delimiter: "|" }))
      .on("data", function(data) {
        users.push(data[0]);
      })
      .on("end", function() {
        resolve(users);
      });
  });
}

function readDocsFile(docsFile) {
  return new Promise(function(resolve, reject) {
    const fs = require("fs");
    resolve(JSON.parse(fs.readFileSync(docsFile, "utf8")));
  });
}
