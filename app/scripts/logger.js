//create custom logger
const fs = require("fs")
const path = require("path");
const logDir = path.join(__dirname, "../logs/");
let date = new Date();


//logs 
//logs it to a file containing the date (creates new file for each day)
//appends data if file already exists
function log(data, type){
    const d = new Date();
    const time = d.toLocaleTimeString();
    let day = `${date.getFullYear()}_${date.getMonth()+1}_${date.getDate()}`;
    const logUrl = `${logDir}${day}-stdout.log`;
    let logMessage = type ? `${type}: ${data}` : `log: ${data}`
    fs.writeFile(logUrl, `${time} ${logMessage}\n`, { flag: "a+" }, (err)=>{});
};

module.exports = {
    log
}