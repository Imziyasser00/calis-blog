"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

export default function AnalyticsGate() {
    const [go, setGo] = useState(false);

    useEffect(() => {
        const trigger = () => setGo(true);

        window.addEventListener("scroll", trigger, { once: true, passive: true });
        window.addEventListener("pointerdown", trigger, { once: true });
        window.addEventListener("keydown", trigger, { once: true });

        return () => {
            window.removeEventListener("scroll", trigger);
            window.removeEventListener("pointerdown", trigger);
            window.removeEventListener("keydown", trigger);
        };
    }, []);

    if (!go) return null;

    return (
        <>
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-F02CLSL67R"
                strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-F02CLSL67R');
        `}
            </Script>
        </>
    );
}
