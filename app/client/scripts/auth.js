let clientString = "jdfuihsedui87456jdjh";
let current = {tewt: null, qde: 0, id: 1} //stores all the current information about tewts, user and qde

//xhr function with url input and isValid and data output
function xhrRequest(url, type, body, header) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
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
            if(!header){
                xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            }
            xhr.send(body)
        } else {
            xhr.send();
        }
    })
}

//global user object
//used when window is refreshed to check against server
function loadUserStorage() {
    let user = {}
    try {
        //user = JSON.parse(localStorage['user']);
        user = JSON.parse(sessionStorage['user']);
    } catch (error) {}
    return user;
}

//removes all user data from storage, then loads storage values into user
function removeUser() {
    //config = {};
    sessionStorage['user'] = "";
    //localStorage["user"] = ""
    user = {};
}

//saves the user object to storage
function saveUserToStorage(user) {

    //uncomment for localstorage
    localStorage['user'] = JSON.stringify(user)
    localStorage["client"] = clientString;
    user = { fname: user.fname, lname: user.lname };

    //uncomment for session storage
    /* sessionStorage['user'] = JSON.stringify(user)
    sessionStorage["client"] = clientString;
    user = { fname: user.fname, lname: user.lname }; */
}

function saveUser(u) {
    user = u;
    saveUserToStorage(user)
}


//creates a user object from the localStorage data
let user = loadUserStorage();


//append to every http request for user validation
let authReqString = () => {
    return `authKey=${user.authKey}&uname=${user.uname}`;
}


current.tewt = null; //this is the tewt object that will be displayed on the tewt page
current.qde = 0; //this is a value to use in the current.tewt.qdes array
let tewtsList = null
let config = {}


//checks if user is admin and displays all .admin class elements
function adminLoginCheck() {
    let adminElements = document.querySelectorAll(".admin");
    let adminDisplay = user.level == "admin" ? "" : "none";
    [...adminElements].forEach(ele=>{
        ele.style.display = adminDisplay;
    })
}

function clearInputs() {
    let userName = document.getElementById("createUsername");
    let password = document.getElementById("createPassword");
    let firstName = document.getElementById("createFirstname");
    let lastName = document.getElementById("createLastname");
    let createUsername = document.getElementById("loginUsername");
    let createPassword = document.getElementById("loginPassword");
    userName.value = "";
    password.value = "";
    firstName.value = "";
    lastName.value = "";
    createUsername.value = "";
    createPassword.value = "";
}


async function createUser() {
    let userName = document.getElementById("createUsername");
    let password = document.getElementById("createPassword");
    let firstName = document.getElementById("createFirstname");
    let lastName = document.getElementById("createLastname");
    if (userName.value == "" || password.value == "" || firstName.value == "" || lastName.value == "") {
        Swal.fire({
            title: "Create User - Error",
            text: "Please fill in all your details"});
        return;
    }
    let url = `${serverIp}/user/create`;
    let cred = `uname=${userName.value}&password=${password.value}&fname=${firstName.value}&lname=${lastName.value}`
    let reply = await xhrRequest(url, "POST", cred);
    console.log(reply)
    if (!reply.body.error) {
        await saveUser(reply.body.data);
        await getConfig()
        await getAllTewts()
        await checkUser()
        editDom()
        setPage("mainPage");
        Swal.fire({
            title: "Welcome New User",
            text: `${user.fname.toUpperCase()} ${user.lname.toUpperCase()}`
        })
        clearInputs()
    } else {
        systemMsg("reply.body.msg")
        Swal.fire({
            title: "Create User - Error",
            text: reply.body.msg})
    }
}


async function login(level) {
    let userName = document.getElementById("loginUsername");
    let password = document.getElementById("loginPassword");
    let url = `${serverIp}/api/login`;
    let cred = `uname=${userName.value}&password=${password.value}&level=${level}`
    let reply = await xhrRequest(url, "POST", cred);
    if (!reply.body.error) {
        user = reply.body.data
        await saveUser(reply.body.data);
        await getConfig()
        await getAllTewts()
        await checkUser()
        if(level == "admin"){
            await getAllResults();
        }
        editDom()
        setPage("mainPage");
        adminLoginCheck();
        Swal.fire({
            title: "Welcome Back",
            text: `${user.fname.toUpperCase()} ${user.lname.toUpperCase()}`
        })
        clearInputs()
    } else {
        systemMsg("Username or password incorrect");
        let text = reply.body.msg ? reply.body.msg : "Username or password incorrect";
        Swal.fire({
            title: "Login Error",
            text
        })
    }
}


function logout() {
    removeUser();
    setPage("loginPage");
    editDom();
    closeMenu("loginPopup");
}


async function checkUserValid() {
    let url = `${serverIp}/api/user?${authReqString()}`;
    let cred = `uname=${user.uname}&authKey=${user.authKey}`
    return await xhrRequest(url, "POST", cred)
}


if (!user.authKey || !user.uname) {
    removeUser();
}

