const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dbHandler = require('./DBHandler'); 

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Middleware to extract user's email from token
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  // Validate token and extract user's email
  // Example: decode JWT token or fetch email from session
  const userEmail = decodeTokenAndGetEmail(token);
  if (!userEmail) return res.status(401).json({ error: 'Unauthorized' });

  req.userEmail = userEmail;
  next();
};
app.post("/sign_in", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await dbHandler.signIn(email, password);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while processing your request" });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const result = await dbHandler.signUp(name, email, password);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while processing your request" });
  }
});

app.post("/input_income", async (req, res) => {
  try {
    const { incomeType, amount } = req.body;
    const result = await dbHandler.inputIncome(incomeType, amount);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while processing your request" });
  }
});

app.post("/input_expense", async (req, res) => {
  try {
    const { expenseType, amount } = req.body;
    const result = await dbHandler.inputExpense(expenseType, amount);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while processing your request" });
  }
});


app.get("/statisticsData", async (req, res) => {
  try {
    const statisticsData = await dbHandler.fetchStatisticsData();
    res.status(200).json(statisticsData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while processing your request" });
  }
});

app.get("/api/logs", async (req, res) => {
  try {
    const logsData = await dbHandler.getAllLogs();
    res.status(200).json(logsData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while processing your request" });
  }
});

app.get("/api/piechartdata", async (req, res) => {
  try {
    const pieChartData = await dbHandler.fetchPieChartData();
    res.status(200).json(pieChartData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while processing your request" });
  }
});

app.get("/api/logs", async (req, res) => {
  try {
    const { date } = req.query;
    const logsData = await fetchLogsData(date);
    res.json(logsData);
  } catch (error) {
    console.error("Error fetching logs data:", error);
    res.status(500).json({ error: "An error occurred while fetching logs data" });
  }
});

app.get("/api/YearlyData", async (req, res) => {
  try {
    const data = await YearlyData();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while processing your request" });
  }
});




const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
