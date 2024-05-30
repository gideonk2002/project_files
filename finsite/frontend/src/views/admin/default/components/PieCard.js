import React, { useState, useEffect } from "react";
import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import Card from "components/card/Card.js";
import PieChart from "components/charts/PieChart";
import { fetchPieChartData } from "views/admin/default/variables/api"; // Import fetchPieChartData function
import { VSeparator } from "components/separator/Separator";

export default function Conversion(props) {
  const { ...rest } = props;
  const [pieChartData, setPieChartData] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading state

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const cardColor = useColorModeValue("white", "navy.700");
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );

  useEffect(() => {
    fetchData();
  }, []);

    const fetchData = async () => {
      try {
        const data = await fetchPieChartData();
        setPieChartData(data.length > 0 ? data : []); // Set to empty array if data is empty
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    

  return (
    <Card p="20px" align="center" direction="column" w="100%" {...rest}>
      <Flex
        px={{ base: "0px", "2xl": "10px" }}
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        mb="8px"
      >
        <Text color={textColor} fontSize="md" fontWeight="600" mt="4px">
          This Month
        </Text>
      </Flex>

      {/* Render PieChart only when data is loaded */}
      {!loading && (
        <PieChart
          h="100%"
          w="100%"
          chartData={pieChartData}
          chartOptions={generatePieChartOptions(
            ["Income", "Expense", "Balance"],
            pieChartData
          )}
        />
      )}

      <Card
        bg={cardColor}
        flexDirection="row"
        boxShadow={cardShadow}
        w="100%"
        p="15px"
        px="20px"
        mt="15px"
        mx="auto"
      >
        {/* Display income percentage */}
        <Flex direction="column" py="5px">
          <Flex align="center">
            <Box h="8px" w="8px" bg="brand.500" borderRadius="50%" me="4px" />
            <Text fontSize="xs" color="secondaryGray.600" fontWeight="700" mb="5px">
              Income
            </Text>
          </Flex>
          <Text fontSize="lg" color={textColor} fontWeight="700">
            {pieChartData[0] ? `${pieChartData[0]}%` : "N/A"}
          </Text>
        </Flex>
        <VSeparator mx={{ base: "50px", xl: "25px", "2xl": "50px" }} />
        {/* Display system percentage */}
        <Flex direction="column" py="5px" me="10px">
          <Flex align="center">
            <Box h="8px" w="8px" bg="#6AD2FF" borderRadius="50%" me="4px" />
            <Text fontSize="xs" color="secondaryGray.600" fontWeight="700" mb="5px">
              Expense
            </Text>
          </Flex>
          <Text fontSize="lg" color={textColor} fontWeight="700">
            {pieChartData[1] ? `${pieChartData[1]}%` : "N/A"}
          </Text>
        </Flex>
        {/* Display empty percentage */}
        
      </Card>
    </Card>
  );
}

// Function to generate pie chart options dynamically
export const generatePieChartOptions = (labels, data) => ({
  labels: labels,
  colors: ["#4318FF", "#6AD2FF", "#EFF4FB"], // Adjust colors if needed
  chart: {
    width: "50px",
  },
  states: {
    hover: {
      filter: {
        type: "none",
      },
    },
  },
  legend: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  hover: { mode: null },
  plotOptions: {
    donut: {
      expandOnClick: false,
      donut: {
        labels: {
          show: false,
        },
      },
    },
  },
  fill: {
    colors: ["#4318FF", "#6AD2FF", "#EFF4FB"], // Adjust fill colors if needed
  },
  tooltip: {
    enabled: true,
    theme: "dark",
  },
  series: data,
});
