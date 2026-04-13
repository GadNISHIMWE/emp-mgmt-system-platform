const db = require("../config/db");

// GET ALL EMPLOYEES
exports.getEmployees = (req, res) => {
  db.query("SELECT * FROM employees", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// ADD EMPLOYEE
exports.addEmployee = (req, res) => {
  const { name, department, position } = req.body;

  const sql = "INSERT INTO employees (name, department, position) VALUES (?, ?, ?)";

  db.query(sql, [name, department, position], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Employee added" });
  });
};

// DELETE EMPLOYEE
exports.deleteEmployee = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM employees WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Employee deleted" });
  });
};