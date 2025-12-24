const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();
const SECRET = "UOP_SECRET_KEY";

/* REGISTER */
router.post("/register", async (req, res) => {
  const { role, name, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (role, name, email, password) VALUES (?,?,?,?)",
    [role, name, email, hashed],
    err => {
      if (err) return res.status(400).json({ error: "User exists" });
      res.json({ message: "Registered successfully" });
    }
  );
});

/* LOGIN */
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    async (err, result) => {
      if (result.length === 0)
        return res.status(401).json({ error: "Invalid credentials" });

      const user = result[0];
      const valid = await bcrypt.compare(password, user.password);

      if (!valid)
        return res.status(401).json({ error: "Invalid credentials" });

      const token = jwt.sign(
        { id: user.id, role: user.role },
        SECRET,
        { expiresIn: "2h" }
      );

      res.json({ token, role: user.role });
    }
  );
});

module.exports = router;
