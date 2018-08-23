const express = require('express')
const app = express()
const path = require('path');
const log = require('color-logs')(true, true, __filename);

const config = require('./config/config');

const SwaggerParser = require('swagger-parser');
const SwaggerExpress = require('swagger-express-mw');
const SwaggerUi = require('swagger-tools/middleware/swagger-ui');



app.use(express.static(path.join(__dirname, 'public')));

app.get('/css/app.css', function (req, res) {
    res.sendFile(path.join(__dirname + '/css/app.css'));
});

app.get('/js/script.js', function (req, res) {
    res.sendFile(path.join(__dirname + '/js/script.js'));
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});



app.listen(3000, () => console.log('Example app listening on port 3000!'))