const ContentBasedRecommender = require("content-based-recommender");
const content_based = new ContentBasedRecommender({
  minScore: 0.1,
  maxSimilarDocuments: 100
});
const nano = require("nano")("http://huyentk:Huyen1312@localhost:5984");
const db = nano.use("advertisement");
const recommender = require("recommender");

module.exports = {
  getContentBasedResult: function(item_id) {
    return new Promise(function(resolve, reject) {
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
          const similarDocuments = content_based.getSimilarDocuments(item_id, 0, 5);
          resolve(similarDocuments);
        })
        .catch(function(err) {
          reject(new Error(err));
        });
    });
  },

  getCollaborativeFilteringResult: function(user_id, item_input = []) {
    return new Promise(function(resolve, reject) {
      let documents = [];
      let user_arr = [];
      let item_arr = [];
      let rating_arr = [];
      let user_idx = 0;
      let q;
      if (item_input.length === 0) {
        q = {
          selector: {
            type: { $eq: "rating" }
          }
        };
      } else {
        q = {
          selector: {
            type: { $eq: "rating" },
            $or: item_input
          }
        };
      }
      db.find(q)
        .then(docs => {
          for (let i = 0; i < docs.docs.length; i++) {
            let obj = {
              user_id: docs.docs[i].user_id,
              item_id: docs.docs[i].item_id,
              rating: docs.docs[i].rating
            };
            documents.push(obj);
          }
          for (let i = 0; i < documents.length; i++) {
            if (user_arr.includes(documents[i].user_id)) {
              continue;
            }
            user_arr.push(documents[i].user_id);
          }
          user_idx = user_arr.indexOf(user_id);
          if (user_idx <= -1) {
            console.log(
              "user has not rated any item in recommended item list."
            );
            reject(-1);
          }
          for (let i = 0; i < documents.length; i++) {
            if (item_arr.indexOf(documents[i].item_id) > -1) {
              continue;
            }
            item_arr.push(documents[i].item_id);
          }
          for (let i = 0; i < documents.length; i++) {
            let item_idx = item_arr.indexOf(documents[i].item_id);
            let user_idx = user_arr.indexOf(documents[i].user_id);
            rating_arr.push([user_idx, item_idx, documents[i].rating]);
          }
        })
        .then(() => {
          let inputMatrix = new Array(user_arr.length);
          for (let i = 0; i < inputMatrix.length; i++) {
            inputMatrix[i] = new Array(item_arr.length);
          }
          for (let j = 0; j < rating_arr.length; j++) {
            inputMatrix[rating_arr[j][0]][rating_arr[j][1]] = rating_arr[j][2];
          }
          inputMatrix.filter(function(arr) {
            for (let k = 0; k < arr.length; k++) {
              if (arr[k] === undefined) arr[k] = 0;
            }
          });
          recommender.getTopCFRecommendations(
            inputMatrix,
            user_idx,
            { limit: 5 },
            recommendations => {
              for (let i = 0; i < recommendations.length; i++) {
                recommendations[i].itemId = item_arr[recommendations[i].itemId];
              }
              resolve(recommendations);
            }
          );
        })
        .catch(function(err) {
          reject(new Error(err));
        });
      // let inputMatrix = [
      //   [0, 0, 0, 2, 2, 3, 0],
      //   [0, 1, 3, 0, 0, 0, 0],
      //   [0, 1, 0, 1, 0, 1, 0],
      //   [2, 0, 0, 4, 0, 1, 1],
      //   [3, 0, 2, 0, 2, 0, 0]
      // ];
      // recommender.getTopCFRecommendations(inputMatrix, 0, recommendations => {
      //   res.send(recommendations);
      // });
    });
  },

  getHybridRecommender: function(user_id, item_id) {
    return new Promise(function(resolve, reject) {
      module.exports
        .getContentBasedResult(item_id)
        .then(similarDocuments => {
          let or = [];
          for (let i = 0; i < similarDocuments.length; i++) {
            or.push({ item_id: similarDocuments[i].id });
          }
          module.exports
            .getCollaborativeFilteringResult(user_id, or)
            .then(result => {
              if (result.length === 0) {
                console.log("Result after CF is null");
                resolve(similarDocuments);
              }
              resolve(result);
            })
            .catch(function(err) {
              if (err === -1) {
                resolve(similarDocuments);
              }
              reject(new Error(err));
            });
        })
        .catch(function(err) {
          reject(new Error(err));
        });
    });
  }
};
