// by requiring `babel/register`, all of our successive `require`s will be Babel'd
require('babel-register')({
    presets: ['es2015']
});
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./route'); // for homepage
const cors = require('cors');

app.use(express.static(__dirname + '/dist/'));
app.use(cors());
// Body Parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use('/', routes);

app.listen(3000, () => {
    console.log('Listening on port 3000');
});