// ==========================================
// DOM ELEMENTS
// ==========================================

const taskForm =
    document.getElementById("taskForm");

const taskInput =
    document.getElementById("taskInput");

const taskDate =
    document.getElementById("taskDate");

const taskList =
    document.getElementById("taskList");

const emptyMessage =
    document.getElementById("emptyMessage");

const taskCount =
    document.getElementById("taskCount");

const progressPercentage =
    document.getElementById("progressPercentage");

const progressFill =
    document.getElementById("progressFill");

const progressText =
    document.getElementById("progressText");

const todayDate =
    document.getElementById("todayDate");

const historyList =
    document.getElementById("historyList");

const streakElement =
    document.getElementById("streak");

const themeBtn =
    document.getElementById("themeBtn");

const filterButtons =
    document.querySelectorAll(".filter-btn");

const currentUserName =
    document.getElementById("currentUserName");

const switchUserBtn =
    document.getElementById("switchUserBtn");

const profileModal =
    document.getElementById("profileModal");

const profileList =
    document.getElementById("profileList");

const newProfileInput =
    document.getElementById("newProfileInput");

const addProfileBtn =
    document.getElementById("addProfileBtn");


// ==========================================
// APPLICATION STATE
// ==========================================

let tasks = [];

let currentFilter = "all";

let currentUser = "";


// ==========================================
// DATE HELPERS
// ==========================================

function getToday() {

    const date =
        new Date();


    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;
}


function formatDate(dateString) {

    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );
}


function getPreviousDate(dateString) {

    const date =
        new Date(
            dateString + "T00:00:00"
        );


    date.setDate(
        date.getDate() - 1
    );


    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;
}


// ==========================================
// PROFILE STORAGE
// ==========================================

function getProfiles() {

    const savedProfiles =
        localStorage.getItem(
            "nivyanProfiles"
        );


    if (savedProfiles) {

        try {

            return JSON.parse(
                savedProfiles
            );

        } catch (error) {

            localStorage.removeItem(
                "nivyanProfiles"
            );
        }
    }


    return [];
}


function saveProfiles(profiles) {

    localStorage.setItem(
        "nivyanProfiles",
        JSON.stringify(profiles)
    );
}


// ==========================================
// CURRENT USER
// ==========================================

function saveCurrentUser() {

    localStorage.setItem(
        "nivyanCurrentUser",
        currentUser
    );
}


function loadCurrentUser() {

    const profiles =
        getProfiles();


    const savedUser =
        localStorage.getItem(
            "nivyanCurrentUser"
        );


    if (
        savedUser &&
        profiles.includes(savedUser)
    ) {

        currentUser =
            savedUser;

    } else {

        currentUser =
            "";
    }
}


// ==========================================
// USER-SPECIFIC STORAGE KEY
// ==========================================

function getTaskStorageKey() {

    return `nivyanTasks_${currentUser}`;
}


// ==========================================
// LOAD TASKS
// ==========================================

function loadTasks() {

    if (!currentUser) {

        tasks = [];

        return;
    }


    const savedTasks =
        localStorage.getItem(
            getTaskStorageKey()
        );


    if (savedTasks) {

        try {

            tasks =
                JSON.parse(
                    savedTasks
                );

        } catch (error) {

            tasks = [];
        }

    } else {

        tasks = [];
    }
}


// ==========================================
// SAVE TASKS
// ==========================================

function saveTasks() {

    if (!currentUser) {

        return;
    }


    localStorage.setItem(
        getTaskStorageKey(),
        JSON.stringify(tasks)
    );
}


// ==========================================
// RENDER PROFILES
// ==========================================

function renderProfiles() {

    profileList.innerHTML = "";


    const profiles =
        getProfiles();


    profiles.forEach(
        function (profile) {

            const profileRow =
                document.createElement(
                    "div"
                );


            profileRow.classList.add(
                "profile-row"
            );


            // SELECT PROFILE

            const selectButton =
                document.createElement(
                    "button"
                );


            selectButton.type =
                "button";


            selectButton.classList.add(
                "profile-btn"
            );


            selectButton.textContent =
                `👤 ${profile}`;


            selectButton.addEventListener(
                "click",
                function () {

                    selectUser(profile);
                }
            );


            // DELETE PROFILE

            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.type =
                "button";


            deleteButton.classList.add(
                "profile-delete-btn"
            );


            deleteButton.textContent =
                "🗑️";


            deleteButton.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();

                    deleteProfile(profile);
                }
            );


            profileRow.append(
                selectButton,
                deleteButton
            );


            profileList.appendChild(
                profileRow
            );
        }
    );
}


// ==========================================
// SELECT USER
// ==========================================

function selectUser(profile) {

    currentUser =
        profile;


    saveCurrentUser();


    loadTasks();


    currentUserName.textContent =
        currentUser;


    profileModal.classList.add(
        "hidden"
    );


    taskDate.value =
        getToday();


    currentFilter =
        "all";


    filterButtons.forEach(
        function (button) {

            button.classList.remove(
                "active"
            );


            if (
                button.dataset.filter ===
                "all"
            ) {

                button.classList.add(
                    "active"
                );
            }
        }
    );


    renderAll();
}


// ==========================================
// DELETE PROFILE
// ==========================================

function deleteProfile(profile) {

    const profiles =
        getProfiles();


    if (
        profiles.length === 1
    ) {

        alert(
            "At least one profile must remain."
        );

        return;
    }


    const confirmed =
        confirm(
            `Are you sure you want to delete ${profile}?\n\nAll tasks and history of this profile will also be deleted.`
        );


    if (!confirmed) {

        return;
    }


    const updatedProfiles =
        profiles.filter(
            function (item) {

                return item !== profile;
            }
        );


    saveProfiles(
        updatedProfiles
    );


    localStorage.removeItem(
        `nivyanTasks_${profile}`
    );


    if (
        currentUser === profile
    ) {

        currentUser =
            updatedProfiles[0];


        saveCurrentUser();


        loadTasks();


        currentUserName.textContent =
            currentUser;


        taskDate.value =
            getToday();


        currentFilter =
            "all";


        filterButtons.forEach(
            function (button) {

                button.classList.remove(
                    "active"
                );


                if (
                    button.dataset.filter ===
                    "all"
                ) {

                    button.classList.add(
                        "active"
                    );
                }
            }
        );


        renderAll();
    }


    renderProfiles();
}


// ==========================================
// OPEN PROFILE MODAL
// ==========================================

function openProfileModal() {

    renderProfiles();


    profileModal.classList.remove(
        "hidden"
    );


    newProfileInput.focus();
}


// ==========================================
// SWITCH USER
// ==========================================

switchUserBtn.addEventListener(
    "click",
    function () {

        openProfileModal();
    }
);


// ==========================================
// ADD NEW PROFILE
// ==========================================

addProfileBtn.addEventListener(
    "click",
    function () {

        const name =
            newProfileInput.value.trim();


        if (name === "") {

            alert(
                "Please enter your name."
            );

            return;
        }


        const profiles =
            getProfiles();


        const alreadyExists =
            profiles.some(
                function (profile) {

                    return (
                        profile.toLowerCase() ===
                        name.toLowerCase()
                    );
                }
            );


        if (alreadyExists) {

            alert(
                "This profile already exists."
            );

            return;
        }


        profiles.push(name);


        saveProfiles(
            profiles
        );


        newProfileInput.value =
            "";


        /*
            If this is the first profile,
            automatically select it.
        */

        if (
            profiles.length === 1
        ) {

            selectUser(name);

            return;
        }


        renderProfiles();
    }
);


// ==========================================
// ENTER KEY FOR PROFILE
// ==========================================

newProfileInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key ===
            "Enter"
        ) {

            addProfileBtn.click();
        }
    }
);


// ==========================================
// ADD TASK
// ==========================================

taskForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        if (!currentUser) {

            alert(
                "Please create a profile first."
            );

            openProfileModal();

            return;
        }


        const text =
            taskInput.value.trim();


        const date =
            taskDate.value ||
            getToday();


        if (text === "") {

            return;
        }


        const newTask = {

            id: Date.now(),

            text: text,

            completed: false,

            date: date,

            createdAt:
                new Date().toISOString(),

            completedAt: null
        };


        tasks.push(
            newTask
        );


        saveTasks();


        renderAll();


        taskInput.value =
            "";


        taskInput.focus();
    }
);


// ==========================================
// RENDER TASKS
// ==========================================

function renderTasks() {

    taskList.innerHTML =
        "";


    const selectedDate =
        taskDate.value ||
        getToday();


    let filteredTasks =
        tasks.filter(
            function (task) {

                return (
                    task.date ===
                    selectedDate
                );
            }
        );


    if (
        currentFilter ===
        "active"
    ) {

        filteredTasks =
            filteredTasks.filter(
                function (task) {

                    return !task.completed;
                }
            );
    }


    if (
        currentFilter ===
        "completed"
    ) {

        filteredTasks =
            filteredTasks.filter(
                function (task) {

                    return task.completed;
                }
            );
    }


    taskCount.textContent =
        filteredTasks.length;


    if (
        filteredTasks.length === 0
    ) {

        emptyMessage.style.display =
            "block";

    } else {

        emptyMessage.style.display =
            "none";
    }


    filteredTasks.forEach(
        function (task) {

            const li =
                document.createElement(
                    "li"
                );


            li.classList.add(
                "task-item"
            );


            if (task.completed) {

                li.classList.add(
                    "completed"
                );
            }


            // CHECKBOX

            const checkbox =
                document.createElement(
                    "input"
                );


            checkbox.type =
                "checkbox";


            checkbox.classList.add(
                "task-checkbox"
            );


            checkbox.checked =
                task.completed;


            checkbox.dataset.id =
                task.id;


            // TASK TEXT

            const span =
                document.createElement(
                    "span"
                );


            span.classList.add(
                "task-text"
            );


            span.textContent =
                task.text;


            // ACTIONS

            const actions =
                document.createElement(
                    "div"
                );


            actions.classList.add(
                "task-actions"
            );


            // EDIT

            const editBtn =
                document.createElement(
                    "button"
                );


            editBtn.textContent =
                "Edit";


            editBtn.classList.add(
                "edit-btn"
            );


            editBtn.dataset.action =
                "edit";


            editBtn.dataset.id =
                task.id;


            // DELETE

            const deleteBtn =
                document.createElement(
                    "button"
                );


            deleteBtn.textContent =
                "Delete";


            deleteBtn.classList.add(
                "delete-btn"
            );


            deleteBtn.dataset.action =
                "delete";


            deleteBtn.dataset.id =
                task.id;


            actions.append(
                editBtn,
                deleteBtn
            );


            li.append(
                checkbox,
                span,
                actions
            );


            taskList.appendChild(
                li
            );
        }
    );
}


// ==========================================
// TOGGLE TASK
// ==========================================

function toggleTask(id) {

    const task =
        tasks.find(
            function (task) {

                return task.id === id;
            }
        );


    if (!task) {

        return;
    }


    task.completed =
        !task.completed;


    if (task.completed) {

        task.completedAt =
            new Date().toISOString();

    } else {

        task.completedAt =
            null;
    }


    saveTasks();


    /*
        Important:
        Completing an old date also
        recalculates streak/history.
    */

    renderAll();
}


// ==========================================
// DELETE TASK
// ==========================================

function deleteTask(id) {

    tasks =
        tasks.filter(
            function (task) {

                return task.id !== id;
            }
        );


    saveTasks();


    renderAll();
}


// ==========================================
// EDIT TASK
// ==========================================

function editTask(id) {

    const task =
        tasks.find(
            function (task) {

                return task.id === id;
            }
        );


    if (!task) {

        return;
    }


    const newText =
        prompt(
            "Edit your target:",
            task.text
        );


    if (
        newText === null
    ) {

        return;
    }


    const cleanText =
        newText.trim();


    if (
        cleanText === ""
    ) {

        return;
    }


    task.text =
        cleanText;


    saveTasks();


    renderAll();
}


// ==========================================
// EVENT DELEGATION
// ==========================================

taskList.addEventListener(
    "click",
    function (event) {

        const action =
            event.target.dataset.action;


        const id =
            Number(
                event.target.dataset.id
            );


        if (
            action ===
            "delete"
        ) {

            deleteTask(id);
        }


        if (
            action ===
            "edit"
        ) {

            editTask(id);
        }
    }
);


// ==========================================
// CHECKBOX EVENT
// ==========================================

taskList.addEventListener(
    "change",
    function (event) {

        if (
            event.target.matches(
                ".task-checkbox"
            )
        ) {

            const id =
                Number(
                    event.target.dataset.id
                );


            toggleTask(id);
        }
    }
);


// ==========================================
// FILTER BUTTONS
// ==========================================

filterButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                currentFilter =
                    button.dataset.filter;


                filterButtons.forEach(
                    function (btn) {

                        btn.classList.remove(
                            "active"
                        );
                    }
                );


                button.classList.add(
                    "active"
                );


                renderTasks();
            }
        );
    }
);


// ==========================================
// DATE CHANGE
// ==========================================

taskDate.addEventListener(
    "change",
    function () {

        renderTasks();
    }
);


// ==========================================
// TODAY'S PROGRESS
// ==========================================

function renderTodayProgress() {

    const today =
        getToday();


    const todayTasks =
        tasks.filter(
            function (task) {

                return task.date ===
                    today;
            }
        );


    const total =
        todayTasks.length;


    const completed =
        todayTasks.filter(
            function (task) {

                return task.completed;
            }
        ).length;


    let percentage = 0;


    if (
        total > 0
    ) {

        percentage =
            Math.round(
                (completed / total) *
                100
            );
    }


    todayDate.textContent =
        formatDate(today);


    progressPercentage.textContent =
        `${percentage}%`;


    progressFill.style.width =
        `${percentage}%`;


    progressText.textContent =
        `${completed} / ${total} completed`;
}


// ==========================================
// GET DAY STATUS
// ==========================================

function getDayStatus(date) {

    const dayTasks =
        tasks.filter(
            function (task) {

                return task.date === date;
            }
        );


    const total =
        dayTasks.length;


    const completed =
        dayTasks.filter(
            function (task) {

                return task.completed;
            }
        ).length;


    return {

        total: total,

        completed: completed,

        /*
            A day is successful when
            at least one target is completed.
        */

        successful:
            completed > 0,

        /*
            A recorded day with zero
            completed targets breaks streak.
        */

        broken:
            total > 0 &&
            completed === 0
    };
}


// ==========================================
// GET ALL RECORDED DATES
// ==========================================

function getRecordedDates() {

    return [
        ...new Set(
            tasks.map(
                function (task) {

                    return task.date;
                }
            )
        )
    ].sort(
        function (a, b) {

            return a.localeCompare(b);
        }
    );
}


// ==========================================
// FIND LATEST SUCCESSFUL DAY
// ==========================================

function getLatestSuccessfulDate() {

    const successfulDates =
        getRecordedDates().filter(
            function (date) {

                return getDayStatus(
                    date
                ).successful;
            }
        );


    if (
        successfulDates.length === 0
    ) {

        return null;
    }


    return successfulDates[
        successfulDates.length - 1
    ];
}


// ==========================================
// CALCULATE STREAK
// ==========================================

function calculateStreak() {

    /*
        We don't force the calculation
        to start from today.

        Instead, we find the latest
        successful day in the history.
    */

    let latestSuccessfulDate =
        getLatestSuccessfulDate();


    if (
        !latestSuccessfulDate
    ) {

        streakElement.textContent =
            "🔥 0 day streak";

        return;
    }


    let streak = 0;

    let currentDate =
        latestSuccessfulDate;


    while (true) {

        const status =
            getDayStatus(
                currentDate
            );


        /*
            At least one completed
            target = successful day.
        */

        if (
            status.successful
        ) {

            streak++;

        } else {

            /*
                0 completed on a recorded
                day = streak break.
            */

            break;
        }


        currentDate =
            getPreviousDate(
                currentDate
            );
    }


    streakElement.textContent =
        `🔥 ${streak} day streak`;
}


// ==========================================
// HISTORY
// ==========================================

function renderHistory() {

    historyList.innerHTML =
        "";


    const dates =
        getRecordedDates();


    dates.reverse();


    dates.forEach(
        function (date, index) {

            const status =
                getDayStatus(date);


            const total =
                status.total;


            const completed =
                status.completed;


            const percentage =
                total > 0
                    ? Math.round(
                        (completed / total) *
                        100
                    )
                    : 0;


            const previousDate =
                getPreviousDate(
                    date
                );


            const previousStatus =
                getDayStatus(
                    previousDate
                );


            const card =
                document.createElement(
                    "div"
                );


            card.classList.add(
                "history-card"
            );


            // HEADER

            const header =
                document.createElement(
                    "div"
                );


            header.classList.add(
                "history-header"
            );


            const dateText =
                document.createElement(
                    "span"
                );


            dateText.classList.add(
                "history-date"
            );


            dateText.textContent =
                formatDate(date);


            const stats =
                document.createElement(
                    "span"
                );


            stats.classList.add(
                "history-stats"
            );


            stats.textContent =
                `${completed}/${total} completed`;


            header.append(
                dateText,
                stats
            );


            // PROGRESS BAR

            const progress =
                document.createElement(
                    "div"
                );


            progress.classList.add(
                "history-progress"
            );


            const progressInner =
                document.createElement(
                    "div"
                );


            progressInner.classList.add(
                "history-progress-fill"
            );


            progressInner.style.width =
                `${percentage}%`;


            progress.appendChild(
                progressInner
            );


            // STATUS TEXT

            const statusText =
                document.createElement(
                    "p"
                );


            statusText.classList.add(
                "history-status"
            );


            if (
                completed === 0
            ) {

                statusText.textContent =
                    "❌ Streak Broken — No target completed.";

                statusText.classList.add(
                    "history-break"
                );

            } else if (
                !previousStatus.successful
            ) {

                statusText.textContent =
                    "🔥 Streak Started — Keep it going!";

                statusText.classList.add(
                    "history-start"
                );

            } else if (
                percentage === 100
            ) {

                statusText.textContent =
                    "🔥 Perfect day — Streak continues!";

                statusText.classList.add(
                    "history-success"
                );

            } else {

                statusText.textContent =
                    "💪 Progress made — Streak continues!";

                statusText.classList.add(
                    "history-success"
                );
            }


            card.append(
                header,
                progress,
                statusText
            );


            historyList.appendChild(
                card
            );
        }
    );


    if (
        dates.length === 0
    ) {

        historyList.innerHTML =
            `
            <p class="empty-message">
                Your consistency journey
                will appear here.
            </p>
            `;
    }
}


// ==========================================
// THEME
// ==========================================

themeBtn.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark"
        );


        if (
            document.body.classList.contains(
                "dark"
            )
        ) {

            themeBtn.textContent =
                "☀️";


            localStorage.setItem(
                "nivyanTheme",
                "dark"
            );

        } else {

            themeBtn.textContent =
                "🌙";


            localStorage.setItem(
                "nivyanTheme",
                "light"
            );
        }
    }
);


// ==========================================
// LOAD THEME
// ==========================================

function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            "nivyanTheme"
        );


    if (
        savedTheme ===
        "dark"
    ) {

        document.body.classList.add(
            "dark"
        );


        themeBtn.textContent =
            "☀️";
    }
}


// ==========================================
// RENDER EVERYTHING
// ==========================================

function renderAll() {

    renderTasks();

    renderTodayProgress();

    renderHistory();

    calculateStreak();
}


// ==========================================
// SHOW PROFILE MODAL
// ==========================================

function showProfileModal() {

    renderProfiles();


    profileModal.classList.remove(
        "hidden"
    );


    newProfileInput.focus();
}


// ==========================================
// INITIALIZE APPLICATION
// ==========================================

function initializeApp() {

    loadTheme();

    loadCurrentUser();

    loadTasks();


    if (
        currentUser
    ) {

        currentUserName.textContent =
            currentUser;

    } else {

        currentUserName.textContent =
            "Create Profile";
    }


    taskDate.value =
        getToday();


    renderAll();


    /*
        First-time user:
        profile creation modal opens automatically.
    */

    if (
        !currentUser
    ) {

        showProfileModal();
    }
}


// ==========================================
// START APPLICATION
// ==========================================

initializeApp();