'use strict';

// write code here
// sort
const table = document.querySelector('table');
const headers = table.querySelectorAll('thead th');
let sortColumn = null;
let sortAsc = true;

headers.forEach((th, index) => {
  th.addEventListener('click', () => {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.rows);

    if (sortColumn !== index) {
      sortColumn = index;
      sortAsc = true;
    } else {
      sortAsc = !sortAsc;
    }

    const rowsSorted = rows.sort((rowA, rowB) => {
      const cellA = rowA.cells[index].textContent.trim();
      const cellB = rowB.cells[index].textContent.trim();
      const numA = parseFloat(cellA.replace(/[$,\s]/g, ''));
      const numB = parseFloat(cellB.replace(/[$,\s]/g, ''));
      const checkNumber = !isNaN(numA) && !isNaN(numB);

      let comparison;

      if (checkNumber) {
        comparison = numA - numB;
      } else {
        comparison = cellA.localeCompare(cellB);
      }

      return sortAsc ? comparison : -comparison;
    });

    tbody.innerHTML = '';
    tbody.append(...rowsSorted);
  });
});

// highlight lines

table.addEventListener('click', (e) => {
  const tr = e.target.closest('tr');
  const tbody = table.querySelector('tbody');

  if (!tr || !tbody.contains(tr)) {
    return;
  }

  table
    .querySelectorAll('tbody tr')
    .forEach((row) => row.classList.remove('active'));
  tr.classList.add('active');
});

// add form

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.innerHTML = `
  <label>Name: <input name="name" type="text" data-qa="name"></label>
  <label>Position: <input name="position" type="text" data-qa="position"></label>
  <label>Office:
    <select name="office" data-qa="office">
      <option value="">Select office</option>
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select>
  </label>
  <label>Age: <input name="age" type="number" data-qa="age"></label>
  <label>Salary: <input name="salary" type="number" data-qa="salary"></label>
  <button type="submit">Save to table</button>
`;
document.body.append(form);

// check form and add lines

const notification = document.createElement('div');

notification.setAttribute('data-qa', 'notification');
document.body.prepend(notification);

function showNotification(message, type) {
  notification.textContent = message;
  notification.className = type;

  setTimeout(() => {
    notification.textContent = '';
    notification.className = '';
  }, 3000);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const firstName = form.name.value.trim();
  const position = form.position.value.trim();
  const office = form.office.value.trim();
  const age = form.age.value.trim();
  const salary = form.salary.value.trim();

  if (!firstName || !position || !office || !age || !salary) {
    showNotification('fill in all fields', 'error');

    return;
  }

  if (firstName.length < 4) {
    showNotification('Name must be at least 4 characters long', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('age must be from 18 to 90 years', 'error');

    return;
  }

  const newRow = document.createElement('tr');

  newRow.innerHTML = `<td>${firstName}</td><td>${position}</td>
  <td>${office}</td><td>${age}</td><td>$${Number(salary).toLocaleString('en-US')}</td>`;

  table.querySelector('tbody').appendChild(newRow);
  form.reset();
  showNotification('Employee added successfully!', 'success');
});

// change cells

let eCell = null;

table.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell) {
    return;
  }

  if (eCell && eCell !== cell) {
    finishEdit(eCell);
  }

  if (eCell === cell) {
    return;
  }
  startEdit(cell);
});

function startEdit(cell) {
  const oldText = cell.textContent;

  cell.dataset.oldText = oldText;

  const input = document.createElement('input');

  input.type = 'text';
  input.className = 'cell-input';
  input.value = oldText;

  cell.textContent = '';
  cell.appendChild(input);
  input.focus();

  input.addEventListener('blur', () => finishEdit(cell));

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      input.blur();
    }

    if (ev.key === 'Escape') {
      cell.textContent = oldText;
      eCell = null;
    }
  });

  eCell = cell;
}

function finishEdit(cell) {
  const input = cell.querySelector('input');

  if (input) {
    const newValue = input.value.trim();

    const oldValue = cell.dataset.oldText;

    cell.textContent = newValue || oldValue;
  }
  eCell = null;
}
