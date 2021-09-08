let startWebServer = () => {
    //THIS IS ALL THE EXPPRESS SERVICES
    //used to validate user before any of the requests are performed
    async function userValidation(req, res, next) {
        let userName = req.query.uname ? req.query.uname : req.body.uname
        userName = userName ? userName.toLowerCase() : "";
        let authKey = req.query.authKey ? req.query.authKey : req.body.authKey;
        let validUser = await user.validate(userName, authKey)
        logger.log(validUser)
        if (validUser) {
            next()
        } else {
            logger.log("User invalid")
            res.status(401).send({ error: true, msg: "User Invalid" })
        }
    }
    //enable cross origin Resource sharing
    app.use(cors());

    //allows express to serve static files like css, html, js
    app.use(express.static(`${__dirname}/client`))
    //app.use(express.static(`${__dirname}/data/config`))
    //app.use("/media/", express.static(`${__dirname}/media`))
    app.use(express.json());       // to support JSON-encoded bodies
    app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies


    // on the request to root (localhost:7000/)
    app.get('/', function (req, res, next) {
        res.send(path.join(__dirname + `/client/index.html`))
    })

    app.get('/api/getconfig', userValidation, function (req, res, next) {
        res.json({error: false, data: config});
    })

    //update the system config (config object and config.json)
    app.post('/api/config', userValidation, function (req, res, next) {
        const jsonData = req.body.data;
        console.log("UpdateConfigApi");
        config = JSON.parse(jsonData);
        logger.log("Data sent from client");
        io.emit("server", {
            cat: "system",
            body: config
        })
        res.send({ error: reply.error, data: config });
        system.saveConfig(jsonData).then(err => { })
    })

    app.post("/api/tewt", userValidation, (req, res, next) => {
        let error = false;
        let msg = "Reply";
        let data = {}
        res.json({ error, data, msg })

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
                    name: config.serverName,
                    ip: config.serverIp,
                    version: config.version
                }
                res.send(systemInfo)
                break
        }
    })


    //returns server name
    app.get('/api/getInfo', function (req, res) {
        res.send({ error: false, deviceName: hostname, platform, name: config.serverName, type: "cbesServer", version: config.version })
    })


    // on the request to root (localhost:3000/)
    app.post('/api/login', async function (req, res, next) {
        console.log(req.body)
        let userName = req.query.uname ? req.query.uname : req.body.uname
        let password = req.query.password ? req.query.password : req.body.password
        loginResult = await user.login(userName, password);
        if (loginResult.error) {
            logger.log("Login Unsuccessful")
            res.status(401)
        } else {
            logger.log("Login Successful")
        }
        res.json(loginResult)
    })

    // on the request to root (localhost:3000/)
    app.post('/api/user', userValidation, async function (req, res, next) {
        let task = req.body.task;
        let uname = req.body.uname;
        let authKey = req.body.authKey;
        let data = null
        switch (task) {
            case "create":
                break;
            case "remove":
                break;
            case "edit":
                break;
            default:
                data = await user.getUser(uname, authKey)
                break;
        }
        console.log(data)
        res.json(data)
    })

    // Change the 404 message modifing the middleware
    app.use(function (req, res, next) {
        res.status(404).send("Sorry, that route doesn't exist. Have a nice day :)")
    })

    // start the server!
    server.listen(serverPort, function () {
        logger.log(`Tactical Scenario Server, listening on port ${serverPort}.`)
    })

}