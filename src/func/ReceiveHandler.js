const HttpUtil = require("../utils/HttpUtil");
const TaskUtil = require("../utils/TaskUtil");
const SendData = require("../func/SendData");
const {v4: uuidv4} = require('uuid');
const fxp = require("fast-xml-parser");
const {logJson} = require("../utils/LogUtil");
const {MSG_TYPE} = require("../config/Config");

function getType(json) {
    const type = json.type;
    for (let key in MSG_TYPE) {
        let typeObj = MSG_TYPE[key];
        if (typeObj && typeObj.type === type) {
            //logJson(json, "" + typeObj.desc);
            json.desc = typeObj.desc;
            return typeObj;
        }
    }
    console.warn("======== 未知的消息TYPE = " + type);
    logJson(json, "getType(json)");
    return type;
}

function heartbeat(json) {

}

function handle_chatroom_members(json) {

}

function handle_cmd({content, wxid}, ws) {
    let split = content.split(/\s+/) || [];
    if (split[1].trim() === "绑定") {
        let uid_uuid = uuidv4().replace(/-/g, '');
        let uid = global.userMap[wxid];
        if (!uid) {
            global.userMapPush(wxid, uid_uuid);
            ws.send(SendData.txt_msg(wxid, "绑定成功！ uid = " + uid_uuid));
        } else {
            ws.send(SendData.txt_msg(wxid, "已经绑定过了！ uid = " + uid_uuid));
        }
    }
}

function handle_recv_msg(json, ws) {
    logJson(json, "handle_recv_msg " + json.desc);
    let {content, type} = json;
    const info = global.personalInfo;
    if (typeof content == "string") {
        let {content, wxid, id1, id2, id3} = json;
        content = (content || "").trim();
        if ((wxid || "").startsWith("gh")) { //公众号消息
            logJson("公众号消息", "消息类型判断");
        } else if ((wxid || "").endsWith("@chatroom")) { //群消息
            logJson("群消息", "消息类型判断");
            if ((id3 || "").indexOf("atuserlist") === -1) {
                return;
            }
            if (id2 === info.wx_id) {
                return;
            }
            const xml2json = fxp.parse(id3 || "");
            //只处理at我的
            if (xml2json["msgsource"]["atuserlist"].indexOf(info.wx_id) !== -1) {
                logJson(id1 + " at我了", "群at")
                let txt = content.replace(new RegExp(/@[^ ]+ /, "g"), "");
                HttpUtil.qingyunke_api(txt, (result_txt) => {
                    ws.send(SendData.txt_msg(wxid, result_txt));
                })
            }
        } else if (content.startsWith("[#CMD]")) { //指令消息
            logJson("指令消息", "消息类型判断");
            if (id2 === info.wx_id) {
                return;
            }
            handle_cmd(json, ws);

        } else {
            logJson("普通消息", "消息类型判断");
            if (id2 === info.wx_id) {
                return;
            }
            TaskUtil.todoAdd(TaskUtil.TXT_MSG, wxid, content, 1000, (todos = []) => {
                logJson(todos, TaskUtil.TXT_MSG + " todoAdd task")
                if (todos.length === 1) {
                    HttpUtil.qingyunke_api(content, (result_txt) => {
                        ws.send(SendData.txt_msg(wxid, result_txt));
                    })
                } else if (todos.length > 1) {
                    ws.send(SendData.txt_msg(wxid, "一次发那么多消息干嘛[晕]"));
                }
            });
        }
    } else if (typeof content == "object") {
        logJson("图片消息", "消息类型判断");

    }

}

function handle_wxuser_list(json) {

}

const ReceiveHandler = (json = {}, ws) => {
    let type = getType(json);
    switch (type) {
        case MSG_TYPE.CHATROOM_MEMBER_NICK:
            logJson(json, "ReceiveHandler " + type.desc);
            //handle_nick(json);
            break;
        case MSG_TYPE.PERSONAL_DETAIL:
            logJson(json, "ReceiveHandler " + type.desc);
            break;
        case MSG_TYPE.AT_MSG:
            logJson(json, "ReceiveHandler " + type.desc);
            break;
        case MSG_TYPE.DEBUG_SWITCH:
            logJson(json, "ReceiveHandler " + type.desc);
            break;
        case MSG_TYPE.PERSONAL_INFO:
            //logJson(json, "ReceiveHandler " + type.desc);
            //handle_personal_info(json);
            MSG_TYPE.PERSONAL_INFO.event && MSG_TYPE.PERSONAL_INFO.event(json);
            break;
        case MSG_TYPE.TXT_MSG:
            logJson(json, "ReceiveHandler " + type.desc);
            break;
        case MSG_TYPE.PIC_MSG:
            logJson(json, "ReceiveHandler " + type.desc);
            break;
        case MSG_TYPE.CHATROOM_MEMBERS:
            //log(json);
            handle_chatroom_members(json);
            break;
        case MSG_TYPE.RECV_PIC_MSG:
            handle_recv_msg(json, ws);
            break;
        case MSG_TYPE.RECV_TXT_MSG:
            handle_recv_msg(json, ws);
            break;
        case MSG_TYPE.RECV_LINK_MSG:
            logJson(json, "ReceiveHandler " + type.desc);
            //ws.send(SendData.txt_msg(json.content.id1, "我不看我不看[抓狂]"))
            break;
        case MSG_TYPE.HEART_BEAT:
            heartbeat(json);
            break;
        case MSG_TYPE.USER_LIST:
            logJson(json, "ReceiveHandler " + type.desc);
            //handle_wxuser_list(json);
            break;
        case MSG_TYPE.GET_USER_LIST_SUCCESS:
            handle_wxuser_list(json);
            break;
        case MSG_TYPE.GET_USER_LIST_FAIL:
            handle_wxuser_list(json);
            break;
        case MSG_TYPE.NEW_FRIEND_REQUEST:
            //log("---------------37----------");
            logJson(json, "ReceiveHandler " + type.desc);
            break;
        case MSG_TYPE.AGREE_TO_FRIEND_REQUEST:
            logJson(json, "ReceiveHandler " + type.desc);
            break;
        //case MSG_TYPE.SEND_TXT_MSG_SUCCSESS:
        //handle_recv_msg(json);
        //break;
        //case MSG_TYPE.SEND_TXT_MSG_FAIL:
        //handle_recv_msg(json);
        //break;
        default:
            logJson("json.type = " + json.type);
            break;
    }
}

module.exports = ReceiveHandler;