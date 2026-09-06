"use client";
import { useEffect, useState } from "react";

export default function BilgeYuzu({ konusuyorMu, dinliyorMu, zihinHavasi }) {
  const [gozKirp, setGozKirp] = useState(false);
  const [agizAcik, setAgizAcik] = useState(false);
  const [icgoruModu, setIcgoruModu] = useState(false);

  useEffect(() => {
    const kirpInterval = setInterval(() => {
      setGozKirp(true);
      setTimeout(() => setGozKirp(false), 180);
    }, 3500 + Math.random() * 2000);
    return () => clearInterval(kirpInterval);
  }, []);

  useEffect(() => {
    if (!konusuyorMu) {
      setAgizAcik(false);
      return;
    }
    const agizInterval = setInterval(() => setAgizAcik((a) => !a), 140);
    return () => clearInterval(agizInterval);
  }, [konusuyorMu]);

  useEffect(() => {
    if (!konusuyorMu && !dinliyorMu) {
      const t = setTimeout(() => setIcgoruModu(true), 800);
      return () => clearTimeout(t);
    }
    setIcgoruModu(false);
  }, [konusuyorMu, dinliyorMu]);

  const halkaHizi = konusuyorMu ? "3s" : dinliyorMu ? "5s" : "10s";

  return (
    <div style={{ position: "relative", width: 220, height: 220, margin: "0 auto" }}>
      {/* Dönen yıldız halkası */}
      <div
        style={{
          position: "absolute",
          inset: -10,
          borderRadius: "50%",
          border: "1px dashed rgba(216, 201, 255, 0.4)",
          animation: `donme ${halkaHizi} linear infinite`,
        }}
      />
      <style>{`
        @keyframes donme { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes nabiz { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.15); } }
      `}</style>

      {/* Kristal ışık, nabız gibi parlıyor */}
      <div
        style={{
          position: "absolute",
          top: -6,
          right: 10,
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: "#93c5fd",
          boxShadow: "0 0 14px 4px #93c5fd",
          animation: "nabiz 2s ease-in-out infinite",
        }}
      />

      {/* Yüz */}
      <svg viewBox="0 0 200 200" width="200" height="200" style={{ position: "absolute", top: 10, left: 10 }}>
        {/* Ten */}
        <ellipse cx="100" cy="105" rx="55" ry="68" fill="#e8c4a0" />
        {/* Çene hattı - kırılmış oval */}
        <path d="M 55 130 Q 60 165 100 170 Q 140 165 145 130" fill="none" stroke="#c9a074" strokeWidth="1.5" opacity="0.5" />
        {/* Elmacık kemiği / nazolabial gölgeler */}
        <path d="M 65 115 Q 75 125 80 135" stroke="#c9a074" strokeWidth="1" opacity="0.4" fill="none" />
        <path d="M 135 115 Q 125 125 120 135" stroke="#c9a074" strokeWidth="1" opacity="0.4" fill="none" />

        {/* Gümüş saç */}
        <path
          d="M 45 100 Q 30 40 100 25 Q 170 40 155 100 Q 160 60 100 45 Q 40 60 45 100 Z"
          fill="#d8d8e8"
        />
        {/* Saç teli dokusu */}
        <path d="M 50 60 Q 45 90 50 110" stroke="#b8b8cc" strokeWidth="1" fill="none" opacity="0.6" />
        <path d="M 150 60 Q 155 90 150 110" stroke="#b8b8cc" strokeWidth="1" fill="none" opacity="0.6" />

        {/* Uzun akan saç ve sakal */}
        <path d="M 45 95 Q 30 160 40 200" stroke="#d8d8e8" strokeWidth="10" fill="none" opacity="0.8" />
        <path d="M 155 95 Q 170 160 160 200" stroke="#d8d8e8" strokeWidth="10" fill="none" opacity="0.8" />
        <path d="M 75 150 Q 100 190 125 150 Q 115 175 100 180 Q 85 175 75 150 Z" fill="#d0d0e0" />

        {/* Çatık kaşlar - çoklu kıl çizgileri */}
        <path d="M 68 88 Q 80 80 92 86" stroke="#c8c8d8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 108 86 Q 120 80 132 88" stroke="#c8c8d8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Alın kırışıklıkları */}
        <path d="M 70 72 Q 100 66 130 72" stroke="#c9a074" strokeWidth="0.8" fill="none" opacity="0.4" />
        <path d="M 72 78 Q 100 73 128 78" stroke="#c9a074" strokeWidth="0.8" fill="none" opacity="0.3" />

        {/* Gözler */}
        <g opacity={gozKirp ? 0.15 : 1}>
          <ellipse cx="80" cy="98" rx="8" ry="5" fill="white" />
          <circle cx="80" cy="98" r="3.2" fill="#4a3b6b" />
          <circle cx="81.5" cy="96.5" r="1" fill="white" />
          <ellipse cx="120" cy="98" rx="8" ry="5" fill="white" />
          <circle cx="120" cy="98" r="3.2" fill="#4a3b6b" />
          <circle cx="121.5" cy="96.5" r="1" fill="white" />
        </g>
        {/* Göz kapağı çizgisi */}
        <path d="M 72 93 Q 80 89 88 93" stroke="#a67c52" strokeWidth="1" fill="none" opacity="0.5" />
        <path d="M 112 93 Q 120 89 128 93" stroke="#a67c52" strokeWidth="1" fill="none" opacity="0.5" />
        {/* Göz kenarı kırışıklıkları */}
        <path d="M 68 100 Q 64 98 62 102" stroke="#c9a074" strokeWidth="0.8" fill="none" opacity="0.4" />
        <path d="M 132 100 Q 136 98 138 102" stroke="#c9a074" strokeWidth="0.8" fill="none" opacity="0.4" />

        {/* Burun ve burun delikleri */}
        <path d="M 100 95 Q 96 115 92 122 Q 100 128 108 122" stroke="#c9a074" strokeWidth="1.2" fill="none" />
        <ellipse cx="95" cy="123" rx="2" ry="1.2" fill="#a67c52" opacity="0.5" />
        <ellipse cx="105" cy="123" rx="2" ry="1.2" fill="#a67c52" opacity="0.5" />

        {/* Dudaklar - cupid's bow */}
        <path
          d={agizAcik ? "M 85 140 Q 100 150 115 140 Q 100 146 85 140 Z" : "M 85 140 Q 92 136 100 138 Q 108 136 115 140 Q 100 143 85 140 Z"}
          fill="#a8654f"
        />
      </svg>

      {/* İçgörüye dalma efekti */}
      {icgoruModu && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(147,197,253,0.15), transparent 70%)",
          }}
        />
      )}
    </div>
  );
}
