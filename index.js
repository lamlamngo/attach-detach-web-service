const express = require('express');
const bodyParser = require('body-parser');
const exec = require('child_process').exec;
const winston = require('winston');

var alef_results;
var cloud_results;

var fs = require('fs');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
logger.add(new winston.transports.Console({
  format: winston.format.simple()
}));
}

const app = express();
app.use(express.static('public'))

const port = 9000;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

require('./app/routes')(app, exec, logger, {});


app.listen(port, () => {
  logger.info('We are live on ' + port);
})
