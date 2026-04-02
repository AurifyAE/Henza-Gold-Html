import React from "react";
import { Box } from "@mui/material";

const YoutubeVideo = () => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        paddingTop: "56.25%", // 16:9
        borderRadius: "1vw",
        overflow: "hidden",
      }}
    >
      <Box
        component="iframe"
        src="https://www.youtube.com/embed/iEpJwprxDdk?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&loop=1&playlist=iEpJwprxDdk"
        title="Market Video"
        allow="autoplay; encrypted-media"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "none",
        }}
      />
    </Box>
  );
};

export default YoutubeVideo;
