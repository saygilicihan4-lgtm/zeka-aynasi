"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import YildizAlani from "../../components/YildizAlani";
import { veriOku } from "../../lib/localStore";
import { BOYUT_ISIMLERI } from "../../lib/analysisEngine";

export default function ZamanTuneliSayfasi() {
  const [veri, setVeri] = useState(null);
  const [seciliBoyut, setSeciliBoyut] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setVeri(veriOku());
  }, []);

  if (!veri) return null;

  const gecmis = [...veri.gecmisCevaplar].reverse();
  const filtrelenmis = seciliBoyut
    ? gecmis.filter((c) => true) // her cevapta tüm boyutlar var, filtre boyuta göre puan gösterimini değiştirir
    : gecmis;

  return (
    <div className="merkez" style={{ paddingBottom: 90 }}>
      <YildizAlani kozmikMevsim="sonbahar" />
      <h1 className="baslik">Zaman Tüneli</h1>
      <p className="alt-baslik">Geçmiş cevapların ve yıldızının o zamanki hali</p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 20 }}>
        {Object.keys(BOYUT_ISIMLERI).map((b) => (
          <button
            key={b}
            className="buton buton-ikincil"
            style={{ fontSize: "0.75rem", padding: "8px 14px" }}
            onClick={() => setSeciliBoyut(seciliBoyut === b ? null : b)}
          >
            {BOYUT_ISIMLERI[b]}
          </button>
        ))}
      </div>

      {filtrelenmis.length === 0 ? (
        <p>Henüz zaman tünelinde bir iz yok.</p>
      ) : (
        filtrelenmis.slice(0, 30).map((c, i) => (
          <div key={i} className="kart" style={{ marginBottom: 12, textAlign: "left" }}>
            <div style={{ fontSize: "0.7rem", color: "#8b7fae", marginBottom: 6 }}>
              {new Date(c.tarih).toLocaleString("tr-TR")}
            </div>
            <div style={{ fontSize: "0.85rem", marginBottom: 8, color: "#e8ddff" }}>{c.soru}</div>
            <div style={{ fontSize: "0.85rem", marginBottom: 8 }}>"{c.metin}"</div>
            {seciliBoyut && (
              <div style={{ fontSize: "0.8rem", color: "#f5d0fe" }}>
                {BOYUT_ISIMLERI[seciliBoyut]}: {c.puanlar[seciliBoyut]}
              </div>
            )}
          </div>
        ))
      )}

      <div className="nav-alt">
        <div className="nav-oge" onClick={() => router.push("/ana-sayfa")}>Ana Sayfa</div>
        <div className="nav-oge aktif" onClick={() => router.push("/zaman-tuneli")}>Zaman Tüneli</div>
        <div className="nav-oge" onClick={() => router.push("/profil")}>Profil</div>
        <div className="nav-oge" onClick={() => router.push("/abonelik")}>Premium</div>
      </div>
    </div>
  );
}
