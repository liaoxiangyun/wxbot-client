//==============================
const TXT_MSG = "TXT_MSG"
const PIC_MSG = "PIC_MSG"

const taskMap = {}


function execTask(key, wxid) {
    let kk = "timer_" + key + "_" + wxid;
    var t = taskMap[key] || null;
    t && t();
}
function debounce2(key, wxid, delay = 500, task) {
    let kk = "timer_" + key + "_" + wxid;
    let timer = taskMap[kk] || null;
    taskMap[kk] = task;
    if (timer == null) {
        task();
        setTimeout(() => {
            execTask(key, wxid);
            taskMap[kk] = null;
        }, delay);
    } else {
        console.debug("=================================== 频率过高，不执行")
    }

}


module.exports = {
    debounce2,
    TXT_MSG,
    PIC_MSG
}