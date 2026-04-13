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

// ---------------------------admin-------------------------------

// ---------------- AUTH CHECK ----------------
window.onload = function () {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  // Redirect if not logged in OR not admin
  if (!user || user.role !== "admin") {
    window.location = "login.html";
    return;
  }

  // If user is valid → load dashboard data
  updateDashboardStats();
};

// ---------------- DASHBOARD STATS ----------------
function updateDashboardStats() {
  const employees = JSON.parse(localStorage.getItem("employees")) || [];
  const total = employees.length;

  const el = document.getElementById("totalEmployees");
  if (el) {
    el.innerText = total;
  }
}

// -------------------------login------------------------------

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(u =>
    u.username === username &&
    u.password === password &&
    u.role === role
  );

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));

    if (role === "admin") {
      window.location = "admin.html";
    } else {
      window.location = "employee.html";
    }
  } else {
    alert("Invalid username or password!");
  }
}

// -----------------------------signup------------------------------

function signup() {
  const username = document.getElementById("newUsername").value;
  const password = document.getElementById("newPassword").value;
  const role = document.getElementById("newRole").value;

  if (!username || !password) {
    alert("Please fill all fields");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const userExists = users.find(u => u.username === username);

  if (userExists) {
    alert("User already exists");
    return;
  }

  users.push({ username, password, role });

  localStorage.setItem("users", JSON.stringify(users));

  alert("Account created successfully!");

  window.location = "login.html";
}

// ------------------load employees------------------
async function loadEmployees() {
  const res = await fetch("http://localhost:5000/api/employees");
  const data = await res.json();

  const table = document.getElementById("employeeTable");
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

  document.getElementById("totalEmployees").innerText = data.length;
}

// ------autoload employee------
if (document.getElementById("employeeTable")) {
  loadEmployees();
}

// -------------add employee----------------
async function saveEmployee() {
  const name = document.getElementById("name").value;
  const department = document.getElementById("department").value;
  const position = document.getElementById("position").value;

  await fetch("http://localhost:5000/api/employees", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, department, position })
  });

  loadEmployees();
}

// ---------------delete employees---------

async function deleteEmployee(id) {
  await fetch(`http://localhost:5000/api/employees/${id}`, {
    method: "DELETE"
  });

  loadEmployees();
}