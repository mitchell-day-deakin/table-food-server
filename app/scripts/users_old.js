const fs = require('fs');
const path = require("path");
const os = require("os");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const system = require("./system.js");
const logger = require(path.join(__dirname, "./logger.js"))
const usersUrl = path.join(__dirname, "../config/users.json");
//let usersUrl = "../data/config/users.json";


//this loads all users {fname, lname, uname, password, authToken, level};
//so other functions can compare, edit, remove, add
async function loadUsers(url) {
    let users = await system.readFile(url, false);
    return users;
}


let encryptPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) throw err;
            resolve({ error: false, password: hash })
        })
    })
}

let checkPassword = async (password, encrpyptedPwrd) => {
    let match = await bcrypt.compare(password, encrpyptedPwrd)
    return match;
}

async function CreateUser(fname, lname, password, level, uname) {
    let authKey = createAuthKey();
    reply = await encryptPassword(password);
    console.log(reply)
    if (!reply.error) {
        password = reply.password;
    }
    return { fname, level, password, lname, uname, password, authKey }
}

async function saveUser(url, user, users) {
    let newUsers = users;
    if (!users.error) {
        newUsers.push(user);
        let errorSaving = await system.saveFile(url, newUsers, false);
        if (!errorSaving) {
            return { error: false, msg: "User Saved", data: newUsers };
        } else {
            return { error: true, msg: "Error saving file", data: users.data }
        }
    } else {
        return { error: true, msg: "Error loading users", data: users.data };
    }
}


//creates a random string authKey
function createAuthKey() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}


//FUNCTIONS THAT ARE EXPORTED
//@params [array of keys wanted from users]
async function getAll(keys) {
    let loaded = await loadUsers(usersUrl);
    if (loaded.error) { return { error: true, data: [] } };
    let users = loaded.data.map(u => {
        let user = {};
        keys.forEach(key => user[key] = u[key]);
        return user;
    });
    return { error: false, data: users };
};


//pass in the user name, and an array of usernames
//check if username is already taken
async function checkUserName(uname) {
    uname = uname.toLowerCase();
    let nameExists = false;
    let users = await getAll(["uname"]);
    if (users.error) {
        console.log("Error loading file");
    } else {
        users.data.forEach(user => {
            if (user.uname == uname) {
                nameExists = true;
            }
        })
    }
    return nameExists;
}


//@params fname, lname, password, level, uname
//returns {error, msg, user}
async function create(fname, lname, password, level, userName) {
    let uname = userName.toLowerCase()
    let nameExists = await checkUserName(uname);
    if (nameExists) {
        console.log("Username already Exists")
        return { error: true, msg: "Username Already Exists", data: null };
    } else {
        let user = await CreateUser(fname, lname, password, level, uname);
        let result = await loadUsers(usersUrl);
        if (!result.error) {
            saveUser(usersUrl, user, result.data);
            logger.log("Created New User: " + uname + ": " + fname + " " + lname);
            return { error: false, msg: "User Created", data: user };
        }
    }
}

function load() {
    let loaded = loadUsers(usersUrl)
    if (loaded.error) {
        return { error: true, msg: "Error laoding users", data: "" }
    } else {
        return { error: false, msg: "Loaded Users", data: loaded.data };
    }
}

function edit(user) {
    //edit user
}



//@params id is value of user being deleted. user is an admin user object
function remove(user) {
    //delete user
}



//checks user is valid
//returns {isValid, type}
async function validate(uname, authKey) {
    let validUser = false;
    let reply = await getAll(["uname", "authKey"]);
    reply.data.forEach(user => {
        if (user.uname == uname && user.authKey == authKey) {
            validUser = true;
        }
    })
    return validUser;
}


async function login(uname, password) {
    let error = true;
    let data = {};
    let reply = await getAll(["uname", "password", "authKey", "fname", "lname", "level"])
    let users = reply.data;
    for (i = 0; i < users.length; i++) {
        if (users[i].uname == uname.toLowerCase()) {
            let correctPassword = await checkPassword(password, users[i].password);
            if (correctPassword) {
                error = false;
                data = {
                    level: users[i].level,
                    uname: users[i].uname,
                    fname: users[i].fname,
                    lname: users[i].lname,
                    authKey: users[i].authKey
                }
                break;
            }
        }
    }
    return { error, data }
}

function changePassword(uname, newPassword, oldpassword) {

}

async function getUser(uname, authKey) {
    let users = await getAll(["fname", "lname", "uname", "level", "authKey"]);
    let user = null;
    users.data.forEach(u => {
        if (u.uname == uname && u.authKey == authKey) {
            user = u;
        };
    })
    if (user) {
        return { error: false, data: user };
    } else {
        return { error: true, data: "" };
    }
}

async function getAllUsers() {
    let loaded = await getAll(["fname", "lname", "uname", "level", "password", "authKey"]);
    if (!loaded.error) {
        logger.log("error getAllUsers")
    }
    return loaded;
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
    getAllUsers,
    getUser,
    login
};