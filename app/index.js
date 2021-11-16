const fs = require('fs');
const path = require("path")
const logger = require(path.join(__dirname, "./scripts/logger.js"));
//web service
const express = require('express');
const app = express();
app.disable("etag").disable("x-powered-by");
const https = require('https');
const http = require("http");
const server = https.createServer({
    key: fs.readFileSync(path.join(__dirname, './key.pem')),
    cert: fs.readFileSync(path.join(__dirname, './cert.pem')),
    passphrase: 'tewt'
}, app);
const multer = require('multer');

const io = require('socket.io').listen(server);
const cors = require('cors');

//system
const process = require("process");
const { exec } = require('child_process');
const os = require("os");

//local js modules
const network = require(path.join(__dirname, `/scripts/network.js`));
const system = require(path.join(__dirname, `/scripts/system.js`));
const user = require(path.join(__dirname, `/scripts/users.js`));
const { Tewt, Qde, Event } = require(path.join(__dirname, `/scripts/tewt.js`));

//define global variables
process.env.NODE_ENV = 'production';
let platform = os.platform();
let deviceName = os.hostname();
let config = {}; //the javascript config obj
let event;

let testUser = { uname: "day", level: "admin" };
let tewts = Tewt();

async function loadTewtData() {
    await tewts.loadTewts();
    await tewts.loadResults()
    //event = Event("Event 1", tewts[0], testUser, 61, "server");
}


process.on('SIGINT', function(){
    logger.log('Server Shutdown', "CLOSE")
});

//stopEvent()

let serverPort = 443 //port for server to run on
let version = "1.1.4";
logger.log(`Server started on ${platform}`, "STARTUP");

let error = false;

//If server is already running then close this instance down
process.on('uncaughtException', function (err) {
    if (err.errno === 'EADDRINUSE') {
        logger.log("Server already running")
    } else {
        logger.log(err, "ERROR");
        console.log(err)
    }
    server.close()
    process.exit
});

let loadConfig = async () => {
    reply = await system.getConfig();
    if (!reply.error) {
        config = reply.data;
        config.id = config.id ? config.id : system.createId();
        config.platform = platform;
        config.deviceName = deviceName;
        config.type = "tewtserver"
    }
}


// update the network every 10 seconds
function updateNetworkDetails() {
    config.network = network.getNetworkDetails()
    system.saveConfig(config).then((err) => { })
}

//checks current network details every 10 seconds
function networkUpdateInterval(seconds) {
    setInterval(() => {
        updateNetworkDetails()
    }, seconds * 1000);
}

//
function getCurrentTewt() {
    let reply = { error: true, data: tewts[0], msg: "No Selected tewt, sending default" }
    tewts.forEach(tewt => {
        if (tewt.name == config.currentTewt) {
            reply = { error: false, data: tewt };
        }
    })
    return reply;
}


function startEvent(status) {
    io.emit("server", {
        cat: "event",
        body: { status }
    })
}



let startWebServer = () => {
    //THIS IS ALL THE EXPPRESS SERVICES
    //used to validate user before any of the requests are performed
    async function userValidation(req, res, next) {
        let userName = req.query.uname ? req.query.uname : req.body.uname
        userName = userName ? userName.toLowerCase() : "";
        let authKey = req.query.authKey ? req.query.authKey : req.body.authKey;
        let validUser = await user.validate(userName, authKey)
        if (validUser) {
            res.locals.reply = await user.getUser(userName, authKey);
            next()
        } else {
            logger.log("User invalid")
            res.status(401).send({ error: true, msg: "User Invalid" })
        }
    }

    function checkAccessId(id) {
        const accessIds = config.accessIds;
        for (i = 0; i < accessIds.length; i++) {
            if (id == accessIds[i].id) {
                return { error: false, expiry: accessIds[i].expiry }
            }
        }
        return { error: true, msg: "Wrong Access ID" };
    }
    //enable cross origin Resource sharing
    app.use(cors());

    //allows express to serve static files like css, html, js
    //app.use(express.static(`${__dirname}/client`));
    app.use("/css", express.static(`${__dirname}/client/css`));
    app.use("/scripts", express.static(`${__dirname}/client/scripts`));
    app.use("/cesium", express.static(`${__dirname}/client/cesium`));
    app.use("/data", express.static(`${__dirname}/client/data`));
    app.use(`/media`, express.static(`${__dirname}/client/media`));
    app.use("/manifest.json", express.static(`${__dirname}/client/manifest.json`));
    app.use("/admin.html", express.static(`${__dirname}/client/admin.html`));


    app.use(express.static(`${__dirname}/data/tewts/media`))
    app.use(express.static(`${__dirname}/data/terrain`))
    app.use(express.static(`${__dirname}/data/tewts/results/videos`))
    //app.use("/media/", express.static(`${__dirname}/media`))
    app.use(express.json({ limit: '50mb' }));       // to support JSON-encoded bodies
    app.use(express.urlencoded({ extended: true, limit: '50mb' })); // to support URL-encoded bodies

    // on the request to root (localhost:7000/)
    app.get('/', function (req, res, next) {
        const cT = new Date();
        const offset = -cT.getTimezoneOffset();
        let id = req.query.id;
        let result = checkAccessId(id);

        if (result.error) {
            res.send(result.msg);
            return;
        }

        let expiry = new Date(result.expiry);

        if (expiry.getTime() >= new Date(cT - cT.getTimezoneOffset() * 60 * 1000) || result.expiry == null) {
            res.sendFile(`${__dirname}/client/index.html`);
            return;
        }

        res.send("Time Expired");

    })

    app.get('/api/getconfig', userValidation, function (req, res, next) {
        res.json({ error: false, data: config });
    })

    //update the system config (config object and config.json)
    app.post('/api/config', userValidation, function (req, res, next) {
        const jsonData = req.body.data;
        config = JSON.parse(jsonData);
        console.log("api/config", config)
        res.send({ error: reply.error, data: config });
        system.saveConfig(jsonData).then(err => { })
    })

    app.post('/api/tewt', userValidation, async (req, res, next) => {
        let {id, name, task, data} = req.body;
        let u = res.locals.reply.data;
        data = JSON.parse(decodeURIComponent(data));
        let reply;
        if (task == "submit") {
            reply = tewts.saveResults(id, name, u, data)
        } else if (task == "mark") {
            let {uname, sub, qdeno, comment, score} = data;
            reply = tewts.markResults(id, uname, sub, qdeno, comment, score);
        } else if (task == "delete") {
            reply = tewts.deleteResult(id, data.uname, data.sub)
        }
        res.json(reply)
    })



    app.get("/api/tewt", userValidation, (req, res, next) => {
        let user = res.locals.reply.data;
        let {id, name, task} = req.query;
        let reply;
        if (task == "list") {
            tewtList = tewts.getList(["name", "id", "enabled"]);
            let userGroup = config.groups.filter(group=>user.groupId == group.id);
            let userTewts = userGroup[0].tewts
            if(userGroup[0].tewts == "*"){
                reply = tewtList;
            } else {
                reply = {error: false, data: tewtList.data.filter(tewt => userTewts.includes(tewt.id))};
            }
            
        } else if (task == "getbyid") {
            reply = tewts.getTewt(name, id)
        } else if (task == "getresultsbyid") {
            reply = tewts.getResults(id);
        } else if (task == "resultslist") {
            reply = tewts.getResults();
        }
        res.json(reply)
    })



    app.post("/api/qde", userValidation, (req, res, next) => {
        let {task, uname, id, qde, data} = req.body;
        let reply;
        if (task == "submit") {
            reply = tewts.getList(["name", "id"]);
        } else if (task == "getbyid") {
            reply = tewts.getTewt(uname, id)
        }
        res.json(reply)
    })

    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, __dirname + '/data/tewts/results/videos')
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    })
    let upload = multer({ storage });
    //SUBMITTING RECORDED VIDEOS
    app.post("/api/file", upload.single('video'), (req, res, next) => {
        console.log('receiving video');
        let reply = { error: false, msg: "file uploaded" }
        res.json(reply)
    })


    app.get('/api/system', userValidation, function (req, res, next) {
        const task = req.query.task;
        logger.log("System API Called")
        switch (task) {
            case "shutdown":
            case "restart":
                res.send("Task Recieved")
                system.shutdown(task)
                break;
            case "getinfo":
            default:
                let systemInfo = {
                    name: config.name,
                    version: config.version,
                    id: config.id
                }
                res.send(systemInfo)
                break
        }
    })


    //returns server name
    app.get('/api/getInfo', function (req, res) {
        let { deviceName, name, type, version, id } = config;
        res.send({ error: false, deviceName, name, type, version, id })
    })


    // on the request to root (localhost:3000/)
    app.post('/api/login', async function (req, res, next) {
        let userName = req.query.uname ? req.query.uname : req.body.uname
        let password = req.query.password ? req.query.password : req.body.password
        let level = req.body.level ? req.body.level : "user";
        loginResult = await user.login(userName, password);
        if (level == "admin" && loginResult.data.level != "admin") {
            loginResult = { error: true, msg: "Need Elevated Permissions" }
        }
        if (loginResult.error) {
            logger.log(`Login Unsuccessful: ${userName}`, "ERROR")
            res.status(401)
        } else {
            logger.log(`Login Successful: ${userName}`, "LOG")
        }
        res.json(loginResult)
    })


    // on the request to root (localhost:3000/)
    app.post('/api/user', userValidation, async function (req, res, next) {
        let task = req.body.task;
        let u = res.locals.reply.data;
        let attribute = req.body.attribute; //this is the key which will be updated on the selected user
        let value = req.body.value; //value of the attribute
        let unameupdate = req.body.unameupdate;
        let data = {error:true, data: ""};
        switch (task) {
            case "create":
                data = await user.create()
                break;
            case "remove":
                break;
            case "edit":
                break;
            case "getall":
                data = {error: false, data: user.getAllFiltered(["uname", "fname","lname", "passwordResetRequested","level"])};
                break;
            case "update":
                if(u.level != "admin"){
                    data.data = "Wrong Privilidges";
                    break;
                };
                data = {error: false, data: user.updateAttribute(unameupdate, attribute, value)};
                break;
            case "resetpassword":
                if(u.level != "admin"){
                    data.data = "Wrong Privilidges";
                    break;
                };
                data = {error: false, data: user.resetPassword(unameupdate)};
                break;
            default:
                data = await user.getUser(u.uname, u.authKey)
                break;
        }
        res.json(data)
    })

    app.post('/api/user/requestpasswordreset', (req,res,next)=>{
        let uname = req.body.uname;
        let confirmRequest = user.requestPasswordReset(uname)
        if(!confirmRequest) res.json({error: true});
        data = {error: false, msg: "Password Request Sent"};
    })

    // on the request to root (localhost:3000/)
    app.post('/user/create', async function (req, res, next) {
        let uname = req.body.uname;
        let fname = req.body.fname;
        let lname = req.body.lname;
        let password = req.body.password;
        let reply = await user.create(fname, lname, password, "user", uname)
        res.json(reply)
    })

    // Change the 404 message modifing the middleware
    app.use(function (req, res, next) {
        res.status(404).send("Sorry, that route doesn't exist. Have a nice day :)")
    })

    // start the server!
    server.listen(serverPort, function () {
        console.log(`Tactical Scenario Server, listening on port ${serverPort}.`);
        logger.log(`HTTPS Server Started.`, "STARTUP");
    })

    // Redirect from http port 
    http.createServer(function (req, res) {
        res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
        console.log(`HTTP redirection server listening on port 80.`);
        res.end();
    }).listen(80);
}

async function startApp(eConfig) {
    if (eConfig) {
        config = eConfig;
    } else {
        await loadConfig();
    }
    await loadTewtData();
    startWebServer();
    networkUpdateInterval(10);
}

//eApp.run(version, serverPort);

//startApp();

module.exports = {
    start: startApp
}