const express = require("express")
const { sendMsg } = require("./my_client")

//api
const server = express();
const port = 8503;

function start(client) {
    server.get("/map", (req, res) => {
        res.send(JSON.stringify(global.userMap, undefined, 4));
    })
    server.get('/sendMsg', (req, res) => {
        const { uid, content } = req.query;
        if (!uid && !content) {
            res.send({
                status: 400,
                message: "不能为空!"
            });
            return;
        }
        for (let key in global.userMap) {
            let value = global.userMap[key];
            if (value == uid) {
                client.sendMsg(key, content);
                res.send({
                    status: 200,
                    message: "发送成功!"
                });
                return;
            }
        }
        res.send({
            status: 200,
            message: "未绑定uid=" + uid
        });
        // res.send(JSON.stringify(req, undefined, 2));
    })
    server.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    })
}


module.exports = {
    start
};