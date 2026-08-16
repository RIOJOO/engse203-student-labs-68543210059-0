export function calculateSummary(tasks = []) {
  return {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === 'To do').length,
    inProgress: tasks.filter((t) => t.status === 'In progress').length,
    done: tasks.filter((t) => t.status === 'Done').length,
  };
}

export function filterTasks(tasks = [], query = '', status = 'All') {
  const normalizedQuery = query.trim().toLowerCase();

  return tasks.filter((task) => {
    const matchQuery =
      (task.title && task.title.toLowerCase().includes(normalizedQuery)) ||
      (task.topic && task.topic.toLowerCase().includes(normalizedQuery));

    const matchStatus = status === 'All' || task.status === status;

    return matchQuery && matchStatus;
  });
}