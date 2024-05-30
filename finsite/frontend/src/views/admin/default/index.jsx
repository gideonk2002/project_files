import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  FormLabel,
  Icon,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdFileCopy,
} from "react-icons/md";
import CheckTable from "views/admin/default/components/CheckTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import PieCard from "views/admin/default/components/PieCard";
import TotalSpent from "views/admin/default/components/TotalSpent";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import { fetchLogsData } from "views/admin/default/variables/api"; // Import the fetchLogsData function from your API file
import { columnsDataCheck } from "views/admin/default/variables/columnsData";

function UserReports() {
  const [statisticsData, setStatisticsData] = useState([]);
  const [logData, setLogData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8081/statisticsData");
      const data = await response.json();
  
      setStatisticsData([
        { name: 'Total Income', value: data.TotalIncome ? `${data.TotalIncome} /-` : 'N/A' },
        { name: 'Total Expenses', value: data.TotalExpenses ? `${data.TotalExpenses} /-` : 'N/A' },
        { name: 'Spent this month', value: data.SpentThisMonth ? `${data.SpentThisMonth} /-` : 'N/A' },
        { name: 'Your balance', value: data.YourBalance ? `${data.YourBalance} /-` : 'N/A' },
        { name: 'Total Count of Incomes', value: data.TotalCountOfIncomes ? data.TotalCountOfIncomes : 'N/A' },
        { name: 'Total Count of Expenses', value: data.TotalCountOfExpenses ? data.TotalCountOfExpenses : 'N/A' },
      ]);
  
      const logsData = await fetchLogsData();
      if (logsData.length === 0) {
        // Create an array of zero values matching the column structure
        const zeroValues = Array.from({ length: columnsDataCheck.length }, () => 0);
        setLogData(zeroValues); // Set zero values to the state
      } else {
        setLogData(logsData); // Set the fetched data to the state
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Set default values or null values for statistics data
      const defaultStatisticsData = [
        { name: 'Total Income', value: 'N/A' },
        { name: 'Total Expenses', value: 'N/A' },
        { name: 'Spent this month', value: 'N/A' },
        { name: 'Your balance', value: 'N/A' },
        { name: 'Total Count of Incomes', value: 'N/A' },
        { name: 'Total Count of Expenses', value: 'N/A' },
      ];
      setStatisticsData(defaultStatisticsData);

      // Set zero values for log data
      const zeroValues = Array.from({ length: columnsDataCheck.length }, () => 0);
      setLogData(zeroValues);
    }
  };
  

  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
        gap='20px'
        mb='20px'>
        {statisticsData.map((statistic, index) => (
          <MiniStatistics
            key={index}
            name={statistic.name}
            value={statistic.value}
            
            endContent={index === 3 && (
              <Flex me='-16px' mt='10px'>
                <FormLabel htmlFor='balance'></FormLabel>
              </Flex>
            )}
            bg={index === 4 ? 'linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)' : boxBg}
            icon={index === 5 && (
              <Icon w='32px' h='32px' as={MdFileCopy} color={brandColor} />
            )}
          />
        ))}
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px' mb='20px'>
        <TotalSpent />
        <WeeklyRevenue />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
        <CheckTable columnsData={columnsDataCheck} tableData={logData} />
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
          <DailyTraffic />
          <PieCard />
        </SimpleGrid>
      </SimpleGrid>
    </Box>
  );
}

export default UserReports;