const Promise = require('bluebird');
const fetchTasks = require('./api').fetchTasks;
const fetchTask = require('./api').fetchTask;
const fetchArchivedTasks = require('./api').fetchArchivedTasks;
const normalizeUndoneTask = require('./common').normalizeUndoneTask;
const normalizeDoneTask = require('./common').normalizeDoneTask;

exports.handler = (event, context, callback) => {

  let startProject = '2017-08-13T01:53:30.000-07:00';
  const boardId = 337859;
  const undoneStagesIds = [2558931, 2558933, 2558935, 2558937];
  const doneStagesIds = [2565921, 2565923, 2558949, 2558959];
  const bugStageId = 2558925;
  const bugCardTypeId = 3958725;
  const lemonCardTypeId = 3958731;
  const unestimatedCardTypeId = 3958727;
  const ignoreCardTypeIds = [bugCardTypeId, lemonCardTypeId, unestimatedCardTypeId];

  fetchTasks(boardId).then( rawData => {

    const actualTasks = rawData.data;
    if (!actualTasks) throw new ApiException('Error fetchBoard actualTasks');
    return actualTasks;

  }).then(actualTasks => {

    const totalPages = 2;
    const kanbantoolMaxResultsPerPage = 175;
    let archivedTasksPromises = [];
    let archivedTasks = [];
    let current = Promise.resolve();

    for (let page = 1; page <= totalPages; page++) {
      archivedTasksPromises.push(current.then(() => fetchArchivedTasks(boardId, page, kanbantoolMaxResultsPerPage)).then(result => result.data));
    }

    return Promise.all(archivedTasksPromises).then(archivedTasksData => {
      for (let page = 0; page < totalPages; page++) {
        archivedTasks.push(...archivedTasksData[page]);
      }
      return [...actualTasks, ...archivedTasks];
    });
  }).then(rawTasks => {

    const firstTask = findFirstTask(rawTasks);
    startProject = firstTask.created_at;
    return rawTasks;

  }).then(rawTasks => {

    let undoneTasks = [];
    let doneTasksIds = [];

    for (let task of rawTasks) {
      if ( !ignoreCardTypeIds.includes(task.card_type_id) && task.time_estimate) {
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
    // console.log({
    //   success: true,
    //   payload: [...data.doneTasks, ...data.undoneTasks]
    // });

  }).catch((error) => {
    console.error({
      success: false,
      payload: error
    });
  });

  callback(null, 'Hello from Lambda');
};

function ApiException(message) {
   this.message = message;
}

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

