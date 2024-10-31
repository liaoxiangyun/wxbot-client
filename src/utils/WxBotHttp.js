/****************************************
 * 重要：3.2.1.121，http的客户端已经改变调用方式
 * send_txt
 * send_pic
 * ***************************************/

const rp = require('request-promise');
const url = 'http://127.0.0.1:5555';
const HEART_BEAT = 5005;
const RECV_TXT_MSG = 1;
const RECV_PIC_MSG = 3;
const USER_LIST = 5000;
const GET_USER_LIST_SUCCSESS = 5001;
const GET_USER_LIST_FAIL = 5002;
const TXT_MSG = 555;
const PIC_MSG = 500;
const AT_MSG = 550;
const CHATROOM_MEMBER = 5010;
const CHATROOM_MEMBER_NICK = 5020;
const PERSONAL_INFO = 6500;
const DEBUG_SWITCH = 6000;
const PERSONAL_DETAIL = 6550;
const ATTATCH_FILE = 5003;


function getid() {
    const id = Date.now();
    return id.toString();
}

/**
 * send txt message
 */
async function send_txt(wxid = "", content = "") {

    const options =
        {
            method: 'POST',
            url: url + '/api/send_txt',
            body: {
                wxid: wxid,//接收消息的wxid
                content: content
            },
            json: true
        };
    let data = await rp(options);
    return data;
}

async function send_pic() {

    const options =
        {
            method: 'POST',
            url: url + '/api/send_pic',
            body: {
                wxid: 'wx id',//接收消息的wxid
                "content": "C:\\temp\\ocr\\3.jpg"
            },
            json: true
        };
    let data = await rp(options);
    return data;
}


/// 和http://127.0.0.1:5555/api/get_chatroom_v1搭配使用
/*
idx通过调用http://127.0.0.1:5555/api/get_chatroom_v1获得
*/
async function get_member() {

    const options =
        {
            method: 'POST',
            url: url + '/api/get_member',
            body: {
                "idx": 2844416549408  //idx通过调用http://127.0.0.1:5555/api/get_chatroom_v1获得
            },
            json: true
        };
    let data = await rp(options);
    return data;
}

async function get_nick() {

    const options =
        {
            method: 'POST',
            url: url + '/api/get_nick',
            body: {
                wxid: 'wx id',//需要获取昵称的的wxid
                "roomid": "room id"//你的微信群id,类似:xxxxx@chatroom
            },
            json: true
        };
    let data = await rp(options);
    return data;
}


module.exports = {
    send_txt: send_txt,
    send_pic: send_pic,
};