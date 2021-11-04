//gets the access id used when opening page
const queryString = window.location.search;
const parameters = new URLSearchParams(queryString);
const accessId = parameters.get('id');
console.log(accessId)


let displayResults = (event) => {

}

function mobileViews(display) {
    let elems = document.querySelectorAll(".local-file");
    elems.forEach(elem => {
        elem.style.display = display;
    })
}

let refreshPage = () => {

}

//import Swal from "sweetalert2";

//const e = require("express");

//handle loading of page
document.addEventListener("DOMContentLoaded", () => { loadingPage("none") }, false);


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
    updateUsersList();
}

async function serverCheck() {
    //check if there is an "ip" param in the url
    let params = new URLSearchParams(document.location.search);
    let ip = params.get("ip");

    serverIp = localStorage["serverIp"] ? localStorage["serverIp"] : "unavailable";
    localStorage["serverIp"] = serverIp;

    if (document.location.protocol != "file:") {
        if (localStorage["deviceType"] != "mobile") {
            serverIp = "";
            localStorage["serverIp"] = serverIp;
            mobileViews("none");
            return;
        }
    }

    mobileViews("");
    if (ip) {
        serverIp = ip;
        localStorage["serverIp"] = serverIp;
    } else if (serverIp == "unavailable") {
        window.location.href = `./serverConnect.html`;
    }
    let url = `${serverIp}/api/getinfo`
    let result = await xhrRequest(url, "GET", null);
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

async function changeUserLevel(uname, selectEle){
    let check = await confirmPrompt("Change User Level", `Changing "${uname}" user level to "${selectEle.value}""`, "Change Level?");
    if(!check){
        updateUsersList();
        return;
    }
    let url = `${serverIp}/api/user`;
    let cred = `task=update&attribute=level&value=${selectEle.value}&unameupdate=${uname}&uname=${user.uname}&authKey=${user.authKey}`
    await xhrRequest(url, "POST", cred)
    updateUsersList();
}

async function resetPassword(uname){
    let check = await userEditPrompt();
    if (!check) return;
    let url = `${serverIp}/api/user`;
    let cred = `task=resetpassword&unameupdate=${uname}&uname=${user.uname}&authKey=${user.authKey}`
    await xhrRequest(url, "POST", cred)
    updateUsersList();
    return 
}

async function userEditPrompt() {
    let result = await Swal.fire({
        title: 'Are you sure?',
        //icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Reset It'
    })
    if (result.value) {
        return true;
    }
    return false;
}

let refreshWindow = async () => {
    await serverCheck();
    let userError = await checkUser();
    if (!userError) {
        await getConfig()
        //await getAllTewts()
        await getAllResults();
        adminLoginCheck();
        editDom()
        setPage("mainPage");
    } else {
        removeUser();
        setPage("loginPage")
    }
}



function changeMainPage(page, btn) {
    let pages = document.querySelectorAll(".pages");
    let targetPage = document.getElementById(page);
    let btns = document.getElementById("mainMenu").querySelectorAll("li");
    if (user.level != "admin") return

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

let closeWindow = (id) => {
    document.getElementById(id).style.display = "none";
    stopDebrief();
}

let openWindow = (id) => {
    document.getElementById(id).style.display = "block";
}


let userPage = async () => {
    window.location.href = `/?id=${accessId}`;
}

let adminPage = async () => {
    window.location.href = `./admin.html`;
}


//map object with entity manipulation
let map = Map("cesiumMap", "map-position");

//creates map entities object
let mapEntities = MapEntities(map);

//Creates the list of options for location and entities <select> boxes
createViewSelector();
//createEntitySelector();

window.onload = refreshWindow();
