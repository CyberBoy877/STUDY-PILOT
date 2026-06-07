/* ==================================
   StudyPilot - Main JavaScript
   ================================== */

// ------------------------------
// Navigation
// ------------------------------

function showSection(sectionId) {

    const sections =
        document.querySelectorAll(".section");

    sections.forEach(section => {
        section.classList.remove("active");
    });

    document
        .getElementById(sectionId)
        .classList.add("active");
}

// ------------------------------
// Daily Goal
// ------------------------------

function saveGoal() {

    const goal =
        document.getElementById("goalInput").value;

    localStorage.setItem("goal", goal);

    loadGoal();
}

function loadGoal() {

    const goal =
        localStorage.getItem("goal");

    document.getElementById("goalDisplay")
        .textContent =
        goal || "No goal set yet.";
}

// ------------------------------
// Tasks
// ------------------------------

function addTask() {

    const input =
        document.getElementById("taskInput");

    const task =
        input.value.trim();

    if (!task) return;

    let tasks =
        JSON.parse(
            localStorage.getItem("tasks")
        ) || [];

    tasks.push(task);

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

    input.value = "";

    loadTasks();
}

function deleteTask(index) {

    let tasks =
        JSON.parse(
            localStorage.getItem("tasks")
        ) || [];

    tasks.splice(index, 1);

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

    loadTasks();
}

function loadTasks() {

    const taskList =
        document.getElementById("taskList");

    taskList.innerHTML = "";

    let tasks =
        JSON.parse(
            localStorage.getItem("tasks")
        ) || [];

    tasks.forEach((task, index) => {

        const li =
            document.createElement("li");

        li.innerHTML = `
            ${task}
            <button
            onclick="deleteTask(${index})"
            style="float:right;">
                Delete
            </button>
        `;

        taskList.appendChild(li);
    });
}

// ------------------------------
// Notes
// ------------------------------

function saveNotes() {

    const notes =
        document.getElementById("notesArea").value;

    localStorage.setItem(
        "notes",
        notes
    );

    alert("Notes Saved!");
}

function loadNotes() {

    const notes =
        localStorage.getItem("notes") || "";

    document.getElementById("notesArea")
        .value = notes;
}

// ------------------------------
// Exam Countdown
// ------------------------------

function saveExamDate() {

    const date =
        document.getElementById("examDate").value;

    localStorage.setItem(
        "examDate",
        date
    );

    updateCountdown();
}

function updateCountdown() {

    const savedDate =
        localStorage.getItem("examDate");

    if (!savedDate) return;

    const examDate =
        new Date(savedDate);

    const today =
        new Date();

    const difference =
        examDate - today;

    const days =
        Math.ceil(
            difference /
            (1000 * 60 * 60 * 24)
        );

    if (days >= 0) {

        document.getElementById("countdown")
            .textContent =
            days + " days remaining";

    } else {

        document.getElementById("countdown")
            .textContent =
            "Exam date passed";
    }
}

// ------------------------------
// Study Streak
// ------------------------------

function updateStreak() {

    const today =
        new Date().toDateString();

    const lastVisit =
        localStorage.getItem("lastVisit");

    let streak =
        Number(
            localStorage.getItem("streak")
        ) || 0;

    if (lastVisit !== today) {

        streak++;

        localStorage.setItem(
            "streak",
            streak
        );

        localStorage.setItem(
            "lastVisit",
            today
        );
    }

    document.getElementById("streak")
        .textContent =
        streak + " Days";
}

// ------------------------------
// Pomodoro Timer
// ------------------------------

let timer;
let totalSeconds = 1500;

function updateTimerDisplay() {

    const minutes =
        Math.floor(totalSeconds / 60);

    const seconds =
        totalSeconds % 60;

    document.getElementById(
        "timerDisplay"
    ).textContent =
        String(minutes).padStart(2, "0")
        + ":" +
        String(seconds).padStart(2, "0");
}

function startTimer() {

    clearInterval(timer);

    timer = setInterval(() => {

        totalSeconds--;

        updateTimerDisplay();

        if (totalSeconds <= 0) {

            clearInterval(timer);

            alert(
                "Pomodoro Session Complete!"
            );
        }

    }, 1000);
}

function resetTimer() {

    clearInterval(timer);

    totalSeconds = 1500;

    updateTimerDisplay();
}

// ------------------------------
// Videos
// ------------------------------

async function loadVideo() {

    try {

        const response =
            await fetch("videos.json");

        const videos =
            await response.json();

        const allVideos = [];

        Object.keys(videos).forEach(subject => {

            videos[subject].forEach(video => {

                allVideos.push(video);
            });
        });

        if (allVideos.length === 0) return;

        const today =
            new Date().getDate();

        const selected =
            allVideos[
                today % allVideos.length
            ];

        document.getElementById(
            "videoTitle"
        ).textContent =
            selected.title;

        document.getElementById(
            "videoLink"
        ).href =
            selected.url;

    } catch (error) {

        console.log(
            "videos.json not found"
        );
    }
}

// ------------------------------
// Initial Load
// ------------------------------

window.onload = () => {

    loadGoal();

    loadTasks();

    loadNotes();

    updateCountdown();

    updateStreak();

    updateTimerDisplay();

    loadVideo();
};
