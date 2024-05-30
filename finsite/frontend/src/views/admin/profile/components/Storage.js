import React, { useState} from "react";
import { Flex, Select, Input, Button, Text, useColorModeValue } from "@chakra-ui/react";
import Card from "components/card/Card.js";

function Storage() {
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const [incomeType, setIncomeType] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleAddIncome = async () => {
    try {
      const response = await fetch("http://localhost:8081/input_income", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ incomeType, amount }),
      });

      if (!response.ok) {
        throw new Error("Failed to add income");
      }

      setError("");
      setSuccessMessage("Income added successfully");

      // Set a timer to clear the success message after 4 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 4000);
    } catch (error) {
      setError("Failed to add income. Please try again.");
    }
  };

  return (
    <Card mb={{ base: "0px", lg: "20px" }} align="center">
      <Flex
        w={{ base: "100%", "2xl": "268px" }}
        me="36px"
        maxH={{ base: "60%", lg: "50%", "1xl": "100%" }}
        minH={{ base: "60%", lg: "50%", "1xl": "100%" }}
      >
        <Flex direction="Column" w="100%" mr={2} p={2} gap={2}>
          <Select
            value={incomeType}
            onChange={(e) => setIncomeType(e.target.value)}
            placeholder="Select Income Type"
            mb="20px"
          >
            <option hidden>Select Income Type...</option>
            <option value="Salary">Salary</option>
            <option value="Pocket Money">Pocket Money</option>
            <option value="Gift">Gift</option>
            <option value="Took Loan">Took Loan</option>
            <option value="Return Loan">Return Loan</option>
          </Select>
          <Input
            placeholder="Enter Amount"
            onChange={(e) => setAmount(e.target.value)}
          />
        </Flex>
      </Flex>
      <Flex direction="column" pe="44px">
        <Text
          color={textColorPrimary}
          fontWeight="bold"
          textAlign="start"
          fontSize="2xl"
          mt={{ base: "20px", "2xl": "50px" }}
        >
          Select the fields and insert Amount
        </Text>
        <Text
          color={textColorSecondary}
          fontSize="md"
          my={{ base: "auto", "2xl": "10px" }}
          mx="auto"
          textAlign="start"
        >
          Insert your Incomes based on categories.
        </Text>
        <Flex w="100%">
          <Button
            me="100%"
            mb="50px"
            w="140px"
            minW="140px"
            mt={{ base: "20px", "2xl": "auto" }}
            variant="brand"
            fontWeight="500"
            onClick={handleAddIncome}
          >
            Add Income
          </Button>
         
        </Flex>
        {error && <div style={{ color: "red" }}>{error}</div>}
          {successMessage && <div style={{ color: "green" }}>{successMessage}</div>}
      
       </Flex>
    </Card>
  );
}

export default Storage;
