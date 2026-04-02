import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useSpotRate } from "../context/SpotRateContext";
import MainLogo from "/images/logo.svg";

const SpotRate = () => {
  const { goldData, silverData } = useSpotRate();

  const [goldBidDir, setGoldBidDir] = useState("neutral");
  const [goldAskDir, setGoldAskDir] = useState("neutral");
  const [silverBidDir, setSilverBidDir] = useState("neutral");
  const [silverAskDir, setSilverAskDir] = useState("neutral");

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.screen.width <= 768); // 🔥 screen.width ignores zoom
    };

    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  const prev = useRef({
    goldBid: null,
    goldAsk: null,
    silverBid: null,
    silverAsk: null,
    platinumBid: null,
    platinumAsk: null,
  });

  const detectChange = (prevVal, currVal, setDir) => {
    if (prevVal === null) return currVal;

    if (currVal > prevVal) {
      setDir("rise");
      setTimeout(() => setDir("neutral"), 800);
    } else if (currVal < prevVal) {
      setDir("fall");
      setTimeout(() => setDir("neutral"), 800);
    }

    return currVal;
  };

  useEffect(() => {
    prev.current.goldBid = detectChange(
      prev.current.goldBid,
      goldData.bid,
      setGoldBidDir,
    );
  }, [goldData.bid]);

  useEffect(() => {
    prev.current.goldAsk = detectChange(
      prev.current.goldAsk,
      goldData.ask,
      setGoldAskDir,
    );
  }, [goldData.ask]);

  useEffect(() => {
    prev.current.silverBid = detectChange(
      prev.current.silverBid,
      silverData.bid,
      setSilverBidDir,
    );
  }, [silverData.bid]);

  useEffect(() => {
    prev.current.silverAsk = detectChange(
      prev.current.silverAsk,
      silverData.ask,
      setSilverAskDir,
    );
  }, [silverData.ask]);

  const getColors = (dir) => {
    if (dir === "rise")
      return { bgColor: "#00FF15", border: "1px solid #00ff9d" };
    if (dir === "fall")
      return { bgColor: "#FF0040", border: " 1px solid #ff3366" };
    return { bgColor: "#F0F8FF00", border: " 1px solid #FFFFFF" };
  };

  const PricePulse = ({ label, value, dir }) => {
    const { bgColor, border } = getColors(dir);
    const hasPulse = dir !== "neutral";

    return (
      <Box
        sx={{
          position: "relative",
          flex: 1,
          mb: "1vw",

          overflow: "hidden",
          ...(hasPulse && {
            animation:
              dir === "rise"
                ? "pulseRise 0.8s ease-out"
                : "pulseFall 0.8s ease-out",
            bgcolor:
              dir === "rise"
                ? "0 0 0 0 rgba(0,255,157,0.6)"
                : "0 0 0 0 rgba(255,51,102,0.6)",
          }),
        }}
      >
        <Typography
          sx={{
            // fontSize: "1vw",

            fontSize: {
              xs: "15px", // mobile
              sm: "2.5vw", // small tablets
              md: "1.6vw", // laptops
            },
            letterSpacing: "0.25vw",
            color: "#FFFFFF",
            mb: "0.5vw",
            textShadow: "0 0 0.8vw rgba(255 255 255 / 0.53)",
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            // fontSize: "2.4vw",
            fontSize: {
              xs: "18px", // mobile
              sm: "2.5vw", // small tablets
              md: "1.8vw", // laptops
              lg: "2.4vw", // desktop
              xl: "2.4vw", // large screens
            },
            fontWeight: 800,
            letterSpacing: "0.18vw",
            textAlign: "center",
            bgcolor: bgColor,
            color: "white",
            border: border,
            borderRadius: "0.8vw",
            fontVariantNumeric: "tabular-nums",
            transition: "all 0.4s ease",
          }}
        >
          {value}
        </Typography>
      </Box>
    );
  };

  const MetalPanel = ({ data, bidDir, askDir, theme }) => {
    const isSilver = theme === "silver";

    const imageSrc = isSilver ? "/images/silver.svg" : "/images/gold.svg";

    return (
      <Box
        sx={{
          position: "relative",
        }}
      >
        {/* Grid Layout */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr .5fr 1fr",
            alignItems: "center",
            justifyContent:'center'
          }}
        >
          {/* LEFT - BID */}
          <Box textAlign="center">
            <Typography
              sx={{
                fontSize: "1.5vw",
                color: "#888",
                fontWeight: "800",

                letterSpacing: "2px",
              }}
            >
              BID
            </Typography>

            <Typography
              sx={{
                fontSize: "2vw",
                fontWeight: 800,
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "12px",
                marginTop: "0.5vw",
                color: "#fff",
                transition: "all 0.3s ease",

                ...(bidDir === "rise" && {
                  backgroundColor: "rgb(3, 165, 19)",
                }),

                ...(bidDir === "fall" && {
                  backgroundColor: "rgb(173, 0, 55)",
                }),
              }}
            >
              {data.bid}
            </Typography>

            <Typography sx={{ mt: "0.5vw", color: "#888", fontSize: "1.5vw" }}>
              LOW{" "}
              <span style={{ color: "#ff3b3b", fontWeight: 600 }}>
                {data.low}
              </span>
            </Typography>
          </Box>

          {/* CENTER IMAGE */}
          <Box
            component="img"
            src={imageSrc}
            sx={{
              width: "4vw",
              minWidth: "40px",
              margin:'auto'
              
            }}
          />

          {/* RIGHT - ASK */}
          <Box textAlign="center">
            <Typography
              sx={{
                fontSize: "1.5vw",
                color: "#888",
                fontWeight: "800",
                letterSpacing: "2px",
              }}
            >
              ASK
            </Typography>

            <Typography
              sx={{
                fontSize: "2vw",
                fontWeight: 800,
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "12px",
                marginTop: "0.5vw",
                color: "#fff",
                transition: "all 0.3s ease",

                ...(askDir === "rise" && {
                  backgroundColor: "rgb(3, 165, 19)",
                }),

                ...(askDir === "fall" && {
                  backgroundColor: "rgb(173, 0, 55)",
                }),
              }}
            >
              {data.ask}
            </Typography>

            <Typography sx={{ mt: "0.5vw", color: "#888", fontSize: "1.5vw" }}>
              HIGH{" "}
              <span style={{ color: "#4cff4c", fontWeight: 600 }}>
                {data.high}
              </span>
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        display: "grid",
        width: "100%",
        padding: "1vw",
        background: "rgba(15,15,15,0.9)",
        borderRadius: "20px",
        border: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(10px)",
        gridTemplateColumns: { xs: "1fr" },
      }}
    >
      <MetalPanel
        data={goldData}
        bidDir={goldBidDir}
        askDir={goldAskDir}
        theme="gold"
      />

      <MetalPanel
        data={silverData}
        bidDir={silverBidDir}
        askDir={silverAskDir}
        theme="silver"
      />
    </Box>
  );
};

export default SpotRate;
