import './style.css';

const form = document.querySelector('#request-form');
const status = document.querySelector('#form-status');
const requestList = document.querySelector('#request-list');
const preview = {
  requesterName: document.querySelector('#preview-name'),
  requestType: document.querySelector('#preview-type'),
  details: document.querySelector('#preview-details'),
};

function readForm() {
  return Object.fromEntries(new FormData(form).entries());
}

function renderPreview(data) {
  preview.requesterName.textContent = data.requesterName.trim() || 'ยังไม่ระบุชื่อ';
  preview.requestType.textContent = data.requestType || 'ยังไม่เลือกประเภท';
  preview.details.textContent = data.details.trim() || 'ยังไม่มีรายละเอียด';
}

function validate(data) {
  const errors = {};

  if (data.requesterName.trim().length < 2) {
    errors.requesterName = 'Please enter at least 2 characters.';
  }
  if (!data.requestType) {
    errors.requestType = 'Please select a request type.';
  }
  if (data.details.trim().length < 10) {
    errors.details = 'Please enter at least 10 characters.';
  }

  return errors;
}

function renderErrors(errors) {
  for (const name of ['requesterName', 'requestType', 'details']) {
    const field = form.elements[name];
    const output = document.querySelector(`#${name}-error`);
    const message = errors[name] ?? '';

    output.textContent = message;
    field.setAttribute('aria-invalid', String(Boolean(message)));
  }
}

function renderStatus(state, message) {
  status.dataset.state = state;
  status.textContent = message;
}

function addRequest(data) {
  const item = document.createElement('li');
  const title = document.createElement('strong');
  const details = document.createElement('p');

  title.textContent = `${data.requestType} — ${data.requesterName}`;
  details.textContent = data.details;
  item.append(title, details);
  requestList.prepend(item);
}

form.addEventListener('input', () => {
  renderPreview(readForm());
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const data = readForm();
  const errors = validate(data);
  renderErrors(errors);

  if (Object.keys(errors).length > 0) {
    renderStatus('invalid', 'Please correct the highlighted fields.');
    form.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }

  addRequest(data);
  renderStatus('success', 'Request submitted successfully.');
  form.reset();
  renderPreview(readForm());
});

renderPreview(readForm());
renderStatus('idle', 'Complete the form to submit a service request.');