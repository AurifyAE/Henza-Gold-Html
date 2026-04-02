import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

const SystemClock = () => {
  const [timeData, setTimeData] = useState({
    day: "",
    date: "",
    time: "",
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const dayStr = now
        .toLocaleDateString("en-GB", { weekday: "long" })
        .toUpperCase();

      const dateStr = now
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .toUpperCase();

      const timeStr = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      setTimeData({
        day: dayStr,
        date: dateStr,
        time: timeStr,
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Glass Container */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "2vw",
          width: "100%",
          padding: "1.2vw 2.5vw",
          borderRadius: "20px",
          backdropFilter: "blur(2px)",
        }}
      >
        {/* Day */}
        <Typography
          sx={{
            fontSize: {
              xs: "12px",
              sm: "1.4vw",
            },
            fontWeight: 500,
            color: "#A0A0A0",
            letterSpacing: "2px",
          }}
        >
          {timeData.day || "-----"}
        </Typography>

        {/* Divider */}
        <Box
          sx={{
            width: "2px",
            height: "2vw",
            background: "rgba(255,255,255,0.2)",
          }}
        />

        {/* Date */}
        <Typography
          sx={{
            fontSize: {
              xs: "12px",
              sm: "1.6vw",
            },
            fontWeight: 700,
            letterSpacing: "2px",
            color: "#FFFFFF",
          }}
        >
          {timeData.date || "-- --- ----"}
        </Typography>

        {/* Optional Time (highlight) */}
        <Typography
          sx={{
            fontSize: {
              xs: "14px",
              sm: "1.8vw",
            },
            fontWeight: 800,
            color: "#d5bbfa",
            letterSpacing: "2px",
            marginLeft: "1vw",
          }}
        >
          {timeData.time}
        </Typography>
      </Box>
    </Box>
  );
};

export default SystemClock;
