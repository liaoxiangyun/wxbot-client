const LogUtil = {
    logJson(json, name) {
        let str = json;
        if (typeof json == "object") {
            str = JSON.stringify(json, undefined, 4);
            if (name) {
                str = "#" + name + " =\n " + str;
            }
        } else {
            if (name) {
                str = "#" + name + " = " + str;
            }
        }
        console.log(str);
    }

}

module.exports = LogUtil;