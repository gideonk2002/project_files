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

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const history = useHistory();

  const handleSignIn = async () => {
    // Validate email and password
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/Sign_in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      // Clear any previous errors
      setError("");

      // Redirect to profile page upon successful sign-in
      history.push("/admin/profile");
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
          Sign In
        </Heading>
        <Text mb="36px" color="gray.400" fontWeight="400" fontSize="md">
          Enter your email and password to sign in!
        </Text>
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
        <Button onClick={handleSignIn} variant="brand" mb="24px">
          Sign In
        </Button>
        <Flex
        flexDirection="column"
        justifyContent="center"
        alignItems="start"
        maxW="100%"
        mt="0px"
      >
        <Text fontWeight="400" fontSize="14px" color="gray.500" mb="24px">
          Not registered yet?{" "}
          <NavLink to="/auth/sign-up">
            <Text color="brand.500" as="span" ms="5px" fontWeight="500">
              Create an Account
            </Text>
          </NavLink>
        </Text>
      </Flex>
      </Box>
     
    </DefaultAuth>
  );
}

export default SignIn;
