import React from "react";
import styles from "./MarketVideoCard.module.scss";

const MarketVideoCard = () => {
  return (
    <div className={styles.wrapper}>
      <iframe
        className={styles.video}
        src="https://www.youtube.com/embed/iEpJwprxDdk?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1"
        title="Market Video"
        frameBorder="0"
        allow="autoplay; encrypted-media; fullscreen"
        allowFullScreen
      />
    </div>
  );
};

export default MarketVideoCard;
