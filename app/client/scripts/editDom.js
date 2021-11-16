//let tewtFireplan; //fireplan object for creating, interacting and getting data from fireplan table
let tewtReport;

function updateMenus() {
    let footer = document.getElementById("footer");
    let userDetails = document.getElementById("userdetails");
    let mainTitle = document.getElementById("maintitle");

    mainTitle.innerHTML = config.name ? config.name : "TEWT";
    userDetails.innerHTML = user.uname ? `Logged In: <span onclick="showMenu('loginPopup')" id="userButton">${user.fname.toUpperCase()}</span>` : 'Logged Out';
}


function createReportPage(report) {
    let reportForm = document.getElementById("reportForm");
    let fpContainer = document.getElementById("fireplan");
    let reportMenuBtn = document.getElementById("reportMenuBtn");
    switch (report.type) {
        case "fireplan":
            reportForm.style.display = "none";
            fpContainer.style.display = "block";
            //tewtFireplan = FirePlan()
            FirePlan.create("fireplan");
            reportMenuBtn.innerHTML = "FIRE PLAN";
            break;
        case "questions":
            reportForm.style.display = "block";
            fpContainer.style.display = "none";
            reportMenuBtn.innerHTML = "REPORT";
            Report.create("reportForm", current.tewt.qdes[current.qde].report.data);
            /* let reportText = '';
            current.tewt.qdes[current.qde].report.data.forEach(question => {
                reportText += `<h4>${question}</h4>`;
                reportText += `<textarea cols="30" rows="5" name="${question}"></textarea><br>`;
            })
            reportText += `<input type="submit" value="SUBMIT QDE" class="hightlight" onclick='submitQde()'>`;
            reportForm.innerHTML = reportText; */
            break;
    }
}


//gives user uavPage if the tewt has one
function uavPage(uavUrl) {
    //let uavPage = document.getElementById("tewtUavPage");
    let uavVideo = document.getElementById("uavVideo");
    let uavMenuLi = document.getElementById("uavMenuOption");
    if (!uavUrl) {
        uavMenuLi.style.display = "none";
        return;
    }
    uavMenuLi.style.display = "list-item";
    if(uavUrl.includes("http")){
        uavVideo.src = `${uavUrl}`
    } else {
        uavVideo.src = `${serverIp}/${uavUrl}`;
    }
    
}


//Adds debrief to app menu if available in the current qde
function updateDebrief(qde) {
    let debriefMenu = document.getElementById("debriefMenuOption");
    if (!qde.debriefEnabled) { debriefMenu.style.display = "none"; return }
    debriefMenu.style.display = "list-item";
}


function createOrdersPage(orders) {
    let ordersPage = document.getElementById("tewtOrdersPage");
    let ordersMenuBtn = document.getElementById("infoMenuOption");
    let ordersPageTitle = document.getElementById("tewtOrdersPage").getElementsByTagName("h2")[0];
    if (orders.name) {
        ordersMenuBtn.innerHTML = orders.name;
        ordersPageTitle.innerHTML = orders.name;
    } else {
        ordersMenuBtn.innerHTML = "ORDERS";
        ordersPageTitle.innerHTML = "ORDERS";
    }

    let htmlData = "";
    switch (orders.type) {
        //if tewt has img urls in orders object
        case "images":
            for (img of orders.images) {
                if (!img) {
                    htmlData += "<br><br><br>";
                    continue;
                }
                htmlData += `<img style="width: 100%;" src="${serverIp}/${img}"/>`
            }
            break;
        case "pdf":

            break
        case "text":
        default:
            htmlData = "<p>"
            htmlData += orders.text.join("<br>");
            htmlData += "</p>"
            break;
    }

    ordersPage.querySelector(".content").innerHTML = htmlData;

}

function updateTewt() {
    if (current.tewt != null) {
        let introPage = document.getElementById("tewtIntroPage");
        let introVideo = document.getElementById("tewtIntroVideo");
        if (current.tewt.qdes[current.qde].status == "intro" && current.tewt.qdes[current.qde].orders.videoUrl) {
            introVideo.src = `${serverIp}/${current.tewt.qdes[current.qde].orders.videoUrl}`;
            changeTewtPage("tewtIntroPage")
        } else {
            changeTewtPage("tewtOrdersPage");
            current.tewt.qdes[current.qde].status = "progress"
        }
        let pageTitle = document.getElementById("pagetitle");
        let ordersPage = document.getElementById("tewtOrdersPage");

        pageTitle.innerHTML = current.tewt.qdes[current.qde].name;

        //sets the uav video
        uavPage(current.tewt.qdes[current.qde].uavVideoUrl)

        //orders
        createOrdersPage(current.tewt.qdes[current.qde].orders);

        //debrief
        updateDebrief(current.tewt.qdes[current.qde])
        //report
        createReportPage(current.tewt.qdes[current.qde].report)

        //map add scenario entities to map
        map.setCameraPos(current.tewt.qdes[current.qde].map.camera);
        let { lat, lon, height } = current.tewt.qdes[current.qde].map.camera
        map.setCameraView({ lat, lon, height })
        map.setCoord({ lat, lon, precision: 5 }, map.PROJ.LATLON);
        //map.addMapImg(current.tewt.qdes[current.qde].map.img.url, current.tewt.qdes[current.qde].map.img.pos)
        map.addMapImages(current.tewt.qdes[current.qde].map.img)
        mapEntities.removeEntities();
        if (current.entities) {
            mapEntities.addLayers(current.entities);
        } else {
            mapEntities.addLayers(current.tewt.qdes[current.qde].map.layers, "system");
        }
        mapEntities.startInterval();

        /* current.tewt.qdes[current.qde].map.baseLayer.entities.forEach(entity => {
            mapEntities.addEntity(entity, "qde")
        }) */
    }
}

function updateMainPage() {
    let page = document.getElementById("mainPage");
    let content = page.querySelector(".content");
    let contentText = "";
    tewtsList.forEach(tewt => {
        if (tewt.enabled) {
            contentText += `<span onclick='startTewt("${tewt.name}","${tewt.id}")' class="tewtBtns"><p>${tewt.name}</p></span>`
        }
    })
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
            pageTitle = "LOGIN";
            break;
        case "mainPage":
            pageTitle = "MAIN MENU";
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


function followMenu(show, title, data,) {
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


function showMenu(menu) {
    document.getElementById(menu).style.display = "block";
}

function closeMenu(menu) {
    document.getElementById(menu).style.display = "none";
}