"use client";
import { BOYUTLAR, BOYUT_ISIMLERI } from "../lib/analysisEngine";
import { yildizSayisiHesapla, karanlikMaddeTespiti, ikizYildizTespiti, kutupYildiziHesapla } from "../lib/galaxySystem";

export default function ZihinGalaksisi({ puanlar, oncekiPuanlar, galaksiAdi }) {
  const karanlikMadde = karanlikMaddeTespiti(puanlar);
  const ikizYildizlar = ikizYildizTespiti(puanlar);
  const kutupYildizi = kutupYildiziHesapla(puanlar);

  const konumlar = {
    mantiksalTutarlilik: { top: "20%", left: "20%" },
    perspektifGenisligi: { top: "15%", left: "70%" },
    duygusalFarkindalik: { top: "55%", left: "50%" },
    esneklik: { top: "70%", left: "20%" },
    ozFarkindalik: { top: "70%", left: "75%" },
  };

  return (
    <div style={{ position: "relative", width: "100%", height: 340 }}>
      {galaksiAdi && (
        <div style={{ textAlign: "center", color: "#d8c9ff", marginBottom: 8, fontSize: "0.9rem" }}>
          Galaksi: {galaksiAdi}
        </div>
      )}

      {kutupYildizi && (
        <div style={{ textAlign: "center", marginBottom: 12, fontSize: "0.85rem", color: "#f5d0fe" }}>
          Kutup Yıldızın: {kutupYildizi.isim}
        </div>
      )}

      <svg viewBox="0 0 300 300" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {ikizYildizlar.map(([b1, b2], i) => {
          const k1 = konumlar[b1];
          const k2 = konumlar[b2];
          return (
            <line
              key={i}
              x1={parseFloat(k1.left)}
              y1={parseFloat(k1.top)}
              x2={parseFloat(k2.left)}
              y2={parseFloat(k2.top)}
              stroke="#facc15"
              strokeWidth="1"
              opacity="0.6"
            />
          );
        })}
      </svg>

      {BOYUTLAR.map((boyut) => {
        const puan = puanlar[boyut];
        const { sayi, parlaklik } = yildizSayisiHesapla(puan);
        const konum = konumlar[boyut];
        const gizemli = karanlikMadde.includes(boyut);

        return (
          <div
            key={boyut}
            style={{
              position: "absolute",
              top: konum.top,
              left: konum.left,
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <div style={{ position: "relative", width: 70, height: 70 }}>
              {gizemli && (
                <div
                  style={{
                    position: "absolute",
                    inset: -8,
                    borderRadius: "50%",
                    border: "1px dotted rgba(147, 51, 234, 0.5)",
                  }}
                />
              )}
              {Array.from({ length: sayi }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    top: `${50 + 30 * Math.sin((i / sayi) * 2 * Math.PI)}%`,
                    left: `${50 + 30 * Math.cos((i / sayi) * 2 * Math.PI)}%`,
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "white",
                    opacity: parlaklik,
                    boxShadow: `0 0 ${6 * parlaklik}px 2px rgba(255,255,255,${parlaklik})`,
                  }}
                />
              ))}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 10 + puan / 5,
                  height: 10 + puan / 5,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, #f5d0fe, #7c3aed)",
                  boxShadow: `0 0 ${puan / 3}px rgba(168, 85, 247, 0.8)`,
                }}
              />
            </div>
            <div style={{ fontSize: "0.7rem", color: "#d8c9ff", marginTop: 4 }}>
              {BOYUT_ISIMLERI[boyut]}
            </div>
            <div style={{ fontSize: "0.65rem", color: "#8b7fae" }}>{puan}</div>
          </div>
        );
      })}

      {/* Geçmiş profil soluk yıldızlarla karşılaştırma */}
      {oncekiPuanlar &&
        BOYUTLAR.map((boyut) => {
          const konum = konumlar[boyut];
          const oncekiPuan = oncekiPuanlar[boyut];
          const { sayi } = yildizSayisiHesapla(oncekiPuan);
          return (
            <div
              key={`onceki-${boyut}`}
              style={{
                position: "absolute",
                top: konum.top,
                left: `calc(${konum.left} + 8%)`,
                transform: "translate(-50%, -50%)",
                opacity: 0.25,
                fontSize: "0.6rem",
                color: "#8b7fae",
              }}
            >
              geçmiş: {oncekiPuan}
            </div>
          );
        })}
    </div>
  );
}
