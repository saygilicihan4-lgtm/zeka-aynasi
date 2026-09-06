"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import YildizAlani from "../components/YildizAlani";

const acilisCumleleri = [
  "Zihnin, keşfedilmemiş bir galaksi gibidir.",
  "Her cevabın, bir yıldızın doğuşudur.",
  "Bazı köşeler karanlıkta kalır, ama ışık her zaman bir yol bulur.",
  "Burada yargılanmayacaksın, sadece görüleceksin.",
  "Hazır olduğunda, kendi galaksini keşfetmeye başla.",
];

export default function GirisSayfasi() {
  const [cumleIndex, setCumleIndex] = useState(0);
  const [gosterGecis, setGosterGecis] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (cumleIndex < acilisCumleleri.length - 1) {
      const t = setTimeout(() => setCumleIndex((i) => i + 1), 3200);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setGosterGecis(true), 3200);
      return () => clearTimeout(t);
    }
  }, [cumleIndex]);

  return (
    <div className="merkez">
      <YildizAlani kozmikMevsim="ilkbahar" />
      <h1 className="baslik">Zeka Aynası</h1>
      <p
        key={cumleIndex}
        style={{
          fontSize: "1.15rem",
          color: "#e8ddff",
          minHeight: 60,
          maxWidth: 480,
          animation: "belirme 1.2s ease",
        }}
      >
        {acilisCumleleri[cumleIndex]}
      </p>
      <style>{`
        @keyframes belirme { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      {gosterGecis && (
        <button className="buton" style={{ marginTop: 32 }} onClick={() => router.push("/ana-sayfa")}>
          Galaksine gir
        </button>
      )}
    </div>
  );
}
