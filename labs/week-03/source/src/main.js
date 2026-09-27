import './style.css';

const form = document.querySelector('#request-form');

// TODO 1: query preview/status/list elements
const status = document.querySelector('#form-status');
const previewStatus = document.querySelector('#preview-status');
const goalCount = document.querySelector('#goal-count');

const preview = {
  displayName: document.querySelector('#preview-name'),
  requestType: document.querySelector('#preview-role'),
  requestDetails: document.querySelector('#preview-goal'),
};

// TODO 2: readForm()
function readForm() {
  return Object.fromEntries(new FormData(form).entries());
}

// TODO 3: renderPreview(data)
function renderPreview(data) {
  preview.displayName.textContent = data.displayName.trim() || "ยังไม่ได้ระบุชื่อ";
  preview.requestType.textContent = data.requestType || "ยังไม่เลือกประเภทคำร้อง";
  preview.requestDetails.textContent = data.requestDetails.trim() || "ยังไม่มีรายละเอียดคำร้อง";
  goalCount.textContent = `${data.requestDetails.length} ตัวอักษร`;
}

// TODO 4: validate(data)
function validate(data) {
  const errors = {};

  if (data.displayName.trim().length < 2) {
    errors.displayName = "กรุณากรอกชื่อผู้ยื่นคำร้องอย่างน้อย 2 ตัวอักษร";
  }

  if (!data.requestType) {
    errors.requestType = "กรุณาเลือกประเภทคำร้อง";
  }

  if (data.requestDetails.trim().length < 10) {
    errors.requestDetails = "กรุณากรอกรายละเอียดอย่างน้อย 10 ตัวอักษร";
  }

  return errors;
}

// TODO 5: renderErrors(errors)
function renderErrors(errors) {
  const fields = ["displayName", "requestType", "requestDetails"];

  fields.forEach((name) => {
    const field = form.elements[name];
    const errorOutput = document.querySelector(`#${name}-error`);
    const errorMessage = errors[name] ?? "";

    if (errorOutput) {
      errorOutput.textContent = errorMessage;
    }

    if (field) {
      field.setAttribute("aria-invalid", String(Boolean(errorMessage)));
    }
  });
}

function renderStatus(state, message) {
  if (status) {
    status.dataset.state = state;
    status.textContent = message;
  }

  if (previewStatus) {
    previewStatus.className = `box ${state}`;
    previewStatus.textContent = message;
  }
}

// TODO 6: input and submit listeners
form.addEventListener("input", () => {
  const data = readForm();
  renderPreview(data);
  
  const errors = validate(data);
  renderErrors(errors);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = readForm();
  const errors = validate(data);
  renderErrors(errors);

  if (Object.keys(errors).length > 0) {
    renderStatus("invalid", "ยังบันทึกไม่ได้ กรุณาตรวจสอบข้อมูล");
    form.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }

  renderStatus(
    "success",
    `ส่งคำร้องสำเร็จแล้ว คุณ ${data.displayName}! ข้อมูลผ่านการตรวจสอบ`,
  );
});

console.log('LAB 3 starter ready', form);
renderPreview(readForm());
renderStatus("idle", "พร้อมสำหรับการกรอกข้อมูล");