const fs = require("fs");
const parse = require("csv-parse");

module.exports = {
    readUserStream(filename) {
        return new Promise(function (resolve, reject) {
            let users = [];
            fs.createReadStream(filename).pipe(parse({delimiter: "|"}))
                .on("data", function (data) {
                    users.push(data[0]);
                }).on("end", function () {
                resolve(users);
            });
        });
    },

    readDocsFile(docsFile) {
        return new Promise(function (resolve, reject) {
            const fs = require("fs");
            resolve(JSON.parse(fs.readFileSync(docsFile, "utf8")));
        });
    },

    // save docs file: /evaluation/docs.json
    readTrain(file1, file) {
        return new Promise(function (resolve, reject) {
            console.time("readFile");
            let docs = {};
            fs.createReadStream(file1).pipe(parse({delimiter: "\t"}))
                .on("data", function (data) {
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
                }).on("end", function () {
                fs.writeFile(file, JSON.stringify(docs), function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("The file was saved!");
                });
                console.timeEnd("readFile");
                resolve(docs);
            });
        });
    },

    readTrainACsCF(file1, file) {
        return new Promise(function (resolve, reject) {
            console.time("readFile");
            let docs = {};
            fs.createReadStream(file1).pipe(parse({delimiter: "\t"}))
                .on("data", function (data) {
                    try {
                        if (docs[data[0]]) {
                            let items = docs[data[0]];
                            let flag1 = 0;
                            let flag2 = 0;
                            items.forEach(item => {
                                if (item.item === data[1]) {
                                    flag1 = 1;
                                }
                                if (item.item === data[2]) {
                                    item.rating ++;
                                    flag2 = 1;
                                }
                            });
                            if (flag1 === 0) {
                                let obj1 = {};
                                obj1.item = data[1];
                                obj1.rating = 1;
                                docs[data[0]].push(obj1);
                            }
                            if (flag2 === 0) {
                                let obj2 = {};
                                obj2.item = data[2];
                                obj2.rating = 1;
                                docs[data[0]].push(obj2);
                            }
                        } else {
                            let obj1 = {};
                            obj1.item = data[1];
                            obj1.rating = 1;
                            let obj2 = {};
                            obj2.item = data[2];
                            obj2.rating = 1;
                            docs[data[0]] = [];
                            docs[data[0]].push(obj1);
                            docs[data[0]].push(obj2);
                        }
                    } catch (e) {
                        reject(e);
                    }
                })
                .on("end", function () {
                    fs.writeFile(file, JSON.stringify(docs), function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        console.log("The file was saved!");
                    });
                    console.timeEnd("readFile");
                    resolve(docs);
                });
        });
    },

    readTrainACs(file1, file) {
        return new Promise(function (resolve, reject) {
            console.time("readAdFile");
            let docs = {};
            fs.createReadStream(file1).pipe(parse({delimiter: "\t"})).on("data", function (data) {
                try {
                    let obj = {};
                    obj.viewed_ad = data[1];
                    obj.clicked_ad = data[2];
                    if (data[0] in docs) docs[data[0]].push(obj);
                    else docs[data[0]] = [obj];
                } catch (e) {
                    reject(e);
                }
            }).on("end", function () {
                fs.writeFile(file, JSON.stringify(docs), function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("The ad file was saved!");
                });
                console.timeEnd("readAdFile");
                resolve(docs);
            });
        });
    }
};