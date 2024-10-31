

const child_process = require('child_process');
const fs = require('fs');

const wxDir = "C:\\Users\\liaoxy\\Documents\\WeChat Files\\"

const getName = (url = "") => {
    return url.substring(url.lastIndexOf("\\") + 1, url.length);
}
function decodeImg({ path = "", wxname }, call) {

    let pathStr = wxDir + path;
    let end = pathStr.lastIndexOf("\\")
    let name = pathStr.substring(end + 1, pathStr.length);
    let dirStr = pathStr.substring(0, end);
    let params = `${dirStr}###${name}`;
    console.log(params)
    // let workerProcess = child_process.spawn('python', ['support.py', wxDir, path]);
    let result = {
        txt: '',
        i: 10,
    };
    var workerProcess = child_process.exec(`python ./src/utils/support.py "${params}"`, function (error, stdout, stderr) {
        if (error) {
            console.log(error.stack);
            console.log('Error code: ' + error.code);
            console.log('Signal received: ' + error.signal);
        }
        console.log('stdout: ' + stdout);
        // console.log('stderr: ' + stderr);
        result.txt = stdout.split("###")[1] || "";
        // console.log('子进程已退出，result = ' + result.txt);
        // setTimeout(() => {
        //     call(result.txt)
        // }, 2000);
    });

    workerProcess.on('exit', function (code) {
        setTimeout(() => {
            result.timer = setInterval(() => {
                console.log({txt:result.txt, i: result.i})
                result.i = result.i - 1;
                if (result.i <= 0) {
                    clearInterval(result.timer);
                    result;
                }
                if (result.txt) {
                    result.i = 0;
                    clearInterval(result.timer);
                    call(result.txt);
                }
            }, 1000);
        }, 1000);
        // call(name);
    });
}

const out_path = "D:\\temp\\images";
module.exports = {
    decodeImg,
    getName,
    getOutPath(name = "") {
        return out_path + "\\" + name;
    }
}