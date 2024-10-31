const fs = require('fs')
const {logJson} = require("../utils/LogUtil")
global.userMap = {
    "wxid": "uid"
}
global.personalInfo = {
    "wx_code": "20221029034321",
    "wx_id": "wxid_3ame1a9xrhee22",
    "wx_name": "摸鱼侠"
}
logJson(global.personalInfo, "global.personalInfo")


let path = 'userMap.json';

try {
    const data = fs.readFileSync(path, 'utf-8');
    // 等待操作结果返回，然后打印结果
    logJson(data, path)
    global.userMap = JSON.parse(data);
} catch (e) {
    console.error(e)
    console.log('读取文件发生错误');
}
global.userMapPush = function (wxid, uid) {
    if (wxid && uid) {
        global.userMap[wxid] = uid;
        fs.writeFileSync(path, JSON.stringify(global.userMap, undefined, 4), (err) => {
            if (err) {
                console.log('写入文件操作失败')
            } else {
                console.log('写入文件操作成功')
            }
        })
    }
}