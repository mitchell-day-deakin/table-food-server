//@param containerId => div/tr etc element to create the range slider
//@param startHandle => position of start handle
//@param endHandle => position of the end handle
//@param minValue:int => minimum value on the slider
//@param maxValue:int => the maximum value on the slider
//@param ticks:int => the different values the handle can be
//@param labelDistance => how often to display a line


/* let RangeSlider = ({ containerId, startHandle, endHandle, minValue, maxValue, ticks, labelDistance }) => {
    let container = document.getElementById(containerId);
    let startHandleValu = startHandle ? startHandle : minValue;
    let endHandleValue = endHandle ? endHandle : maxValue;
    minValue = minValue ? minValue : 0;
    maxValue = maxValue ? maxValue : 100;
    let range = maxValue - minvalue;
    ticks = ticks ? ticks : 1;
    labelDistance = labelDistance ? labelDistance : 10;
    let slider;
    let startHandle;
    let endHandle;

    let createHandle = (handlePos) => {
        let handle = document.createElement("div");
        handle.classList.add("range-slider-handle");
        let unit = slider.width / range;
        let handleUnitPos = handlePos - minValue;
        handle.style.left = unit * handleUnitPos;

    }

    let createSlider = () => {
        slider = document.createElement("div");
        slider.classList.add("range-slider");
        container.appendChild(slider);
        createHandle(minValue)
    }

    return {
        createSlider
    }
} */


let Sliders = (times) => {
    let options = {
        start: [30, 30, 30, 30, 30, 30, 30, 30],
        //tooltips: [true, true, true, true, true, true],
        connect: [false, true, false, true, false, true, false, true, false],
        range: {
            'min': -30,
            'max': 30
        },
        step: 1,
        pips: {
            mode: 'values',
            values: [-25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25],
            density: 1
        }
    }
    //creating a text box above every second slider handle
    let createText = (ele) => {
        let connects = ele.querySelectorAll(".noUi-handle");
        connects.forEach((el, i) => {
            if (i % 2 == 0) {
                let title = document.createElement("input");
                //title.classList.add("slider-text target-input");
                title.setAttribute("class", "target-input slider-text")
                el.appendChild(title)
            }
        })
    }
    //create slider
    let create = (ele) => {
        noUiSlider.create(ele, options);
        createText(ele)
    }

    let getSliders = () => {
        return;
    }

    let getValues = () => {
        slider1.noUiSlider.get()
    }

    //returns array {name, time} from in the parent element "scheduleRow"
    let getHandles = (scheduleRow) => {
        let values = [];
        let inputValue; //the target text in input associated to handle
        let currentHandle; //the handle that is currently being edited.
        let handles = scheduleRow.querySelectorAll(".noUi-handle");
        handles.forEach((handle, i) => {
            try {
                let inp = handle.querySelectorAll(".target-input")[0];
                inputValue = inp.value
                if (inputValue){
                    currentHandle = { name: inputValue, startTime: handle.getAttribute("aria-valuenow") };
                }
            } catch (error) {
                if(inputValue){
                    currentHandle.endTime = handle.getAttribute("aria-valuenow");
                    values.push(currentHandle)
                }
            }
        })
        return values;
    }

    return {
        create,
        getSliders,
        getValues,
        getHandles
    }
}

let sliders = Sliders()
//sliders.create();




let Report = (() => {
    let questions;
    let cont = null;
    let created = false;

    let create = (div,reportQuestions) => {
        created = true;
        questions = reportQuestions;
        cont = document.getElementById(div);
        let reportText = '';
        questions.forEach(question => {
            reportText += `<h4>${question}</h4>`;
            reportText += `<textarea cols="30" rows="5"  class="report-answers" name="${question}"></textarea><br>`;
        })
        reportText += `<input type="submit" style="margin-bottom: 10px;" value="SUBMIT QDE" class="hightlight" onclick='submitQde()'>`;
        cont.innerHTML = reportText;
    }

    let get = () => {
        let result = [];
        let answers = document.querySelectorAll(".report-answers");
        console.log(answers);
        [...answers].forEach(answer=>{
            result.push({q: answer.name, a: answer.value});
        })
        return result;
    }

    let remove = ()=>{
        created = false;
        if(cont) cont.innerHTML = "";
    }

    let status = ()=>{return created}

    return {
        status,
        remove,
        get,
        create
    }
})();


let FirePlan = (() => {
    //element id to create fireplan DOM in (usually a div);
    let cont;
    //containers for head info, target table and schedule table
    let infoCont;
    let targetCont;
    let schedCont;
    let created = false;
    let create = (div) => {
        cont = document.getElementById(div);
        created = true;
        let html;
        html = main;
        cont.innerHTML = html;

        //addTargets(2);
        //addSchedules(2);

        infoCont = cont.querySelector("#fp-info");
        targetCont = cont.querySelector("#fp-targets");
        schedCont = cont.querySelector("#fp-schedules");
    }

    let main = `<div id="fireplan">` +
        `<h2>Artillery Fire Plan</h2>` +
        `<div id="fp-info">` +
        `<div class="fireplan-input-cont">` +
        `<h4>Fire Plan</h4>` +
        `<input type="text" name="" id="fp-id">` +
        `</div >` +
        `<div class="fireplan-input-cont">` +
        `<h4>Supporting</h4>` +
        `<input type="text" name="" id="fp-supporting">` +
        `</div>` +
        `<div class="fireplan-input-cont">` +
        `<h4>Originator</h4>` +
        `<input type="text" name="" id="fp-originator">` +
        `</div>` +
        `<div class="fireplan-input-cont large-cont">` +
        `<h4>Modifications By</h4>` +
        `<input type="text" name="" id="fp-modifications">` +
        `</div>` +
        `<div class="fireplan-input-cont">` +
        `<h4>Superimposed</h4>` +
        `<input type="text" name="" id="fp-superimposed">` +
        `</div>` +
        `<div class="fireplan-input-cont">` +
        `<h4>H-hour</h4>` +
        `<input type="number" name="" id="fp-hhour">` +
        `</div>` +
        `<div class="fireplan-input-cont">` +
        `<h4>Sheet</h4>` +
        `<input type="text" name="" id="fp-sheet">` +
        `</div>` +
        `<div class="fireplan-input-cont large-cont" id="fp-date-cont">` +
        `<h4>Date/time group</h4>` +
        `<input type="date" name="" id="fp-date">` +
        `</div>` +
        `</div><br>` +
        `<div id="fp-targets"><h3>Target Information</h3></div>` +
        `<button class="highlight green" onclick="FirePlan.addTargets(1)" >ADD Target</button>` +
        `<button class="highlight red" onclick="FirePlan.removeTarget()" >DEL Target</button>` +
        `<div id="fp-schedules"><h3>Schedule</h3></div>` +
        `<button class="highlight green" onclick="FirePlan.addSchedules(1)" >ADD Schedule</button>` +
        `<button class="highlight red" onclick="FirePlan.removeSchedule()" >DEL Schedule</button></br>` +
        `<input type="button" style="margin-bottom: 10px;" value="SUBMIT QDE" class="highlight fireplan-submit" onclick='submitQde()'>`;

    let addTargets = (num) => {
        let target = document.getElementById("fp-targets");
        let targets = document.querySelectorAll(".fp-targetinfo");
        let tLength = targets.length + 1;
        num = num ? num : 1;
        let html = "";
        for (i = tLength; i < num + tLength; i++) {
            let div = document.createElement("div");
            div.id = `fp-targetinfo-${i}`;
            div.classList.add("fp-targetinfo");
            div.innerHTML += `<div class="cell fp-line">${i}</div>` +
                `<div class="cell">` +
                `<input type="text" placeholder="(a)Tgt No" name="" class="fp-targetno" id="fp-targetno-${i}"></div>` +
                `<div class="cell">` +
                `<input type="text" placeholder="(b)Desc" name="" class="fp-targetdescription" id="fp-targetdescription-${i}"></div>` +
                `<div class="cell">` +
                `<input type="text" placeholder="(c)Loc" name="" class="fp-targetloc" id="fp-targetloc-${i}"></div>` +
                `<div class="cell">` +
                `<input type="text" placeholder="(d)Alt" name="" class="fp-targetalt" id="fp-targetalt-${i}"></div>` +
                `<div class="cell">` +
                `<input type="text" placeholder="(e)Remarks" name="" class="fp-targetremarks" id="fp-targetremarks-${i}"></div>` +
                `</div>`
                target.appendChild(div);
        }
    }

    let removeTarget = () => {
        let targets = document.querySelectorAll(".fp-targetinfo");
        targets[targets.length - 1].remove();
    }

    let addSchedules = (num) => {
        let scheduleCont = document.getElementById("fp-schedules");
        let schedules = document.querySelectorAll(".fp-schedule");
        let idString = "slider-"
        let sLength = schedules.length + 1;
        let html = "";
        for (i = sLength; i < sLength + num; i++) {
            let div = document.createElement("div");
            div.id = `fp-schedule-${i}`;
            div.classList.add("fp-schedule");
            div.innerHTML = `<div class="cell fp-line">${i}</div>` +
                `<div class="cell"><input type="text" placeholder="(f) Org/Fmn" name="" class="fp-org" id="fp-org-${i}"></div>` +
                `<div class="cell"><input type="text" placeholder="(g) Call Sign" name="" class="fp-cs" id="fp-cs-${i}"></div>` +
                `<div class="cell timings-slider-td"><div class="timings-slider" id="${idString + i}"></div></div>` +
                `<div class="cell"><textarea placeholder="(i) Remarks" class="fp-remarks remarks" id="fp-remarks-${i}"cols="35"></textarea></div>`;
            scheduleCont.appendChild(div);
        }
        //scheduleCont.innerHTML += html;
        for (i = sLength; i < sLength + num; i++) {
            console.log(i)
            let ele = document.getElementById(idString + i)
            sliders.create(ele);
        }
    }

    let removeSchedule = () => {
        let schedules = document.querySelectorAll(".fp-schedule");
        console.log(schedules)
        schedules[schedules.length - 1].remove();
    }

    let getData = () => {
        let fireplan = {};
        fireplan.head = getHead();
        fireplan.targets = getTargets();
        fireplan.schedules = getSchedules();
        return fireplan;
    }

    let getTargets = () => {
        let targets = document.querySelectorAll(".fp-targetinfo");
        let results = [];
        [...targets].forEach(target => {
            let no = target.querySelector(".fp-targetno").value;
            let description = target.querySelector(".fp-targetdescription").value;
            let location = target.querySelector(".fp-targetloc").value;
            let alt = target.querySelector(".fp-targetalt").value;
            let remarks = target.querySelector(".fp-targetremarks").value;
            results.push({ no, description, location, alt, remarks });
        })
        return results;
    }

    let getSchedules = () => {
        let schedules = document.querySelectorAll(".fp-schedule");
        let results = [];
        [...schedules].forEach(schedule => {
            let org = schedule.querySelector(".fp-org").value;
            let cs = schedule.querySelector(".fp-cs").value;
            let times = sliders.getHandles(schedule);
            let remarksTemp = schedule.querySelector(".fp-remarks").value;
            let remarks = remarksTemp.split(/\n\r?/g);
            results.push({ org, cs, times, remarks });
        })
        return results;
    }

    let getHead = () => {
        let id = document.getElementById("fp-id").value;
        let supporting = document.getElementById("fp-supporting").value;
        let originator = document.getElementById("fp-originator").value;
        let modifications = document.getElementById("fp-modifications").value;
        let superimposed = document.getElementById("fp-superimposed").value;
        let hhour = document.getElementById("fp-hhour").value;
        let sheet = document.getElementById("fp-sheet").value;
        let date = document.getElementById("fp-date").value;
        return { id, supporting, originator, modifications, superimposed, hhour, sheet, date }
    }

    let status = ()=>{return created}

    let remove = ()=>{
        created = false;
        if(cont) cont.innerHTML = "";
    }

    return {
        status,
        remove,
        create,
        addTargets,
        removeTarget,
        addSchedules,
        removeSchedule,
        getData,
        getTargets,
        getSchedules,
        getHead
    }

})();




