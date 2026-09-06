"use client";
import { useEffect, useState } from "react";
import { dilekYildiziGorunsunMu } from "../lib/galaxySystem";

export default function YildizAlani({ kozmikMevsim }) {
  const [yildizlar, setYildizlar] = useState([]);
  const [kayanYildiz, setKayanYildiz] = useState(null);

  useEffect(() => {
    const yeniYildizlar = Array.from({ length: 60 }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      boyut: Math.random() * 2 + 1,
      gecikme: Math.random() * 3,
    }));
    setYildizlar(yeniYildizlar);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (dilekYildiziGorunsunMu()) {
        setKayanYildiz({ top: Math.random() * 40, left: Math.random() * 40 });
        setTimeout(() => setKayanYildiz(null), 1200);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const mevsimRenkleri = {
    ilkbahar: "radial-gradient(circle at 50% 30%, #2d1b4e, #04040c)",
    yaz: "radial-gradient(circle at 50% 30%, #1b2d4e, #04040c)",
    sonbahar: "radial-gradient(circle at 50% 30%, #4e2d1b, #04040c)",
    kis: "radial-gradient(circle at 50% 30%, #1b3a4e, #04040c)",
  };

  return (
    <div
      className="yildiz-alani"
      style={{ background: mevsimRenkleri[kozmikMevsim] || mevsimRenkleri.ilkbahar }}
      onClick={() => kayanYildiz && setKayanYildiz(null)}
    >
      {yildizlar.map((y, i) => (
        <div
          key={i}
          className="yildiz"
          style={{
            top: `${y.top}%`,
            left: `${y.left}%`,
            width: `${y.boyut}px`,
            height: `${y.boyut}px`,
            animationDelay: `${y.gecikme}s`,
          }}
        />
      ))}
      {kayanYildiz && (
        <div
          className="kayan-yildiz"
          style={{ top: `${kayanYildiz.top}%`, left: `${kayanYildiz.left}%` }}
        />
      )}
    </div>
  );
}
