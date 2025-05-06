import { fetchTasks } from "./fetch.js";

document.addEventListener("DOMContentLoaded", async () => {
    const tasks = await fetchTasks();
    displayTasks(tasks);
    generateCalendar();

    // Adicionar evento para a barra de pesquisa
    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", () => filterTasks(tasks));
});

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

    // Botão de menu (três pontos)
    const menuButton = document.createElement("button");
    menuButton.className = "menu-button";
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

    // Menu de ações
    const actionMenu = document.createElement("div");
    actionMenu.className = "action-menu";

    const actions = [
        { title: "Feita", icon: "https://cdn2.iconfinder.com/data/icons/my-cubicle/512/Check_Mark-512.png" },
        { title: "Editar", icon: "https://static-00.iconduck.com/assets.00/edit-square-icon-1024x1022-pd40h6x1.png" },
        { title: "Apagar", icon: "https://static-00.iconduck.com/assets.00/edit-delete-symbolic-icon-417x512-fbzatn0z.png" }
    ];

    actions.forEach(({ title, icon }) => {
        const button = document.createElement("button");
        button.title = title;

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

    // Título da tarefa
    const title = document.createElement("div");
    title.className = "title";
    title.textContent = task.name || "Sem título";
    card.appendChild(title);

    // Informações da tarefa
    const meta = document.createElement("div");
    meta.className = "todo-meta";

    const dueDate = task.dueDate || "Data indefinida";

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

    return card;
}

function toggleMenu(button) {
    const menu = button.nextElementSibling;
    const isVisible = menu.style.display === "flex";
    document.querySelectorAll(".action-menu").forEach(m => m.style.display = "none");
    if (!isVisible) menu.style.display = "flex";
}

document.addEventListener("click", function (e) {
    if (!e.target.closest(".todo-item")) {
        document.querySelectorAll(".action-menu").forEach(m => m.style.display = "none");
    }
});

function generateCalendar() {
  const calendarContainer = document.querySelector(".calendar");
  const calendarHeader = document.createElement("div");
  calendarHeader.className = "calendar-header";
  const date = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  calendarHeader.textContent = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  calendarContainer.appendChild(calendarHeader);

  const calendarGrid = document.createElement("div");
  calendarGrid.className = "calendar-grid";

  // Criar os dias do mês
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  // Preencher os dias antes do dia 1 (não deixa células vazias)
  for (let i = 0; i < firstDayOfMonth; i++) {
      const emptyCell = document.createElement("div");
      emptyCell.className = "calendar-cell empty";
      calendarGrid.appendChild(emptyCell);
  }

  // Criar os dias do mês
  for (let day = 1; day <= daysInMonth; day++) {
      const dayCell = document.createElement("div");
      dayCell.className = "calendar-cell";
      dayCell.textContent = day;

      // Adicionar classe "today" para o dia atual
      if (day === date.getDate()) {
          dayCell.classList.add("today");
      }

      // Adicionar classe "past" para os dias anteriores ao dia atual
      if (day < date.getDate()) {
          dayCell.classList.add("past");
      }

      calendarGrid.appendChild(dayCell);
  }

  calendarContainer.appendChild(calendarGrid);
}


document.addEventListener("DOMContentLoaded", () => {
  const newTaskButton = document.getElementById("new-task-button");
  const taskModal = document.getElementById("task-modal");
  const closeModalButton = document.getElementById("close-modal");
  const taskForm = document.getElementById("task-form");

  // Abrir o modal
  newTaskButton.addEventListener("click", () => {
      taskModal.style.display = "flex"; // Exibe o modal
  });

  // Fechar o modal
  closeModalButton.addEventListener("click", () => {
      taskModal.style.display = "none"; // Oculta o modal
  });

  // Fechar o modal se clicar fora dele
  window.addEventListener("click", (event) => {
      if (event.target === taskModal) {
          taskModal.style.display = "none";
      }
  });

  // Submissão do formulário (adicionar tarefa)
  taskForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const taskName = document.getElementById("task-name").value;
      const taskDate = document.getElementById("task-date").value;
      const taskPriority = document.getElementById("task-priority").value;

      // Aqui você pode adicionar a lógica para criar uma nova tarefa
      // Por exemplo, adicionar a nova tarefa à lista de tarefas
      console.log("Tarefa criada:", { taskName, taskDate, taskPriority });

      
      taskModal.style.display = "none";
  });
});