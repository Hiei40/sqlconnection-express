const express = require('express');
const mysql2 = require('mysql2');

const app = express();
const port = 3000;
app.use(express.json())

const connection = mysql2.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'blog1',
  port: 3306
});

connection.connect(error => {
  if (error) {
    console.log('Fail to connect to DB:', error.message);
  } else {
    console.log('Connected to DB 😂😂😂');
  }
});




app.get('/', (req, res) => res.send('hello!'));
app.listen(port, () => console.log(`example app listening on port ${port}!`));
