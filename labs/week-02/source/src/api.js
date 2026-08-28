export async function fetchLearningTasks({ simulateError = false } = {}) {
  if (simulateError) {
    throw new Error("Simulated error: data source is unavailable");
  }

  // เรียกไปยังโฟลเดอร์ data/learning-tasks.json โดยตรง
  const url = "./data/learning-tasks.json";
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Unable to load tasks (HTTP ${response.status})`);
  }

  const tasks = await response.json();

  if (!Array.isArray(tasks)) {
    throw new Error("The data source returned an invalid task collection");
  }

  return tasks;
}