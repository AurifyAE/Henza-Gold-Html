import React from "react";
import { Box, Typography } from "@mui/material";
import AurifyLogo from "/images/aurify-logo.svg";

const PoweredByAurify = () => {


  return (
    <Box
      sx={{
        textDecoration: "none",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "end",
        gap: "0.6vw",
        padding: "0.8vw 1.4vw",
        // margin: "0 auto",
      }}
    >


      <Typography
        component="a"
        href="https://www.aurify.ae"
        target="_blank"
        rel="noopener noreferrer"
        
      >
     
        <Box
          component="img"
          src={AurifyLogo}
          alt="Aurify"
          sx={{
            height: { xs: "5vw", md: "4vw" },
            objectFit: "contain",
          }}
        />

      </Typography>
    </Box>
  );
};

export default PoweredByAurify;
