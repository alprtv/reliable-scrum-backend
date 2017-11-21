//require('./dbinit');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const Logger = new require('../logger');
const logger = new Logger();
const config = require('../config');
const corsOptions = {
  origin: '*',
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE'
}

let app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsOptions));

app.use(require('./../middleware/sendHttpError'));
app.use(require('./../middleware/apiSendJson'));
app.use(require('./../controllers'));
app.use(require('./errorHandler'));

var port = process.env.PORT || 8080;

app.listen(port ,err => {
  if(err) throw err;
  else logger.info(`Running server at port ${config.port}!`)
});

