import { fetchTasks } from './api.js';
import { calculateSummary, filterTasks } from './utils.js';
import { renderStatus, renderSummary, renderTasks } from './ui.js';

const state = {
  tasks: [],
  searchQuery: '',
  filterStatus: 'All',
};

const dom = {
  status: document.getElementById('status-message'),
  summary: document.getElementById('summary-section'),
  taskList: document.getElementById('task-list'),
  search: document.getElementById('search-input'),
  filter: document.getElementById('filter-select'),
};

function updateView() {
  const filtered = filterTasks(state.tasks, state.searchQuery, state.filterStatus);
  renderTasks(dom.taskList, filtered);
}

function attachEvents() {
  dom.search.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    updateView();
  });

  dom.filter.addEventListener('change', (e) => {
    state.filterStatus = e.target.value;
    updateView();
  });
}

async function init() {
  attachEvents();
  renderStatus(dom.status, 'กำลังโหลดข้อมูล...', 'loading');

  try {
    const data = await fetchTasks();
    state.tasks = data;

    renderStatus(dom.status, 'โหลดข้อมูลสำเร็จ', 'success');
    renderSummary(dom.summary, calculateSummary(state.tasks));
    updateView();

    setTimeout(() => {
      renderStatus(dom.status, '');
    }, 2500);
  } catch (error) {
    renderStatus(dom.status, error.message, 'error');
  }
}

init();