let results = [];


async function getTewt() {
    let url = `${serverIp}/api/tewt?${authReqString()}`
    let tewt = await xhrRequest(url, "GET", "");
    current.tewt = tewt.body.data;
    return current.tewt;
}


async function getAllTewts() {
    let url = `${serverIp}/api/tewt?task=list&${authReqString()}`
    let tewts = await xhrRequest(url, "GET", "");
    if (!tewts.body.error) {
        tewtsList = tewts.body.data;
    }
    return tewts;
}


function changeTewtPage(page, btn) {
    let videos = document.getElementsByTagName("video");
   [...videos].forEach(vid=>vid.pause());

    let pages = document.querySelectorAll(".tewtPage");
    let targetPage = document.getElementById(page);
    let btns = document.getElementById("tewtMenu").querySelectorAll("li");

    //hide all pages
    for (i = 0; i < pages.length; i++) {
        pages[i].style.display = "none";
    }
    //set all menu buttons to normal color
    for (j = 0; j < btns.length; j++) {
        btns[j].classList.remove("btnSelected");
    }

    targetPage.style.display = "block";
    if (btn) {btn.classList.add("btnSelected")}
    if(page == "tewtDebriefPage"){
        //startCameraVideo();
        checkDebrief()
    } else {
        stopCameraVideo();
    }
    hideTewtMenu()
    if (page == "tewtMapPage") {
        mapSpace();
    }
}


function showTewtMenu() {
    if (current.tewt.qdes[current.qde].status == "intro") {
        return
    }
    let menu = document.getElementById("tewtMenu");
    let menuBtn = document.getElementById("textMenuButton");
    let icon = document.getElementById("tewt-icon");

    menu.classList.add("openMenu");
    menu.classList.remove("closedMenu")
    icon.classList.add("change");

}

function hideTewtMenu() {
    let menu = document.getElementById("tewtMenu");
    let menuBtn = document.getElementById("textMenuButton");
    let icon = document.getElementById("tewt-icon");

    menu.classList.remove("openMenu");
    menu.classList.add("closedMenu")
    icon.classList.remove("change");
}

function toggleTewtMenu() {
    let menu = document.getElementById("tewtMenu");
    let menuBtn = document.getElementById("textMenuButton");
    let icon = document.getElementById("tewt-icon");

    if (menu.classList.contains("openMenu")) {
        hideTewtMenu();
    } else {
        showTewtMenu();
    }
}


async function startTewt(name, id) {
    let url = `${serverIp}/api/tewt?task=getbyid&name=${name}&id=${id}&${authReqString()}`
    let { error, body } = await xhrRequest(url, "GET", "");
    let submission = {}
    if (!error && !body.error) {
        current.tewt = body.data;
        current.tewt.startTime = new Date().getTime();
        current.tewt.results = [];
        current.qde = 0;
        current.tewt.qdes[current.qde].status = "intro";
        saveTewt(current)
        updateTewt()
        //changeTewtPage("tewtIntroPage");
        setPage("tewtPage");
        mapSpace();
    } else {
        Swal.fire(body.msg)
        if(body.msg == "User Invalid"){
            logout();
        }
    }
    return submission
}

function saveTewtOld(cur) {
    localStorage['current'] = JSON.stringify(current);
    localStorage['qdeStatus'] = current.tewt.qdes[current.qde].status;
}

async function saveTewt(){
    let req = await storage.addData('current', current)
    if(req.error){
        console.log("Failed to save to indexed");
    }
}


function loadTewtOld() {
    if (localStorage["current"]) {
        try {
            let loaded = JSON.parse(localStorage["current"]);
            if(loaded.tewt != null) current = loaded;
        } catch (error) {
            clearTewt()
        }
    }
}

async function loadTewt(){
    let req = await storage.getData('current', 1);
    if(!req.error && req.data) {
        current = req.data;
        return;
    };
    clearTewt();
}


function clearTewtOld() {
    current.tewt = null;
    current.qde = 0;
    current.entities = null;
    if(Report.status()){
        Report.remove();
    } else {
        FirePlan.remove();
    }
    saveTewt();
}

function clearTewt(){
    mapEntities.stopInterval();
    current.tewt = null;
    current.entities = null
    current.qde = 0;
    
    if(Report.status()){
        Report.remove();
    } else {
        FirePlan.remove();
    }
    storage.addData('current', current);
}


function exitTewt() {
    Swal.fire({
        title: 'EXIT TEWT',
        text: "This will end the exercise, and lose all data. Do you want to continue?",
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#666666',
        confirmButtonText: 'EXIT',
    }).then((result) => {
        if (result.value) {
            setPage("mainPage");
            changeTewtPage("tewtOrdersPage")
            clearTewt()
            mapEntities.removeEntities("qde");
        }
    })
}

function finishedTewt() {
    Swal.fire({
        title: 'TEWT',
        text: "Completed: "+current.tewt.name,
    })
    setPage("mainPage");
    changeTewtPage("tewtOrdersPage")
    clearTewt();
    mapEntities.removeEntities("qde");
}


async function submitQde() {
    current.tewt.results.push(submission());
    if (current.qde >= current.tewt.qdes.length - 1) {
        let reply = await submitTewt()
        finishedTewt();
        return
    }
    Swal.fire({
        title: 'TEWT',
        text: "Complete the next scenario",
    }).then(_ => {
        current.entities = null
        current.qde++;
        saveTewt(current.tewt, current.qde);
        current.tewt.qdes[current.qde].status = "progress";
        if (current.tewt.qdes[current.qde].orders.videoUrl != false) {
            current.tewt.qdes[current.qde].status = "intro";
        }
        updateTewt()
        return
    })
}

function mapMenuPosition(pos) {
    let mapMenus = document.querySelectorAll(".mapMenus")
    let linePopup = document.getElementById("lineFinishPopup");
    let toAdd, toRemove
    if (pos == "side") {
        toAdd = "menuVertical"
        toRemove = "menuHorizontal"
        linePopup.classList.add("popupBottom")
        linePopup.classList.remove("popupTop")
    } else {
        toAdd = "menuHorizontal"
        toRemove = "menuVertical"
        linePopup.classList.add("popupTop")
        linePopup.classList.remove("popupBottom")
    }

    for (i = 0; i < mapMenus.length; i++) {
        mapMenus[i].classList.add(toAdd)
        mapMenus[i].classList.remove(toRemove)
    }
}


function mapSpace() {
    let bOrientation = (screen.orientation || {}).type || screen.mozOrientation || screen.msOrientation
    let pos = bOrientation == "landscape-primary" ? "side" : "top";
    //let pos = screen.orientation.type == "landscape-primary" ? "side" : "top";
    mapMenuPosition(pos)
}

let introVideo = document.getElementById("tewtIntroVideo");
introVideo.onended = () => {
    current.tewt.qdes[current.qde].status = "progress";
    saveTewt(current.tewt, current.qde);
    console.log(current.tewt.qdes[current.qde].status)
    document.getElementById("tewtMenu").style.display = "block";
    changeTewtPage("tewtOrdersPage");
}


function setProj() {
    let proj = document.getElementById("proj-type");
    map.setProj(proj.value)
}

//displays display string in footer element
function displayCoords(display) {
    document.getElementById("map-position").innerHTML = display;
}

function submission(){
    let submission = {};
    let qde = current.tewt.qdes[current.qde];
    submission.qdeName = qde.name;
    submission.camera = qde.map.camera;
    console.log(mapEntities.exportAll())
    submission.layers = mapEntities.exportAll();
    submission.fireplan = FirePlan.status() ?  FirePlan.getData() :  null;
    submission.report = Report.status() ? Report.get() : null;
    submission.marks = {comment: "", score: 0};
    if(qde.debrief && qde.debrief.name) {
        submission.debrief = qde.debrief.name;
    } else {
        submission.debrief = null;
    }
    //submission.debrief = qde.debrief?.name ? qde.debrief.name : null;
    return submission;
}

async function sendBlobs(qdeArray){
    let prom = [];
    for await (qde of qdeArray){
        if(qde.debrief){
            let form = new FormData();
            form.append('video', qde.debrief.blob, qde.debrief.name)
            console.log(qde.debrief)
            form.append('uname', user.uname);
            form.append('authKey', user.authKey);
            let xhr = await xhrRequest(`${serverIp}/api/file`, "POST", form, 'none');
            prom.push(xhr);
        }
    }
    let results = await Promise.all(prom);
    return results;
}


let submitTewt = async ()=>{
    let submission = {startTime: current.tewt.startTime, endTime: new Date().getTime(), results: current.tewt.results}
    let url = `${serverIp}/api/tewt`;
    let reply = await xhrRequest(url, "POST", `task=submit&name=${current.tewt.name}&id=${current.tewt.id}&data=${encodeURIComponent(JSON.stringify(submission))}&${authReqString()}`);
    let replyTwo = await sendBlobs(current.tewt.qdes);
    return reply;
}


window.onresize = function () {
    let bOrientation = (screen.orientation || {}).type || screen.mozOrientation || screen.msOrientation
    let orientation = bOrientation == "landscape-primary" ? "side" : "top";
    //let orientation = screen.orientation.type == "landscape-primary" ? "side" : "top";
    mapMenuPosition(orientation)
    mapSpace();
};