let socket;

socket = io.connect(serverIp);

//old connection from CBES client to JSDIS server
/*let stopSocket = () => {
    try {
        socket.disconnect()
    } catch (err) {
        console.log("Socket was not disconnected")
    }
}*/

let assessentsUpdate = (data)=>{}

let eventUpdate = (data)=>{
    document.getElementById("serverinfo");
    //console.log(data)
    serverinfo.innerHTML = data.status.timeLeftString
}

let intUpdate = (data)=>{
    fxConfig.nxServer = data.nxServer;
    fxConfig.network = data.network;
    setServerIps(fxConfig);
}

let groupUpdate = (data)=>{
    fxConfig.groups = data
    editDom(fxConfig)
}

let personnelUpdate = (data)=>{
    fxConfig.personnel = data;
    editDom(fxConfig);
}

let trigger = (data)=>{
    highlightButton(data);
}

let systemUpdate = (data)=>{
    fxConfig = data;
    editDom(fxConfig)
}

let sound = (data)=>{
    console.log(data)
    fxConfig.soundNodes = data;
    editDom(fxConfig)
}

socket.on("server", (data)=>{
    switch(data.cat){
        case "event":
            eventUpdate(data.body)
            break;
        case "int":
            intUpdate(data.body);
            break;
        case "assessments":
            assessmentUpdate(data.body);
            break;
        case "groups":
            groupUpdate(data.body);
            break;
        case "personnel":
            personnelUpdate(data.body);
            break;
        case "trigger":
            trigger(data.body);
            break;
        case "sound":
            sound(data.body);
            break;
        case "system":
            systemUpdate(data.body);
            break;
        case "jsdis":
            locationUpdate(data.body);
            console.log("JSDIS Msg")
            break;
        default: 
            console.log("Unknown IO message", data);

    }
})