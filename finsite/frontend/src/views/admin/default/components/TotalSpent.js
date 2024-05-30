import React, { useState, useEffect } from "react";
import { MdBarChart, MdOutlineCalendarToday } from "react-icons/md";
import { fetchYearlyData } from "views/admin/default/variables/api";
import { lineChartOptionsTotalSpent } from "variables/charts";
import { Button, Flex, Icon, Box, useColorModeValue } from "@chakra-ui/react";
import Card from "components/card/Card.js";
import LineChart from "components/charts/LineChart";

export default function TotalSpent(props) {
  const defaultChartData = [
    {
      name: "Income",
      data: [0, 0, 0, 66, 49, 68, 50, 64, 48, 66, 49, 68],
    },
    {
      name: "Expense",
      data: [0, 0, 0, 46, 20, 46, 30, 40, 24, 46, 20, 46],
    },
  ];
  
  const [chartData, setChartData] = useState(defaultChartData);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      const { Income, Expense } = await fetchYearlyData();
      const incomeArray = Income.map(percent => Math.round(percent));
      const expenseArray = Expense.map(percent => Math.round(percent));
  
      setChartData([
        { name: "Income", data: incomeArray },
        { name: "Expense", data: expenseArray },
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error appropriately
    }
  };
  
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = useColorModeValue("secondaryGray.600", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const iconColor = useColorModeValue("brand.500", "white");
  const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const bgHover = useColorModeValue(
    { bg: "secondaryGray.400" },
    { bg: "whiteAlpha.50" }
  );
  const bgFocus = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.100" }
  );
  return (
    <Card
      justifyContent='center'
      align='center'
      direction='column'
      w='100%'
      mb='0px'
      {...props}>
      <Flex justify='space-between' ps='0px' pe='20px' pt='5px'>
        <Flex align='center' w='100%'>
          <Button
            bg={boxBg}
            fontSize='sm'
            fontWeight='500'
            color={textColorSecondary}
            borderRadius='7px'>
            <Icon
              as={MdOutlineCalendarToday}
              color={textColorSecondary}
              me='4px'
            />
            This Year
          </Button>
          <Button
            ms='auto'
            align='center'
            justifyContent='center'
            bg={bgButton}
            _hover={bgHover}
            _focus={bgFocus}
            _active={bgFocus}
            w='37px'
            h='37px'
            lineHeight='100%'
            borderRadius='10px'
            {...props}>
            <Icon as={MdBarChart} color={iconColor} w='24px' h='24px' />
          </Button>
        </Flex>
      </Flex>
      <Flex w='100%' flexDirection={{ base: "column", lg: "row" }}>
        <Box minH='260px' minW='100%' mt='auto'>
          <LineChart
            chartData={chartData}
            chartOptions={lineChartOptionsTotalSpent}
          />
        </Box>
      </Flex>
    </Card>
  );
}
