export async function fetchLogsData() {
  try {
    const response = await fetch("http://localhost:8081/api/logs");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching logs data:", error);
    throw new Error("Error fetching logs data:", error);
  }
}

export async function fetchPieChartData() {
  try {
    const response = await fetch("http://localhost:8081/api/piechartdata"); // Corrected endpoint URL
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching pie chart data:", error); // Updated error message
    throw new Error("Error fetching pie chart data:", error);
  }
}

export async function fetchDailyTraffic() {
  try {
    const response = await fetch("http://localhost:8081/api/dailytraffic"); // Corrected endpoint URL
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching daily traffic data:", error); // Updated error message
    throw new Error("Error fetching daily traffic data:", error);
  }
}
// api.js

export async function fetchYearlyData() {
  try {
    const response = await fetch("http://localhost:8081/api/YearlyData");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching yearly data:", error);
    throw new Error("Error fetching yearly data:", error);
  }
}




  
