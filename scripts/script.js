const notTrackingStatus = document.querySelector(".not-tracking-status");
const getStartedBtn = document.querySelector(".btn-get-started");
const main = document.querySelector("main");

getStartedBtn.addEventListener("click", inputSubjectNumber);

function inputSubjectNumber() {
    const numSubjectsLabel = document.createElement("label");
    numSubjectsLabel.setAttribute("for", "num-subjects");
    numSubjectsLabel.textContent = "Enter number of subjects";

    const numSubjects = document.createElement("input");
    numSubjects.setAttribute("type", "text");
    numSubjects.id = "num-subjects";

    const createSubBtn = document.createElement("button");
    createSubBtn.setAttribute("type", "button");
    createSubBtn.className = "btn btn-create-subjects";
    createSubBtn.textContent = "Next";

    const inputPanel = document.createElement("div");
    inputPanel.className = "input-container";
    inputPanel.append(numSubjectsLabel, numSubjects, createSubBtn);

    main.appendChild(inputPanel);

    setTimeout(() => { document.body.addEventListener("click", hideInputPanel); }, 10);
}

function hideInputPanel(e) {
    const targetElement = e.target;

    if (targetElement.classList.contains("input-container"))
        return;
    else if (targetElement.classList.contains("btn-create-subjects"))
        createSubjects();
    else if (targetElement.parentElement.classList.contains("input-container"))
        return;
    else
        document.querySelector(".input-container").remove();

    document.body.removeEventListener("click", hideInputPanel);
}

function createSubjects() {
    const inputPanel = document.querySelector(".input-container");
    const numSubjects = document.getElementById("num-subjects");

    // CHECK IF INPUT CONTAINS NON-NUMERIC CHARACTER(S)
    const inputValArr = numSubjects.value.split('');
    for (char of inputValArr) {
        if (isNaN(char)) return;
    }

    notTrackingStatus.style.display = "none";
    inputPanel.remove();

    const attendanceGrid = document.createElement("div");
    attendanceGrid.className = "attendance-grid";
    document.querySelector("main .container").appendChild(attendanceGrid);

    const numSubjectsVal = parseInt(numSubjects.value);
    for (let i = 1; i <= numSubjectsVal; i++) {
        const subject = document.createElement("div");
        subject.className = `subject-${i}`;

        const details = document.createElement("div");
        details.className = "details";

        const subjectName = document.createElement("h3");
        subjectName.className = "subject-name";

        const dataShowcase = document.createElement("div");
        dataShowcase.className = "data-showcase";

        const numAttended = document.createElement("p");
        numAttended.className = "attended";

        const numTotal = document.createElement("p");
        numTotal.className = "total";

        const percentage = document.createElement("div");
        percentage.className = "percentage";

        const numPercentage = document.createElement("p");
        numPercentage.className = "num-percentage";

        dataShowcase.append(numAttended, numTotal);

        details.append(subjectName, dataShowcase);

        percentage.appendChild(numPercentage);

        subject.append(details, percentage);

        attendanceGrid.appendChild(subject);

        subject.addEventListener("click", editAttendance);
    }
}

function editAttendance(e) {
    let currSubject = e.target;

    // LOGIC TO ALWAYS KEEP THE TARGET HAVING CLASS "subject-*" 
    // * REPRESENTS A NUMBER AS IN "subject-1"
    let d = true;
    while (d) {
        let classArr = currSubject.className.split('-');

        if (classArr.length <= 1) {
            currSubject = currSubject.parentElement;
            continue;
        }

        for (c of classArr) {
            if (!isNaN(c)) {
                d = isNaN(c);
                break;
            }
        }

        if (!d) break;
        else currSubject = currSubject.parentElement;
    }

    const subjectNameElement = Array.from(currSubject.children[0].children)[0];
    const attendedElement = Array.from(currSubject.children[0].children)[0].nextElementSibling.children[0];
    const totalElement = Array.from(currSubject.children[0].children)[0].nextElementSibling.children[1];
    const percentElement = Array.from(currSubject.children[1].children)[0];
    // const subjectsArr = Array.from(document.querySelectorAll('.attendance-grid > div[class^="subject-"]'));

    let inputPanelUpdate = document.createElement("div");
    inputPanelUpdate.setAttribute("class", "input-container");

    inputPanelUpdate.innerHTML =
        `<div class="cancel"><i class="fa-solid fa-circle-xmark"></i></div>
    <input type="text" id="subject-name-input" placeholder="Enter subject name">
    <div>
        <label for="classes-attended">Enter number of classes attended</label>
        <div class="attended-input-grp">
            <button type="button" class="decrease"><i class="fa-solid fa-minus"></i></button>
            <input type="number" id="classes-attended" min="0" value="0">
            <button type="button" class="increase"><i class="fa-solid fa-plus"></i></button>
        </div>
    </div>
    <div>
        <label for="classes-total">Enter number of total classes</label>
        <div class="total-input-grp">
            <button type="button" class="decrease"><i class="fa-solid fa-minus"></i></button>
            <input type="number" id="classes-total" min="0" value="0">
            <button type="button" class="increase"><i class="fa-solid fa-plus"></i></button>
        </div>
    </div>

    <button class="btn btn-update">Update</button>`;


    main.appendChild(inputPanelUpdate);

    document.getElementById("subject-name-input").value = subjectNameElement.innerHTML;
    if (attendedElement.innerText !== '' && totalElement.innerText === '') {
        document.getElementById("classes-attended").value = attendedElement.children[0].innerText;
        document.getElementById("classes-total").value = String(Number(totalElement.innerText));
    } else if (attendedElement.innerText === '' && totalElement.innerText !== '') {
        document.getElementById("classes-attended").value = String(Number(attendedElement.innerText));
        document.getElementById("classes-total").value = totalElement.children[0].innerText;
    } else if (attendedElement.innerText === '' && totalElement.innerText === '') {
        document.getElementById("classes-attended").value = String(Number(attendedElement.innerText));
        document.getElementById("classes-total").value = String(Number(totalElement.innerText));
    } else {
        document.getElementById("classes-attended").value = attendedElement.children[0].innerText;
        document.getElementById("classes-total").value = totalElement.children[0].innerText;
    }


    document.querySelector(".cancel").addEventListener("click", () => {
        inputPanelUpdate.remove();
    });

    Array.from(document.querySelectorAll(".decrease")).forEach(decrease => {
        decrease.addEventListener("click", () => {
            let nextInput = decrease.nextElementSibling;
            parseInt(nextInput.value) > 0 ? nextInput.value = `${parseInt(nextInput.value) - 1}` : nextInput.value = '0';
        });
    });

    Array.from(document.querySelectorAll(".increase")).forEach(increase => {
        increase.addEventListener("click", () => {
            let previousInput = increase.previousElementSibling;
            previousInput.value = `${parseInt(previousInput.value) + 1}`;
        });
    });

    // LOGIC FOR EDITING ATTENDANCE
    document.querySelector(".btn-update").addEventListener("click", () => {
        let subjectNameVal = document.getElementById("subject-name-input").value;
        let attendedVal = document.getElementById("classes-attended").value;
        let totalVal = document.getElementById("classes-total").value;
        let percentageAttendance = Math.floor(parseInt(attendedVal) / parseInt(totalVal) * 100);

        if (percentageAttendance >= 75) {
            Array.from(currSubject.children[1].children)[0].classList.remove("inadequate")
            Array.from(currSubject.children[1].children)[0].classList.add("adequate")
        }
        else {
            Array.from(currSubject.children[1].children)[0].classList.remove("adequate");
            Array.from(currSubject.children[1].children)[0].classList.add("inadequate");
        }

        subjectNameElement.innerHTML = subjectNameVal;
        attendedElement.innerHTML = `Classes attended: <span>${attendedVal}</span>`;
        totalElement.innerHTML = `Total classes: <span>${totalVal}</span>`;
        percentElement.innerHTML = `${percentageAttendance}%`;

        inputPanelUpdate.remove();
    });
}