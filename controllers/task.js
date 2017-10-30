const app = new (require('express').Router)();
const models = require('../models');
const HttpError = require('../error').HttpError;

app.get('/api/v1/tasks', (req, res, next) => {

  models.Task.find()
   .exec().then((tasks) => {
      res.json({
        error: false,
        payload: tasks
      });
   }).catch(err => {
     console.log(err);
    return next(new HttpError());
   });

});

app.post('/api/v1/tasks', (req, res, next) => {

  const body = req.body;
  const newTask = new models.Task(body);

  newTask.save().then((task) => {
    res.json({
      error: false,
      payload: task._id
    });
  }).catch(next);

});

module.exports = app;

