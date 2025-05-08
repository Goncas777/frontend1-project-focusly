const apiURL = "https://681904ce5a4b07b9d1d1b463.mockapi.io/";

export const fetchTasks = async () => {
  try {
    const response = await fetch(apiURL + "tasks");
    if (!response.ok) throw new Error("Falha ao buscar os dados");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const createTask = async (newTask) => {
  const response = await fetch(apiURL + "tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTask),
  });
  return await response.json();
};


// Função para atualizar uma tarefa
export async function updateTask(taskData) {
  try {
      const response = await fetch(`${apiURL}/tasks/${taskData.id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(taskData)
      });

      if (!response.ok) {
          throw new Error("Erro ao atualizar a tarefa.");
      }

      return await response.json();
  } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
  }
}

export async function deleteTask(taskId) {
  try {
      const response = await fetch(`${apiURL}/tasks/${taskId}`, {
          method: 'DELETE',
      });

      if (!response.ok) {
          throw new Error("Erro ao apagar a tarefa.");
      }

      return await response.json();  // Retorna a resposta após a exclusão
  } catch (error) {
      console.error("Erro ao apagar tarefa:", error);
  }
}

