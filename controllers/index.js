const app = new (require('express').Router)();

app.use(require('./board'));

// for nonexistent route
app.use(function(req, res, next){
  res.status(404);
  res.json({api: 'v1'});
});

module.exports = app;

