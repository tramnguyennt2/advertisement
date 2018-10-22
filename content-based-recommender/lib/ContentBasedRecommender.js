const _ = require("underscore");
const Vector = require("vector-object");
const striptags = require("striptags");
const sw = require("stopword");
const natural = require("natural");
const vietnamese_stopwords = require("vietnamese-stopwords");
const {TfIdf} = natural;
const vntk = require("vntk");
const tokenizer = vntk.wordTokenizer();
const fs = require('fs');

const defaultOptions = {
    maxVectorSize: 100,
    maxSimilarDocuments: Number.MAX_SAFE_INTEGER,
    minScore: 0,
    debug: false
};

class ContentBasedRecommender {
    constructor(options = {}) {
        fs.readFile('tokens.json', 'utf8', (err, data) => {
            if (err) {
                return console.log(err);
            }
            this.tokens = JSON.stringify(data);
        });
        this.setOptions(options);
        this.data = {};
    }

    setOptions(options = {}) {
        // validation
        if (
            options.maxVectorSize !== undefined &&
            (!Number.isInteger(options.maxVectorSize) || options.maxVectorSize <= 0)
        ) {
            throw new Error(
                "The option maxVectorSize should be integer and greater than 0"
            );
        }

        if (
            options.maxSimilarDocuments !== undefined &&
            (!Number.isInteger(options.maxSimilarDocuments) ||
                options.maxSimilarDocuments <= 0)
        ) {
            throw new Error(
                "The option maxSimilarDocuments should be integer and greater than 0"
            );
        }

        if (
            options.minScore !== undefined &&
            (!_.isNumber(options.minScore) ||
                options.minScore < 0 ||
                options.minScore > 1)
        ) {
            throw new Error("The option minScore should be a number between 0 and 1");
        }

        this.options = Object.assign({}, defaultOptions, options);
    }

    trainOpt(documents, item_id) {
        this.validateDocuments(documents);

        if (this.options.debug) {
            console.log(`Total documents: ${documents.length}`);
        }

        // step 1 - preprocess the documents
        const preprocessDocs = this._preprocessDocuments(documents, this.options);

        // step 2 - create document vectors
        const docVectors = this._produceWordVectors(preprocessDocs, this.options);

        // step 3 - calculate similarities
        this.data = this._calculateSimilaritiesOpt(docVectors, item_id, this.options);
    }

    train(documents) {
        this.validateDocuments(documents);

        if (this.options.debug) {
            console.log(`Total documents: ${documents.length}`);
        }

        // step 1 - preprocess the documents
        const preprocessDocs = this._preprocessDocuments(documents, this.options);

        // step 2 - create document vectors
        const docVectors = this._produceWordVectors(preprocessDocs, this.options);

        // step 3 - calculate similarities
        this.data = this._calculateSimilarities(docVectors, this.options);
    }

    validateDocuments(documents) {
        if (!_.isArray(documents)) {
            throw new Error("Documents should be an array of objects");
        }

        for (let i = 0; i < documents.length; i += 1) {
            const document = documents[i];

            if (!_.has(document, "id") || !_.has(document, "content")) {
                throw new Error("Documents should be have fields id and content");
            }
        }
    }

    getSimilarDocuments(id, start = 0, size = undefined) {
        let similarDocuments = this.data[id];

        if (similarDocuments === undefined) {
            return [];
        }

        const end = size !== undefined ? start + size : undefined;
        similarDocuments = similarDocuments.slice(start, end);

        return similarDocuments;
    }

    export() {
        return {
            options: this.options,
            data: this.data
        };
    }

    import(object) {
        const {options, data} = object;

        this.setOptions(options);
        this.data = data;
    }

    // pseudo private methods

    _preprocessDocuments(documents, options) {
        if (options.debug) {
            console.log("Preprocessing documents");
        }

        const processedDocuments = documents.map(item => ({
            id: item.id,
            tokens: this.tokens[item.id] ? this.tokens[item.id] : this._getTokensFromString(item.id, item.content)
        }));

        return processedDocuments;
    }

    _getTokensFromString(number, string) {
        // remove html and to lower case
        const tmpString = striptags(string, [], " ").toLowerCase();
        // tokenize the string
        const tokens = tokenizer.tag(tmpString);
        // get unigrams
        const unigrams = sw.removeStopwords(tokens, vietnamese_stopwords);
        // // get bigrams
        // const bigrams = NGrams.bigrams(tokens)
        //     .filter(bigram =>
        //         // filter terms with stopword
        //         (bigram.length === sw.removeStopwords(bigram, vietnamese_stopwords).length))
        //     .map(bigram =>
        //         // stem the tokens
        //         bigram.map(token => PorterStemmer.stem(token)).join('_'));
        //
        // // get trigrams
        // const trigrams = NGrams.trigrams(tokens)
        //     .filter(trigram =>
        //         // filter terms with stopword
        //         (trigram.length === sw.removeStopwords(trigram, vietnamese_stopwords).length))
        //     .map(trigram =>
        //         // stem the tokens
        //         trigram.map(token => PorterStemmer.stem(token)).join('_'));
        //
        // return [].concat(unigrams, bigrams, trigrams);
        fs.appendFile('tokens.json', [].concat(unigrams), function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
        return [].concat(unigrams);
    }

    _produceWordVectors(processedDocuments, options) {
        // process tfidf
        const tfidf = new TfIdf();

        processedDocuments.forEach(processedDocument => {
            tfidf.addDocument(processedDocument.tokens);
        });

        // create word vector
        const documentVectors = [];

        for (let i = 0; i < processedDocuments.length; i += 1) {
            if (options.debug) {
                console.log(`Creating word vector for document ${i}`);
            }

            const processedDocument = processedDocuments[i];
            const hash = {};

            const items = tfidf.listTerms(i);
            const maxSize = Math.min(options.maxVectorSize, items.length);
            for (let j = 0; j < maxSize; j += 1) {
                const item = items[j];
                hash[item.term] = item.tfidf;
            }

            const documentVector = {
                id: processedDocument.id,
                vector: new Vector(hash)
            };

            documentVectors.push(documentVector);
        }
        return documentVectors;
    }

    _calculateSimilarities(documentVectors, options) {
        const data = {};

        // initialize data hash
        for (let i = 0; i < documentVectors.length; i += 1) {
            const documentVector = documentVectors[i];
            const {id} = documentVector;
            data[id] = [];
        }
        // calculate the similar scores
        for (let i = 0; i < documentVectors.length; i += 1) {
            if (options.debug) {
                console.log(`Calculating similarity score for document ${i}`);
            }
            const idi = documentVectors[i].id;
            const vi = documentVectors[i].vector;
            for (let j = 0; j < i; j += 1) {
                const idj = documentVectors[j].id;
                const vj = documentVectors[j].vector;
                var fs = require('fs');

                const similarity = vi.getCosineSimilarity(vj);

                if (similarity > options.minScore) {
                    data[idi].push({id: idj, score: similarity});
                    data[idj].push({id: idi, score: similarity});
                }
            }
        }
        // finally sort the similar documents by descending order
        Object.keys(data).forEach(id => {
            data[id].sort((a, b) => b.score - a.score);

            if (data[id].length > options.maxSimilarDocuments) {
                data[id] = data[id].slice(0, options.maxSimilarDocuments);
            }
        });
        return data;
    }

    _calculateSimilaritiesOpt(documentVectors, item_id, options) {
        const data = {};
        let index = 0;
        let idi;
        let vi;
        // initialize data hash
        for (let i = 0; i < documentVectors.length; i += 1) {
            if (documentVectors[i].id === item_id) {
                idi = documentVectors[i].id;
                vi = documentVectors[i].vector;
                index = i;
                data[idi] = [];
                break;
            }
        }
        documentVectors.splice(index, 1);

        // calculate the similar scores
        for (let j = 0; j < documentVectors.length; j += 1) {
            if (options.debug) {
                console.log(`Calculating similarity score for document ${j}`);
            }
            const idj = documentVectors[j].id;
            const vj = documentVectors[j].vector;
            const similarity = vi.getCosineSimilarity(vj);

            if (similarity > options.minScore) {
                data[idi].push({id: idj, score: similarity});
            }
        }
        // finally sort the similar documents by descending order
        Object.keys(data).forEach(id => {
            data[id].sort((a, b) => b.score - a.score);
            if (data[id].length > options.maxSimilarDocuments) {
                data[id] = data[id].slice(0, options.maxSimilarDocuments);
            }
        });
        return data;
    }
}

module.exports = ContentBasedRecommender;
