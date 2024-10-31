const HttpUtil = require("../utils/HttpUtil");
const TaskUtil = require("../utils/TaskUtil");
const PyUtil = require("../utils/PyUtil");
const SendData = require("../func/SendData");
const qinlin = require("../task/qinlin");
const { v4: uuidv4 } = require('uuid');
const fxp = require("fast-xml-parser");
const fs = require("fs");
const schedule = require('node-schedule');
const { logJson } = require("../utils/LogUtil");
const { MSG_TYPE } = require("../config/Config");
const { coverImage, setTags } = require("../CoverImage");
const lodash = require("lodash");
let convert = require('xml-js');
const { config } = require("process");
const Holiday = require("../util/Holiday");
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
    console.log("heartbeat", json);
}

function handle_chatroom_members(json) {
    console.log("handle_chatroom_members", json);
}

function handle_cmd({ content, wxid }, ws) {
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

let context = {
    lastTime: 0,
    history_pic_list: [],
    schedule_list : [],
    scheduleChat:[
    //     {
    //     chatWs: null,
    //     chatId:"20450408714@chatroom",//xxq 20450408714@chatroom
    //     holiday:true,
    //     cron: "0 30 10 * * *",//10点半 am
    //     task: async(obj)=>{
    //         if(obj.holiday && Holiday.isOff())return;
    //         if(obj.chatWs==null)return;
    //         HttpUtil.chatgpt_api("午饭时间到了，请组织一段话催促同事们该点外卖了", obj.chatId, (result_txt) => {
    //             send(obj.chatWs, SendData.txt_msg(obj.chatId, result_txt));
    //         }, 4)
    //     }
    // },
    {
        chatWs: null,
        chatId:"20728039276@chatroom",//夸夸群
        holiday:true,
        cron: "0 0 18 * * *",//6点 pm
        task: async(obj)=>{
            if(obj.holiday && Holiday.isOff())return;
            if(obj.chatWs==null)return;
            HttpUtil.chatgpt_api("下班时间到了，请组织一段话催促朋友们该下班了", obj.chatId, (result_txt) => {
                send(obj.chatWs, SendData.txt_msg(obj.chatId, result_txt));
            }, 4)
        }
    },
    {
        chatWs: null,
        chatId:"20450408714@chatroom",//myq 21026544165@chatroom
        holiday:true,
        cron: "0 30 18 * * *",//6点半 pm
        task: async(obj)=>{
            if(obj.holiday && Holiday.isOff())return;
            if(obj.chatWs==null)return;
            HttpUtil.chatgpt_api("下班时间到了，请组织一段话催促同事们该下班了", obj.chatId, (result_txt) => {
                send(obj.chatWs, SendData.txt_msg(obj.chatId, result_txt));
            }, 4)
        }
    }
],
};
context.scheduleChat.forEach(value => {
    context.schedule_list.push(schedule.scheduleJob(value.cron, ()=>{value.task(value)}));
})
function markToSchedule(ws, wxid, content){
    console.debug(`#markToSchedule  wxid=${wxid}`)
    context.scheduleChat.filter((item)=>item.chatId==wxid).forEach(item=>{item.chatWs = ws})
}
function pushHistoryPic(json, wxid = "") {
    let key = "history_pic_list" + ":" + wxid;
    console.log("#pushHistoryPic  key=" + key)
    if (!context[key]) {
        context[key] = [];
    }
    context[key].push(json);
    if (context[key].length > 2) {
        context[key].shift();
    }
    console.log(context[key])
}
function getHistoryPic(wxid = "") {
    let key = "history_pic_list" + ":" + wxid;
    console.log("#getHistoryPic  key=" + key)
    let list = context[key] || [];
    let last = list.pop();
    context[key] = list;
    return last;
}

function send(ws, p, msg) {
    let time = new Date().getTime();
    if (time - context.lastTime < 500) {
        if (msg) {
            throw Error("操作频繁，请稍后再试")
        }
        return false;
    }
    context.lastTime = time;
    ws.send(p);
}

function handle_link_msg(json, ws) {
    logJson(json, "handle_link_msg " + json.desc);
    let { content, type } = json;
    const info = global.personalInfo;

    if (type === MSG_TYPE.RECV_LINK_MSG.type) {
        logJson("引用消息", "消息类型判断");
        const { id1, id2, content: conx } = content;
        let con = coverXml2Json(content)

        let txt_ = con?.msg?.appmsg?.title?._text;
        if (txt_ && txt_.indexOf("@摸鱼侠 ") != -1) {
            let txt = content.replace(new RegExp(/@[^ ]+ /, "g"), "").trim();
            if (txt.indexOf("加水印") != -1 || txt.indexOf("边框")) {
                let hours = now.getHours();
                if (hours >= 18) {
                    console.log("now == ", now)
                    send(ws, SendData.txt_msg(wxid, "18:00-24:00 暂停营业"));
                    return;
                } else {
                    // //取出历史数据
                    // let last = getHistoryPic();

                    // const { detail, id1, id2, thumb, content: conx } = last;
                    // if ((conx.indexOf("cdnmidimgurl") != -1 && detail && thumb)) {
                    //     //是图片
                    //     handle_pic(ws, content);
                    // }
                }

            }
        }

        // console.log("=====json", JSON.stringify(con, null, 4))


    }

}
function handle_recv_msg(json, ws) {
    logJson(json, "handle_recv_msg " + json.desc);
    let { content, type } = json;
    const info = global.personalInfo;
    const now = new Date();
    if (typeof content == "string") {
        let { content, wxid, id1, id2, id3 } = json;
        content = (content || "").trim();
        if ((wxid || "").startsWith("gh")) { //公众号消息
            logJson("公众号消息", "消息类型判断");
        } else if ((wxid || "").endsWith("@chatroom")) { //群消息
            logJson("群消息", "消息类型判断");
            let b1 = (id3 || "").indexOf("atuserlist") === -1;
            // if ((id3 || "").indexOf("atuserlist") === -1) {
            //     return;
            // }
            markToSchedule(ws, wxid, content);
            console.log("info = ", info)
            if (id2 === info.wx_id) {
                return;
            }
            const xml2json = fxp.parse(id3 || "");
            //只处理at我的

            //console.log("xml2json = ", xml2json)
            let uname = global.personalInfo.wx_name || "";
            //微信@触发  new RegExp(/@[^ ]+ /, "g")
            //关键字触发  new RegExp(/@?摸鱼侠\s/,'g');
            let keyword1 = new RegExp('@?'+uname+'\\s+\\S+','g');
            console.debug(`content=${content}    keyword1.test(content)=${keyword1.test(content)}`)
            console.debug(`(xml2json["msgsource"]["atuserlist"]=${xml2json["msgsource"]["atuserlist"]}   keyword1.test(content)=${keyword1.test(content)}`)
            if ((!b1 && xml2json["msgsource"]["atuserlist"]?.indexOf(info.wx_id) !== -1) || keyword1.test(content)) {
                logJson(id1 + " at我了", "群at")
                let txt = content.replace(new RegExp(/@[^ ]+ /, "g"), "").trim();
                txt = txt.replace(keyword1, "").trim();
                console.log("txt ", txt)
                TaskUtil.debounce2(TaskUtil.TXT_MSG, null, 3000, () => {
                    if (txt == "开门" || txt == "芝麻开门") {
                        console.log("开门")
                        qinlin.openDoor().then((res) => {
                            let d = res.data;
                            console.log("===============open: ", d)
                            if (d) {
                                console.log(d)
                                send(ws, SendData.txt_msg(wxid, JSON.stringify(d) + "\r\n【荔园新村8栋A单元门禁】已打开"));
                            }
                        }).catch(error => {
                            send(ws, SendData.txt_msg(wxid, "网络异常"));
                        })


                    } else if (txt.indexOf("加水印") != -1 || txt.indexOf("边框") != -1) {
                        let hours = now.getHours();
                        if (hours >= 18) {
                            console.log("now == ", now)
                            send(ws, SendData.txt_msg(wxid, "18:00之后暂停营业"));
                            return;
                        } else {
                            //取出历史数据
                            let last = getHistoryPic(wxid);
                            console.log("历史数据 has=" + !!last)
                            if (last) {
                                const { content: conx } = last;
                                //是图片
                                handle_pic(last.ws, conx);
                            }
                        }

                    } else if (txt == "打开西门") {
                        console.log("打开西门")

                    } else if (txt == "更新token") {
                        console.log("更新token")
                        qinlin.refresh(d => { send(ws, SendData.txt_msg(wxid, JSON.stringify(d))); });

                    } else if (txt == "@所有人") {
                        
                    } else {
                        console.log("打开else")
                        HttpUtil.chatgpt_api(txt, wxid, (result_txt) => {
                            send(ws, SendData.txt_msg(wxid, result_txt));
                        })
                    }
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
            TaskUtil.debounce2(TaskUtil.TXT_MSG, null, 1000, () => {
                console.log("执行代码==================")
                HttpUtil.chatgpt_api(content, wxid, (result_txt) => {
                    send(ws, SendData.txt_msg(wxid, result_txt));
                })
            });

        }
    } else if (type == MSG_TYPE.RECV_PIC_MSG.type && typeof content == "object") {
        logJson("图片消息", "消息类型判断");
        const { detail, id1, id2, thumb, content: conx } = content;
        if ((conx.indexOf("cdnmidimgurl") != -1 && detail && thumb)) {
            json.ws = ws;
            pushHistoryPic(json, id1);
            //是图片
            // handle_pic(ws, content);


        } else {

        }


    }

}




const replaceStr = (str = "", flag) => {
    return flag ? str.replace('\\n', "")
        .replace('\n', "")
        .replace('\\t', "")
        .replace('\t', "")
        .replace('\\"', "\"")
        .replace('\"', "") : str;
}

const toJson = (txt = "") => {
    xml = replaceStr(txt)
    // console.log(xml)
    let result1 = convert.xml2json(xml, { compact: true, spaces: 4 });
    // result1.msg.appmsg.refermsg
    let json = JSON.parse(result1)

    let ref = json?.msg?.appmsg?.refermsg;
    if (!ref) return json;
    console.log(ref);

    try {
        let msgsource = replaceStr(ref.msgsource._text)
        // console.log("msgsource =========== ", msgsource)
        let content = replaceStr(ref.content._text, false)
        // console.log("content =========== ", content)
        ref.msgsource = JSON.parse(convert.xml2json(msgsource, { compact: true, spaces: 4 }))
        ref.content = JSON.parse(convert.xml2json(content, { compact: true, spaces: 4 }))
        // console.log("@ref.msgsource =========== ", ref.msgsource)
        // console.log("@ref.content =========== ", ref.content)
    } catch (e) {
        console.error(e)
    }

    return json;
}

const coverXml2Json = (content2) => {
    // console.log(content2)
    let content = lodash.cloneDeep(content2)
    let content_2 = content["content"];
    console.log(content_2)
    if (content_2 && content_2.indexOf("<?xml") != -1) {
        let json = toJson(content_2);
        content["content"] = json;
        return content
    }
    console.warn("coverXml2Json失败")
}



const handle_pic = (ws, content) => {
    const { detail, id1, id2, thumb, content: conx } = content;
    TaskUtil.debounce2(TaskUtil.PIC_MSG, null, 5000, () => {
        console.log("执行代码==================")
        const exec = () => {
            //解码图片
            PyUtil.decodeImg({
                path: "" + detail,
            }, (file_path) => {
                console.log(`PyUtil.decodeImg file_path = ${file_path}`)
                const ex = fs.existsSync(file_path);
                console.log(`#######decodeImg#${file_path}#ex=` + ex);
                if (ex) {
                    let file = {
                        name: PyUtil.getName(file_path),
                        path: file_path,
                        tags: {},
                        make: id2,
                    }
                    setTags([file], () => {
                        coverImage(file, (path) => {
                            console.log("准备发送图片 path" + path)
                            send(ws, SendData.pic_msg(id1, path))
                        })
                    })
                }
            });
        }

        let timer = null;
        let path = PyUtil.getOutPath(PyUtil.getName(detail)) || ""
        let ref = {
            i: 3,
        }
        console.log("预计地址 path=" + path)
        setTimeout(() => {
            exec();
        }, 1000)
        // exec();
        // timer = setInterval(() => {
        //     if (ref.i <= 0) {
        //         ref.i = 0;
        //         clearInterval(timer);
        //         return;
        //     }
        //     if (fs.existsSync(path.replace(".dat", ".jpg"))) {
        //         exec();
        //     } else if (fs.existsSync(path.replace(".dat", ".png"))) {
        //         exec();
        //     }

        //     ref.i = ref.i - 1;
        // }, 1000);

    });
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
        case "4":
        case 4:
            console.log("==========电脑消息")
            handle_recv_msg(json, ws);
            break;
        case MSG_TYPE.RECV_TXT_MSG:
            handle_recv_msg(json, ws);
            break;
        case MSG_TYPE.RECV_LINK_MSG:
            logJson(json, "ReceiveHandler " + type.desc);
            handle_link_msg(json, ws);
            //ws.send(SendData.txt_msg(json.content.id1, "我不看我不看[抓狂]"))
            break;
        case MSG_TYPE.HEART_BEAT:
            // heartbeat(json);
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