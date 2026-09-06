"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import YildizAlani from "../../components/YildizAlani";
import { veriOku, veriGuncelle } from "../../lib/localStore";

export default function SohbetSayfasi() {
  const [mesajlar, setMesajlar] = useState([
    { rol: "bilge", metin: "Zihnin bugün ne anlatmak istiyor? Seni dinliyorum." },
  ]);
  const [girdi, setGirdi] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const router = useRouter();
  const sonRef = useRef(null);

  useEffect(() => {
    sonRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mesajlar]);

  async function mesajGonder() {
    if (!girdi.trim()) return;
    const kullaniciMesaji = girdi.trim();
    setMesajlar((m) => [...m, { rol: "kullanici", metin: kullaniciMesaji }]);
    setGirdi("");
    setYukleniyor(true);

    const veri = veriOku();
    try {
      const yanit = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cevapMetni: kullaniciMesaji,
          gecmisPuanlar: veri.gecmisPuanlar,
          gecmisCevaplar: veri.gecmisCevaplar,
          istatistik: veri.istatistik,
        }),
      });
      const sonuc = await yanit.json();

      veriGuncelle((mevcut) => ({
        ...mevcut,
        gecmisCevaplar: [
          ...mevcut.gecmisCevaplar,
          { metin: kullaniciMesaji, puanlar: sonuc.analiz.puanlar, tarih: sonuc.analiz.tarih, soru: "Serbest sohbet" },
        ].slice(-200),
        gecmisPuanlar: sonuc.analiz.puanlar,
        istatistik: sonuc.istatistik,
        rozetler: sonuc.rozetler,
      }));

      setMesajlar((m) => [...m, { rol: "bilge", metin: sonuc.analiz.kocYorumu }]);
    } catch {
      setMesajlar((m) => [...m, { rol: "bilge", metin: "Bir şeyler ters gitti, ama seni dinlemeye devam ediyorum." }]);
    } finally {
      setYukleniyor(false);
    }
  }

  return (
    <div className="merkez" style={{ paddingBottom: 100 }}>
      <YildizAlani kozmikMevsim="yaz" />
      <h1 className="baslik">Serbest Sohbet</h1>

      <div style={{ width: "100%", maxWidth: 480, marginBottom: 20 }}>
        {mesajlar.map((m, i) => (
          <div
            key={i}
            style={{
              textAlign: m.rol === "kullanici" ? "right" : "left",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "10px 14px",
                borderRadius: 14,
                background: m.rol === "kullanici" ? "rgba(124,58,237,0.4)" : "rgba(255,255,255,0.06)",
                fontSize: "0.9rem",
                maxWidth: "80%",
              }}
            >
              {m.metin}
            </span>
          </div>
        ))}
        <div ref={sonRef} />
      </div>

      <div style={{ width: "100%", maxWidth: 480, display: "flex", gap: 8 }}>
        <textarea
          className="metin-alani"
          style={{ minHeight: 50 }}
          value={girdi}
          onChange={(e) => setGirdi(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              mesajGonder();
            }
          }}
          placeholder="Yaz..."
          disabled={yukleniyor}
        />
      </div>
      <button className="buton" style={{ marginTop: 10 }} onClick={mesajGonder} disabled={yukleniyor || !girdi.trim()}>
        Gönder
      </button>

      <div className="nav-alt">
        <div className="nav-oge" onClick={() => router.push("/ana-sayfa")}>Ana Sayfa</div>
        <div className="nav-oge" onClick={() => router.push("/zaman-tuneli")}>Zaman Tüneli</div>
        <div className="nav-oge" onClick={() => router.push("/profil")}>Profil</div>
        <div className="nav-oge" onClick={() => router.push("/abonelik")}>Premium</div>
      </div>
    </div>
  );
}
