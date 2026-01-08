'use client';

import React, { useEffect } from "react";
import { SpotRateProvider } from "@/context/SpotRateContext";

const Layout = (props) => {

    useEffect(() => {

        const applyZoomClass = () => {
            const zoom = Math.round((window.outerWidth / window.innerWidth) * 100);
            const html = document.documentElement;

            // Remove existing zoom-* classes
            html.classList.forEach((cls) => {
                if (cls.startsWith('zoom-')) {
                    html.classList.remove(cls);
                }
            });

            // Add current zoom class
            html.classList.add(`zoom-${zoom}`);

        };

        applyZoomClass();
        window.addEventListener('resize', applyZoomClass);

        return () => {
            window.removeEventListener('resize', applyZoomClass);
        };
    }, []);


    return (
        <main id="main-element" className="main">
            <SpotRateProvider>
                {props.children}
            </SpotRateProvider>
        </main>
    );
};

export default Layout;
