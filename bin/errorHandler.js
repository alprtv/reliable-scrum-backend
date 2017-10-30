const Logger = require('../logger');
const logger = new Logger();
const HttpError = require('../error').HttpError;

module.exports = function (err, req, res, next) {

  if (err instanceof HttpError) {
    logger.error('HttpError', err);
    res.sendHttpError(err);
  } else  {
    logger.error('Error is unknown type ', err);
    err = new HttpError(500);
    res.sendHttpError(err);
  }
};

