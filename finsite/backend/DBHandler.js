const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'finsite'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

let userEmail = '';

function setUserEmail(email) {
  userEmail = email;
}

function signIn(email, password) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM reg WHERE `User_id` = ? AND `Password` = ?";
    connection.query(sql, [email, password], (err, result) => {
      if (err) {
        reject(err);
      } else {
        if (result.length > 0) {
          setUserEmail(email);
          resolve({ success: true, message: "Login successful" });
        } else {
          resolve({ success: false, message: "Invalid email or password" });
        }
      }
    });
  });
}

function signUp(name, email, password) {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO reg (User_name, User_id, Password) VALUES (?, ?, ?)";
    connection.query(sql, [name, email, password], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve({ success: true, message: "SignUp successful" });
      }
    });
  });
}

function inputIncome(incomeType, amount) {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO logs (User_id, Type, Category, Amount) VALUES (?, ?, ?, ?)";
    connection.query(sql, [userEmail, "Income", incomeType, amount], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve({ success: true, message: "Income added successfully" });
      }
    });
  });
}

function inputExpense(expenseType, amount) {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO logs (User_id, Type, Category, Amount) VALUES (?, ?, ?, ?)";
    connection.query(sql, [userEmail, "Expense", expenseType, amount], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve({ success: true, message: "Expense added successfully" });
      }
    });
  });
}


function fetchStatisticsData() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT
        (SELECT SUM(Amount) FROM logs WHERE User_id = ? AND Type='Income') AS TotalIncome,
        (SELECT SUM(Amount) FROM logs WHERE User_id = ? AND Type='Expense') AS TotalExpenses,
        (SELECT SUM(Amount) FROM logs WHERE User_id = ? AND Type='Expense' AND MONTH(date) = MONTH(CURRENT_DATE())) AS SpentThisMonth,
        (SELECT (SELECT SUM(Amount) FROM logs WHERE User_id = ? AND Type='Income') - (SELECT SUM(Amount) FROM logs WHERE User_id = ? AND Type='Expense')) AS YourBalance,
        (SELECT COUNT(*) FROM logs WHERE User_id = ? AND Type='Income') AS TotalCountOfIncomes,
        (SELECT COUNT(*) FROM logs WHERE User_id = ? AND Type='Expense') AS TotalCountOfExpenses
    `;
    connection.query(query, [userEmail, userEmail, userEmail, userEmail, userEmail, userEmail, userEmail], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
  });
}

function getAllLogs() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT Type,Category,Amount,date FROM logs WHERE User_id = ?';
    connection.query(query, [userEmail], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

function fetchPieChartData() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT
        (SELECT SUM(Amount) FROM logs WHERE User_id = ? AND Type='Income') AS TotalIncome,
        (SELECT SUM(Amount) FROM logs WHERE User_id = ? AND Type='Expense') AS TotalExpenses,
        (SELECT (SELECT SUM(Amount) FROM logs WHERE User_id = ? AND Type='Income') - (SELECT SUM(Amount) FROM logs WHERE User_id = ? AND Type='Expense')) AS Balance
    `;
    connection.query(query, [userEmail, userEmail, userEmail, userEmail], (err, results) => {
      if (err) {
        reject(err);
      } else {
        // Calculate percentages
        const totalIncome = results[0].TotalIncome;
        const totalExpenses = results[0].TotalExpenses;
        const balance = results[0].Balance;
        const total = totalIncome + totalExpenses + balance;

        const incomePercentage = parseInt((totalIncome / total) * 100);
        const expensePercentage = parseInt((totalExpenses / total) * 100);
        const balancePercentage = parseInt((balance / total) * 100);

        const pieChartData = [incomePercentage, expensePercentage, balancePercentage];
        
        resolve(pieChartData);
      }
    });
  });
}
function fetchLogsData(date) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * 
      FROM logs 
      WHERE DATE(date_column) = ?;`;
    connection.query(query, [date], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

module.exports = { fetchLogsData };

// DBHandler.js

function YearlyData() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT
        MONTH(date) AS Month,
        SUM(CASE WHEN Type='Income' THEN Amount ELSE 0 END) / SUM(Amount) * 100 AS TotalIncome,
        SUM(CASE WHEN Type='Expense' THEN Amount ELSE 0 END) / SUM(Amount) * 100 AS TotalExpenses
      FROM logs
      GROUP BY MONTH(date)
    `;
    console.log("Executing query:", query); // Log the query being executed
    connection.query(query, (err, results) => {
      if (err) {
        console.error("Error executing query:", err); // Log any errors that occur during query execution
        reject(err);
      } else {
        console.log("Query results:", results); // Log the results obtained from the query
        const data = results.map(({ Month, TotalIncome, TotalExpenses }) => ({
          Month,
          TotalIncome: TotalIncome || 0,
          TotalExpenses: TotalExpenses || 0,
        }));
        resolve(data);
      }
    });
  });
}

module.exports = { YearlyData };




module.exports = { signIn, signUp, inputIncome, inputExpense, fetchStatisticsData, getAllLogs, fetchPieChartData, fetchLogsData };

