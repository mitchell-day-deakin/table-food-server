//let tewtFireplan; //fireplan object for creating, interacting and getting data from fireplan table
let tewtReport;


function timeLabel(time) {
    time = Math.round(time / 1000);
    let hour = Math.floor(time / 3600);
    hour = hour < 10 ? `0${hour}` : hour;
    //let min = time >= 3600 ? Math.floor(time / 60) - 60 : Math.floor(time / 60);
    let min = Math.floor((time % 3600)/60)
    min = min < 10 ? `0${min}` : min;
    let sec = time % 60;
    sec = sec < 10 ? `0${sec}` : sec;
    return `${hour}:${min}:${sec}`;
}

function updateMenus() {
    let footer = document.getElementById("footer");
    let userDetails = document.getElementById("userdetails");
    let mainTitle = document.getElementById("maintitle");

    mainTitle.innerHTML = config.name ? config.name : "TEWT";
    userDetails.innerHTML = user.uname ? `Logged In: <span onclick="showMenu('loginPopup')" id="userButton">${user.fname.toUpperCase()}</span>` : 'Logged Out';
}

async function updateUsersList(){
    let reply = await getUserList();
    if(reply.error) return;
    let cont = document.getElementById("admin-user-list");
    let text = `<table id='user-table'><tr><th style="background-color: #999">USER NAME</th><th>NAME</th><th style="background-color: #999">LEVEL</th><th>PASSWORD</th></tr>`;
    for(const user of reply.body.data){
        let opt1 = "";
        let opt2 = "selected";
        let resetOpt1 = "";
        let resetButString = "RESET";
        text+= `<tr><td style="background-color: #999">${user.uname}</td><td>${user.fname+' '+user.lname}</td>`
        if(user.level == "admin") { opt1 = "selected"; opt2 = " "; }
        if(user.uname == "admin"){
            text+=`<td style="background-color: #999"><p>admin</p></td>`
        } else {
            text+=`<td style="background-color: #999"><select onchange="changeUserLevel('${user.uname}', this)" name="user-level" id="user-level-select"><option ${opt1} value="admin">admin</option><option ${opt2} value="user">user</option></select></td>`

        }
        if(user.passwordResetRequested) {resetButString = "REQUESTED" }
        text+=`<td><button style="height: 30px; witdth: fit-content" class="tewtBtns" onclick="resetPassword('${user.uname}')">${resetButString}</button></td></tr>`;
    }
    cont.innerHTML = text;
}


function updateTewt() {
    if (current.tewt != null) {
        console.log("Update Tewt")
        let introPage = document.getElementById("tewtIntroPage");
        let introVideo = document.getElementById("tewtIntroVideo");

        if (current.tewt.qdes[current.qde].status == "intro" && current.tewt.qdes[current.qde].orders.videoUrl) {
            introVideo.src = current.tewt.qdes[current.qde].orders.videoUrl;
            changeTewtPage("tewtIntroPage")
        } else {
            changeTewtPage("tewtOrdersPage");
        }
        let pageTitle = document.getElementById("pagetitle");
        let ordersPage = document.getElementById("tewtOrdersPage");
        let uavPage = document.getElementById("tewtUavPage");
        let uavVideo = document.getElementById("uavVideo");
        let mapPage = document.getElementById("tewtMepPage");
        let reportPage = document.getElementById("tewtReportPage");

        pageTitle.innerHTML = current.tewt.qdes[current.qde].name;
        uavVideo.src = `${current.tewt.qdes[current.qde].uavVideoUrl}`;


        //orders
        let ordersText = "<p>"
        ordersText += current.tewt.qdes[current.qde].orders.text.join("<br>");
        ordersText += "</p>"
        ordersPage.querySelector(".content").innerHTML = ordersText;


        //report
        createReportPage(current.tewt.qdes[current.qde].report)

        //map add scenario entities to map
        let { lat, lon, height } = current.tewt.qdes[current.qde].map.camera
        map.setCameraView({ lat, lon, height })
        map.setCoord({ lat, lon, precision: 5 }, map.PROJ.LATLON);
        map.addMapImg(current.tewt.qdes[current.qde].map.img.url, current.tewt.qdes[current.qde].map.img.pos)
        mapEntities.removeEntities("qde")
        /* current.tewt.qdes[current.qde].map.baseLayer.entities.forEach(entity => {
            mapEntities.addEntity(entity, "qde")
        }) */

        //debrief video
        
    }
}

let createFireplan = (fp) => {
    let div = document.getElementById("fp-popup").querySelector(".content");
    FirePlan.create(div, fp);
}

let createReport = (data) => {
    let div = document.getElementById("report-popup").querySelector(".content");
    let text = ""
    data.forEach(qAndA => {
        text += `<h4>${qAndA.q}</h4><br><p>${qAndA.a}</p><br>`
    })
    div.innerHTML = text;
    console.log(div)
}

let createSubmissionDiv = (qdeSub, user, i) => {
    console.log(user)
    let attemptTime = timeLabel((qdeSub.endTime - qdeSub.startTime))
    let attemptDiv = document.createElement("div");
    attemptDiv.classList.add("attempt-cont");
    let attemptTitle = document.createElement("div");
    attemptTitle.classList.add("attempt-title");
    attemptTitle.setAttribute("onclick", "showHide(this)");
    attemptDiv.appendChild(attemptTitle);
    attemptTitle.innerHTML = `${new Date(qdeSub.startTime).toISOString().split('T')[0]}, ` +
        `${new Date(qdeSub.startTime).toLocaleTimeString()}, ` +
        `Time Taken: ${attemptTime}` +
        `<span class="r-label attempt" onclick="deleteResult('${user}', '${current.tewt.id}','${i}')">${i + 1}</span>`;
    //attemptDiv.innerHTML += ""
    return attemptDiv;
}

let createResultDiv = () => {

}

let showSubmission = () => {

}

let hidSubmission = () => {

}

let toggleSubmission = () => {

}

function openVideo(url){
    let video = document.getElementById('debrief_video');
    document.getElementById('debrief-popup').style.display = "block"
    video.src = `${serverIp}/${url}`;
    video.currentTime = 9999999;
    video.onloadeddata = ()=>{
        video.play();
    }
    video.load();
}


let editMarkingPage = (data) => {
    console.log("marking page", data)
    let infoCont = document.getElementById("tewtResultsInfo");
    let resultsCont = document.getElementById("tewtResultsCont");
    let titleSpan = document.getElementById("markingPage").querySelector("h2");
    infoCont.innerHTML = "";
    resultsCont.innerHTML = "";
    titleSpan.innerHTML = `<li class="backBtn" onclick="changeMainPage('mainPage', document.getElementById('mainMenu').querySelectorAll('li')[0])"><img class="listImage" src="media/barrow.svg" alt=""></li> Marking:  ${data.name}`;

    let uResultsEle;
    for (key in data.users) {
        let user = data.users[key];
        let userTitle = document.createElement("h3");
        let userDiv = document.createElement("div");
        userDiv.classList.add("user-cont");
        userDiv.setAttribute("id", `${key}_results`);
        let userSubmissions = document.createElement("div");
        userDiv.appendChild(userTitle);
        userDiv.appendChild(userSubmissions);
        userTitle.innerHTML = `${user.fname} ${user.lname}<span class="r-label"><span onclick="showAll('${key}')" class="link">Show</span> / <span onclick='hideAll("${key}")' class="link">Hide</span></span>`
        userTitle.style.backgroundColor = "#111"
        resultsCont.appendChild(userDiv);
        for (i = (user.submissions.length - 1); i >= 0; i--) {
            let qdeSub = user.submissions[i]
            let attemptDiv = createSubmissionDiv(qdeSub, key, i)
            userSubmissions.appendChild(attemptDiv);
            let qdesDiv = document.createElement("div");
            qdesDiv.classList.add("qdes-closed");
            qdesDiv.classList.add("qdes-cont")
            attemptDiv.appendChild(qdesDiv);
            qdeSub.results.forEach((qde, j) => {
                let qdeDiv = document.createElement("div");
                qdeDiv.style.border = "1px solid black";
                qdesDiv.appendChild(qdeDiv);
                let qdeTitle = document.createElement("p");
                qdeTitle.innerHTML = qde.qdeName;
                qdeTitle.style.width = "140px";
                let mapBtnText = `<button onclick='openMap("${key}", "${data.id}", "${i}", "${j}")' class="resultsBtn">MAP</button>`;
                let fpBtnText = qde.fireplan
                    ? `<button onclick='openFireplan("${key}", "${data.id}", "${i}", "${j}")' class="resultsBtn">FIREPLAN</button>` : "";
                let reportBtnText = qde.report
                    ? `<button onclick='openReport("${key}", "${data.id}", "${i}", "${j}")' class="resultsBtn">REPORT</button>` : ""
                let videoBtnText = qde.debrief
                    ? `<button onclick="openVideo('${qde.debrief}')" class="resultsBtn">Debrief</button>` : "";
                
                let buttonCont = document.createElement('div');
                buttonCont.setAttribute("style", "width: 80px; display: inline-block; height: 100%;");
                buttonCont.innerHTML = mapBtnText + fpBtnText + videoBtnText + reportBtnText
                qdeDiv.appendChild(qdeTitle);
                //qdeDiv.innerHTML += mapBtnText;
                qdeDiv.appendChild(buttonCont);
                let comments = document.createElement("textarea");
                console.log("comment", qde.marks.comment)
                comments.innerHTML = qde.marks.comment;
                comments.setAttribute("id", `${key}-${i}-${j}-comment`)
                let input = `<input type="number" id="${key}-${i}-${j}-score" max="10" min="0" value="${qde.marks.score}"></input><span>/10  </span>&nbsp` +
                    `<button class="resultsBtn" onclick='saveScore("${data.name}","${key}", "${data.id}", "${i}", "${j}")'>SAVE</button>`;
                qdeDiv.appendChild(comments);
                qdeDiv.innerHTML += input;
            })
        }

    }
}

function updateMainPage() {
    let page = document.getElementById("mainPage");
    let content = page.querySelector(".content");
    let contentText = "";
    if (resultsList.length < 1) {
        contentText += "<h4>There is currently no submissions available</h4>"
    } else {
        resultsList.forEach(result => {
            contentText += `<span onclick='showTewtResults("${result.name}","${result.id}")' class="tewtBtns"><p>${result.name}</p></span>`
        })
    }
    content.innerHTML = contentText;
}


function setPage(page) {
    let pageTitle = "";
    let pages = document.querySelectorAll(".pages");
    let selectPage = document.getElementById(page);
    for (i = 0; i < pages.length; i++) {
        pages[i].style.display = "none";
    }
    switch (page) {
        case "loginPage":
            pageTitle = "LOGIN - admin";
            break;
        case "mainPage":
            pageTitle = "RESULTS";
            break;
        case "tewtPage":
            pageTitle = `${current.tewt.qdes[0].name}`;
            break;
        case "settingsPage":
            pageTitle = "SETTINGS";
            break;
    }
    hideMainMenu()
    document.getElementById("pagetitle").innerHTML = pageTitle;
    selectPage.style.display = "block";
}


function systemMsg(msg) {
    let infoBox = document.getElementById("serverinfo");
    infoBox.innerHTML = msg;
    setInterval(_ => {
        infoBox.innerHTML = "";
    }, 4000)
}


//used to change the login div from create to login and back
function userLoginBox(type) {
    let createDiv = document.getElementById("createUserDiv");
    let loginDiv = document.getElementById("loginUserDiv");
    let createTab = document.getElementById("createTab");
    let loginTab = document.getElementById("loginTab");
    if (type == "login") {
        loginDiv.style.display = "inline-block";
        createDiv.style.display = "none";
        createTab.style.backgroundColor = "#333333";
        loginTab.style.backgroundColor = "#21628d"
    } else {
        loginDiv.style.display = "none";
        createDiv.style.display = "inline-block";
        createTab.style.backgroundColor = "#21628d";
        loginTab.style.backgroundColor = "#333333"
    }

}


function followMenu(show, title, data, ) {
    let followMenu = document.getElementById("followMenu");
    let titleDiv = followMenu.querySelector("h4");
    let body = followMenu.querySelector("div");

    if (show) {
        titleDiv.innerHTML = title;
        body.innerHTML = data;
        followMenu.style.display = "block";
    } else {
        return
    }
}

let showAll = (uname)=>{
    let userDiv = document.getElementById(`${uname}_results`)
    let submissions = userDiv.querySelectorAll(".qdes-cont");
    [...submissions].forEach(sub=>{
        sub.classList.add("qdes-open");
        sub.classList.remove("qdes-closed");
    })
}

let hideAll = (uname)=>{
    console.log(`${uname}_results`)
    let userDiv = document.getElementById(`${uname}_results`)
    let submissions = userDiv.querySelectorAll(".qdes-cont");
    [...submissions].forEach(sub=>{
        sub.classList.add("qdes-closed");
        sub.classList.remove("qdes-open");
    })
}

let showHide=(ele)=>{
    let div = ele.nextSibling;
    if(div.classList.contains("qdes-closed")){
        div.classList.remove("qdes-closed");
        div.classList.add("qdes-open");
    } else {
        div.classList.remove("qdes-open");
        div.classList.add("qdes-closed");
    }
}


function showMenu(menu) {
    document.getElementById(menu).style.display = "block";
}

function closeMenu(menu) {
    document.getElementById(menu).style.display = "none";
}