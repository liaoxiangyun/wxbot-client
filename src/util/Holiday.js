
const Holiday = {
    data: {},
    isOff() {
        //判断今天是否休假
        //数据源于https://github.com/tangyan85/GetHolidays
        //需要将非工作日（包括节假日（ day_type = 0）、周末（只要是周末，不管是否调休 day_type = 2））与工作日（ day_type = 1）区分开来，写入json文件
        let now = new Date();
        let year = now.getFullYear() + "";
        let month = (now.getMonth() + 1) < 10 ? "0" + (now.getMonth() + 1) : (now.getMonth() + 1) + "";
        let day = now.getDate() < 10 ? "0" + now.getDate() : "" + now.getDate();
        let yearData = require("./data/" + now.getFullYear() + ".json")
        if (yearData) {
            let code = yearData[year + month][year + month + day];
            if (code !== 1) {
                return true;
            }
        } else {
            return this.isWeekend();
        }
    },
    getWeek() {
        return new Date().getDay() + (4 - new Date(1).getDay()); //加上偏移量
    },
    isWeekend() {
        let week = this.getWeek();
        return week === 0 || week === 6;
    },
}

module.exports = Holiday