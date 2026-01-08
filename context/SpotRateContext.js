'use client';

import React, { createContext, useContext, useState } from 'react';

const SpotRateContext = createContext(null);

export const SpotRateProvider = ({ children }) => {
    const [goldData, setGoldData] = useState({
        bid: 0,
        ask: 0,
        low: 0,
        high: 0,
        bidChanged: false,
    });

    const [silverData, setSilverData] = useState({
        bid: 0,
        ask: 0,
        low: 0,
        high: 0,
        bidChanged: false,
    });

    const calculateValues = (
        bid = 0,
        bidSpread = 0,
        askSpread = 0,
        offset = 0,
        precision = 2
    ) => {
        const bidValue = Number(bid) + Number(bidSpread);
        const askValue = bidValue + Number(askSpread) + Number(offset);

        return {
            bid: bidValue.toFixed(precision),
            ask: askValue.toFixed(precision),
        };
    };

    const updateMarketData = (
        marketData,
        goldBidSpread = 0,
        goldAskSpread = 0,
        silverBidSpread = 0,
        silverAskSpread = 0
    ) => {
        if (!marketData) return;

        if (marketData.Gold) {
            const goldValues = calculateValues(
                marketData.Gold.bid,
                goldBidSpread,
                goldAskSpread,
                0.5
            );

            setGoldData({
                bid: goldValues.bid,
                ask: goldValues.ask,
                low: marketData.Gold.low,
                high: marketData.Gold.high,
                bidChanged: marketData.Gold.bidChanged,
            });
        }

        if (marketData.Silver) {
            const silverValues = calculateValues(
                marketData.Silver.bid,
                silverBidSpread,
                silverAskSpread,
                0.05,
                3
            );

            setSilverData({
                bid: silverValues.bid,
                ask: silverValues.ask,
                low: marketData.Silver.low,
                high: marketData.Silver.high,
                bidChanged: marketData.Silver.bidChanged,
            });
        }
    };

    return (
        <SpotRateContext.Provider
            value={{ goldData, silverData, updateMarketData }}
        >
            {children}
        </SpotRateContext.Provider>
    );
};

export const useSpotRate = () => {
    const context = useContext(SpotRateContext);
    if (!context) {
        throw new Error('useSpotRate must be used inside SpotRateProvider');
    }
    return context;
};
