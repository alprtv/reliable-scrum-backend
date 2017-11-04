const app = new (require('express').Router)();
const HttpError = require('../error').HttpError;
const fetchBoards = require('../api').fetchBoards;
const fetchBoard = require('../api').fetchBoard;
const fetchTasks = require('../api').fetchTasks;

function ApiException(message) {
   this.message = message;
}

app.get('/api/v1/kanbantools/boards', (req, res, next) => {

  fetchBoards().then( kbdata => {
    const data = kbdata.data;
    if (!data) throw new ApiException('Error fetchBoards');

    return data.map( item => {
      return {
        id: item.board.id,
        name: item.board.name,
        description: item.board.description,
        createdAt: item.board.created_at,
      };
    });
  }).then((boards) => {
    res.json({
      success: true,
      payload: boards
    });
  }).catch((error) => {
    res.json({
      success: false,
      payload: error
    });
  });

});

app.get('/api/v1/kanbantools/boards/:id', (req, res, next) => {
  const boardId = 337859;
  //const boardId = req.params.id;

  fetchBoard(boardId).then( kbdata => {
    const data = kbdata.data;
    if (!data) throw new ApiException('Error fetchBoard');
    return {
      id: data.board.id,
      name: data.board.name,
      description: data.board.description,
      createdAt: data.board.created_at,
    };
  }).then((board) => {
    res.json({
      success: true,
      payload: board
    });
  }).catch((error) => {
    res.json({
      success: false,
      payload: error
    });
  });

});

app.get('/api/v1/kanbantools/boards/:boardId/tasks', (req, res, next) => {
  const boardId = 337859;
  //const boardId = req.params.id;

  fetchTasks(boardId).then( kbdata => {
    const data = kbdata.data;
    if (!data) throw new ApiException('Error fetchBoard');
    return data;
  }).then((board) => {
    res.json({
      success: true,
      payload: board
    });
  }).catch((error) => {
    res.json({
      success: false,
      payload: error
    });
  });

});

module.exports = app;
