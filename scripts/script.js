import { fetchTasks } from "./fetch.js";

document.addEventListener("DOMContentLoaded", async () => {
    const tasks = await fetchTasks();
    displayTasks(tasks);
});

function displayTasks(tasks) {
    const taskContainer = document.querySelector(".task-grid");
    taskContainer.innerHTML = "";

    tasks.forEach((task) => {
    const taskCard = createTaskCard(task);
    taskContainer.appendChild(taskCard);
    });
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
  