const db = require("../config/db");

// SIGNUP
exports.signup = (req, res) => {
  const { username, password, role } = req.body;

  const sql = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";

  db.query(sql, [username, password, role], (err) => {
    if (err) {
      return res.status(400).json({ message: "User already exists" });
    }

    res.json({ message: "Account created successfully" });
  });
};

// LOGIN
exports.login = (req, res) => {
  const { username, password, role } = req.body;

  const sql = "SELECT * FROM users WHERE username=? AND password=? AND role=?";

  db.query(sql, [username, password, role], (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length > 0) {
      res.json({ user: results[0] });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });
};