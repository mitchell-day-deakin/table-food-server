const fs = require('fs');
const path = require("path");
const os = require("os");
const Crypto = require("./CryptoJS.js");
Crypto.phrase = "tewtPhrase";
const system = require("./system.js");
const logger = require(path.join(__dirname, "./logger.js"))
const usersUrl = path.join(__dirname, "../config/users.json");
//let usersUrl = "../data/config/users.json";
let users = [];
let tokenPeriod = 7; // days for token to remain valid

//this loads all users {fname, lname, uname, password, authToken, level};
//so other functions can compare, edit, remove, add
async function loadUsers() {
    let loaded = await system.readFile(usersUrl, false);
    if (!loaded.error) {
        users = loaded.data
        return;
    };
    let admin = createUser('admin', '', Crypto.AES.encrypt('admin@tewt', Crypto.phrase).toString(Crypto.enc.Utf8), 'admin', 'admin');
    users.push(admin);
    saveUsers();
}

loadUsers();

async function saveUsers() {
    let reply = await system.saveFile(usersUrl, users, false);
    return reply;
}


let encryptPassword = (password) => {
    let hash = Crypto.AES.encrypt(password, Crypto.phrase).toString();
    return { error: false, password: hash };
}

let checkPassword = async (password, encryptedPwrd) => {
    let decrypted = Crypto.AES.decrypt(encryptedPwrd, Crypto.phrase).toString(Crypto.enc.Utf8);
    let match = decrypted == password ? true : false;
    return match;
}

function createUser(fname, lname, password, level, uname) {
    let authKey = createAuthKey();
    reply = encryptPassword(password);
    return { fname, level, password: reply.password, lname, uname, authKey, issuedAt: new Date() }
}

//creates a random string authKey
function createAuthKey() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}


//FUNCTIONS THAT ARE EXPORTED
//@params [array of keys wanted from users]
async function getAllKeys(keys) {
    if (!users) { return { error: true, data: [] } };
    newUsers = users.map(u => {
        let user = {};
        keys.forEach(key => user[key] = u[key]);
        return user;
    });
    return { error: false, data: newUsers };
};


//pass in the user name, and an array of usernames
//check if username is already taken
async function checkUserName(uname) {
    uname = uname.toLowerCase();
    for (i = 0; i < users.length; i++) {
        if (users[i].uname == uname) return true;
    };
    return false;
}


//@params fname, lname, password, level, uname
//returns {error, msg, user}
async function create(fname, lname, password, level, userName) {
    let uname = userName.toLowerCase()
    let nameExists = await checkUserName(uname);
    if (nameExists) { return { error: true, msg: "Username Already Exists", data: null } };
    let user = createUser(fname, lname, password, level, uname);
    if (!users) { return { error: true, msg: "Error loading users", data: null } };
    users.push(user);
    saveUsers();
    logger.log("Created New User: " + uname + ": " + fname + " " + lname);
    return { error: false, msg: "User Created", data: user };
}


function edit(user) {
    //edit user
}


async function changePassword(uname, newPwrd, password) {
    for (i = 0; i < users.length; i++) {
        if (uname == users[i].uname) {
            if (checkPassword(password, users[i].password)) {
                users[i].password = encryptPassword(newPwrd);
                users[i].authKey = createAuthKey();
                saveUsers()
                return { error: false, msg: "Password Changed", data: user[i] };
            };
            return { error: true, msg: "Users Password is incorrect", data: users[i] }
        }
    }
    return { error: true, msg: "User Not Found in system", data: "" }
}


/** PUBLIC
 * Resets users password to empty string
 * @param {string} adminUname 
 * @param {string} adminPwrd 
 * @param {string} uname 
 */
async function resetPassword(adminUname, adminPwrd, uname) {
    let loaded = await loadUsers(usersUrl);
    loaded.data.forEach
}

function deleteUser(user) {
    for (i = 0; i < users.length; i++) {
        if (users[i].uname == user.uname) {
            users.splice(i, 1);
            return;
        }
    }
}



function remove(adminUname, adminPwrd, uname) {
    for (i = 0; i < users; i++) {
        if (adminUser == users[i] && users[i].level == "admin") {
            deleteUser(user);
        }
    }
}



/**
 * Checks if user is valid
 * @param {string} uname 
 * @param {string} authKey 
 */
async function validate(uname, authKey) {
    let validUser = false;
    //let reply = await getAll(["uname", "authKey"]);
    for (const user of users) {
        if (user.uname == uname && user.authKey == authKey) {
            return tokenTimeValid(user);
        }
    };
    return false;
}

//checks if the user token time has run out
function tokenTimeValid(user) {
    let date = new Date();
    let issuedDate = new Date(user.issuedAt);
    let daysDiff = (date.getTime() - issuedDate.getTime()) / (1000 * 3600 * 24);
    if (daysDiff > tokenPeriod) {
        //user.issuedAt = null;
        return false;
    }
    return true;
}

//checks uname and password of user
//if the user has reset=true, then the users password will be updated
async function login(uname, password) {
    let data = {}
    for (i = 0; i < users.length; i++) {
        if (users[i].uname == uname.toLowerCase()) {
            //this handles new password from user
            if (!users[i].password) {
                let result = encryptPassword(password);
                users[i].password = result.password;
                users[i].authKey = createAuthKey();
            }
            let correctPassword = await checkPassword(password, users[i].password);
            if (!correctPassword) return { error: true, msg: "Incorrect Password", data }
            if(!tokenTimeValid(users[i])){
                users[i].issuedAt = new Date();
            }
            saveUsers();
            data = {
                level: users[i].level,
                uname: users[i].uname,
                fname: users[i].fname,
                lname: users[i].lname,
                authKey: users[i].authKey
            }
            return { error: false, data }
        }
    }
    return { error: true, data: "" }
}


async function getUser(uname, authKey) {
    for (i = 0; i < users.length; i++) {
        if (users[i].uname == uname && users[i].authKey == authKey) {
            return { error: false, data: users[i] }
        };
    }
    return { error: true, data: "" };
}

async function getAll() {
    return users;
}

async function getAllUsernames() {
    let loaded = await getAll(["uname"])
    if (!loaded.error) {
        logger.log("error getAllUsernames")
    }
}

//getAllUsers()
//getAllUsernames()

/*create("Mitchell", "Dayz", "TTTTTT", "admin", "dayl")
    .then(mitchell=>{
        console.log(mitchell)
    })
*/

module.exports = {
    create,
    remove,
    edit,
    changePassword,
    validate,
    getAll,
    getUser,
    login
};