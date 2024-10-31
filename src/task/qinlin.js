
const schedule = require('node-schedule');
const axios = require("axios")


const baseUrl = "https://mobileapi.qinlinkeji.com/"
let data = {
    sessionId: "wxmini:2c9a19588419ec830184221a11193386"
}
const refresh = (call) => {
    axios.post(baseUrl + "api/wxmini/v3/appuser/refresh?sessionId=" + data.sessionId, {}).then((res) => {
        let d = res.data;
        console.log("===========refresh  ", d);
        if (d) {
            data.sessionId = d.sessionId || data.sessionId
        }
        call && call(d);
    }).catch((res) => {

    })
}

// schedule.scheduleJob('0 0/20/40 * * * *', () => {
//     console.log("===============scheduleJob: " + new Date())

//     refresh();

// });
// refresh();

const door1 = "&doorControlId=190308&macAddress=23DABA008401&communityId=11308";
const door2 = "&doorControlId=80200&macAddress=FC19CC009725&communityId=11308";
const door3 = "&doorControlId=80186&macAddress=FC19CC014628&communityId=11308";
module.exports = {
    refresh,
    openDoor(call) {
        return axios.post(baseUrl + "api/open/doorcontrol/v2/open?sessionId=" + data.sessionId + "&doorControlId=190308&macAddress=23DABA008401&communityId=11308", { ...door1 });
    },
    
    openDoor2(call) {
        return axios.post(baseUrl + "api/open/doorcontrol/v2/open?sessionId=" + data.sessionId + "&doorControlId=190308&macAddress=23DABA008401&communityId=11308", { ...door1 });
    },
    
    openDoor3(call) {
        return axios.post(baseUrl + "api/open/doorcontrol/v2/open?sessionId=" + data.sessionId + "&doorControlId=190308&macAddress=23DABA008401&communityId=11308", { ...door1 });
    }
}