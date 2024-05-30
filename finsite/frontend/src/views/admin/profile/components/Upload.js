import React, { useState } from "react";
import { Flex, Select, Input, Button, Text, useColorModeValue } from "@chakra-ui/react";
import Card from "components/card/Card.js";

function Upload() {
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const [expenseType, setExpenseType] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleAddExpense = async () => {
    try {
      const response = await fetch("http://localhost:8081/input_expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ expenseType, amount }),
      });

      if (!response.ok) {
        throw new Error("Failed to add expense");
      }

      // Clear any previous errors
      setError("");
      // Show success message
      setSuccessMessage("Expense added successfully");
      setTimeout(() => {
        setSuccessMessage("");
      }, 4000);
    } catch (error) {
      setError("Failed to add expense. Please try again.");
    }
  };

  return (
    <Card mb="20px" align="center" p="20px">
      <Flex h="100%" direction={{ base: "column", "2xl": "row" }}>
        <Flex
          w={{ base: "100%", "2xl": "268px" }}
          me="36px"
          maxH={{ base: "60%", lg: "50%", "1xl": "100%" }}
          minH={{ base: "60%", lg: "50%", "1xl": "100%" }}
        >
          <Flex direction="Column" w="100%" mr={2} p={2} gap={2}>
            {/* Expense type dropdown menu */}
            <Select
              value={expenseType}
              onChange={(e) => setExpenseType(e.target.value)}
              placeholder="Select Expense Type"
              mb="20px"
            >
              {/* Hide the default option from the dropdown menu */}
              <option hidden>Select Expense Type...</option>
              <option value="Housing">Housing</option>
              <option value="Food">Food</option>
              <option value="Transportation">Transportation</option>
              <option value="Utilities">Utilities</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Personal Care">Personal Care</option>
              <option value="Clothing">Clothing</option>
              <option value="Debt Payments">Debt Payments</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Childcare">Childcare</option>
              <option value="Insurance">Insurance</option>
              <option value="Savings">Savings</option>
              <option value="Taxes">Taxes</option>
              <option value="Pets">Pets</option>
              <option value="Home Maintenance">Home Maintenance</option>
              <option value="Travel">Travel</option>
              <option value="Gifts and Donations">Gifts and Donations</option>
              <option value="Subscriptions">Subscriptions</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </Select>
            {/* Amount input */}
            <Input
              placeholder="Enter Amount"
              value={amount}
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
            Insert your expenses based on categories and subcategories.
          </Text>
          <Flex w="100%">
            {/* Add Expenses button */}
            <Button
              me="100%"
              mb="50px"
              w="140px"
              minW="140px"
              mt={{ base: "20px", "2xl": "auto" }}
              variant="brand"
              fontWeight="500"
              onClick={handleAddExpense}
            >
              Add Expenses
            </Button>
          </Flex>
          {/* Error message */}
          {error && <div style={{ color: "red" }}>{error}</div>}
          {/* Success message */}
          {successMessage && <div style={{ color: "green" }}>{successMessage}</div>}
        </Flex>
      </Flex>
    </Card>
  );
}

export default Upload;
