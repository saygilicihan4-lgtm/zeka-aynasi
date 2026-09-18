"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import YildizAlani from "../../components/YildizAlani";
import { veriOku } from "../../lib/localStore";
import { yankiSecimiYap } from "../../lib/galaxySystem";
import { PLANLAR } from "../../lib/subscription";

export default function AnaSayfa() {
  const [veri, setVeri] = useState(null);
  const [yanki, setYanki] = useState(null);
  const [geceModu, setGeceModu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const v = veriOku();
    setVeri(v);
    setYanki(yankiSecimiYap(v.gecmisCevaplar.map((c) => c.metin)));
    const saat = new Date().getHours();
    setGeceModu(saat >= 23 || saat < 5);
  }, []);

  if (!veri) return null;

  return (
    <div className="merkez" style={{ paddingBottom: 90 }}>
      <YildizAlani kozmikMevsim="ilkbahar" />
      <h1 className="baslik">
        {veri.galaksiAdi ? veri.galaksiAdi : "Zihin Galaksin"}
      </h1>
      <p className="alt-baslik">
        {geceModu
          ? "Gece sakinliği çöktü. Şimdi sesler daha net duyulur."
          : "Bugün zihninle biraz zaman geçirmeye hazır mısın?"}
      </p>

      {yanki && (
        <div className="kart" style={{ marginBottom: 20, opacity: 0.85 }}>
          <div style={{ fontSize: "0.75rem", color: "#8b7fae", marginBottom: 6 }}>
            Bir yankı geldi, geçmişten
          </div>
          <div style={{ fontSize: "0.9rem", color: "#e8ddff" }}>"{yanki.metin}"</div>
        </div>
      )}

      <div className="kart">
        <p style={{ marginBottom: 16 }}>Ne yapmak istersin?</p>
        <button className="buton" onClick={() => router.push("/soru")}>
          Günlük Soru
        </button>
        <br />
        <button className="buton buton-ikincil" onClick={() => router.push("/sohbet")}>
          Serbest Sohbet
        </button>
        <br />
        <button className="buton buton-ikincil" onClick={() => router.push("/sesli-sohbet")}>
          Bilgeyle Sesli Konuş
        </button>
      </div>

      <div className="kart" style={{ marginTop: 20, border: "1px solid #7c3aed" }}>
        <div style={{ fontSize: "0.75rem", color: "#c4b5fd", marginBottom: 6 }}>
          Abonelik Paketleri
        </div>
        <h3 style={{ marginBottom: 8 }}>Ücretsiz veya Premium</h3>
        <p style={{ fontSize: "0.88rem", lineHeight: 1.6, color: "#c4b5fd" }}>
          <strong>{PLANLAR.ucretsiz.isim}:</strong> {PLANLAR.ucretsiz.fiyatMetni}<br />
          <strong>{PLANLAR.premium.isim}:</strong> {PLANLAR.premium.fiyatMetni}
        </p>
        <p style={{ fontSize: "0.8rem", color: "#8b7fae", marginBottom: 14 }}>
          Premium; sınırsız soru ve sohbet, Zaman Tüneli ve Bilgeyle sesli konuşma özelliklerini içerir.
        </p>
        <button className="buton" onClick={() => router.push("/abonelik")}>
          Paketleri İncele
        </button>
      </div>

      <div className="nav-alt">
        <div className="nav-oge aktif" onClick={() => router.push("/ana-sayfa")}>Ana Sayfa</div>
        <div className="nav-oge" onClick={() => router.push("/zaman-tuneli")}>Zaman Tüneli</div>
        <div className="nav-oge" onClick={() => router.push("/profil")}>Profil</div>
        <div className="nav-oge" onClick={() => router.push("/abonelik")}>Premium</div>
      </div>
    </div>
  );
}
