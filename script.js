const STORAGE_KEY = 'employeeRecords';

const form = document.getElementById('employeeForm');
const createdAtInput = document.getElementById('created_at');
const updatedAtInput = document.getElementById('updated_at');
const recordsBody = document.getElementById('recordsBody');
const emptyMsg = document.getElementById('emptyMsg');
const clearBtn = document.getElementById('clearBtn');

function toLocalDateTimeValue(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function stampTimestamps() {
  const now = toLocalDateTimeValue(new Date());
  createdAtInput.value = now;
  updatedAtInput.value = now;
}

function getRecords() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function saveRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function renderRecords() {
  const records = getRecords();
  recordsBody.innerHTML = '';

  emptyMsg.style.display = records.length ? 'none' : 'block';

  records.forEach((record, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${record.name}</td>
      <td>${record.role}</td>
      <td>${Number(record.salary).toFixed(2)}</td>
      <td>${record.data}</td>
      <td>${record.created_at.replace('T', ' ')}</td>
      <td>${record.updated_at.replace('T', ' ')}</td>
      <td><button type="button" class="delete-btn" data-index="${index}">Delete</button></td>
    `;
    recordsBody.appendChild(row);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const record = {
    name: form.name.value.trim(),
    role: form.role.value.trim(),
    salary: form.salary.value,
    data: form.data.value,
    created_at: createdAtInput.value,
    updated_at: updatedAtInput.value,
  };

  const records = getRecords();
  records.push(record);
  saveRecords(records);
  renderRecords();

  form.reset();
  stampTimestamps();
});

recordsBody.addEventListener('click', (e) => {
  if (!e.target.classList.contains('delete-btn')) return;
  const index = Number(e.target.dataset.index);
  const records = getRecords();
  records.splice(index, 1);
  saveRecords(records);
  renderRecords();
});

clearBtn.addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY);
  renderRecords();
});

stampTimestamps();
renderRecords();
