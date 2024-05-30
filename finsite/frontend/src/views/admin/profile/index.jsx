import { Box, Grid } from "@chakra-ui/react";
import Banner from "views/admin/profile/components/Banner";
import Storage from "views/admin/profile/components/Storage";
import Upload from "views/admin/profile/components/Upload";
import React, { useState, useEffect } from "react";
import axios from "axios";

import banner from "assets/img/auth/banner.png";
import avatar from "assets/img/avatars/avatar1.png";

function Overview() {
  const [userData, setUserData] = useState({
    name: 'GIdeon K',
    income: '10',
    expense: '8',
    balance: '45670 /-',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8081/Profile_data");
      const { name, income, expense, balance } = response.data;
      setUserData({ name, income, expense, balance: `${balance} /-` });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}
      <Grid
        templateColumns={{
          base: "1fr",
          lg: "1.34fr 1fr 1.62fr",
        }}
        templateRows={{
          base: "repeat(3, 1fr)",
          lg: "1fr",
        }}
        gap={{ base: "20px", xl: "20px" }}
      >
        <Banner
          gridArea='1 / 1 / 2 / 2'
          banner={banner}
          avatar={avatar}
          name={userData.name}
          income={userData.income}
          expense={userData.expense}
          balance={userData.balance}
        />
        <Storage
          gridArea={{ base: "2 / 1 / 3 / 2", lg: "1 / 2 / 2 / 3" }}
        />
        <Upload
          gridArea={{
            base: "3 / 1 / 4 / 2",
            lg: "1 / 3 / 2 / 4",
          }}
          minH={{ base: "auto", lg: "420px", "2xl": "365px" }}
          pe='20px'
          pb={{ base: "100px", lg: "20px" }}
        />
      </Grid>
    </Box>
  );
}

export default Overview;
