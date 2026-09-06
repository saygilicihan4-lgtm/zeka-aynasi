"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import YildizAlani from "../../components/YildizAlani";
import { soruUret, gecemi } from "../../data/questions";
import { veriOku, veriGuncelle } from "../../lib/localStore";

export default function SoruSayfasi() {
  const [soru, setSoru] = useState("");
  const [cevap, setCevap] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [ruyaModu, setRuyaModu] = useState(false);
  const [meteorYagmuru, setMeteorYagmuru] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setSoru(soruUret());
    setRuyaModu(gecemi());
  }, []);

  function baskaSoruSor() {
    setSoru(soruUret());
    setCevap("");
  }

  async function cevabiGonder() {
    if (!cevap.trim()) return;
    setYukleniyor(true);
    const veri = veriOku();

    try {
      const yanit = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cevapMetni: cevap,
          gecmisPuanlar: veri.gecmisPuanlar,
          gecmisCevaplar: veri.gecmisCevaplar,
          istatistik: veri.istatistik,
        }),
      });
      const sonuc = await yanit.json();

      const yeniGecmisCevaplar = [
        ...veri.gecmisCevaplar,
        { metin: cevap, puanlar: sonuc.analiz.puanlar, tarih: sonuc.analiz.tarih, soru },
      ].slice(-200);

      const yeniIstatistik = {
        ...sonuc.istatistik,
        ruyaModuCevapSayisi: veri.istatistik.ruyaModuCevapSayisi + (ruyaModu ? 1 : 0),
      };

      veriGuncelle((mevcut) => ({
        ...mevcut,
        gecmisCevaplar: yeniGecmisCevaplar,
        gecmisPuanlar: sonuc.analiz.puanlar,
        istatistik: yeniIstatistik,
        rozetler: sonuc.rozetler,
      }));

      // Her 3 cevapta bir meteor yağmuru animasyonu
      if (yeniIstatistik.toplamCevap % 3 === 0) {
        setMeteorYagmuru(true);
        setTimeout(() => setMeteorYagmuru(false), 2000);
      }

      sessionStorage.setItem("son-analiz", JSON.stringify(sonuc));
      setTimeout(() => router.push("/sonuc"), meteorYagmuru ? 2100 : 300);
    } catch (hata) {
      setYukleniyor(false);
    }
  }

  return (
    <div className="merkez">
      <YildizAlani kozmikMevsim="ilkbahar" />
      {meteorYagmuru && (
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: `${Math.random() * 30}%`,
                left: `${Math.random() * 100}%`,
                width: 2,
                height: 40,
                background: "linear-gradient(white, transparent)",
                animation: `meteor ${0.6 + Math.random() * 0.6}s linear ${i * 0.05}s`,
                transform: "rotate(30deg)",
              }}
            />
          ))}
          <style>{`
            @keyframes meteor {
              from { transform: translate(0,0) rotate(30deg); opacity: 1; }
              to { transform: translate(200px, 400px) rotate(30deg); opacity: 0; }
            }
          `}</style>
        </div>
      )}

      {ruyaModu && (
        <div style={{ fontSize: "0.75rem", color: "#93c5fd", marginBottom: 8 }}>
          Rüya Modu
        </div>
      )}
      <h2 style={{ maxWidth: 480, marginBottom: 24, color: "#f0eaff" }}>{soru}</h2>

      <textarea
        className="metin-alani"
        style={{ maxWidth: 480 }}
        value={cevap}
        onChange={(e) => setCevap(e.target.value)}
        placeholder="Aklından geçeni yaz..."
        disabled={yukleniyor}
      />

      <div style={{ marginTop: 16 }}>
        <button className="buton" onClick={cevabiGonder} disabled={yukleniyor || !cevap.trim()}>
          {yukleniyor ? "Analiz ediliyor..." : "Gönder"}
        </button>
        <button className="buton buton-ikincil" onClick={baskaSoruSor} disabled={yukleniyor}>
          Başka bir soru sor
        </button>
      </div>
    </div>
  );
}
