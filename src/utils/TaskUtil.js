//==============================
const TXT_MSG = "TXT_MSG"
const PIC_MSG = "PIC_MSG"

const taskMap = {}

function todoAdd(key, wxid, value, delay = 500, task) {
    let oldValue = taskMap["todo_" + key + "_" + wxid] || [];
    oldValue.push(value);
    taskMap["todo_" + key + "_" + wxid] = oldValue;

    let todoTask = taskMap["todoTask_" + key + "_" + wxid];
    const callback = () => {
        let todo = todoGet(key, wxid) || [];
        task && task(todo);
        todoRemove(key, wxid);
    }
    if (todoTask == null) {
        taskMap["todoTask_" + key + "_" + wxid] = setTimeout(callback, delay);
    } else {
        try {
            clearTimeout(todoTask);
        } catch (e) {
        }
        taskMap["todoTask_" + key + "_" + wxid] = setTimeout(callback, delay);
    }
}

function todoGet(key, wxid) {
    let oldValue = taskMap["todo_" + key + "_" + wxid] || [];
    return oldValue;
}

function todoRemove(key, wxid) {
    try {
        clearTimeout(taskMap["todoTask_" + key + "_" + wxid]);
    } catch (e) {
    }
    taskMap["todo_" + key + "_" + wxid] = []
}

module.exports = {
    todoAdd,
    TXT_MSG,
    PIC_MSG
}