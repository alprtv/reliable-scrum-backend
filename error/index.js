const path = require('path');
const http = require('http');

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.message = message || http.STATUS_CODES[status] || 'Error';
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}

exports.HttpError = HttpError;

