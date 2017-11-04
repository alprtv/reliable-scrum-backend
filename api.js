const axiosLib = new require('axios');
const config = require('./config/api');

var axios = axiosLib.create({
  baseURL: 'https://devspace.kanbantool.com/api/v1/',
  headers: {'X-KanbanToolToken': config.token}
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

module.exports.fetchBoards = fetchBoards;
module.exports.fetchBoard = fetchBoard;
module.exports.fetchTasks = fetchTasks;

