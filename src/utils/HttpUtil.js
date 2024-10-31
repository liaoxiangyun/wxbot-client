const axios = require("axios")


let HttpUtil = {
    /**
     * @see http://api.qingyunke.com/
     */
    qingyunke_api(msg = "你好", wxid, callback) {
        axios.get('http://api.qingyunke.com/api.php?key=free&appid=0&msg=' + encodeURIComponent(msg))
            .then(function (response) {
                if (response.data && response.data.content) {
                    let content = response.data.content.replace(new RegExp("{br}", "g"), "\n");
                    callback && callback(content);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    },
    
    /**
     * @see http://api.qingyunke.com/
     */
    chatgpt_api(msg = "你好", chatId='', callback, retry=0) {
        const run = () =>{
            axios.get(`http://liaoxy.cn:884/chat/send?chatId=${chatId}&text=` + encodeURIComponent(msg))
            .then(function (response) {
                if (response.data && response.data) {
                    let data = response.data;
                    if(retry && data.status){
                        if(retry<=0)return;
                        console.log(`#chatgpt_api: text=${data.text} ; =========正在重试获取正确结果${count}`)
                        retry = retry-1;
                        setTimeout(()=>{
                            run()
                        }, 3000+parseInt(Math.random()*10000))
                        return;
                    }
                    callback && callback(data.text);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        }
        run();
        
    }
}

module.exports = HttpUtil;