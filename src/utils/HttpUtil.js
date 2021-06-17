const axios = require("axios")


let HttpUtil = {
    /**
     * @see http://api.qingyunke.com/
     */
    qingyunke_api(msg = "你好", callback) {
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
    }
}

module.exports = HttpUtil;