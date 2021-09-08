/* This file is for connecting the client to a server when the index
    file is not being served from a web server
    i.e inside an android webview app
    */
let savedServers = {}

/**
 * XHR function with url input and isValid and data output
 * @param {String} url  url  for http request
 * @param {String <GET/POST>} type  GET or POST request
 * @param {POST Body} body Body for POST request to send
 */
function xhrRequest(url, type, body) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log(url)
                resolve({ error: false, body: JSON.parse(xhr.response) });
            } else if (xhr.readyState === 4 && xhr.status !== 200) {
                resolve({ error: true, body: JSON.parse(xhr.response) });
            }
        }
        xhr.timeout = 3000;
        xhr.ontimeout = () => {
            resolve({ error: true, body: "Error Connecting to server" });
        }
        xhr.onerror = function () {
            resolve({ error: true, body: "Error Connecting to server" });
        }
        xhr.open(type, url, true);
        if (type == "POST") {
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.send(body)
        } else {
            xhr.send();
        }
    })
}

function saveServersToStorage() {
    localStorage.savedServers = JSON.stringify(savedServers);
}

function loadPreviousServers() {
    savedServers = localStorage["savedServers"] ? JSON.parse(localStorage["savedServers"]) : {};
    localStorage.savedServers = JSON.stringify(savedServers);
}

function removeSavedServer(id) {
    if (!savedServers[id]) return;
    savedServers[id] = {};
    delete savedServers[id];
    saveServersToStorage()
    displayPreviousServers();
}

function displayPreviousServers() {
    let container = document.getElementById("serverlist");

    let text = "";
    for (server in savedServers) {
        let { version, deviceName, platform } = savedServers[server];
        text += `<div class="servers">`
        text += `<div class="server_header" style="position: relative; height: 15px; width: 100%; "><span class="closeButton" onclick="removeSavedServer('${server}')">x</span></div>`
        text += `<div class="tewtBtns" onclick="connectToServer('${server}')">${server}${deviceName ? "<Br>" + deviceName : ""}<br>V:${version ? version : "unknown"}<br>Connect`
        text += `</div></div>`;
    }
    container.innerHTML = text;

    //event listener for close buttons
    let closeBtns = document.getElementsByClassName("closeButton");
    [...closeBtns].forEach(closeBtn => {
        closeBtn.addEventListener("click", (evt) => {
            evt.preventDefault();
        })
    })
}

/**
 *  Saves the server object to the savedServer object and localStorage
 * @param {Object} server Object with name, version, deviceName, 
 * @param {String} address  Address of server
 */
function saveServer(server, address) {
    savedServers[address] = server;
    saveServersToStorage()
}

function loadCurrentServer() {

}


/**
 * Checks if server is valid and connects if it is
 * @param {String} addr  address of server
 */
async function connectToServer(addr) {
    let address = addr ? addr : document.getElementById("serverip").value;
    let url = `https://${address}:7010/api/getinfo`
    let { body, error } = await xhrRequest(url, "GET", null);
    if (error || body.type != "tewtserver") {
        document.getElementById("status").innerHTML = "Error connecting to Server";
        return
    }
    saveServer(body, address);
    localStorage["serverIp"] = `https://${address}:7010`;
    localStorage["deviceType"] = "client";
    localStorage["user"] = "";
    window.location.href = `./index.html?ip=https://${address}:7010`;
}

//runs on page load
function loadPage() {
    loadPreviousServers();
    displayPreviousServers();
}

window.onload = loadPage();