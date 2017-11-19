const app = new (require('express').Router)();
const HttpError = require('../error').HttpError;
const fetchBoards = require('../api').fetchBoards;
const fetchBoard = require('../api').fetchBoard;
const fetchTasks = require('../api').fetchTasks;
const fetchTask = require('../api').fetchTask;
const normalizeUndoneTask = require('../common').normalizeUndoneTask;
const normalizeDoneTask = require('../common').normalizeDoneTask;
const Promise = require('bluebird');

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
  let startProject = '2017-08-13T01:53:30.000-07:00';
  const bugStageId = 2558925;
  const bugCardTypeId = 3958725;

  fetchTasks(boardId).then( rawData => {

    const actualTasks = rawData.data;
    if (!actualTasks) throw new ApiException('Error fetchBoard actualTasks');
    return actualTasks;

  }).then(actualTasks => {

    const archived = 1;
    return fetchTasks(boardId, archived).then( rawData => {
      const archivedTasks = rawData.data;
      if (!archivedTasks) throw new ApiException('Error fetchBoard archivedTasks');

      return [...actualTasks, ...archivedTasks];
    });

  }).then(rawTasks => {

    const firstTask = findFirstTask(rawTasks);
    startProject = firstTask.created_at;
    return rawTasks;

  }).then(rawTasks => {

    let undoneTasks = [];
    let doneTasksIds = [];

    for (task of rawTasks) {
      if ( task.card_type_id !== bugCardTypeId && task.time_estimate) {
        if (undoneStagesIds.includes(task.workflow_stage_id)) {
          undoneTasks.push(normalizeUndoneTask(task, startProject));
        } else {
          if (doneStagesIds.includes(task.workflow_stage_id)) {
            doneTasksIds.push(task.id);
          }
        }
      }
    }
    return { undoneTasks, doneTasksIds };

  }).then(data => {

    let current = Promise.resolve();
    const fetchDoneTasks = data.doneTasksIds.map(taskId => {
      current = current.then(() => fetchTask(boardId, taskId)).then(result => result.data);
      return current;
    });
    return Promise.all(fetchDoneTasks).then(rawDoneTasks => {
      const doneTasks = rawDoneTasks.map(taskData => {
        return normalizeDoneTask(taskData.task, startProject, doneStagesIds);
      })
      return { undoneTasks: data.undoneTasks, doneTasks};
    });

  }).then( data => {

    console.log('data.undoneTasks.length', data.undoneTasks.length);
    console.log('data.doneTasks.length', data.doneTasks.length);

    res.json({
      success: true,
      payload: data.doneTasks
    });

  }).catch((error) => {
    console.error(error);
    res.json({
      success: false,
      payload: error
    });
  });

});

module.exports = app;

function findFirstTask(tasks) {
  let minDate = Date.now();
  let indexFirstTask = 0;

  for (let i = 0; i < tasks.length; i++) {
    const taskDate = Date.parse(tasks[i].created_at);
    if ( taskDate < minDate) {
      minDate = taskDate;
      indexFirstTask = i;
    }
  }

  return tasks[indexFirstTask];
}

