const mySql = require("mysql");

const ERROR_CODES={
    DUPLICATE_ENTRY: "ER_DUP_ENTRY",

}

function DB() {
    //initiate db connection
    let con;

    let connect = () => {
        con = mySql.createConnection({
            host: "localhost",
            user: "tewtserver",
            password: "AvEnG3Rs",
            database: "tewt"
        }); con.connect();
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


    let createEntry = (table, data) => {
        return new Promise((resolve, reject) => {
            con.query(`INSERT into ${table} SET ?`, data, (err, results, fields) => {
                if (err) resolve({ error: true, msg: err });
                resolve({ error: false, data: results });
            })
        })
    }

    query('Insert into users SET', [{ uname: "test1", fname: "test1" },{ uname: "test3", fname: "test2" }])
        .then(reply => {
            console.log(JSON.stringify(reply));
            query('Select * FROM users')
                .then(reply2 => { console.log(JSON.stringify(reply2)) })
        })


    let getAll = () => {
        return new Promise((resolve, reject) => {
            con.query(`INSERT into ${table} SET ?`, data, (err, results, fields) => {
                if (err) resolve({ error: true, msg: err });
                resolve({ error: false, data: results });
            })
        })
    }


    let getAllUsers = () => {
        con.query('SELECT * FROM users', (err, results, fields) => {
            if (err) { console.log(error); return };
            console.log(`The solution is: ${JSON.stringify(results)}`)
        })
    }


    let disconnect = () => {
        con.end()
    }


    return {
        disconnect,
        reconnect,
        connect,
    }
}






//SET of TESTS

//create DB object and automatically connect
let db = DB();

//test disconnection
setTimeout(db.disconnect, 3000);
//test reconnection
//test connection



