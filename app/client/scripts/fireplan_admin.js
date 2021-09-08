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

//array of times eg [-10, -9,-4,0,2,4]
let Sliders = () => {
    let options = {
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
    let createText = (ele, times) => {
        let connects = ele.querySelectorAll(".noUi-handle");
        connects.forEach((el, i) => {
            //console.log(i)
            if (i % 2 == 0) {
                let title = document.createElement("input");
                //title.classList.add("slider-text target-input");
                title.setAttribute("class", "target-input slider-text")
                title.setAttribute("disabled", true)
                title.value = times[i / 2].name;
                el.appendChild(title)
            }
        })
    }
    //create slider
    let create = (ele, times) => {
        let start = [];
        let connect = [false];
        times.forEach(handle => {
            start.push(handle.startTime);
            start.push(handle.endTime);
            connect.push(true);
            connect.push(false);
        })
        options.start = start;
        options.connect = connect;
        noUiSlider.create(ele, options);
        createText(ele, times)
        ele.setAttribute("disabled", true)
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
                if (inputValue) {
                    currentHandle = { name: inputValue, startTime: handle.getAttribute("aria-valuenow") };
                }
            } catch (error) {
                if (inputValue) {
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


let Report = (() => {
    let questions;
    let cont = null;
    let created = false;

    let create = (div, reportQuestions) => {
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
        [...answers].forEach(answer => {
            result.push({ q: answer.name, a: answer.value });
        })
        return result;
    }

    let remove = () => {
        created = false;
        cont.innerHTML = "";
    }

    let status = () => { return created }

    return {
        status,
        remove,
        get,
        create
    }
})();


let FirePlan = (() => {
    console.log("fireplan is here")
    let sliders = Sliders();
    //element id to create fireplan DOM in (usually a div);
    let cont;
    //containers for head info, target table and schedule table
    let infoCont;
    let targetCont;
    let schedCont;
    let created = false;
    let create = (div, fp) => {
        created = true;
        div.innerHTML = main(fp.head);
        //console.log(fp)
        addTargets(fp.targets)
        addSchedules(fp.schedules)

        infoCont = document.querySelector("#fp-info");
        targetCont = document.querySelector("#fp-targets");
        schedCont = document.querySelector("#fp-schedules");
    }

    let main = (fpHead) => {
        return `<div id="fireplan">` +
            `<h2>Artillery Fire Plan</h2>` +
            `<div id="fp-info">` +
            `<div class="fireplan-input-cont">` +
            `<h4>Fire Plan</h4>` +
            `<input type="text" value="${fpHead.id}" disabled id="fp-id">` +
            `</div >` +
            `<div class="fireplan-input-cont">` +
            `<h4>Supporting</h4>` +
            `<input type="text" value="${fpHead.supporting}" disabled id="fp-supporting">` +
            `</div>` +
            `<div class="fireplan-input-cont">` +
            `<h4>Originator</h4>` +
            `<input type="text" value="${fpHead.originator}" disabled id="fp-originator">` +
            `</div>` +
            `<div class="fireplan-input-cont large-cont">` +
            `<h4>Modifications By</h4>` +
            `<input type="text" value="${fpHead.modifications}" disabled id="fp-modifications">` +
            `</div>` +
            `<div class="fireplan-input-cont">` +
            `<h4>Superimposed</h4>` +
            `<input type="text" value="${fpHead.superimposed}" disabled id="fp-superimposed">` +
            `</div>` +
            `<div class="fireplan-input-cont">` +
            `<h4>H-hour</h4>` +
            `<input type="number" value="${fpHead.hhour}" disabled id="fp-hhour">` +
            `</div>` +
            `<div class="fireplan-input-cont">` +
            `<h4>Sheet</h4>` +
            `<input type="text" value="${fpHead.sheet}" disabled id="fp-sheet">` +
            `</div>` +
            `<div class="fireplan-input-cont large-cont" id="fp-date-cont">` +
            `<h4>Date/time group</h4>` +
            `<input type="date" value="${fpHead.date}" disabled id="fp-date">` +
            `</div>` +
            `</div><br>` +
            `<div id="fp-targets"><h3>Target Information</h3></div>` +
            `<div id="fp-schedules"><h3>Schedule</h3></div>`
    }

    let addTargets = (fpTargets) => {
        if(fpTargets.length <= 0) return;
        let target = document.getElementById("fp-targets");
        for (i = 0; i < fpTargets.length; i++) {
            //console.log(fpTargets[i])
            let div = document.createElement("div");
            div.id = `fp-targetinfo-${i}`;
            div.classList.add("fp-targetinfo");
            div.innerHTML += `<div class="cell fp-line">${i + 1}</div>` +
                `<div class="cell">` +
                `<input type="text" placeholder="(a) Target No" value="${fpTargets[i].no}" class="fp-targetno" id="fp-targetno-${i}" disabled></div>` +
                `<div class="cell">` +
                `<input type="text" placeholder="(b) Description" value="${fpTargets[i].description}" class="fp-targetdescription" id="fp-targetdescription-${i}" disabled></div>` +
                `<div class="cell">` +
                `<input type="text" placeholder="(c) Location" value="${fpTargets[i].location}" class="fp-targetloc" id="fp-targetloc-${i}" disabled></div>` +
                `<div class="cell">` +
                `<input type="text" placeholder="(d) Alt" value="${fpTargets[i].alt}" class="fp-targetalt" id="fp-targetalt-${i}" disabled></div>` +
                `<div class="cell">` +
                `<input type="text" placeholder="(e) Remarks" value="${fpTargets[i].remarks}" class="fp-targetremarks" id="fp-targetremarks-${i}" disabled></div>` +
                `</div>`
            target.appendChild(div);
        }
    }

    let removeTarget = () => {
        let targets = document.querySelectorAll(".fp-targetinfo");
        targets[targets.length - 1].remove();
    }

    let addSchedules = (schedules) => {
        if(schedules.length <= 0) return;
        let scheduleCont = document.getElementById("fp-schedules");
        let idString = "slider-"
        for (i = 0; i < schedules.length; i++) {
            if (schedules[i].times.length > 0) {
                let div = document.createElement("div");
                div.id = `fp-schedule-${i}`;
                div.classList.add("fp-schedule");
                div.innerHTML = `<div class="cell fp-line">${i + 1}</div>` +
                    `<div class="cell"><input type="text" placeholder="(f) Org/Fmn" value="${schedules[i].org}" class="fp-org" id="fp-org-${i}" disabled></div>` +
                    `<div class="cell"><input type="text" placeholder="(g) Call Sign" value="${schedules[i].cs}" class="fp-cs" id="fp-cs-${i}" disabled></div>` +
                    `<div class="cell timings-slider-td"><div class="timings-slider" id="${idString + i}"></div></div>` +
                    `<div class="cell"><textarea placeholder="(i) Remarks" class="fp-remarks remarks" id="fp-remarks-${i}"cols="35" disabled>${schedules[i].remarks}</textarea></div>`;
                scheduleCont.appendChild(div);
            }
        }


        for (i = 0; i < schedules.length; i++) {
            if (schedules[i].times.length > 0) {
                let ele = document.getElementById(idString + i)
                sliders.create(ele, schedules[i].times);
            }
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

    let status = () => { return created }

    let remove = () => {
        created = false;
        cont.innerHTML = "";
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




