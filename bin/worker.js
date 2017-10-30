require('./dbinit');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const Logger = new require('../logger');
const logger = new Logger();
const config = require('../config');
let app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var corsOptions = {
  origin: true,
  methods: ['GET', 'POST'],
  credentials: true,
  maxAge: 3600
}
app.use(cors(corsOptions));

app.use(require('./../middleware/sendHttpError'));
app.use(require('./../middleware/apiSendJson'));
app.use(require('./../controllers'));
app.use(require('./errorHandler'));

app.listen(config.port ,err => {
  if(err) throw err;
  else logger.info(`Running server at port ${config.port}!`)
});

