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

app.post('/auth/signup',(res,req,next)=>{
const {firstname,middlename,lastname,email,password,confirmpassword}=req.body;
console.log({firstname,middlename,lastname,email,password,confirmpassword});
if(password !==confirmpassword){

    return res.statusCode(400).json({message:"password mismatch with confirmPassword"});
}
return res.json({message:"signup"});

})



app.get('/', (req, res) => res.send('hello!'));
app.listen(port, () => console.log(`example app listening on port ${port}!`));
