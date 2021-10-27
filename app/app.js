const electron = require('electron');
const app = electron.app
const { BrowserWindow, Menu, Tray, shell } = electron;
const NativeImage = electron.nativeImage;
const path = require("path")
const opn = require("opn");
const process = require('process');
const logger = require(path.join(__dirname, "./scripts/logger.js"));

const serverUrl = `file://${path.join(__dirname, "/data/splash.html")}`;
const apiUrl = `file://${path.join(__dirname, "/client/api.html")}`
const system = require(path.join(__dirname, `/scripts/system.js`));
const os = require("os");
let platform = os.platform();
let hostname = os.hostname();

const main = require(`${__dirname}/index.js`);

let appIcon = null;
let config = null

//If server is already running then close this instance down
process.on('uncaughtException', function (err) {
    if (err.errno === 'EADDRINUSE') {
        logger.log("Server already running")
    } else {
        logger.log(err);
        console.log(err)
    }
    quit();
    process.exit
});


/**
 * Loads config to global variable config
 */
let loadConfig = async () => {
    reply = await system.getConfig();
    if (!reply.error) {
        config = reply.data;
        config.id = config.id ? config.id : system.createId();
        config.platform = platform;
        config.hostname = hostname;
        config.type = "tewtserver";
        system.saveConfig(config)
    }
}


function run(version, port) {
    //set tray icon and functionality
    let url = `https://localhost?id=cubic_system`
    //win.loadURL(url);
    appIcon = new Tray(`${path.join(__dirname, "/data/media/server.png")}`)

    let iconMenu = Menu.buildFromTemplate([
        {
            label: `V${version}`
        },
        {
            label: `HTTPS Port: ${port}`
        },
        {
            label: `HTTP Port: 80 (Redirect)`
        },
        {
            type: "separator"
        },
        {
            label: "Splash",
            click: function () {
                showInfo()
            }
        },
        /* {
            label: "Settings",
            click: function () {
                //openSettings()
            }
        }, */
        {
            label: "Open Window",
            click: function () {
                //showWindow(url)
                createWindow(url)
            }
        },
        /*{
            label: "API",
            click: function () {
                showApi()
            }
        },*/
        {
            label: "Exit",
            click: function () {
                quit()
            }
        }
    ])

    appIcon.setToolTip('TEWT Server,Right Click for options');
    appIcon.setContextMenu(iconMenu);
}

//function to quick application
let quit = () => {
    app.quit();
}


//opens the window win with url
function showWindow(url) {
    win.show();
}

function createWindow(url){
    let win = new BrowserWindow({
        show: false,
        //alwaysOnTop: true,
        backgroundColor: '#555555',
		width: 1400,
		height: 800,
		minWidth: 600,
        minHeight: 600,
        icon: NativeImage.createFromPath(__dirname + '/data/media/icon.png'),
        //frame: false,
        darkTheme: true,
        transparent: false,
        autoHideMenuBar: true,
        title: "TEWT Client",
        webPreferences: {
            webSecurity: false
        }
    })

    win.loadURL(url);
    win.on("ready-to-show",()=>{
        win.show();
    })

    //stops the main window opening new window
    win.webContents.on('new-window', function (e, url) {
        e.preventDefault();
        shell.openExternal(url);
    });
}

//shows the server information page for x seoonds
function showInfo() {
    splash.show()
    setTimeout(() => {
        splash.hide()
    }, 4000)
}

//create BrowserWindows
//let win;
let splash, apiPage;

app.commandLine.appendSwitch('ignore-certificate-errors');
app.on('ready', () => {
    //main window
    /* win = new BrowserWindow({
        show: false,
        //alwaysOnTop: true,
        backgroundColor: '#555555',
		width: 1400,
		height: 800,
		minWidth: 600,
        minHeight: 600,
        icon: NativeImage.createFromPath(__dirname + '/data/media/icon.png'),
        //frame: false,
        darkTheme: true,
        transparent: false,
        autoHideMenuBar: true,
        title: "TEWT Client",
        webPreferences: {
            webSecurity: false
        }
    }) */

    //splash screen showing application information
    splash = new BrowserWindow({
        show: false,
        alwaysOnTop: true,
        height: 220,
        width: 600,
        frame: false,
        darkTheme: true,
        transparent: true,
        autoHideMenuBar: true
    })

    //api page with server api
    apiPage = new BrowserWindow({
        show: false,
        height: 500,
        width: 300,
        darkTheme: true,
        autoHideMenuBar: true
    })

    
    /* //stops the main window opening new window
    win.webContents.on('new-window', function (e, url) {
        e.preventDefault();
        shell.openExternal(url);
    }); */

    //load window urls
    splash.loadURL(serverUrl)
    apiPage.loadURL(apiUrl);

    start()

    //uncomment if wanting the splash screen to appear on startup
    //showInfo()
})

//listens for close event on main window and hides it instead.
/* win.on('close', (e) => {
    e.preventDefault();
    if (process.platform != 'darwin') {
        app.quit()
    }
    win.hide();
}) */

//loads config then starts the web server
async function start() {
    await loadConfig();
    main.start(config);
    run(config.version, 443)
}

module.exports = {

}



