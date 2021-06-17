const {
    MSG_TYPE,
} = require("../config/Config");
const {logJson} = require("../utils/LogUtil");


function getId() {
    return Date.now().toString();
}

function create(obj = {}) {
    if (typeof obj != "object") {
        console.error(`${obj} is not object`)
        return;
    }
    if (!obj.type || obj.type === "null") {
        console.error(`type is not null`)
        return;
    }
    if (typeof obj.type == "object" && obj.type.type) {
        obj.type = obj.type.type;
    }
    for (let key in obj) {
        let v = obj[key];
        if (!v || v === "null") {
            console.error(`${key} is not null`)
            return;
        }
    }
    let data = {
        id: getId(),
        type: "null",
        wxid: "null",
        roomid: "null",
        content: 'null',
        nickname: "null",
        ext: 'null',
        ...obj
    }
    let res = JSON.stringify(data);
    logJson(res, "SendData")
    return res;
}

/**
 * 发送json， wxid 包括个人和群id
 * 群id 21045788160@chatroom
 */
const SendData = {
    /**
     * 图片
     * @param wxid 23023281066@chatroom
     * @param file_path 'C:\\tmp\\2.jpg'
     */
    pic_msg(wxid, file_path) {
        return create({
            type: MSG_TYPE.PIC_MSG,
            wxid: wxid,
            content: file_path,
        })
    },
    /**
     * 文本
     * @param wxid
     * @param content
     * @returns {string}
     */
    txt_msg(wxid = "", content = "") {
        return create({
            type: MSG_TYPE.TXT_MSG,
            wxid: wxid,
            content: content,
        })
    },

    //----------------------------- 群

    /**
     * 发送群AT消息
     * @param roomid 群id
     * @param wxid 你的wxid
     * @param nickname 群昵称（你要at的人）
     * @param content 内容，不能为空
     */
    at_msg(roomid = "", wxid = "", nickname = "", content = "") {
        return create({
            type: MSG_TYPE.AT_MSG,
            roomid: '23023281066@chatroom',//not null  23023281066@chatroom
            wxid: 'your wxid',//not null
            content: 'at msg test,hello world，真的有一套',//not null
            nickname: '老张',
        })
    },


    //----------------------------- 其他
    /**
     * debugview调试信息开关，默认为关
     */
    debug_switch() {
        return create({
            type: MSG_TYPE.DEBUG_SWITCH,
        })
    },

}

const GetData = {
    /**
     * 获取自己的信息
     */
    personal_info() {
        return create({
            type: MSG_TYPE.PERSONAL_INFO,
        })
    },
    /**
     * 通过wxid获取好友详细信息
     */
    personal_detail(wxid) {
        return create({
            type: MSG_TYPE.PERSONAL_DETAIL,
            wxid: wxid,
            content: 'op:personal detail',
        })
    },
    /**
     * 获取聊天室成员列表
     */
    chatroom_members() {
        return create({
            type: MSG_TYPE.CHATROOM_MEMBERS,
        })
    },
    /**
     * 获取聊天室成员的昵称
     * @param roomid 聊天室id
     * @param wxid 微信id
     */
    chatroom_member_nick(roomid, wxid) {
        return create({
            type: MSG_TYPE.CHATROOM_MEMBER_NICK,
            wxid: wxid,
            roomid: roomid,
        })
    },
    /**
     * 获取微信通讯录用户名字和wxId
     */
    user_list() {
        return create({
            type: MSG_TYPE.USER_LIST,
        })
    },
}


module.exports = {
    ...SendData,
    ...GetData,
};