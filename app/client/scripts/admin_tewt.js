let resultsList = null;

async function getTewt() {
    let url = `${serverIp}/api/tewt?${authReqString()}`
    let tewt = await xhrRequest(url, "GET", "");
    currentTewt = tewt.body.data;
    return currentTewt;
}


async function getAllTewts() {
    let url = `${serverIp}/api/tewt?task=list&${authReqString()}`
    let tewts = await xhrRequest(url, "GET", "");
    if (!tewts.body.error) {
        tewtsList = tewts.body.data;
    }
    return tewts;
}

async function getAllResults() {
    let url = `${serverIp}/api/tewt?task=resultslist&${authReqString()}`
    let results = await xhrRequest(url, "GET", "");
    console.log(results)
    if (!results.body.error) {
        resultsList = results.body.data;
    }
    return results;
}

function setProj() {
    let proj = document.getElementById("proj-type");
    map.setProj(proj.value)
}

async function showTewtResults(name, id) {
    let url = `${serverIp}/api/tewt?task=getresultsbyid&name=${name}&id=${id}&${authReqString()}`
    let tewtUrl = `${serverIp}/api/tewt?task=getbyid&name=${name}&id=${id}&${authReqString()}`
    let { error, body } = await xhrRequest(url, "GET", "");
    let reply = await xhrRequest(tewtUrl, "GET", "");
    if (!error && !body.error && !reply.error && !reply.body.error) {
        console.log(reply.body.data);
        current.tewt = reply.body.data;
        await editMarkingPage(body.data);
        changeMainPage("markingPage", document.getElementById("mainMenu").querySelectorAll("li")[0]);
    } else {
        Swal.fire(body.msg)
    }
    return;
}


/* function openMap(uname, tewtId, attempt, qde) {
    let lat, lon, height;
    mapEntities.removeEntities();
    map.addMapImages(current.tewt.qdes[qde].map.img)
    let entities;
    for (i = 0; i < resultsList.length; i++) {
        if (resultsList[i].id == tewtId) {
            entities = resultsList[i].users[uname].submissions[attempt].results[qde].entities;
            let camera = resultsList[i].users[uname].submissions[attempt].results[qde].camera
            lat = camera.lat;
            lon = camera.lon;
            height = camera.height;
            map.setCameraView({ lat, lon, height })
        }
    }
    entities.forEach(entity => {
        mapEntities.addEntity(entity, "qde")
    })
    document.getElementById("map-popup").style.display = "block";
} */

function openMap(uname, tewtId, attempt, qde) {
    mapEntities.removeEntities();
    map.addMapImages(current.tewt.qdes[qde].map.img)
    for (i = 0; i < resultsList.length; i++) {
        if (resultsList[i].id == tewtId) {
            let camera = resultsList[i].users[uname].submissions[attempt].results[qde].camera
            map.setCameraView(camera)
            mapEntities.addLayers(resultsList[i].users[uname].submissions[attempt].results[qde].layers)
        }
    }
    document.getElementById("map-popup").style.display = "block";
}

async function openReport(uname, tewtId, attempt, qde) {
    for (i = 0; i < resultsList.length; i++) {
        if (resultsList[i].id == tewtId) {
            let report = resultsList[i].users[uname].submissions[attempt].results[qde].report;
            createReport(report);
            document.getElementById("report-popup").style.display = "block";
        }
    }
}

async function openFireplan(uname, tewtId, attempt, qde) {
    for (i = 0; i < resultsList.length; i++) {
        if (resultsList[i].id == tewtId) {
            let fp = resultsList[i].users[uname].submissions[attempt].results[qde].fireplan;
            createFireplan(fp);
            document.getElementById("fp-popup").style.display = "block";
            return
        }
    }
}

async function saveScore(name, uname, tewtId, attempt, qde) {
    console.log(`${uname}-${attempt}-${qde}-comment`)
    let comment = document.getElementById(`${uname}-${attempt}-${qde}-comment`).value;
    let score = document.getElementById(`${uname}-${attempt}-${qde}-score`).value;

    let url = `${serverIp}/api/tewt`;
    let body = `task=mark&id=${tewtId}&data=${JSON.stringify({ uname, qdeno: qde, sub: attempt, comment, score })}&${authReqString()}`
    let reply = await xhrRequest(url, "POST", body);
    await getAllResults();
    //showTewtResults(name, tewtId);
    console.log(reply)
    Swal.fire(reply.body.msg)
}

async function deleteResult(uname, tewtId, attempt) {
    let result = await Swal.fire({
        title: `Delete Result`,
        text: `Are you sure you want to delete this result?`,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'DELETE'
    })
    if ("dismiss" in result) return;
    let url = `${serverIp}/api/tewt`;
    let body = `task=delete&id=${tewtId}&data=${JSON.stringify({ uname, sub: attempt })}&${authReqString()}`
    let reply = await xhrRequest(url, "POST", body);
    await getAllResults();
    //showTewtResults(name, tewtId);
    Swal.fire(reply.body.msg)
    reply.body.data.forEach(tewt => {
        if (tewt.id == tewtId) {
            editMarkingPage(tewt)
            return;
        }
    })

    return;

}


function stopDebrief(){
    document.getElementById("debrief_video").pause();
}