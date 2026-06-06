const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskCategory = document.getElementById("taskCategory");
const taskPriority = document.getElementById("taskPriority");
const taskDescription = document.getElementById("taskDescription");
const addTaskBtn = document.getElementById("addTaskBtn");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const categoryFilter = document.getElementById("categoryFilter");

const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completionRate = document.getElementById("completionRate");

const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

const taskCounter = document.getElementById("taskCounter");
const themeToggle = document.getElementById("themeToggle");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

addTaskBtn.addEventListener("click", addTask);

searchInput.addEventListener("input", renderTasks);
statusFilter.addEventListener("change", renderTasks);
categoryFilter.addEventListener("change", renderTasks);

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");

    localStorage.setItem(
        "theme",
        document.body.classList.contains("light")
            ? "light"
            : "dark"
    );
});

loadTheme();

function loadTheme() {

    const theme = localStorage.getItem("theme");

    if(theme === "light"){
        document.body.classList.add("light");
    }
}

function saveTasks() {
    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

function addTask() {

    const title = taskInput.value.trim();

    if(title === "") {
        alert("Please enter a task title");
        return;
    }

    const task = {
        id: Date.now(),
        title,
        description: taskDescription.value.trim(),
        date: taskDate.value,
        category: taskCategory.value,
        priority: taskPriority.value,
        completed: false
    };

    tasks.push(task);

    saveTasks();

    clearForm();

    renderTasks();
    updateStats();
}

function clearForm() {

    taskInput.value = "";
    taskDescription.value = "";
    taskDate.value = "";
    taskCategory.selectedIndex = 0;
    taskPriority.selectedIndex = 0;
}

function renderTasks() {

    const search = searchInput.value.toLowerCase();

    const status = statusFilter.value;

    const category = categoryFilter.value;

    let filtered = tasks.filter(task => {

        const matchesSearch =
            (task.title || "")
                .toLowerCase()
                .includes(search) ||

            (task.description || "")
                .toLowerCase()
                .includes(search);
                
        const matchesStatus =
            status === "all"
            ? true
            : status === "completed"
            ? task.completed
            : !task.completed;

        const matchesCategory =
            category === "all"
            ? true
            : task.category === category;

        return (
            matchesSearch &&
            matchesStatus &&
            matchesCategory
        );
    });

    taskCounter.textContent =
        `${filtered.length} Tasks`;

    if(filtered.length === 0){

        taskList.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-clipboard-list"></i>
                <h3>No Tasks Found</h3>
                <p>Create a task to get started.</p>
            </div>
        `;

        return;
    }

    taskList.innerHTML = "";

    filtered.forEach(task => {

        const card = document.createElement("div");

        card.className =
            task.completed
            ? "task-card completed"
            : "task-card";

        card.innerHTML = `
            <div class="task-top">

                <div>

                    <div class="task-title">
                        ${task.title}
                    </div>

                </div>

            </div>

            <div class="task-description">
                ${task.description || "No description"}
            </div>

            <div class="task-meta">

                <span class="badge category">
                    ${task.category}
                </span>

                <span class="badge date">
                    ${task.date || "No Date"}
                </span>

                <span class="badge priority-${task.priority.toLowerCase()}">
                    ${task.priority}
                </span>

            </div>

            <div class="task-actions">

                <button
                    class="complete-btn"
                    onclick="toggleTask(${task.id})"
                >
                    ${task.completed ? "Undo" : "Complete"}
                </button>

                <button
                    class="edit-btn"
                    onclick="editTask(${task.id})"
                >
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})"
                >
                    Delete
                </button>

            </div>
        `;

        taskList.appendChild(card);
    });
}

function toggleTask(id) {

    tasks = tasks.map(task => {

        if(task.id === id){
            task.completed = !task.completed;
        }

        return task;
    });

    saveTasks();

    renderTasks();
    updateStats();
}

function deleteTask(id) {

    const confirmDelete =
        confirm("Delete this task?");

    if(!confirmDelete) return;

    tasks = tasks.filter(
        task => task.id !== id
    );

    saveTasks();

    renderTasks();
    updateStats();
}

function editTask(id) {

    const task =
        tasks.find(t => t.id === id);

    if(!task) return;

    const newTitle =
        prompt(
            "Edit title",
            task.title
        );

    if(newTitle === null) return;

    const newDescription =
        prompt(
            "Edit description",
            task.description
        );

    task.title = newTitle.trim();
    task.description =
        newDescription || "";

    saveTasks();

    renderTasks();
}

function updateStats() {

    const total = tasks.length;

    const completed =
        tasks.filter(
            task => task.completed
        ).length;

    const pending =
        total - completed;

    const percentage =
        total === 0
        ? 0
        : Math.round(
            (completed / total) * 100
        );

    totalTasks.textContent = total;

    completedTasks.textContent =
        completed;

    pendingTasks.textContent =
        pending;

    completionRate.textContent =
        `${percentage}%`;

    progressText.textContent =
        `${percentage}%`;

    progressFill.style.width =
        `${percentage}%`;
}

document
    .querySelectorAll(".nav-item")
    .forEach(item => {

        item.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".nav-item")
                    .forEach(nav =>
                        nav.classList.remove("active")
                    );

                item.classList.add("active");

                const page =
                    item.dataset.page;

                if(page === "completed"){
                    statusFilter.value =
                        "completed";
                }
                else if(page === "pending"){
                    statusFilter.value =
                        "pending";
                }
                else{
                    statusFilter.value =
                        "all";
                }

                renderTasks();
            }
        );
    });

renderTasks();
updateStats();