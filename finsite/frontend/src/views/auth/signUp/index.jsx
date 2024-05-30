import React, { useState } from "react";
import { useHistory, NavLink } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Flex,
} from "@chakra-ui/react";
import DefaultAuth from "layouts/auth/Default";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import illustration from "assets/img/auth/auth.png";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const history = useHistory();

  const handleSignUp = async () => {
    // Validate name, email, and password
    if (!name || !email || !password) {
      setError("Please enter your name, email, and password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      // Clear any previous errors
      setError("");
      setSuccessMessage("Sign up successful!");

      // Redirect to sign-in page upon successful sign-up
      history.push("/auth/sign-in");
    } catch (error) {
      setError("Invalid email or password. Please try again.");
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Box
        maxW={{ base: "100%", md: "420px" }}
        mx={{ base: "auto", lg: "0px" }}
        mt={{ base: "40px", md: "14vh" }}
        px={{ base: "25px", md: "0px" }}
        mb={{ base: "20px", md: "auto" }}
        flexDirection="column"
      >
        <Heading fontSize="36px" mb="10px">
          Sign Up
        </Heading>
        <Text mb="36px" color="gray.400" fontWeight="400" fontSize="md">
          Enter your name, email, and password to sign up!
        </Text>
        <FormControl mb="24px">
          <FormLabel>Name</FormLabel>
          <Input
            type="text" // Change the type to "text" for name input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
        <FormControl mb="24px">
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl mb="24px">
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement>
              <Icon
                as={showPassword ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                color="gray.500"
                cursor="pointer"
                onClick={handleTogglePasswordVisibility}
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>
        {error && (
          <Text color="red.500" mb="24px" fontWeight="bold">
            {error}
          </Text>
        )}
        {successMessage && (
          <Text color="green.500" mb="24px" fontWeight="bold">
            {successMessage}
          </Text>
        )}
        <Button onClick={handleSignUp} variant="brand" mb="24px">
          Sign Up
        </Button>
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="start"
          maxW="100%"
          mt="0px"
        >
          <Text fontWeight="400" fontSize="14px" color="gray.500" mb="24px">
            Go Back to sign in{" "}
            <NavLink to="/auth/sign-in">
              <Text color="brand.500" as="span" ms="5px" fontWeight="500">
                Sign In
              </Text>
            </NavLink>
          </Text>
        </Flex>
      </Box>
    </DefaultAuth>
  );
}

export default SignUp;
