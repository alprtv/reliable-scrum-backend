
const normalizeUndoneTask = function (task, startProject) {
  const createdAt = new Date(task.created_at);
  const updatedAt = new Date(task.updated_at);
  const dateStartProject = new Date(startProject);

  return {
    id: task.id,
    stageId: task.workflow_stage_id,
    swimlaneId: task.swimlane_id,
    name: task.name,
    description: task.description,
    createdAt,
    updatedAt,
    value: msecToHours(task.time_estimate),
    sprintAdd: calcSprintNumByDate(dateStartProject, createdAt),
    sprintDone: null,
  }
}

const normalizeDoneTask = function (task, startProject, doneStagesIds) {
  const createdAt = new Date(task.created_at);
  const updatedAt = new Date(task.updated_at);
  const dateStartProject = new Date(startProject);
  const sprintAdd = calcSprintNumByDate(dateStartProject, createdAt);
  const actionMoved = 'moved';
  const changelogs = task.changelogs;
  let sprintDone = sprintAdd;

  if (changelogs) {
    const movedTask = changelogs.find( oldTask => {
      return oldTask.what === actionMoved && doneStagesIds.includes(oldTask.workflow_stage_id);
    });
    if (movedTask) {
      sprintDone = calcSprintNumByDate(dateStartProject, new Date(movedTask.created_at));
    }
  }

  return {
    id: task.id,
    stageId: task.workflow_stage_id,
    swimlaneId: task.swimlane_id,
    name: task.name,
    description: task.description,
    createdAt,
    updatedAt,
    value: msecToHours(task.time_estimate),
    sprintAdd,
    sprintDone,
  }
}

function msecToHours (value) {
  return Math.round(value / 3600);
}

function calcSprintNumByDate(start, createdAt) {
  const diffInDays = dateDiffInDays(start, createdAt);
  const sprintLength = 7;

  return Math.floor(diffInDays / sprintLength);
}

function dateDiffInDays(a, b) {
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((utc2 - utc1) / 86400000);
}

module.exports.normalizeUndoneTask = normalizeUndoneTask;
module.exports.normalizeDoneTask = normalizeDoneTask;

