//gets the access id used when opening page
const queryString = window.location.search;
const parameters = new URLSearchParams(queryString);
const accessId = parameters.get('id');
console.log(accessId)

//handle loading of page
//document.addEventListener("DOMContentLoaded", () => { loadingPage("none") }, false);
document.addEventListener('wheel', (event) => {
    if (!event.ctrlKey) return;
    event.preventDefault();
    // Send a message to your handler in the browser to adjust the zoom.
}, { passive: false })




/**
 * Shows or hides the loading page.
 * @param {string} display This is the value for the display <none/block/default/inline-block/inline>
 */
function loadingPage(display) {
    document.getElementById("loadingpage").style.display = display;
}




//gets the json data file with all nodes and config
async function getConfig() {
    var url = `${serverIp}/api/getconfig?${authReqString()}`;
    let reply = await xhrRequest(url, 'GET', "");
    if (!reply.body.error) {
        config = reply.body.data; //json object with config and node data
    } else {
        Swal.fire("Error Getting Config from server")
        removeUser();
    }
    return reply;
};



function editDom() {
    //updateNetwork()
    updateMenus();
    updateTewt();
    updateMainPage();
}



function mobileViews(display) {
    let elems = document.querySelectorAll(".local-file");
    elems.forEach(elem => {
        elem.style.display = display;
    })
}


function checkDevice() {
    let params = new URLSearchParams(document.location.search);
    let pIp = params.get("ip");
    let pDevice = params.get("device");
    serverIp = "";
    mobileViews("none");

    //check if using browser
    if (document.location.protocol != "file:") {
        localStorage.device = "browser";
        return;
    }

    //check android device and add mobile view
    if (pDevice == "android" || localStorage.device == "android") {
        mobileViews("");
    }


}


async function serverCheck() {
    //check if there is an "ip" param in the url
    let params = new URLSearchParams(document.location.search);
    let ip = params.get("ip");

    serverIp = localStorage["serverIp"] ? localStorage["serverIp"] : "unavailable";
    localStorage["serverIp"] = serverIp;

    if (document.location.protocol != "file:") {
        if (localStorage["deviceType"] != "client") {
            serverIp = "";
            localStorage["serverIp"] = serverIp;
            mobileViews("none");
            return
        }
    }

    localStorage["deviceType"] = "client";
    mobileViews("");
    if (ip) {
        serverIp = ip;
        localStorage["serverIp"] = serverIp;
    } else if (serverIp == "unavailable") {
        window.location.href = `./serverConnect.html`;
    }
    let url = `${serverIp}/api/getinfo`
    let result = await xhrRequest(url, "GET", null);
    console.log(result)
    if (!result.error) { config = result.data };
    if (result.error) {
        //alert("Can\'t connect to server");
        window.location.href = `./serverConnect.html`;
    }
    return;
}



function disconnectServer() {
    window.location.href = `./serverConnect.html`;
}



async function checkUser() {
    let error;
    if (user.uname && localStorage["client"] == clientString) {
        let validUser = await checkUserValid();
        if (validUser.body.error) {
            removeUser();
            error = true;
        } else {
            saveUser(validUser.body.data);
            error = false;
        }
    } else {
        error = true;
    }
    return error;
}



let refreshWindow = async () => {
    loadingPage("block");
    await serverCheck();
    loadingPage("none");
    let userError = await checkUser();
    if (!userError) {
        await getConfig()
        await getAllTewts()
        await loadTewt()
        if (current.tewt) {
            //updateTewt()
            setPage("tewtPage");
        } else {
            setPage("mainPage");
        }
        adminLoginCheck();
        editDom()
    } else {
        removeUser();
        setPage("loginPage")
    }
}




function changeMainPage(page, btn) {
    let pages = document.querySelectorAll(".mainPage");
    let targetPage = document.getElementById(page);
    let btns = document.getElementById("mainMenu").querySelectorAll("li");

    //hide all pages
    for (i = 0; i < pages.length; i++) {
        pages[i].style.display = "none";
    }
    //set all menu buttons to normal color
    for (j = 0; j < btns.length; j++) {
        btns[j].classList.remove("btnSelected");
    }

    targetPage.style.display = "block";
    if (btn) {
        btn.classList.add("btnSelected")
    }
    hideMainMenu()
    if (page == "tewtMapPage") {
        mapSpace();
    }
}



function showMainMenu() {
    let menu = document.getElementById("mainMenu");
    let icon = document.getElementById("main-icon");
    menu.classList.add("openMenu");
    menu.classList.remove("closedMenu");
    icon.classList.add("change");
}


function hideMainMenu() {
    let menu = document.getElementById("mainMenu");
    let icon = document.getElementById("main-icon");
    menu.classList.remove("openMenu");
    menu.classList.add("closedMenu")
    icon.classList.remove("change");
}


function toggleMainMenu() {
    let menu = document.getElementById("mainMenu");
    if (menu.classList.contains("openMenu")) {
        hideMainMenu();
    } else {
        showMainMenu();
    }
}


let adminPage = async () => {
    window.location.href = `./admin.html?id=${accessId}`;
}


//map object with entity manipulation
let map = Map("cesiumMap", "map-position");


//creates map entities object
let mapEntities = MapEntities(map);


//Creates the list of options for location and entities <select> boxes
createViewSelector();
//createEntitySelector();


window.onload = refreshWindow();


/* window.onbeforeunload = confirmExit;
function confirmExit() {
    return "Some task is in progress. Are you sure, you want to close?";
} */