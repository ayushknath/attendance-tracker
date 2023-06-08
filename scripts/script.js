const notTrackingStatus = document.querySelector(".not-tracking-status");
const getStartedBtn = document.querySelector(".btn-get-started");
const main = document.querySelector("main");
const clearSubjectsBtn = document.querySelector(".clear-subjects");
const attendanceArr = localStorage.getItem("attendance")
  ? JSON.parse(localStorage.getItem("attendance"))
  : [];

if (attendanceArr.length > 0) {
  notTrackingStatus.style.display = "none";

  // SET SUBJECTS
  document
    .querySelector("main .container")
    .insertAdjacentHTML("beforeend", '<div class="attendance-grid"></div>');

  for (let i = 1; i <= attendanceArr[0]; i++) {
    const subject = `
    <div class="subject-${i}">
        <div class="details">
            <h3 class="subject-name"></h3>
            <div class="data-showcase">
                <p class="attended"></p>
                <p class="total"></p>
            </div>
        </div>

        <div class="percentage">
            <p class="num-percentage"></p>
        </div>
    </div>
    `;

    document
      .querySelector(".attendance-grid")
      .insertAdjacentHTML("beforeend", subject);

    document
      .querySelector(`.subject-${i}`)
      .addEventListener("click", editAttendance);
  }

  clearSubjectsBtn.style.display = "grid";
  clearSubjectsBtn.addEventListener("click", clearSubjects);

  const subjects = Array.from(
    document.querySelector(".attendance-grid").children
  );
  subjects.forEach((subject, index) => {
    const subjectNameElement = subject.children[0].children[0];
    const attendedElement = subject.children[0].children[1].children[0];
    const totalElement = subject.children[0].children[1].children[1];
    const percentElement = subject.children[1].children[0];

    subjectNameElement.textContent = attendanceArr[index + 1].subjectName;

    attendedElement.innerHTML = `Classes attended: <span>${
      attendanceArr[index + 1].attendedClasses
    }</span>`;

    totalElement.innerHTML = `Total classes: <span>${
      attendanceArr[index + 1].totalClasses
    }</span>`;

    percentElement.textContent = `${attendanceArr[index + 1].percentage}%`;

    if (attendanceArr[index + 1].percentage >= 75) {
      percentElement.classList.remove("inadequate");
      percentElement.classList.add("adequate");
    } else {
      percentElement.classList.remove("adequate");
      percentElement.classList.add("inadequate");
    }
  });
} else {
  notTrackingStatus.style.display = "flex";

  clearSubjectsBtn.style.display = "none";
  clearSubjectsBtn.removeEventListener("click", clearSubjects);
}

getStartedBtn.addEventListener("click", inputSubjectNumber);

function inputSubjectNumber() {
  const htmlToInsert = `
  <div class="input-container">
    <div class="cancel"><i class="fa-solid fa-circle-xmark"></i></div>
    <label for="num-subjects">Enter number of subjects</label>
    <input type="text" id="num-subjects" />
    <button type="button" class="btn btn-create-subjects">Next</button>
  </div>
  `;

  insertInputContainer("beforeend", main, htmlToInsert);

  document
    .querySelector(".btn-create-subjects")
    .addEventListener("click", createSubjects);
}

function createSubjects() {
  let numSubjectsValue = document.getElementById("num-subjects").value;

  // CHECK IF INPUT CONTAINS NON-NUMERIC CHARACTER(S) OR ITS EMPTY
  if (numSubjectsValue === "" || isNaN(numSubjectsValue)) {
    return;
  }

  notTrackingStatus.style.display = "none";

  document
    .querySelector("main .container")
    .insertAdjacentHTML("beforeend", '<div class="attendance-grid"></div>');

  numSubjectsValue = parseInt(numSubjectsValue);
  attendanceArr.push(numSubjectsValue);

  for (let i = 1; i <= numSubjectsValue; i++) {
    const subject = `
    <div class="subject-${i}">
        <div class="details">
            <h3 class="subject-name"></h3>
            <div class="data-showcase">
                <p class="attended"></p>
                <p class="total"></p>
            </div>
        </div>

        <div class="percentage">
            <p class="num-percentage"></p>
        </div>
    </div>
    `;

    document
      .querySelector(".attendance-grid")
      .insertAdjacentHTML("beforeend", subject);

    document
      .querySelector(`.subject-${i}`)
      .addEventListener("click", editAttendance);

    attendanceArr.push({
      subjectName: undefined,
      attendedClasses: undefined,
      totalClasses: undefined,
      percentage: undefined,
    });
  }

  clearSubjectsBtn.style.display = "grid";
  clearSubjectsBtn.addEventListener("click", clearSubjects);

  document.querySelector(".input-container").remove();
}

function editAttendance(e) {
  const currSubject = e.target.closest('div[class|="subject"]');
  const subjects = Array.from(currSubject.parentElement.children);
  const subjectNumber = Number(
    Array.from(currSubject.classList[0].split("-")[1])
  );

  // REMOVE EVENT LISTENER FROM EACH SUBJECT
  subjects.forEach((subject) => {
    subject.removeEventListener("click", editAttendance);
  });

  const subjectNameElement = currSubject.children[0].children[0];
  const attendedElement =
    currSubject.children[0].children[0].nextElementSibling.children[0];
  const totalElement =
    currSubject.children[0].children[0].nextElementSibling.children[1];
  const percentElement = currSubject.children[1].children[0];

  const htmlToInsert = `
  <div class="input-container">
        <div class="cancel"><i class="fa-solid fa-circle-xmark"></i></div>
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

        <button class="btn btn-update">Update</button>
    </div>
  `;

  insertInputContainer("beforeend", main, htmlToInsert, subjects);

  document.getElementById("subject-name-input").value =
    subjectNameElement.textContent;
  if (attendedElement.innerText !== "" && totalElement.innerText === "") {
    document.getElementById("classes-attended").value =
      attendedElement.children[0].innerText;
    document.getElementById("classes-total").value = totalElement.innerText;
  } else if (
    attendedElement.innerText === "" &&
    totalElement.innerText !== ""
  ) {
    document.getElementById("classes-attended").value =
      attendedElement.innerText;
    document.getElementById("classes-total").value =
      totalElement.children[0].innerText;
  } else if (
    attendedElement.innerText === "" &&
    totalElement.innerText === ""
  ) {
    document.getElementById("classes-attended").value =
      attendedElement.innerText;
    document.getElementById("classes-total").value = totalElement.innerText;
  } else {
    document.getElementById("classes-attended").value =
      attendedElement.children[0].innerText;
    document.getElementById("classes-total").value =
      totalElement.children[0].innerText;
  }

  Array.from(document.querySelectorAll(".decrease")).forEach((decrease) => {
    decrease.addEventListener("click", () => {
      const nextInput = decrease.nextElementSibling;
      Number(nextInput.value) > 0
        ? (nextInput.value = `${Number(nextInput.value) - 1}`)
        : (nextInput.value = "0");
    });
  });

  Array.from(document.querySelectorAll(".increase")).forEach((increase) => {
    increase.addEventListener("click", () => {
      const previousInput = increase.previousElementSibling;
      previousInput.value = Number(previousInput.value) + 1;
    });
  });

  // LOGIC FOR EDITING ATTENDANCE
  document.querySelector(".btn-update").addEventListener("click", () => {
    let subjectNameVal = document.getElementById("subject-name-input").value;
    let attendedVal = document.getElementById("classes-attended").value;
    let totalVal = document.getElementById("classes-total").value;

    if (subjectNameVal === "" || attendedVal === "" || totalVal === "") {
      return;
    }

    let percentageAttendance = Math.floor(
      (parseInt(attendedVal) / parseInt(totalVal)) * 100
    );

    attendanceArr[subjectNumber].subjectName = subjectNameVal;
    attendanceArr[subjectNumber].attendedClasses = parseInt(attendedVal);
    attendanceArr[subjectNumber].totalClasses = parseInt(totalVal);
    attendanceArr[subjectNumber].percentage = percentageAttendance;

    localStorage.setItem("attendance", JSON.stringify(attendanceArr));

    if (percentageAttendance >= 75) {
      Array.from(currSubject.children[1].children)[0].classList.remove(
        "inadequate"
      );
      Array.from(currSubject.children[1].children)[0].classList.add("adequate");
    } else {
      Array.from(currSubject.children[1].children)[0].classList.remove(
        "adequate"
      );
      Array.from(currSubject.children[1].children)[0].classList.add(
        "inadequate"
      );
    }

    subjectNameElement.innerHTML = subjectNameVal;
    attendedElement.innerHTML = `Classes attended: <span>${attendedVal}</span>`;
    totalElement.innerHTML = `Total classes: <span>${totalVal}</span>`;
    percentElement.innerHTML = `${percentageAttendance}%`;

    // ADD EVENT LISTENER TO SUBJECTS AGAIN
    subjects.forEach((subject) => {
      subject.addEventListener("click", editAttendance);
    });

    document.querySelector(".input-container").remove();
  });
}

function insertInputContainer(
  whereToInsert,
  element,
  whatToInsert,
  subjects = null
) {
  element.insertAdjacentHTML(whereToInsert, whatToInsert);

  document.querySelector(".cancel").addEventListener("click", (e) => {
    e.target.closest(".input-container").remove();

    if (subjects) {
      subjects.forEach((subject) => {
        subject.addEventListener("click", editAttendance);
      });
    }
  });
}

function clearSubjects(e) {
  if (e.target.classList.contains("btn")) {
    localStorage.removeItem("attendance");
    location.reload();
  }
}
