module.exports = function(req, res, next) {
  res.apiSendJson = function(success, payload, message) {
    const responseBody = {
      'success': success,
      'payload': payload,
      'message': message
    };
    res.json(responseBody);
  };
  next();
};

