const mySql = require("mysql");

const ERROR_CODES = {
    DUPLICATE_ENTRY: "ER_DUP_ENTRY",

}

function DB() {
    //initiate db connection
    let con;

    let connect = () => {
        return new Promise((resolve, reject) => {
            con = mySql.createConnection({
                host: "localhost",
                user: "tewtserver",
                password: "AvEnG3Rs",
                database: "tewt"
            });

            con.connect(err => {
                if (err) resolve({ error: true, msg: err });
                resolve({ error: false, msg: "DB Connected" });
                console.log(con.state)
            });
        })
    }

    connect();

    let reconnect = () => {
        disconnect();
        connect();
    }


    let query = (queryString, data) => {
        return new Promise((resolve, reject) => {
            const connecter = !data ? ";" : " ? ";
            con.query(`${queryString}${connecter}`, data, (err, results, fields) => {
                if (err) resolve({ error: true, msg: err });
                resolve({ error: false, data: results });
            })
        })
    }

    //single entry into database
    let createEntry = async (table, data) => {
        return await query(`INSERT into ${table} SET`, data);
    }



    let getAll = () => {
        return new Promise((resolve, reject) => {
            con.query(`INSERT into ${table} SET ?`, data, (err, results, fields) => {
                if (err) resolve({ error: true, msg: err });
                resolve({ error: false, data: results });
            })
        })
    }

    let update = async (table, data, filter)=>{
        let setString = "";
        for (key in data){
            setString += `${key}=${data[key]}, `;
        }
        return await query(`UPDATE ${table} SET ${setString} WHERE ${filter}`)
    }

    let getData = async ({ table, keys, filter }) => {
        filter = !filter ? ";" : `WHERE ${filter};`;
        if (!keys || keys == "*") {
            query
        }
    }


    let getAllUsers = async () => {
        return await query('SELECT * FROM users');
    }


    let disconnect = () => {
        con.end()
    }


    return {
        disconnect,
        reconnect,
        connect,
        createEntry,
        update
    }
}






//SET of TESTS

//create DB object and automatically connect
let db = DB();

//test disconnection
//setTimeout(db.disconnect, 3000);
//test reconnection
//test connection

//test update
let user = {fname: "updated", uname: "daym", lname: "bestest"}

db.update("users", user, `uname='${user.uname}'`).then(reply=>{
    console.log(reply)
})


/* query('Insert into users SET', [{ uname: "test1", fname: "test1" },{ uname: "test3", fname: "test2" }])
.then(reply => {
    console.log(JSON.stringify(reply));
    query('Select * FROM users')
        .then(reply2 => { console.log(JSON.stringify(reply2)) })
}) */


