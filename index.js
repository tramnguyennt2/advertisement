// by requiring `babel/register`, all of our successive `require`s will be Babel'd
require('babel-register')({
    presets: ['es2015']
});
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const main_routes = require('./router/router'); // for homepage
const acs_evaluation_routes = require('./router/acs_evaluation_route');
const mls_evaluation_routes = require('./router/mls_evaluation_route');
const comparision_routes = require('./router/comparision');
const cors = require('cors');

app.use(express.static(__dirname + '/dist/'));
app.use(cors());
// Body Parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use('/', main_routes);
app.use('/acs-evaluation', acs_evaluation_routes);
app.use('/mls-evaluation', mls_evaluation_routes);
app.use('/compare', comparision_routes);

app.listen(3000, () => {
    console.log('Listening on port 3000');
});