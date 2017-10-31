const app = new (require('express').Router)();
const models = require('../models');
const HttpError = require('../error').HttpError;

app.get('/api/v1/boards', (req, res, next) => {

  models.Board.find()
   .exec().then((boards) => {
      res.json({
        error: false,
        payload: boards
      });
   }).catch(err => {
    return next(new HttpError());
   });

});

// app.post('/api/v1/boards', (req, res, next) => {
//
//   const body = req.body;
//   const newTask = new models.Task(body);
//
//   newTask.save().then((task) => {
//     res.json({
//       error: false,
//       payload: task._id
//     });
//   }).catch(next);
//
// });

module.exports = app;

