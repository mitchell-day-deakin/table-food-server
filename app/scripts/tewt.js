
const fs = require('fs');
const dirTree = require('directory-tree')
const path = require('path')
const system = require('./system.js')
const tewtPath = path.join(__dirname, '../data/tewts/');
const qdesPath = path.join(__dirname, '../data/qdes/');
const resultsPath = `${tewtPath}/results/`;

let qdesList;
let tewtsList;
let event;
let submissions;


//creates a random string authKey
function createAuthKey() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

let createId = (list) => {
    let isTaken = true;
    let count = 0;
    let id;
    while (isTaken) {
        isTaken = false;
        id = createAuthKey();
        for (i = 0; i < list.length; i++) {
            if (list[i] == id) {
                isTaken = true;
                break;
            }
        }

        if (isTaken == false) {
            return id;
        } else if (count > 15) {
            return "error: could not create unique id"
        }
        count++
    }
}


let id = createId([createAuthKey(), createAuthKey(), "55"], 0)



let load = (path, type) => {
    return new Promise((resolve, reject) => {
        let tree = dirTree(tewtPath, { extensions: /\.(json)$/ })
        let deviceList = [];
        tree.children.forEach(ele => {
            if (ele.type == "file") {
                deviceList.push(system.readFile(ele.path))
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


let loadTewts = async () => {
}

let loadQdes = async () => {

}


//factory function for tewts
function Tewt() {
    let list = null;
    let results = null;


    let getList = (items) => {
        if (list) {
            let result = [];
            list.forEach(t => {
                let ele = {};
                items.forEach(key => {
                    if (t[key]) {
                        ele[key] = t[key];
                    }
                })
                result.push(ele);
            })
            return { error: false, data: result };
        } else {
            return { error: true, msg: "Tewts list is empty or loading" }
        }
    }

    let submit = (submission, uname) => {
        let id = submission.tewt.id;
    }

    let loadResults = async () => {
        results = await system.load(resultsPath, "json");
        return results
    }

    let getResults = (id) => {
        if (!results) { return { error: true, msg: "No Results" } }
        if (!id) { return { error: false, data: results } };
        for (i = 0; i < results.length; i++) {
            if (id == results[i].id) {
                return { error: false, data: results[i] }
            }
        }
        return { error: true, msg: "Could not find results with id: " + id }
    }

    let saveResults = async (id, name, user, submission) => {
        let exists = false;
        for (i = 0; i < results.length; i++) {
            if (results[i].id == id) {
                exists = true;
                try {
                    results[i].users[user.uname].submissions.push(submission)
                } catch (error) {
                    results[i].users[user.uname] = {fname: user.fname, lname: user.lname, submissions: [submission]};
                }

            }
        }
        //if tewtResults object doesnt exist
        if (!exists) {
            let tewt = { id, name, users: {} }
            tewt.users[user.uname] = {fname: user.fname, lname: user.lname, submissions: [submission]};
            results.push(tewt);
        }
        saveResultsToFile();
        return { error: false, msg: "Saved submission" }
    }


    let saveResultsToFile = () => {
        results.forEach(result => {
            system.saveFile(`${resultsPath}/${result.id}.json`, JSON.stringify(result, null, 4))
        })
    }


    let getTewt = (name, id) => {
        let reply = { error: true, msg: "Could not find Tewt" }
        list.forEach(t => {
            if (t.name == name && t.id == id) {
                reply = { error: false, data: t };
            }
        })
        return reply
    }

    /**
     * This creates an object in the results[qdeNo].marks, which has a comment and a score
     * @param {string} id Id of the tewt being marked
     * @param {string} uname Username of the user being marked
     * @param {int} sub The idx of the submission being marked in submissions array
     * @param {int} qdeNo The idx of the qde in tewt.qdes array
     * @param {string} comment The comment made about the results
     * @param {int} score The score given for the results
     */
    let markResults = (id, uname, sub, qdeNo, comment, score)=>{
        for(i=0;i<results.length;i++){
            if(results[i].id == id){
                results[i].users[uname].submissions[sub].results[qdeNo].marks = {comment, score}
                saveResultsToFile();
                return {error: false, data: results, msg: "Marks Saved"};
            }
        }
    }
    /**
     * Deletes a result the results of a tewt
     * @param {string} id Id of the tewt
     * @param {string} uname Username of user
     * @param {int} sub The idx of the submissions
     * @param {int} qdeNo The idx of the qde in tewt.qdes
     */
    let deleteResult = (id, uname, sub)=>{
        for(i=0;i<results.length;i++){
            if(results[i].id == id){
                results[i].users[uname].submissions.splice(sub, 1);
                saveResultsToFile();
                return {error: false, data: results, msg: "Marks Saved"};
            }
        }
        return {error: true, msg: "Couldn't find Tewt with id: "+id, data: ""}
    }

    let loadTewts = async () => {
        list = await load(tewtPath);
        return list;
    }

    return {
        loadTewts,
        getList,
        getTewt,
        saveResults,
        loadResults,
        markResults,
        deleteResult,
        getResults
    }
}


//factory function for qdes
function Qde() {
    let list;
    return {
        load: async () => {
            list = await load(qdesPath)
            return qdes;
        }

    }
}

//factory function for tewt events
function Event(name, tewt, user, dur, type) {
    tewt;
    name;
    type
    let users = [];
    let trainer = user;
    let duration = dur ? dur : 15;
    let status = { startTime: 0, finishTime: 0, running: false, timeLeft: duration, timeLeftString: "0" };

    function timeLabel(time) {
        let hour = Math.floor(status.timeLeft / 3600);
        hour = hour < 10 ? `0${hour}` : hour;
        let min = status.timeLeft >= 3600 ? Math.floor(status.timeLeft / 60) - 60 : Math.floor(status.timeLeft / 60);
        min = min < 10 ? `0${min}` : min;
        let sec = status.timeLeft % 60;
        sec = sec < 10 ? `0${sec}` : sec;
        return `${hour}:${min}:${sec}`;
    }

    async function timer(returnIntervalFunction) {
        let interval = setInterval(_ => {
            let currentTime = new Date().getTime();
            status.timeLeft = Math.round((status.finishTime - currentTime) / 1000);
            status.timeLeftString = timeLabel(status.timeLeft);
            //returnIntervalFunction(status);
            if (status.timeLeft >= 1) {
                status.timeLeft--;
                returnIntervalFunction(status);
            } else {
                //console.log("Finished", min, ":", sec)
                status.running = false;
                returnIntervalFunction(status);
                clearInterval(interval);
            }
        }, 1000)
        return false;
    }

    return {
        start: async (timerReturn) => {
            if (user.level != "admin") {
                console.log("User has wrong permissions")
                return { error: true, msg: "Not the right level" }
            }
            status.running = true;
            status.startTime = new Date().getTime()
            status.finishTime = new Date(status.startTime + duration * 1000 * 60).getTime();
            await timer(timerReturn)
            //status.running= false;
        },
        stop: (user) => {
            if (user.level == "admin") {
                console.log("Finished Event");
                status.timeLeft = 0;
                status.running = false;
                status.finishTime = new Date().getTime();
            }
        },
        addUser: (user) => {
            if (!status.running) {
                return false;
            }
            let userAlreadyStarted = false;
            users.forEach(u => {
                if (user.uname == u.uname) {
                    userAlreadyStarted = true;
                    return
                }
            })
            if (!userAlreadyStarted) {
                users.push(user)
            } else {
                console.log("User already exists")
            }
            return true;
        },
        userSubmitQde: (uname, qdeName, submission) => {

        },
        output: () => {
            return { tewt, users, trainer, status }
        }
    }

}

module.exports = {
    Event,
    Tewt,
    Qde
}


