// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD9kw2tyqNvAoMYCEopZvlTyy97FigTVlQ",
  authDomain: "ems-system-d0f08.firebaseapp.com",
  projectId: "ems-system-d0f08",
  storageBucket: "ems-system-d0f08.firebasestorage.app",
  messagingSenderId: "346869146384",
  appId: "1:346869146384:web:03a69778b89e7691977b95"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

const getPageName = () => window.location.pathname.split("/").pop();

const showError = (message) => window.alert(message);

const navigateToDashboard = (role) => {
  window.location.href = role === "admin" ? "admin.html" : "employee.html";
};

// ── Auth ──────────────────────────────────────────────────────────────────────

async function signup() {
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  if (!username || !email || !password || !role) return showError("All fields are required");

  const btn = document.getElementById("signup-btn");
  btn.disabled = true;
  btn.textContent = "Creating account...";

  try {
    const { user } = await auth.createUserWithEmailAndPassword(email, password);

    await db.collection("users").doc(user.uid).set({
      uid: user.uid,
      username,
      email,
      role,
      createdAt: new Date().toISOString()
    });

    document.getElementById("signup-form").style.display = "none";
    document.getElementById("signup-success").style.display = "block";
    setTimeout(() => (window.location.href = "login.html"), 2500);
  } catch (error) {
    btn.disabled = false;
    btn.textContent = "Sign Up";
    showError(error.code === "auth/email-already-in-use" ? "Email already in use" : error.message);
  }
}

async function login() {
  const email = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  if (!email || !password || !role) return showError("All fields are required");

  try {
    const { user } = await auth.signInWithEmailAndPassword(email, password);
    const userDoc = await db.collection("users").doc(user.uid).get();

    if (!userDoc.exists) return showError("User profile not found");

    const profile = userDoc.data();

    if (profile.role !== role) {
      await auth.signOut();
      return showError("Selected role does not match this account");
    }

    navigateToDashboard(profile.role);
  } catch (error) {
    showError("Invalid credentials");
  }
}

async function logout() {
  await auth.signOut();
  window.location.href = "login.html";
}

// ── Employees ─────────────────────────────────────────────────────────────────

function renderEmployees(employees) {
  const tbody = document.getElementById("employeeTable");
  const total = document.getElementById("totalEmployees");
  if (!tbody) return;

  total.textContent = employees.length;
  tbody.innerHTML = employees.map((e) => `
    <tr>
      <td>${e.name}</td>
      <td>${e.department}</td>
      <td>${e.position}</td>
      <td><button onclick="deleteEmployee('${e.id}')">Delete</button></td>
    </tr>
  `).join("");
}

function loadEmployees() {
  db.collection("employees")
    .orderBy("createdAt", "desc")
    .onSnapshot((snapshot) => {
      const employees = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      renderEmployees(employees);
    }, (error) => showError(error.message));
}

async function saveEmployee() {
  const name = document.getElementById("name").value.trim();
  const department = document.getElementById("department").value.trim();
  const position = document.getElementById("position").value.trim();

  if (!name || !department || !position) return showError("All fields are required");

  try {
    const user = auth.currentUser;
    await db.collection("employees").add({
      name,
      department,
      position,
      createdAt: new Date().toISOString(),
      createdBy: user.uid
    });

    document.getElementById("name").value = "";
    document.getElementById("department").value = "";
    document.getElementById("position").value = "";
  } catch (error) {
    showError(error.message);
  }
}

async function deleteEmployee(id) {
  try {
    await db.collection("employees").doc(id).delete();
  } catch (error) {
    showError(error.message);
  }
}

// ── Page Guard ────────────────────────────────────────────────────────────────

function initializePage() {
  const page = getPageName();

  if (page === "admin.html") {
    auth.onAuthStateChanged(async (user) => {
      if (!user) return (window.location.href = "login.html");

      const userDoc = await db.collection("users").doc(user.uid).get();
      if (!userDoc.exists || userDoc.data().role !== "admin") {
        await auth.signOut();
        return (window.location.href = "login.html");
      }

      loadEmployees();
    });
  }

  if (page === "employee.html") {
    auth.onAuthStateChanged(async (user) => {
      if (!user) return (window.location.href = "login.html");

      const userDoc = await db.collection("users").doc(user.uid).get();
      if (!userDoc.exists || userDoc.data().role !== "employee") {
        await auth.signOut();
        return (window.location.href = "login.html");
      }

      const profile = userDoc.data();
      document.getElementById("emp-name").textContent = profile.username;
      document.getElementById("emp-email").textContent = profile.email;

      const snapshot = await db.collection("employees")
        .where("createdBy", "==", user.uid)
        .limit(1)
        .get();

      if (!snapshot.empty) {
        const emp = snapshot.docs[0].data();
        document.getElementById("emp-department").textContent = emp.department;
        document.getElementById("emp-position").textContent = emp.position;
      }

      db.collection("employees").orderBy("createdAt", "desc").onSnapshot((snap) => {
        const tbody = document.getElementById("colleaguesTable");
        tbody.innerHTML = snap.docs.map((doc) => {
          const e = doc.data();
          return `<tr><td>${e.name}</td><td>${e.department}</td><td>${e.position}</td></tr>`;
        }).join("");
      });
    });
  }
}

window.signup = signup;
window.login = login;
window.logout = logout;
window.saveEmployee = saveEmployee;
window.deleteEmployee = deleteEmployee;

document.addEventListener("DOMContentLoaded", initializePage);
