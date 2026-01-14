"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import styles from "./MainScreen.module.scss";
import Image from "next/image";
import io from "socket.io-client";

import { fetchSpotRates, fetchServerURL } from "@/pages/api/api";
import { useSpotRate } from "@/context/SpotRateContext";
import MarketVideoCard from "../MarketVideoCard/MarketVideoCard";
import CommodityPriceCard from "../CommodityPriceCard/CommodityPriceCard";
import MetalPriceList from "../MetalPriceList/MetalPriceList";
import { getSocketTransports, isTVBrowser } from "@/utils/browserDetection";

const MainScreen = () => {
  // ============================================================================
  // STATE
  // ============================================================================
  const [serverURL, setServerURL] = useState("");
  const [marketData, setMarketData] = useState({});
  const [commodities, setCommodities] = useState([]);
  const [news, setNews] = useState([]);

  const [goldBidSpread, setGoldBidSpread] = useState(0);
  const [goldAskSpread, setGoldAskSpread] = useState(0);
  const [silverBidSpread, setSilverBidSpread] = useState(0);
  const [silverAskSpread, setSilverAskSpread] = useState(0);

  const adminId = process.env.NEXT_PUBLIC_ADMIN_ID;
  const { updateMarketData } = useSpotRate();

  // ============================================================================
  // DATE
  // ============================================================================
  const { date, day } = useMemo(() => {
    const today = new Date();
    return {
      date: today
        .toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
        .toUpperCase(),
      day: today.toLocaleDateString("en-US", { weekday: "long" }),
    };
  }, []);

  // ============================================================================
  // FORMATTERS
  // ============================================================================
  const currencyFormatter = useMemo(() => {
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, []);

  // ============================================================================
  // PRICE COMPUTATION
  // ============================================================================
  const GoldbiddingPrice = (marketData?.Gold?.bid || 0) + goldBidSpread;
  const GoldaskingPrice = GoldbiddingPrice + 0.5 + goldAskSpread;

  const SilverbiddingPrice = (marketData?.Silver?.bid || 0) + silverBidSpread;
  const SilverAskingPrice = Number(
    (SilverbiddingPrice + 0.05 + silverAskSpread).toFixed(3)
  );

  // ============================================================================
  // HELPERS
  // ============================================================================
  const getMetalName = useCallback((metal) => {
    switch (metal.toLowerCase()) {
      case "gold":
        return "GM";
      case "gold kilobar":
        return "KGBAR";
      case "gold ten tola":
        return "TTBAR";
      default:
        return metal.charAt(0).toUpperCase() + metal.slice(1);
    }
  }, []);

  const calculatePrices = useCallback(
    (item, metalName) => {
      const unitMultiplier = {
        GM: 1,
        KGBAR: 1000,
        TTBAR: 116.64,
      }[metalName];

      const purity = Number(item.purity);
      const purityPower = purity / Math.pow(10, purity.toString().length);

      return {
        bidPrice:
          (GoldbiddingPrice / 31.103) * 3.674 * unitMultiplier * purityPower,
        askPrice:
          (GoldaskingPrice / 31.103) * 3.674 * unitMultiplier * purityPower,
      };
    },
    [GoldbiddingPrice, GoldaskingPrice]
  );

  // ============================================================================
  // INITIAL LOAD
  // ============================================================================
  useEffect(() => {
    const loadInitialData = async () => {
      let retryCount = 0;
      const maxRetries = isTVBrowser() ? 5 : 3;
      const retryDelay = isTVBrowser() ? 2000 : 1000;

      const attemptLoad = async () => {
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
        } catch (error) {
          console.error(`Initial load failed (attempt ${retryCount + 1}/${maxRetries})`, error);
          
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(attemptLoad, retryDelay);
          } else {
            console.error("Max retries reached. Failed to load initial data.");
          }
        }
      };

      attemptLoad();
    };

    loadInitialData();
  }, [adminId]);

  // ============================================================================
  // SOCKET
  // ============================================================================
  useEffect(() => {
    if (!serverURL) return;

    const transports = getSocketTransports();
    const isTV = isTVBrowser();

    const socket = io(serverURL, {
      transports: transports,
      withCredentials: true,
      query: {
        secret: process.env.NEXT_PUBLIC_SOCKET_SECRET_KEY,
      },
      // TV browsers may need longer timeouts
      timeout: isTV ? 20000 : 10000,
      reconnection: true,
      reconnectionDelay: isTV ? 2000 : 1000,
      reconnectionDelayMax: isTV ? 10000 : 5000,
      reconnectionAttempts: isTV ? 10 : 5,
      forceNew: false,
    });

    socket.on("connect", () => {
      console.log("Socket connected with transport:", socket.io.engine.transport.name);
      socket.emit("request-data", ["GOLD", "SILVER"]);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      // For TV browsers, try to reconnect with polling only
      if (isTV && socket.io.engine?.transport?.name !== 'polling') {
        socket.io.opts.transports = ['polling'];
        socket.disconnect();
        socket.connect();
      }
    });

    socket.on("market-data", (data) => {
      setMarketData((prev) => ({
        ...prev,
        [data.symbol]: data,
      }));
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    socket.on("reconnect", (attemptNumber) => {
      console.log("Socket reconnected after", attemptNumber, "attempts");
      socket.emit("request-data", ["GOLD", "SILVER"]);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("market-data");
      socket.off("disconnect");
      socket.off("reconnect");
      socket.disconnect();
    };
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
  // MARKET NEWS
  // ============================================================================
  useEffect(() => {
    const fetchMarketNews = async () => {
      let retryCount = 0;
      const maxRetries = isTVBrowser() ? 3 : 2;
      const retryDelay = isTVBrowser() ? 2000 : 1000;

      const attemptFetch = async () => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), isTVBrowser() ? 15000 : 10000);

          const res = await fetch("/api/market-news", {
            signal: controller.signal,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          });

          clearTimeout(timeoutId);

          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }

          const data = await res.json();
          setNews(data.headlines || []);
        } catch (error) {
          if (error.name === 'AbortError') {
            console.error("Market news fetch timeout");
          } else {
            console.error(`Failed to fetch market news (attempt ${retryCount + 1}/${maxRetries}):`, error);
          }

          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(attemptFetch, retryDelay);
          } else {
            console.error("Max retries reached. Failed to fetch market news.");
            setNews(["Market updates loading..."]);
          }
        }
      };

      attemptFetch();
    };

    fetchMarketNews();
  }, []);

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className={styles.mainscreen_Section}>
      <div className={styles.mainscreen_body}>
        <div className={styles.logo}>
          <Image src="/images/logo.svg" height={100} width={100} alt="Logo" />
        </div>

        <div className={styles.table_sec}>
          <CommodityPriceCard />
        </div>

        <div className={styles.commodity_sec}>
          <MetalPriceList
            commodities={commodities}
            getMetalName={getMetalName}
            calculatePrices={calculatePrices}
            currencyFormatter={currencyFormatter}
          />
        </div>

        <div className={styles.footer_body}>
          <div className={styles.youtube_sec}>
            <MarketVideoCard />
          </div>
          <div className={styles.sponsor_logo}>
            <Image
              src="/images/aurify-logo.svg"
              height={100}
              width={100}
              alt="Logo"
            />
          </div>
        </div>
      </div>

      <div className={styles.video_sec}>
        <video src="/videos/background.mp4" autoPlay muted loop playsInline />
      </div>
    </div>
  );
};

export default MainScreen;
