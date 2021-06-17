//#weixin version 3.2.1.121
const WebSocket = require('ws');
const SendData = require('./func/SendData');
const {logJson} = require('./utils/LogUtil');
const {MSG_TYPE} = require('./config/Config');
const ReceiveHandler = require('./func/ReceiveHandler');

const ws = new WebSocket(`ws://192.168.50.12:5555`);//被注入DLL的微信所在机器IP

ws.on('open', function open() {
    logJson("=======", "open")
    ws.send(SendData.personal_info(), function () {
        MSG_TYPE.PERSONAL_INFO.event = function (json = {}) {
            logJson(json, "=========== open cb")
            try {
                let json_info = JSON.parse(json.content);
                const {wx_code, wx_id, wx_name} = json_info;
                if (wx_code && wx_id && wx_name) {
                    global.personalInfo = json_info;
                }
                logJson(global.personalInfo, "personalInfo");
            } catch (e) {
                console.error(e);
            }
            MSG_TYPE.PERSONAL_INFO.event = null;
        }
    })
})
ws.on('close', function close() {
    console.log('disconnected');
});

ws.on('message', function incoming(data) {
    let json = data;
    try {
        if (json && typeof json == "string") {
            json = JSON.parse(json);
        }
        if (!json) {
            logJson(data, "on message > error")
            return;
        }
        ReceiveHandler(json, ws);
    } catch (e) {
        console.error(e);
        console.error(data);
    }
})

module.exports = {
    ws,
    sendMsg(wxid, content) {
        ws.send(SendData.txt_msg(wxid, content))
    }
};