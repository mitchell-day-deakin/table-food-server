let Storage = () => {
    let STATUS = {
        STARTED: "started",
        LOADED: "loaded",
        UNSUPPORTED: "unsupported"
    }

    let status = STATUS.STARTED; //loaded / error / waiting
    let indexedDb = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    let db;

    if (!indexedDb) {
        console.log("Browser doesnt support indexedDB");
        alert("Does not support indexedDB")
        status = STATUS.UNSUPPORTED;
    }

    /**
     *
     * @param {string} dbName
     * @param {int} version
     * @param {array} tablesArray {name: <name of table>, keyPath: <object key/id>}
     * @param {function} successCB function called when db open is successful
     * @param {function} errorCB function called when db open error
     * @param {function} upgradeCB function called when db op needs an upgrade
     */
    let connect = (dbName, version, tablesArray, successCB, errorCB, upgradeCB) => {
        // return new Promise((res, rej)=>{
        let dbRequest = indexedDb.open(dbName, version);
        dbRequest.onupgradeneeded = (e) => {
            db = e.target.result;
            tablesArray.forEach(table => {
                if (!db.objectStoreNames.contains(table.name)) {
                    db.createObjectStore(table.name, { keyPath: table.key });
                }
            })
        }

        dbRequest.onsuccess = (e) => {
            db = e.target.result;
            status = STATUS.LOADED;
            successCB(db);
        }

        dbRequest.onerror = (e) => {
            errorCB(e);
        }

        //})

    }
    let getAllTables = () => {
        if (status != "loaded") { return { error: true, msg: "Storage not loaded" } };
    }


    let getTable = (storeName, mode) => {
        let tx = db.transaction(tableName, mode);
        return tx.objectStore(tableName);
    }


    /**
     * Adds or updates data to table using put
     * @param {string} table name of table to add to
     * @param {Object} data the object being added to table
     */
    let addData = async (table, data) => {
        return new Promise((resolve, reject) => {
            if (status != "loaded") resolve({ error: true, msg: "" });
            let tx = db.transaction(table, "readwrite");
            let store = tx.objectStore(table);
            let req = store.put(data);

            req.onsuccess = () => { resolve({ msg: "Successfully Added", error: false }); }
            req.onerror = (err) => { 
                console.log(err)
                resolve({ error: true, msg: "Data not added" }) 
            }
        })
    }


    let getData = (table, key) => {
        return new Promise((resolve, reject) => {
            let tx = db.transaction(table, "readwrite");
            let store = tx.objectStore(table);
            let req = store.get(key);
            req.onsuccess = (e) => {
                resolve({ msg: "Got data", error: false, data: e.target.result });
            };
            req.onerror = (e) => { resolve({ error: true, msg: "Error getting data" }); }
        })
    }

    let getAllData = (table) => {
        return new Promise((resolve, reject) => {
            let tx = db.transaction(table, "readwrite");
            let store = tx.objectStore(table);
            let req = store.getAll();
            req.onsuccess = (e) => {
                resolve({ msg: "Got data", error: false, data: e.target.result });
            };
            req.onerror = (e) => { resolve({ error: true, msg: "Error getting data" }); }
        })
    }


    let putData = () => { }
    let delData = () => { }
    let getStatus = () => { return status };


    return {
        connect,
        getAllTables,
        addData,
        getData,
        getAllData,
        putData,
        delData,
        getStatus
    }
}

let storageOpened = (db) => {
    storage.addData('tewts', { name: "tewttest", id: 1 });
    storage.addData('tewts', { id: 2, name: "tewt2name" })
}

let storageError = () => {
    console.log("Storage error")
}

let storageUpgrade = () => {
    console.log("Storage upgraded")
}

let tablesList = [
    { name: 'tewts', key: 'id' },
    { name: 'users', key: 'uname' },
    { name: 'results', key: 'id' },
    { name: 'current', key: 'id' }
];

let storage = Storage();
storage.connect("tewtDb", 1, tablesList, storageOpened, storageError, storageUpgrade);
setTimeout(() => {
    //storage.getData('tewts', 1).then(reply => {
    //console.log(reply)
    //})
    storage.getAllData('tewts').then(reply => {
    })
}, 3000)
