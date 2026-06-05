const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskCategory = document.getElementById("taskCategory");
const taskPriority = document.getElementById("taskPriority");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const searchTask = document.getElementById("searchTask");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateStats() {
    document.getElementById("totalTasks").textContent =
        tasks.length;

    document.getElementById("completedTasks").textContent =
        tasks.filter(task => task.completed).length;

    document.getElementById("pendingTasks").textContent =
        tasks.filter(task => !task.completed).length;
}

function getFilteredTasks() {

    let filtered = [...tasks];

    if (currentFilter === "completed") {
        filtered = filtered.filter(
            task => task.completed
        );
    }

    if (currentFilter === "pending") {
        filtered = filtered.filter(
            task => !task.completed
        );
    }

    const searchValue =
        searchTask.value.toLowerCase();

    if (searchValue) {
        filtered = filtered.filter(task =>
            task.text
                .toLowerCase()
                .includes(searchValue)
        );
    }

    return filtered;
}

function renderTasks() {

    taskList.innerHTML = "";

    const filteredTasks =
        getFilteredTasks();

    filteredTasks.forEach(task => {

        const originalIndex =
            tasks.indexOf(task);

        const taskDiv =
            document.createElement("div");

        taskDiv.className =
            task.completed
                ? "task completed"
                : "task";

        taskDiv.innerHTML = `
            <div class="task-top">
                <strong>${task.text}</strong>
                <span>${task.priority}</span>
            </div>

            <div class="task-info">
                ${task.category}
                |
                ${task.date || "No Date"}
            </div>

            <div class="task-actions">

                <button
                    class="complete-btn"
                    onclick="toggleTask(${originalIndex})"
                >
                    ✓
                </button>

                <button
                    class="edit-btn"
                    onclick="editTask(${originalIndex})"
                >
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask(${originalIndex})"
                >
                    Delete
                </button>

            </div>
        `;

        taskList.appendChild(taskDiv);
    });

    updateStats();
}

addBtn.addEventListener("click", () => {

    const text =
        taskInput.value.trim();

    if (!text) return;

    tasks.push({
        text: text,
        date: taskDate.value,
        category: taskCategory.value,
        priority: taskPriority.value,
        completed: false
    });

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskDate.value = "";
});

function toggleTask(index) {

    tasks[index].completed =
        !tasks[index].completed;

    saveTasks();
    renderTasks();
}

function deleteTask(index) {

    tasks.splice(index, 1);

    saveTasks();
    renderTasks();
}

function editTask(index) {

    const newTask =
        prompt(
            "Edit task",
            tasks[index].text
        );

    if (
        newTask !== null &&
        newTask.trim() !== ""
    ) {
        tasks[index].text =
            newTask.trim();

        saveTasks();
        renderTasks();
    }
}

searchTask.addEventListener(
    "keyup",
    renderTasks
);

const filterBtns =
    document.querySelectorAll(
        ".filter-btn"
    );

filterBtns.forEach(btn => {

    btn.addEventListener(
        "click",
        () => {

            filterBtns.forEach(b =>
                b.classList.remove(
                    "active"
                )
            );

            btn.classList.add(
                "active"
            );

            currentFilter =
                btn.dataset.filter;

            renderTasks();
        }
    );
});

const themeToggle =
    document.getElementById(
        "themeToggle"
    );

if (
    localStorage.getItem("theme") ===
    "dark"
) {
    document.body.classList.add(
        "dark-mode"
    );

    themeToggle.textContent =
        "Light Mode";
}

themeToggle.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark-mode"
        );

        if (
            document.body.classList.contains(
                "dark-mode"
            )
        ) {

            localStorage.setItem(
                "theme",
                "dark"
            );

            themeToggle.textContent =
                "Light Mode";
        }
        else {

            localStorage.setItem(
                "theme",
                "light"
            );

            themeToggle.textContent =
                "Dark Mode";
        }
    }
);

renderTasks();