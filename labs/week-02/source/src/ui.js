export function renderStatus(container, message, type = 'info') {
  if (!message) {
    container.textContent = '';
    container.className = 'status-box hidden';
    return;
  }
  container.className = `status-box status-${type}`;
  container.textContent = message;
}

export function renderSummary(container, summary) {
  const cards = [
    { label: 'Total', value: summary.total, key: 'total' },
    { label: 'To do', value: summary.todo, key: 'todo' },
    { label: 'In progress', value: summary.inProgress, key: 'in-progress' },
    { label: 'Done', value: summary.done, key: 'done' },
  ];

  container.innerHTML = cards
    .map(
      (c) => `
      <div class="summary-card card-${c.key}">
        <h3>${c.label}</h3>
        <p class="summary-value">${c.value}</p>
      </div>`
    )
    .join('');
}

export function renderTasks(container, tasks = []) {
  if (tasks.length === 0) {
    container.innerHTML = '<p class="empty-state">ไม่พบรายการที่ตรงกับเงื่อนไข</p>';
    return;
  }

  container.innerHTML = tasks
    .map(
      (task) => `
      <article class="task-card">
        <div class="task-header">
          <span class="badge badge-${task.status.toLowerCase().replace(/\s+/g, '-')}">${task.status}</span>
        </div>
        <h4 class="task-title">${task.title}</h4>
        <p class="task-topic">${task.topic}</p>
      </article>`
    )
    .join('');
}