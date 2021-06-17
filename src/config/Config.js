const os = require("os");

const MSG_TYPE = {
    /**
     * 心跳包
     */
    HEART_BEAT: {
        type: 5005,
        desc: "心跳包",
    },   //
    /**
     * 接收文本消息
     */
    RECV_TXT_MSG: {
        type: 1,
        desc: "接收文本消息"
    },    //接收文本消息
    /**
     * 接收图片消息
     */
    RECV_PIC_MSG: {
        type: 3,
        desc: "接收图片消息"
    },    //接收图片消息
    /**
     * 引用链接消息
     * 如：引用消息，合并转发，分享模板链接
     */
    RECV_LINK_MSG: {
        type: 49,
        desc: "引用链接消息"
    },    //引用链接消息
    /**
     * 获取联系人列表
     */
    USER_LIST: {
        type: 5000,
        desc: "获取联系人列表"
    },    //获取联系人列表
    /**
     * 获取用户列表成功
     */
    GET_USER_LIST_SUCCESS: {
        type: 5001,
        desc: "获取用户列表成功"
    },   //获取用户列表成功
    /**
     * 获取用户列表失败
     */
    GET_USER_LIST_FAIL: {
        type: 5002,
        desc: "获取用户列表失败"
    },   //获取用户列表失败
    /**
     * 发送文本
     */
    TXT_MSG: {
        type: 555,
        desc: "发送文本"
    },       //发送文本
    /**
     * 发送图片
     */
    PIC_MSG: {
        type: 500,
        desc: "发送图片"
    },       //发送图片
    /**
     * 发送群AT消息
     */
    AT_MSG: {
        type: 550,
        desc: "发送群AT消息"
    },        //发送群AT消息
    /**
     * 获取聊天室成员列表
     */
    CHATROOM_MEMBERS: {
        type: 5010,
        desc: "获取聊天室成员列表"
    },  //获取聊天室成员列表
    /**
     * 聊天室成员昵称
     */
    CHATROOM_MEMBER_NICK: {
        type: 5020,
        desc: "获取聊天室成员昵称"
    }, //获取聊天室成员昵称
    /**
     * 个人信息
     */
    PERSONAL_INFO: {
        type: 6500,
        desc: "个人信息"
    },    //个人信息
    /**
     * 调试开关
     */
    DEBUG_SWITCH: {
        type: 6000,
        desc: "调试开关"
    },     //调试开关
    /**
     * 个人详细信息
     */
    PERSONAL_DETAIL: {
        type: 6550,
        desc: "个人详细信息"
    },  //个人详细信息
    /**
     * 全部销毁
     */
    DESTROY_ALL: {
        type: 9999,
        desc: "全部销毁"
    },      //全部销毁
    /**
     * 微信好友请求消息
     */
    NEW_FRIEND_REQUEST: {
        type: 37,
        desc: "微信好友请求消息"
    },//微信好友请求消息
    /**
     * 同意微信好友请求消息
     */
    AGREE_TO_FRIEND_REQUEST: {
        type: 10000,
        desc: "同意微信好友请求消息"
    },//同意微信好友请求消息
    /**
     * 附件_文件
     */
    ATTATCH_FILE: {
        type: 5003,
        desc: "附件_文件"
    },     //附件_文件
}

const Config = {
    MSG_TYPE,
}


module.exports = Config;