const app = new (require('express').Router)();
const HttpError = require('../error').HttpError;
const fetchBoards = require('../api').fetchBoards;
const fetchBoard = require('../api').fetchBoard;
const fetchTasks = require('../api').fetchTasks;
const fetchTask = require('../api').fetchTask;
const normalizeUndoneTask = require('../common').normalizeUndoneTask;
const normalizeDoneTask = require('../common').normalizeDoneTask;

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

  fetchBoard(boardId).then( rawData => {
    const data = rawData.data;
    if (!data) throw new ApiException('Error fetchBoard');
    let stages = [];

    for (stage of data.board.workflow_stages) {
      const id = stage.id;
      const parentId = stage.parent_id;
      let hasChilds = false;

      if (parentId) {
        let name = stage.name;

        for ( let parentStage of data.board.workflow_stages) {
          if (parentStage.parent_id === id) {
            hasChilds = true;
          }
          if (parentStage.parent_id && parentStage.id === parentId) {
            name = parentStage.name + ' / ' + name;
          }
        }

        if (!hasChilds) {
          stages.push ({
            id,
            name,
            parentId,
          });
        }
      }
    }

    return {
      id: data.board.id,
      name: data.board.name,
      description: data.board.description,
      createdAt: data.board.created_at,
      stages,
    };
  }).then((board) => {
    res.json({
      success: true,
      payload: board
    });
  }).catch((error) => {
    console.error('error', error);
    res.json({
      success: false,
      payload: error
    });
  });

});

app.get('/api/v1/kanbantools/boards/:boardId/tasks', (req, res, next) => {
  const boardId = 337859;
  //const boardId = req.params.id;
  const undoneStagesIds = [2558931, 2558933, 2558935, 2558937];
  const doneStagesIds = [2565921, 2565923, 2558949, 2558959];
  const startProject = '2017-08-13T01:53:30.000-07:00';
  const bugStageId = 2558925;
  const bugCardTypeId = 3958725;

  fetchTasks(boardId).then( rawData => {
    const data = rawData.data;
    if (!data) throw new ApiException('Error fetchBoard');

    let undoneTasks = [];
    let rawDoneTasks = [];

    for (task of data) {
      if (task.time_estimate >= 0 &&
          task.workflow_stage_id !== bugStageId &&
          task.card_type_id !== bugCardTypeId) {

        if (undoneStagesIds.includes(task.workflow_stage_id)) {
          undoneTasks.push(normalizeUndoneTask(task, startProject));
        }
        if (doneStagesIds.includes(task.workflow_stage_id)) {
          rawDoneTasks.push(task);
        }

      }
    }

    return { undoneTasks, rawDoneTasks };
  }).then( tasks => {

    let doneTasks = [];
    const fetchDoneTasks = tasks.rawDoneTasks.map( task => {
      return fetchTask(boardId, task.id);
    });

    Promise.all(fetchDoneTasks).then( results => {
      console.log(results);
    });

    res.json({
      success: true,
      payload: tasks
    });

  }).catch((error) => {
    res.json({
      success: false,
      payload: error
    });
  });

});

module.exports = app;

