import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

const clockConfig = [
  {
    key: "india",
    label: "INDIA",
    timeZone: "Asia/Kolkata",
    flag: "/images/india.png",
  },
  {
    key: "uae",
    label: "UAE",
    timeZone: "Asia/Dubai",
    flag: "/images/uae.png",
  },
  {
    key: "london",
    label: "LONDON",
    timeZone: "Europe/London",
    flag: "/images/uk.png",
  },
];

const WorldClockHorizontal = () => {
  const [times, setTimes] = useState({});

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const timeOptions = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };

      const updatedTimes = {};

      clockConfig.forEach((clock) => {
        updatedTimes[clock.key] = now.toLocaleTimeString("en-US", {
          ...timeOptions,
          timeZone: clock.timeZone,
        });
      });

      setTimes(updatedTimes);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        gap: "2vw",
        padding: "1vw 2vw",
        backdropFilter: "blur(2px)",

        width: "100%",
      }}
    >
      {clockConfig.map((clock) => (
        <Box
          key={clock.key}
          sx={{
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            gap: {
              xs: "10px",
              lg: "1vw",
            },
          }}
        >
          <Box
            sx={{
              width: {
                xs: "30px",
                lg: "4vw",
              },
            }}
          >
            <img
              src={clock.flag}
              alt={clock.label}
              style={{ width: "100%", height: "auto" }}
            />
          </Box>
          <Box>
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "0.5vw",
                fontSize: {
                  xs: "14px",
                  lg: "1.2vw",
                },
                fontWeight: 500,
                color: "#FFFFFF",
              }}
            >
              {clock.label}
            </Typography>

            <Typography
              sx={{
                fontSize: {
                  xs: "14px",
                  lg: "1.2vw",
                },
                color: "#fff",
              }}
            >
              {times[clock.key] || "--:-- AM"}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default WorldClockHorizontal;
