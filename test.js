const HttpUtil = require('./src/utils/httpUtil');
const TaskUtil = require('./src/utils/TaskUtil');
const LogUtil = require('./src/utils/LogUtil');
// HttpUtil.qingyunke_api("你好", (response) => {
//     console.log(response);
// })

let obj = {
    a: "1",
    b: "2",
}

let data = {
    ...obj,
    a: "a",
}

//console.log(data)

const fxp = require("fast-xml-parser");

let xml = "<?xml version=\"1.0\"?>\n<msg>\n\t<img aeskey=\"451e1ae4ea22391cff829962edcfa2f6\" encryver=\"0\" cdnthumbaeskey=\"451e1ae4ea22391cff829962edcfa2f6\" cdnthumburl=\"30780201000471306f0201000204a31dc99802032f59190204dda66971020460c1a9ff044a617570696d675f333765326137646635663835343031305f313632333330343730333030345f38643838653065652d333331312d346139662d623032322d356434336465373735373565020401090a020201000400\" cdnthumblength=\"6275\" cdnthumbheight=\"120\" cdnthumbwidth=\"120\" cdnmidheight=\"0\" cdnmidwidth=\"0\" cdnhdheight=\"0\" cdnhdwidth=\"0\" cdnmidimgurl=\"30780201000471306f0201000204a31dc99802032f59190204dda66971020460c1a9ff044a617570696d675f333765326137646635663835343031305f313632333330343730333030345f38643838653065652d333331312d346139662d623032322d356434336465373735373565020401090a020201000400\" length=\"34199\" md5=\"6682c9f5ea176ec3635b57e1250985f6\" hevc_mid_size=\"34199\" />\n</msg>\n"

const xml2json = fxp.parse(xml);

console.log(JSON.stringify(xml2json, undefined, 4));

