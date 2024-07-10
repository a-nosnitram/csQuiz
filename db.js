const mysql = require('mysql2')

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'csQuiz'
  });
  
conn.connect((err) => {
    if (err) {
      console.error('error connecting to db :', err.message);
    return;
    }
    console.log('connected to db');
});

  module.exports = conn 
