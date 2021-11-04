const fs = require('fs')
const path = require("path")
const os = require("os");
const logger = require(path.join(__dirname, "./logger.js"))
const crypto = require("crypto");
const dirTree = require("directory-tree");

const configUrl = path.join(__dirname, "../config/config.json")

let userCredentials = {};
let platform = os.platform();
const encryption = {algorithm: 'aes-192-cbc', password: 'tewtserver'};

let createId = ()=>{
    let s4=()=>{
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return(s4()+"_"+s4()+"_"+s4()+"_"+s4());
}

function encryptData(data){
    return new Promise((resolve, reject)=>{
        let reply = "";
        const key = crypto.scryptSync(encryption.password, "salt", 20);
        const cipher = crypto.createCipheriv(encryption.algorithm, key);

        cipher.on('readable', ()=>{
            let chunk;
            while (null !== (chunk = cipher.read())){
                reply += chunk.toString('hex');
            }
        })

        cipher.on('end', ()=> resolve(reply))
        cipher.write(data);
        cipher.end()
    })
}

function decryptData(data){
    return new Promise((resolve, reject)=>{
        let reply = "";
        const key = crypto.scryptSync(encryption.password, "salt", 20);
        const decipher = crypto.createDecipheriv(encryption.algorithm, key);

        decipher.on('readable', ()=>{
            let chunk;
            while (null !== (chunk = decipher.read())){
                reply += chunk.toString('hex');
            }
        })

        decipher.on('end', ()=> resolve(reply))
        decipher.write(data, 'hex');
        decipher.end()
    })
}

let openFile = (url)=>{
    return new Promise((resolve, reject)=>{
        fs.readFile(url, (err, d) => {
            if (err) resolve({ error: true, data: "" });
            resolve({error: false, data: d})
        })
    })
}

// params are file url, and key value of saving object
let readFile = (url) => {
    return new Promise((resolve, reject)=>{
        let data;
        let reply;
        fs.readFile(url, (err, d) => {
            if (err) resolve({ error: true, data: "" });
            data = d;
            try {
                data = JSON.parse(data);
                reply = { error: false, data };
            } catch (e) {
                reply = { error: true, data: "" };
            } finally {
                resolve(reply);
            }
        })
    })
}

// params are file url, and key value of saving object
let readFileTest = async (url, hash) => {
        let reply = await openFile(url);
        let data = reply.data;
        if(reply.error){return {error: true, data: ""}}
        if(hash == true){
            data = await decryptData(data);
        }
        let jsonReply = jsonParse(data);
        return jsonReply;
}


let jsonParse = (str)=>{
    let reply
    try {
        data = JSON.parse(string);
        reply = { error: false, data };
    } catch (e) {
        reply = { error: true, data: str};
    } finally {
        return reply
    }
}

let closeFile = (url, data)=>{
    return new Promise((resolve,reject)=>{
        fs.writeFile(url, data, (err) => {
            let error = err ? true : false;
            resolve({ error });
        })
    })
}

//saving config files params are url, the config data and key value of saving object
let saveFile = async (url, data/*, hash*/) => {
        let d = (typeof data == 'object') ? JSON.stringify(data, null, 4) : data;
        let error = await closeFile(url, d);
        return error;
}


//LOAD AND SAVE ALL CONFIG FILES
//load and save config
let getConfig = () => {
    return new Promise((resolve, reject) => {
        readFile(configUrl).then(reply => {
            resolve(reply);
        })
    })
}


let saveConfig = (data) => {
    return new Promise((resolve, reject) => {
        saveFile(configUrl, data).then(err => {
            resolve(err)
        })
    })
}

// gets shutdown or restart command and performs exec on system
function shutdown(task) {
    var taskString
    if (task == "shutdown") {
        taskString = (platform == "win32") ? 'shutdown -s -t 00' : 'sudo shutdown -h now'
    } else if (task == "restart") {
        taskString = (platform == "win32") ? 'shutdown -r -t 00' : 'sudo shutdown -r now'
    }
    exec(taskString, (err, stdout, stderr) => {
        if (err) {
            logger.log(`Could not ${task} selected this device`)
        } else {
            logger.log(`${task} complete!`)
        }
    })
}


let load = (path, type) => {
    return new Promise((resolve, reject) => {
        let tree = dirTree(path, { extensions: /\.(json)$/ })
        let deviceList = [];
        tree.children.forEach(ele => {
            if (ele.type == "file") {
                deviceList.push(readFile(ele.path))
            }
        })

        Promise.all(deviceList)
            .then((data) => {
                let reply = [];
                data.forEach((ele) => {
                    if (!ele.error) {
                        reply.push(ele.data)
                    }
                })
                resolve(reply)
            })
    })
}


module.exports = {
    getConfig,
    saveConfig,
    readFile,
    saveFile,
    shutdown,
    load,
    createId
    /*genAuthToken,
    checkAuthToken,*/
}

