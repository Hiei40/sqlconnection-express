const express = require('express');
const mysql2 = require('mysql2');

const app = express();
const port = 3000;
app.use(express.json());

const connection = mysql2.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'blog1',
  port: 3306
});

connection.connect(error => {
  if (error) {
    console.error('Fail to connect to DB:', error.message);
  } else {
    console.log('Connected to DB');
  }
});

app.post('/auth/signup', async (req, res) => {
  const {
    u_firstName,
    u_middleName,
    u_lastName,
    u_email,
    u_password,
    u_confirmPassword,
    u_DOB,
    u_confirmEmail,
    u_gender
  } = req.body;

  if (u_password !== u_confirmPassword) {
    return res.status(400).json({ message: "Password and confirmPassword do not match" });
  }

  try {
    const findQuery = 'SELECT * FROM users WHERE u_email = ?';
    const [existingUsers] = await connection.promise().execute(findQuery, [u_email]);

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // إدخال البيانات
    const insertQuery = `
      INSERT INTO users 
      (u_firstName, u_middleName, u_lastName, u_email, u_password, u_DOB, u_confirmEmail, u_gender)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await connection.promise().execute(insertQuery, [
      u_firstName,
      u_middleName,
      u_lastName,
      u_email,
      u_password,
      u_DOB,
      u_confirmEmail,
      u_gender
    ]);

    return res.status(201).json({ message: "Signup successful", insertId: result.insertId });
  } catch (error) {
    return res.status(500).json({ message: "Failed to process signup", error });
  }
});

app.post('/auth/login', async (req, res) => {
  const { u_email, u_password } = req.body;

  if (!u_email || !u_password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // البحث عن المستخدم بناءً على البريد وكلمة المرور
    const findQuery = 'SELECT * FROM users WHERE u_email = ? AND u_password = ?';
    const [users] = await connection.promise().execute(findQuery, [u_email, u_password]);

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // تسجيل الدخول ناجح، ترجع بيانات المستخدم
    return res.status(200).json({ message: "Login successful", user: users[0] });
  } catch (error) {
    return res.status(500).json({ message: "Failed to process login", error });
  }
});



app.get('/', (req, res) => {
  const u_id = req.query.id;
  if (!u_id) {
    return res.status(400).json({ message: "u_id is required" });
  }

  const sql = 'SELECT * FROM users WHERE u_id = ?';
  connection.execute(sql, [u_id], (error, data) => {
    if (error) {
      return res.status(500).json({ message: "Fail to run this query", error });
    }
    return res.json({ message: "Done", data });
  });
});

app.listen(port, () => console.log(`example app listening on port ${port}!`));