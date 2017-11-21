const axiosLib = new require('axios');
//const config = require('./config/api');

var axios = axiosLib.create({
  baseURL: 'https://devspace.kanbantool.com/api/v1/',
  headers: {'X-KanbanToolToken': process.env.token},
  timeout: 10000000,
});

const fetchBoards = function () {
  return axios.get(`boards.json`)
  .then(function (res) {
    return res;
  })
  .catch(function (err) {
    return err;
  });
}

const fetchBoard = function (id) {
  return axios.get(`boards/${id}.json`)
  .then(function (res) {
    return res;
  })
  .catch(function (err) {
    return err;
  });
}

const fetchTasks = function (id) {
  return axios.get(`boards/${id}/tasks.json`)
  .then(function (res) {
    return res;
  })
  .catch(function (err) {
    return err;
  });
}

const fetchArchivedTasks = function (id, page, perPage) {
  return axios.get(`boards/${id}/tasks.json`, {
    params: {
      archived: 1,
      page: page,
      per_page: perPage,
    }
  })
  .then(function (res) {
    return res;
  })
  .catch(function (err) {
    return err;
  });
}


const fetchTask = function (boardId, taskId) {
  return axios.get(`boards/${boardId}/tasks/${taskId}.json`)
  .then(function (res) {
    return res;
  })
  .catch(function (err) {
    return err;
  });
}

module.exports.fetchBoards = fetchBoards;
module.exports.fetchBoard = fetchBoard;
module.exports.fetchTasks = fetchTasks;
module.exports.fetchArchivedTasks = fetchArchivedTasks;
module.exports.fetchTask = fetchTask;

