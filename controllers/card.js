const app = new (require('express').Router)();
const models = require('../models');
const HttpError = require('../error').HttpError;

app.get('/api/v1/cards', (req, res, next) => {

  models.Card.find()
   .exec().then((cards) => {
      res.json({
        error: false,
        payload: cards
      });
   }).catch(err => {
     console.log(err);
    return next(new HttpError());
   });

});

app.post('/api/v1/cards', (req, res, next) => {

  const body = req.body;
  const newCard = new models.Card(body);

  newCard.save().then((journal) => {
    res.json({
      error: false,
      payload: journal._id
    });
  }).catch(next);

});

module.exports = app;

