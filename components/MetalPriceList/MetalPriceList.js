import React, { useMemo } from "react";
import styles from "./MetalPriceList.module.scss";

const MetalPriceList = ({
  commodities,
  getMetalName,
  calculatePrices,
  currencyFormatter,
}) => {

  const items = useMemo(() => {
    if (!commodities?.length) return [];

    return commodities.map((item) => {
      const metalName = getMetalName(item.metal);
      const prices = calculatePrices(item, metalName);

      return {
        name: item.metal,
        bid: currencyFormatter.format(prices.bidPrice),
        ask: currencyFormatter.format(prices.askPrice),
      };
    });
  }, [commodities, getMetalName, calculatePrices, currencyFormatter]);

  return (
    <div className={styles.wrapper}>
      {items.map((item, index) => (
        <div key={index} className={styles.row}>
          {/* LEFT */}
          <div className={styles.metalName}>{item.name}</div>

          {/* RIGHT */}
          <div className={styles.prices}>
            <div className={styles.priceBlock}>
              <span className={styles.label}>BID (AED)</span>
              <span className={styles.value}>{item.bid}</span>
            </div>

            <div className={styles.priceBlock}>
              <span className={styles.label}>ASK (AED)</span>
              <span className={styles.value}>{item.ask}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetalPriceList;
