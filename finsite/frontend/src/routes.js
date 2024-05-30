import React from "react";
import { Icon } from "@chakra-ui/react";
import { MdPerson, MdHome, MdLock, MdNewLabel } from "react-icons/md";

// Admin Imports
import MainDashboard from "views/admin/default";
import Profile from "views/admin/profile";

// Auth Imports
import SignInCentered from "views/auth/signIn";
import SignUp from "views/auth/signUp"; // Import the SignUp component

const routes = [
  {
    name: "Main Dashboard",
    layout: "/admin",
    path: "/default",
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: MainDashboard,
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "/profile",
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: Profile,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "/sign-in",
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: SignInCentered,
  },
  // Add SignUp route
  {
    name: "New Registration",
    layout: "/auth",
    path: "/sign-up",
    icon: <Icon as={MdNewLabel} width="20px" height="20px" color="inherit" />, // You can change the icon as needed
    component: SignUp,
  },
];

export default routes;
