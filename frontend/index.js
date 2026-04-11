const API = "http://localhost:5000/employees";

// Load employees
async function loadEmployees() {
  const res = await fetch(API);
  const data = await res.json();

  const table = document.getElementById("employeeList");
  table.innerHTML = "";

  data.forEach(emp => {
    table.innerHTML += `
      <tr>
        <td>${emp.name}</td>
        <td>${emp.department}</td>
        <td>${emp.position}</td>
        <td>
          <button onclick="deleteEmployee(${emp.id})">Delete</button>
        </td>
      </tr>
    `;
  });
}

// Add employee
async function addEmployee() {
  const name = document.getElementById("name").value;
  const department = document.getElementById("department").value;
  const position = document.getElementById("position").value;

  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, department, position })
  });

  loadEmployees();
}

// Delete employee
async function deleteEmployee(id) {
  await fetch(`${API}/${id}`, {
    method: "DELETE"
  });

  loadEmployees();
}

// Initialize
loadEmployees();