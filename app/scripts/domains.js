const System = require('./system');
const path = require('path');
const domainListUrl = path.join(__dirname, '../config/domains.json');

function Domains(){
    let domains = null;

    let save = ()=>{

    }

    let load = async ()=>{
        let reply = await System.readFile(domainListUrl);
        console.log(reply);
        return reply;
    }

    let create = ()=>{

    }

    let remove = (domainId)=>{

    }

    let getTewtList = (domainId)=>{

    }

    let setTewtList = (arrayTewtIds)=>{

    }

    let addTewt = (domainId, tewtId)=>{

    }

    let removeTewt = (domainId, tewtId)=>{

    }

    

    return {
        load,
        save,
        create,
        remove,
        getTewtList,
        setTewtList,
        addTewt,
        removeTewt
    }
}


module.exports = Domains;