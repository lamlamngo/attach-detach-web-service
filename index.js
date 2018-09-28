const express = require('express');
const bodyParser = require('body-parser');
const exec = require('child_process').exec;

var alef_results;
var cloud_results;

var fs = require('fs');

const app = express();
app.use(express.static('public'))

const port = 8080;
var ip='0.0.0.0';

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

require('./app/routes')(app, exec, {});


app.listen(port,ip, () => {
  console.log('We are live on ' + port);
})
