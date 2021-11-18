const { MongoClient, Logger } = require("mongodb");
const path = require("path");
const logger = require(path.join(__dirname, "./logger.js"))



function Mongo({address, port = 27017, dbName}){
    if(!address) {return console.log("No address assigned for MongoDB")};
    if(!dbName){return console.log("No dbName assigned for MongoDB")};
    let url = `mongodb://${address}:${port}`;
    let client = new MongoClient(url);
    let db;

    const connect = async ()=>{
        await client.connect()
        db = client.db(dbName);
    }


    let addData = (collection, [data])=>{

    }

    let getData = async(collection, filter)=>{
        let coll = db.collection(collection);
        let reply = await coll.find();
        console.log(reply)
        return reply
    }

    let removeData = ()=>{

    }

    let update = async (collection, data, filter)=>{
        try{
            let coll = db.collection(collection);
            console.log(coll)
            let result = await coll.updateOne(filter, {$set: data});
            console.log(result);
            return result;
        } catch(e){
            console.log("mongo update", e);
            logger.log(e, "ERROR");
            return e;
        }
    
    }

    return {
        addData,
        getData,
        removeData,
        update,
        connect
    }
}



let mongo = Mongo({address: 'localhost', dbName: "cubic_tewt"})
mongo.connect()
.then(_=>{
    mongo.update('users', {lname: "testUpdated"}, {fname: "test2"})
        .then(_=>{
            mongo.getData('users');
        })
})


