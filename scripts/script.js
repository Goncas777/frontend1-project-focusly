import { fetchTasks, createTask, updateTask, deleteTask } from "./fetch.js";

document.addEventListener("DOMContentLoaded", async () => {
    const tasks = await fetchTasks();
    displayTasks(filterUpcomingTasks(tasks));
    generateCalendar(tasks);

    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", () => filterTasks(tasks));
    document.getElementById("tag-filter").addEventListener("change", () => applyAllFilters(tasks));
    document.getElementById("priority-filter").addEventListener("change", () => applyAllFilters(tasks));
    document.getElementById("date-filter").addEventListener("change", () => applyAllFilters(tasks));
});

function filterUpcomingTasks(tasks) {
    const today = new Date();
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);
    return tasks.filter(task => {
        if (task.dueDate) {
            const taskDate = new Date(task.dueDate);
            return taskDate >= twoDaysAgo;
        }
        return false;
    });
}

function applyAllFilters(tasks) {
    const tagValue = document.getElementById("tag-filter").value;
    const priorityValue = document.getElementById("priority-filter").value;
    const dateValue = document.getElementById("date-filter").value;

    let filtered = filterUpcomingTasks(tasks);

    if (tagValue) {
        filtered = filtered.filter(task => task.tags && task.tags.includes(tagValue));
    }

    if (priorityValue) {
        filtered = filtered.filter(task => String(task.priority) === priorityValue);
    }

    if (dateValue === "asc") {
        filtered = filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (dateValue === "desc") {
        filtered = filtered.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
    }

    displayTasks(filtered);
}

function displayTasks(tasks) {
    const taskContainer = document.querySelector(".task-grid");
    taskContainer.innerHTML = "";

    tasks.forEach((task) => {
        const taskCard = createTaskCard(task);
        taskContainer.appendChild(taskCard);
    });
}

function filterTasks(tasks) {
    const searchQuery = document.getElementById("search-input").value.toLowerCase();
    const filteredTasks = tasks.filter(task => 
        task.name.toLowerCase().includes(searchQuery)
    );
    displayTasks(filteredTasks);
}

function createTaskCard(task) {
    const card = document.createElement("div");
    card.className = "todo-item";

    const menuButton = document.createElement("button");
    menuButton.className = "menu-button";
    menuButton.title = "Opções";
    menuButton.onclick = () => toggleMenu(menuButton);

    const menuIcon = document.createElement("i");
    menuIcon.className = "fas fa-ellipsis-v";

    const menuImg = document.createElement("img");
    menuImg.src = "https://cdn2.iconfinder.com/data/icons/50-material-design-round-corner-style/44/Submenu_2-512.png";
    menuImg.style.width = "20px";
    menuImg.style.height = "20px";
    menuImg.alt = "";

    menuIcon.appendChild(menuImg);
    menuButton.appendChild(menuIcon);
    card.appendChild(menuButton);

    const actionMenu = document.createElement("div");
    actionMenu.className = "action-menu";
    const actions = [
        {
            title: "Feita",
            icon: "https://cdn2.iconfinder.com/data/icons/my-cubicle/512/Check_Mark-512.png",
            onclick: async () => {
                console.log("Feita clicada");
                await updateTask({ ...task, completed: true });
                const updatedTasks = await fetchTasks();
                displayTasks(filterUpcomingTasks(updatedTasks));
            }            
        },
        {
            title: "Editar",
            icon: "https://static-00.iconduck.com/assets.00/edit-square-icon-1024x1022-pd40h6x1.png",
            onclick: () => openEditModal(task)
        },
        {
            title: "Apagar",
            icon: "https://static-00.iconduck.com/assets.00/edit-delete-symbolic-icon-417x512-fbzatn0z.png",
            onclick: async () => {
                const confirmDelete = confirm("Tem a certeza de que deseja apagar esta tarefa?");
                if (confirmDelete) {
                    await deleteTask(task.id);
                    const updatedTasks = await fetchTasks();
                    displayTasks(filterUpcomingTasks(updatedTasks));
                }
            }
        }
    ];

    actions.forEach(({ title, icon, onclick }) => {
        const button = document.createElement("button");
        button.title = title;
    
        button.addEventListener("click", (event) => {
            event.stopPropagation();
            if (onclick) onclick();
        });
    
        const i = document.createElement("i");
        i.className = `fas fa-${title.toLowerCase()}`;
    
        const img = document.createElement("img");
        img.src = icon;
        img.style.width = "20px";
        img.style.height = "20px";
        img.alt = "";
    
        i.appendChild(img);
        button.appendChild(i);
        actionMenu.appendChild(button);
    });

    card.appendChild(actionMenu);

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = task.name || "Sem título";
    card.appendChild(title);

    const meta = document.createElement("div");
    meta.className = "todo-meta";

    const dueDate = task.dueDate ? formatDueDate(task.dueDate) : "Data indefinida";

    const priorityMap = {
        1: "Low",
        2: "Medium",
        3: "High"
    };

    const priority = priorityMap[task.priority] || "Medium";

    const span = document.createElement("span");
    span.className = `priority-${priority.toLowerCase()}`;
    span.textContent = priority;

    meta.textContent = `Due: ${dueDate} • `;
    meta.appendChild(span);
    card.appendChild(meta);

    if (task.completed) {
        const checkEmoji = document.createElement("span");
        checkEmoji.textContent = "✅";
        checkEmoji.style.position = "absolute";
        checkEmoji.style.bottom = "10px";
        checkEmoji.style.right = "10px";
        checkEmoji.style.fontSize = "1.5rem";
        card.appendChild(checkEmoji);
    }

    if (task.tags && task.tags.length > 0) {
        const tagContainer = document.createElement("div");
        tagContainer.className = "tag-container";

        const emojiMap = {
            "Trabalho": "💼",
            "Lazer": "🎮",
            "Escola": "📚",
            "Desporto": "🏃",
            "Outros": "🧩"
        };

        task.tags.forEach(tag => {
            const tagEl = document.createElement("span");
            tagEl.className = "tag";
            tagEl.textContent = `${emojiMap[tag] || ""} ${tag}`;
            tagContainer.appendChild(tagEl);
        });

        card.appendChild(tagContainer);
    }

    return card;
}

function formatDueDate(dueDate) {
    const date = new Date(dueDate);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function toggleMenu(button) {
    const menu = button.nextElementSibling;
    const isVisible = menu.style.display === "flex";
    document.querySelectorAll(".action-menu").forEach(m => m.style.display = "none");
    if (!isVisible) menu.style.display = "flex";
}

document.addEventListener("click", function (e) {
    if (!e.target.closest(".action-menu") && !e.target.closest(".menu-button")) {
        document.querySelectorAll(".action-menu").forEach(m => m.style.display = "none");
    }
});

function generateCalendar(tasks) {
    const calendarContainer = document.querySelector(".calendar");
    const calendarHeader = document.createElement("div");
    calendarHeader.className = "calendar-header";
    const date = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    calendarHeader.textContent = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    calendarContainer.appendChild(calendarHeader);

    const resetButton = document.createElement("button");
    resetButton.id = "reset-calendar-button";
    resetButton.className = "reset-button";
    resetButton.textContent = "Resetar Pesquisa";
    calendarContainer.appendChild(resetButton);

    const calendarGrid = document.createElement("div");
    calendarGrid.className = "calendar-grid";

    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.className = "calendar-cell empty";
        calendarGrid.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement("div");
        dayCell.className = "calendar-cell";
        dayCell.textContent = day;

        if (day === date.getDate()) {
            dayCell.classList.add("today");
        }

        if (day < date.getDate()) {
            dayCell.classList.add("past");
        }

        dayCell.addEventListener("click", () => {
            filterTasksByDate(day, tasks);
        });

        calendarGrid.appendChild(dayCell);
    }

    calendarContainer.appendChild(calendarGrid);

    resetButton.addEventListener("click", () => {
        resetCalendar(tasks);
    });
}

function filterTasksByDate(day, tasks) {
    const date = new Date();
    date.setDate(day);
    date.setMonth(date.getMonth());
    date.setFullYear(date.getFullYear());

    const selectedDate = date.toISOString().split('T')[0];

    const filteredTasks = tasks.filter(task => {
        if (task.dueDate) {
            const taskDueDate = new Date(task.dueDate).toISOString().split('T')[0];
            return taskDueDate === selectedDate;
        }
        return false;
    });

    displayTasks(filteredTasks);
}

function openEditModal(task) {
    const taskModal = document.getElementById("task-modal");

    document.getElementById("task-name").value = task.name;
    document.getElementById("task-date").value = task.dueDate;
    document.getElementById("task-priority").value = task.priority;
    document.getElementById("task-id").value = task.id;
    document.getElementById("task-completed").checked = !!task.completed;

    document.querySelectorAll('#tag-options input[type="checkbox"]').forEach(cb => {
        cb.checked = task.tags?.includes(cb.value);
    });

    document.getElementById("completed-field").style.display = "block";
    document.querySelector(".modal-content h2").textContent = "Editar Tarefa";
    document.querySelector(".submit-button").textContent = "Editar Tarefa";
    taskModal.style.display = "flex";
}

document.addEventListener("DOMContentLoaded", () => {
    const newTaskButton = document.getElementById("new-task-button");
    const taskModal = document.getElementById("task-modal");
    const closeModalButton = document.getElementById("close-modal");
    const taskForm = document.getElementById("task-form");

    newTaskButton.addEventListener("click", () => {
        document.getElementById("task-form").reset();
        document.getElementById("task-id").value = "";
        document.getElementById("completed-field").style.display = "none";
        document.querySelector(".modal-content h2").textContent = "Criar Nova Tarefa";
        document.querySelector(".submit-button").textContent = "Criar Tarefa";
        taskModal.style.display = "flex";
    });

    closeModalButton.addEventListener("click", () => {
        taskModal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === taskModal) {
            taskModal.style.display = "none";
        }
    });

    taskForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const taskId = document.getElementById("task-id").value;
        const taskName = document.getElementById("task-name").value;
        const taskDate = document.getElementById("task-date").value;
        const taskPriority = document.getElementById("task-priority").value;
        const tagCheckboxes = document.querySelectorAll('#tag-options input[type="checkbox"]:checked');
        const selectedTags = Array.from(tagCheckboxes).map(cb => cb.value);

        const currentDate = new Date();
        const selectedDate = new Date(taskDate);

        if (selectedDate < currentDate) {
            alert("A data e hora de vencimento não podem ser no passado.");
            return;
        }

        const taskData = {
            id: taskId,
            name: taskName,
            dueDate: taskDate,
            priority: taskPriority,
            completed: document.getElementById("task-completed").checked,
            tags: selectedTags
        };
        

        if (taskId) {
            await updateTask(taskData);
            console.log("Tarefa editada:", taskData);
        } else {
            await createTask(taskData);
            console.log("Tarefa criada:", taskData);
        }

        const updatedTasks = await fetchTasks();
        displayTasks(filterUpcomingTasks(updatedTasks));

        taskModal.style.display = "none";
    });
});

function resetCalendar(tasks) {
    const filtered = filterUpcomingTasks(tasks);
    displayTasks(filtered);
}


if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("service-worker.js")
        .then((reg) => console.log("Service Worker registado:", reg))
        .catch((err) => console.log("Erro ao registar o Service Worker:", err));
    });
  }


async function loadComponents() {
    const components = await fetch("component.html");
    const filters = await components.text();
    document.getElementById("filters").innerHTML = filters;
}

loadComponents();



  