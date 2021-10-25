//Debrief 
let debrief = {
    stream: null,
    mode: "record", //record OR playback
    camVid: document.getElementById("debrief_camera"),
    playbackVid: document.getElementById("debrief_playback"),
    rec: null,
    recorded: {
        blob: null,
        url: "",
        name: ''
    },
    chunks: [],
    clockTimer: null,
    dur: 0
}

let debriefDelBtn = document.getElementById("debrief_delete");
const debriefSaveBtn = document.getElementById('debrief_save');
const recordBtn = document.getElementById("debrief_record");
const stopBtn = document.getElementById("debrief_stop");

debriefDelBtn.onclick = (e) => {
    setDebriefRecord();
    startCameraVideo();
}

debriefSaveBtn.onclick = (e)=>{
    console.log(debrief.recorded)
    let {name, blob, url} = debrief.recorded;
    name = current.tewt.startTime+"_"+user.uname+"_"+current.qde+".webm";
    blob = debrief.recorded.blob;
    url = debrief.recorded.url;
    current.tewt.qdes[current.qde].debrief = {name, url, blob};
    saveTewt();
}

recordBtn.addEventListener("click", () => {
    console.log("Started Recording");
    debrief.chunks = [];
    debrief.rec.ondataavailable = function(e) {
        //console.log(new Date()+": data received");
        debrief.chunks.push(e.data);
    }
    debrief.rec.onstart = e=>{}
    loadingPage("block");
    setTimeout(()=>{
        loadingPage("none");
        startClock();
    }, 1000);
    debrief.rec.start(1000);
})

function stopRecording(){
    debrief.rec.stop();
    stopClock();
    const options = { type: 'video/webm; codecs=vp9' };
    debrief.recorded.blob = new Blob(debrief.chunks, options);
    //console.log(debrief.recorded.blob.size/1024);
    debrief.recorded.url = URL.createObjectURL(debrief.recorded.blob);
    stopCameraVideo();
    debrief.playbackVid.src = debrief.recorded.url;
    debrief.playbackVid.currentTime = 999999;
    loadingPage("block");
    debrief.playbackVid.onloadedmetadata = ()=>{
        loadingPage("none");
        setDebriefPlayback();
        debrief.playbackVid.play();
    }
    debrief.playbackVid.load();
}

stopBtn.addEventListener("click", stopRecording);



function handleStartCamera(stream) {
    debrief.stream = !debrief.stream ? stream : debrief.stream;
    if ("srcObject" in debrief.camVid) {
        debrief.camVid.srcObject = debrief.stream;
    } else {
        window.URL.createObjectURL(debrief.stream);
    }
    return debrief.stream;
}

function handleStreamError(error) {
    switch(error.name){
        case 'NotFoundError':
            alert('Devices camera not available');
            break;
        default:
            alert('Error getting stream');
    }
    console.log(error.name);
}

//starts capturing stream from camera and displaying in video#debrief_video
async function startCameraVideo() {
    let constraints = { audio: true, video: { facingMode: "user" } };
    try {
        debrief.stream = await navigator.mediaDevices.getUserMedia(constraints);
        debrief.rec = new MediaRecorder(debrief.stream);
        handleStartCamera(debrief.stream);

    } catch (error) { handleStreamError(error); }

    debrief.camVid.onloadedmetadata = (evt) => {
        debrief.camVid.play();
    }
}

function stopCameraVideo() {
    if (!debrief.stream) return;
    debrief.chunks = [];
    debrief.camVid.pause();
    debrief.stream.getTracks().forEach(t => {
        t.stop();
        debrief.camVid.srcObject.removeTrack(t);
    });
    debrief.stream = null;
}

function checkDebrief(){
    let savedDebrief = current.tewt.qdes[current.qde].debrief;
    if(savedDebrief){
        console.log(savedDebrief.url)
        debrief.playbackVid.src = URL.createObjectURL(savedDebrief.blob)
        debrief.playbackVid.currentTime = 999999;
        setDebriefPlayback();
        return;
    }
    setDebriefRecord();
}

function setDebriefRecord() {
    document.getElementById("deb_con_record").style.display = "block";
    document.getElementById("deb_con_playback").style.display = "none";
    debrief.camVid.style.display = "inline";
    debrief.playbackVid.style.display = "none";
    debrief.playbackVid.pause();
    document.getElementById("debrief_time").innerHTML = "01:00<br>WAITING";
    startCameraVideo();
}

function setDebriefPlayback() {
    document.getElementById("deb_con_record").style.display = "none";
    document.getElementById("deb_con_playback").style.display = "block";
    debrief.camVid.style.display = "none";
    debrief.playbackVid.style.display = "inline";
    document.getElementById("debrief_time").innerHTML = "PLAYBACK";
    stopCameraVideo();
}


//COUNTDOWN clock for recording debrief
function startClock(){
    let timeDiv = document.getElementById("debrief_time");
    let time = 60;
    timeDiv.style.color = "red";
    timeDiv.innerHTML = "01:00<br>RECORDING"
    debrief.dur = 0;
    debrief.clockTimer = setInterval(()=>{
        if(time <= 0){ 
            stopRecording();
            stopClock();
        } else {
            time--;
            timeDiv.innerHTML = time < 10 ? `00:0${time}<br>RECORDING` : `00:${time}<br>RECORDING`
            debrief.dur++;
        }
    },1000)
}


function stopClock(){
    let timeDiv = document.getElementById("debrief_time");
    clearInterval(debrief.clockTimer);
    timeDiv.innerHTML = "01:00<br>WAITING";
    timeDiv.style.color = "white";
}