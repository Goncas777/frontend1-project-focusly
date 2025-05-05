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