/**
 * Third party dependencies
 */
const express = require('express');
const bodyParser = require('body-parser');

/**
 * Logger set up
 */
var logger = require('./app/utils/log');

/**
 * express set up
 */

const app = express();
app.use(express.static('public'))
const port = 9000;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

require('./app/routes')(app, {});

app.listen(port, () => {
  logger.info('We are live on ' + port);
})

