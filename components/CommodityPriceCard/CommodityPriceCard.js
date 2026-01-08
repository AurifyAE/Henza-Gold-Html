'use client';

import React, { useEffect, useState } from 'react';
import styles from "./CommodityPriceCard.module.scss";
import Image from 'next/image';
import io from 'socket.io-client';

import { fetchSpotRates, fetchServerURL } from '@/pages/api/api';
import { useSpotRate } from '@/context/SpotRateContext';

const CommodityPriceCard = () => {

  // ============================================================================
  // STATE
  // ============================================================================
  const [serverURL, setServerURL] = useState('');
  const [marketData, setMarketData] = useState({});
  const [commodities, setCommodities] = useState([]);

  const [goldBidSpread, setGoldBidSpread] = useState(0);
  const [goldAskSpread, setGoldAskSpread] = useState(0);
  const [silverBidSpread, setSilverBidSpread] = useState(0);
  const [silverAskSpread, setSilverAskSpread] = useState(0);

  const [prevGoldBid, setPrevGoldBid] = useState(null);
  const [goldBidDirection, setGoldBidDirection] = useState('');
  const [prevSilverBid, setPrevSilverBid] = useState(null);
  const [silverBidDirection, setSilverBidDirection] = useState('');

  const [prevGoldAsk, setPrevGoldAsk] = useState(null);
  const [goldAskDirection, setGoldAskDirection] = useState('');

  const [prevSilverAsk, setPrevSilverAsk] = useState(null);
  const [silverAskDirection, setSilverAskDirection] = useState('');



  const adminId = process.env.NEXT_PUBLIC_ADMIN_ID;
  const { updateMarketData } = useSpotRate();

  // ============================================================================
  // COMPUTED PRICES
  // ============================================================================

  const GoldbiddingPrice = (marketData?.Gold?.bid || 0) + goldBidSpread;
  const GoldaskingPrice = GoldbiddingPrice + 0.5 + goldAskSpread;
  const SilverbiddingPrice = (marketData?.Silver?.bid || 0) + silverBidSpread;
  const SilverAskingPrice = Number((SilverbiddingPrice + 0.05 + silverAskSpread).toFixed(3));

  // ============================================================================
  // INITIAL DATA (SPREADS + SERVER)
  // ============================================================================
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [spotRes, serverRes] = await Promise.all([
          fetchSpotRates(adminId),
          fetchServerURL(),
        ]);

        const info = spotRes.data.info;

        setCommodities(info.commodities || []);
        setGoldBidSpread(info.goldBidSpread || 0);
        setGoldAskSpread(info.goldAskSpread || 0);
        setSilverBidSpread(info.silverBidSpread || 0);
        setSilverAskSpread(info.silverAskSpread || 0);
        setServerURL(serverRes.data.info.serverURL);
      } catch (err) {
        console.error('Failed to load initial data', err);
      }
    };

    loadInitialData();
  }, [adminId]);

  // ============================================================================
  // SOCKET CONNECTION
  // ============================================================================
  useEffect(() => {
    if (!serverURL) return;

    const socket = io(serverURL, {
      query: { secret: process.env.NEXT_PUBLIC_SOCKET_SECRET_KEY },
      transports: ['websocket'],
      withCredentials: true,
    });

    socket.on('connect', () => {
      socket.emit('request-data', ['GOLD', 'SILVER']);
    });

    socket.on('market-data', (data) => {
      setMarketData((prev) => ({ ...prev, [data.symbol]: data }));
    });

    return () => socket.disconnect();
  }, [serverURL]);

  // ============================================================================
  // CONTEXT UPDATE
  // ============================================================================
  useEffect(() => {
    if (!Object.keys(marketData).length) return;

    updateMarketData(
      marketData,
      goldBidSpread,
      goldAskSpread,
      silverBidSpread,
      silverAskSpread
    );
  }, [
    marketData,
    goldBidSpread,
    goldAskSpread,
    silverBidSpread,
    silverAskSpread,
    updateMarketData,
  ]);

  // ============================================================================
  // PRICE DIRECTION (GOLD BID)
  // ============================================================================
  useEffect(() => {
    if (GoldbiddingPrice == null) return;

    let timeout;

    if (prevGoldBid !== null) {
      if (GoldbiddingPrice > prevGoldBid) {
        setGoldBidDirection("up");
      } else if (GoldbiddingPrice < prevGoldBid) {
        setGoldBidDirection("down");
      } else {
        setGoldBidDirection("normal");
      }

      // ⏱ Reset to normal after 00.5 second
      timeout = setTimeout(() => {
        setGoldBidDirection("normal");
      }, 500);
    }

    setPrevGoldBid(GoldbiddingPrice);

    return () => clearTimeout(timeout);
  }, [GoldbiddingPrice]);
  useEffect(() => {
    if (GoldaskingPrice == null) return;

    let timeout;

    if (prevGoldAsk !== null) {
      if (GoldaskingPrice > prevGoldAsk) {
        setGoldAskDirection("up");
      } else if (GoldaskingPrice < prevGoldAsk) {
        setGoldAskDirection("down");
      } else {
        setGoldAskDirection("normal");
      }

      timeout = setTimeout(() => {
        setGoldAskDirection("normal");
      }, 500);
    }

    setPrevGoldAsk(GoldaskingPrice);

    return () => clearTimeout(timeout);
  }, [GoldaskingPrice]);

  useEffect(() => {
    if (SilverbiddingPrice == null) return;

    let timeout;

    if (prevSilverBid !== null) {
      if (SilverbiddingPrice > prevSilverBid) {
        setSilverBidDirection("up");
      } else if (SilverbiddingPrice < prevSilverBid) {
        setSilverBidDirection("down");
      } else {
        setSilverBidDirection("normal");
      }

      // ⏱ Reset to normal after 0.5 second
      timeout = setTimeout(() => {
        setSilverBidDirection("normal");
      }, 500);
    }

    setPrevSilverBid(SilverbiddingPrice);

    return () => clearTimeout(timeout);
  }, [SilverbiddingPrice]);

  useEffect(() => {
    if (SilverAskingPrice == null) return;

    let timeout;

    if (prevSilverAsk !== null) {
      if (SilverAskingPrice > prevSilverAsk) {
        setSilverAskDirection("up");
      } else if (SilverAskingPrice < prevSilverAsk) {
        setSilverAskDirection("down");
      } else {
        setSilverAskDirection("normal");
      }

      timeout = setTimeout(() => {
        setSilverAskDirection("normal");
      }, 500);
    }

    setPrevSilverAsk(SilverAskingPrice);

    return () => clearTimeout(timeout);
  }, [SilverAskingPrice]);




  return (
    <div className={styles.container}>

      <div
        className={`${styles.priceRow} `}
      >
        <div className={styles.priceContent}>
          {/* ================= BID ================= */}
          <div className={styles.priceSection}>
            <div className={styles.label}>BID</div>
            <div
              className={`${styles.priceBox} ${styles.bidBox}  `}
            >
              <div className={`${styles.price}
               ${goldBidDirection === "up"
                  ? styles.priceUp
                  : goldBidDirection === "down"
                    ? styles.priceDown
                    : ""
                }`}>
                {GoldbiddingPrice}
              </div>
              <div className={styles.subPrice}>
                LOW{" "}
                {marketData?.Gold?.low || 0}
              </div>
            </div>
          </div>

          {/* ================= METAL ================= */}
          <div className={styles.metalIcon}>
            <Image
              src={"/images/gold.svg"}
              height={120}
              width={120}
            />
          </div>

          {/* ================= ASK ================= */}
          <div className={styles.priceSection}>
            <div className={styles.label}>ASK</div>
            <div className={`${styles.priceBox} ${styles.askBox}`}>
              <div className={`${styles.price}
    ${goldAskDirection === "up"
                  ? styles.priceUp
                  : goldAskDirection === "down"
                    ? styles.priceDown
                    : ""
                }`}>
                {GoldaskingPrice}

              </div>
              <div className={styles.subPrice}>
                HIGH{" "}
                {marketData?.Gold?.high || 0}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`${styles.priceRow}  `}
      >
        <div className={styles.priceContent}>
          {/* ================= BID ================= */}
          <div className={styles.priceSection}>
            <div className={styles.label}>BID</div>
            <div
              className={`${styles.priceBox} ${styles.bidBox}  `}
            >
              <div className={`${styles.price}
               ${silverBidDirection === "up"
                  ? styles.priceUp
                  : silverBidDirection === "down"
                    ? styles.priceDown
                    : ""
                }`}>
                {SilverbiddingPrice}
              </div>
              <div className={styles.subPrice}>
                LOW{" "}
                {marketData?.Silver?.low || 0}
              </div>
            </div>
          </div>

          {/* ================= METAL ================= */}
          <div className={styles.metalIcon}>
            <Image
              src={"/images/silver.svg"}
              height={120}
              width={120}
            />
          </div>

          {/* ================= ASK ================= */}
          <div className={styles.priceSection}>
            <div className={styles.label}>ASK</div>
            <div className={`${styles.priceBox} ${styles.askBox}`}>
              <div className={`${styles.price}
    ${silverAskDirection === "up"
                  ? styles.priceUp
                  : silverAskDirection === "down"
                    ? styles.priceDown
                    : ""
                }`}>
                {SilverAskingPrice}
              </div>
              <div className={styles.subPrice}>
                HIGH{" "}
                {marketData?.Silver?.high || 0}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CommodityPriceCard;
