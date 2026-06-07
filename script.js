/* ==================================
   StudyPilot - Final Script (Upgraded)
   ================================== */

// ------------------------------
// NAVIGATION
// ------------------------------

function showSection(sectionId) {
    document.querySelectorAll(".section").forEach(sec => {
        sec.classList.remove("active");
    });

    document.getElementById(sectionId).classList.add("active");
}

// ------------------------------
// DAILY GOAL
// ------------------------------

function saveGoal() {
    const goal = document.getElementById("goalInput").value;
    localStorage.setItem("goal", goal);
    loadGoal();
}

function loadGoal() {
    document.getElementById("goalDisplay").innerText =
        localStorage.getItem("goal") || "No goal set";
}

// ------------------------------
// TASK SYSTEM
// ------------------------------

function addTask() {
    const input = document.getElementById("taskInput");
    const task = input.value.trim();

    if (!task) return;

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);

    localStorage.setItem("tasks", JSON.stringify(tasks));
    input.value = "";

    loadTasks();
}

function deleteTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.splice(index, 1);

    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
}

function loadTasks() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach((task, i) => {
        const li = document.createElement("li");

        li.innerHTML = `
            ${task}
            <button onclick="deleteTask(${i})">X</button>
        `;

        list.appendChild(li);
    });
}

// ------------------------------
// NOTES SYSTEM
// ------------------------------

function saveNotes() {
    const notes = document.getElementById("notesArea").value;
    localStorage.setItem("notes", notes);
}

function loadNotes() {
    document.getElementById("notesArea").value =
        localStorage.getItem("notes") || "";
}

// ------------------------------
// EXAM COUNTDOWN
// ------------------------------

function saveExamDate() {
    const date = document.getElementById("examDate").value;
    localStorage.setItem("examDate", date);
    updateCountdown();
}

function updateCountdown() {
    const date = localStorage.getItem("examDate");

    if (!date) return;

    const diff =
        new Date(date) - new Date();

    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    document.getElementById("countdown").innerText =
        days >= 0
            ? days + " days left"
            : "Exam passed";
}

// ------------------------------
// STUDY STREAK
// ------------------------------

function updateStreak() {
    const today = new Date().toDateString();
    const last = localStorage.getItem("lastVisit");

    let streak = parseInt(localStorage.getItem("streak")) || 0;

    if (last !== today) {
        streak++;
        localStorage.setItem("streak", streak);
        localStorage.setItem("lastVisit", today);
    }

    document.getElementById("streak").innerText =
        streak + " Days";
}

// ------------------------------
// POMODORO TIMER
// ------------------------------

let timer;
let timeLeft = 1500;

function updateTimerDisplay() {
    let m = Math.floor(timeLeft / 60);
    let s = timeLeft % 60;

    document.getElementById("timerDisplay").innerText =
        `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function startTimer() {
    clearInterval(timer);

    timer = setInterval(() => {
        timeLeft--;

        updateTimerDisplay();

        if (timeLeft <= 0) {
            clearInterval(timer);
            alert("Pomodoro complete!");
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    timeLeft = 1500;
    updateTimerDisplay();
}

// ------------------------------
// VIDEO SYSTEM (NEW SMART VERSION)
// ------------------------------

let videosData = [];

async function loadVideo() {
    try {
        const res = await fetch("videos.json");
        videosData = await res.json();

        const allVideos = [];

        Object.values(videosData).forEach(subject => {
            subject.forEach(v => allVideos.push(v));
        });

        const todayIndex = new Date().getDate() % allVideos.length;

        const selected = allVideos[todayIndex];

        document.getElementById("videoTitle").innerText =
            selected.title + " (" + selected.teacher + ")";

        document.getElementById("videoLink").onclick = () => {
            const url =
                "https://www.youtube.com/results?search_query=" +
                encodeURIComponent(selected.query);

            window.open(url, "_blank");
        };

    } catch (e) {
        console.log("videos.json not found");
    }
}

// ------------------------------
// INIT
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
