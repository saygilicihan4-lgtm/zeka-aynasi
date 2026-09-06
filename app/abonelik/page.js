"use client";
import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import YildizAlani from "../../components/YildizAlani";
import { veriOku, veriGuncelle } from "../../lib/localStore";
import { PLANLAR } from "../../lib/subscription";

export default function AbonelikSayfasi() {
  return (
    <Suspense fallback={null}>
      <AbonelikIcerik />
    </Suspense>
  );
}

function AbonelikIcerik() {
  const [veri, setVeri] = useState(null);
  const [islemde, setIslemde] = useState(false);
  const [hataMesaji, setHataMesaji] = useState("");
  const router = useRouter();
  const parametreler = useSearchParams();

  useEffect(() => {
    setVeri(veriOku());

    // iyzico Ödeme Formu'ndan başarılı dönüşle geldiyse premium'u işaretle.
    // Not: Asıl doğrulama zaten app/api/subscribe/callback/route.js içinde
    // iyzico sunucusuna sorularak yapılıyor; burada sadece arayüzü güncelliyoruz.
    if (parametreler.get("basarili") === "1") {
      veriGuncelle((mevcut) => ({ ...mevcut, premium: true }));
      setVeri(veriOku());
    }
  }, [parametreler]);

  if (!veri) return null;

  async function premiumAl() {
    setIslemde(true);
    setHataMesaji("");
    try {
      const yanit = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "premium" }),
      });
      const sonuc = await yanit.json();

      if (sonuc.checkoutUrl) {
        // Kullanıcıyı iyzico'nun güvenli ödeme sayfasına yönlendir
        window.location.href = sonuc.checkoutUrl;
        return;
      }

      if (sonuc.hata) {
        setHataMesaji(sonuc.hata);
      }
    } catch (hata) {
      setHataMesaji("Bağlantı sırasında bir sorun oluştu.");
    } finally {
      setIslemde(false);
    }
  }

  function galaksiKartiIndir() {
    const kartMetni = `${veri.galaksiAdi || "Adsız Galaksi"} — ${veri.istatistik.toplamCevap} cevap — ${new Date().toLocaleDateString()}`;
    const blob = new Blob([kartMetni], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "galaksi-karti.txt";
    link.click();
  }

  return (
    <div className="merkez" style={{ paddingBottom: 90 }}>
      <YildizAlani kozmikMevsim="yaz" />
      <h1 className="baslik">Premium</h1>

      <div className="kart" style={{ marginBottom: 16 }}>
        <h3>{PLANLAR.ucretsiz.isim}</h3>
        <p style={{ fontSize: "0.85rem", color: "#8b7fae" }}>
          Günde 1 soru, sınırlı sohbet süresi, zaman tüneline erişim yok.
        </p>
        {!veri.premium && <p style={{ color: "#93c5fd" }}>Şu anki planın</p>}
      </div>

      <div className="kart" style={{ border: "1px solid #a855f7" }}>
        <h3>{PLANLAR.premium.isim}</h3>
        <p style={{ fontSize: "0.85rem", color: "#8b7fae", marginBottom: 12 }}>
          Sınırsız soru, sınırsız sohbet, zaman tüneli erişimi, bilgeyle sesli konuşma.
        </p>
        {veri.premium ? (
          <p style={{ color: "#f5d0fe" }}>Bu plana sahipsin</p>
        ) : (
          <button className="buton" onClick={premiumAl} disabled={islemde}>
            {islemde ? "Yönlendiriliyor..." : "Premium'a Geç"}
          </button>
        )}
        {hataMesaji && (
          <p style={{ color: "#fca5a5", fontSize: "0.8rem", marginTop: 10 }}>{hataMesaji}</p>
        )}
      </div>

      <button className="buton buton-ikincil" style={{ marginTop: 20 }} onClick={galaksiKartiIndir}>
        Galaksi Kartını Paylaş
      </button>

      <div className="nav-alt">
        <div className="nav-oge" onClick={() => router.push("/ana-sayfa")}>Ana Sayfa</div>
        <div className="nav-oge" onClick={() => router.push("/zaman-tuneli")}>Zaman Tüneli</div>
        <div className="nav-oge" onClick={() => router.push("/profil")}>Profil</div>
        <div className="nav-oge aktif" onClick={() => router.push("/abonelik")}>Premium</div>
      </div>
    </div>
  );
}
