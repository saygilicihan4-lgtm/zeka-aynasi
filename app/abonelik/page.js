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
  const router = useRouter();
  const parametreler = useSearchParams();

  useEffect(() => {
    setVeri(veriOku());

    if (parametreler.get("basarili") === "1") {
      veriGuncelle((mevcut) => ({ ...mevcut, premium: true }));
      setVeri(veriOku());
    }
  }, [parametreler]);

  if (!veri) return null;

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
      <h1 className="baslik">Abonelik Paketleri</h1>
      <p className="alt-baslik">
        İhtiyacına uygun planı seç. Ücretsiz plan süresizdir; Premium plan aylık aboneliktir.
      </p>

      <div className="kart" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
          <h3 style={{ margin: 0 }}>{PLANLAR.ucretsiz.isim}</h3>
          <strong style={{ fontSize: "1.15rem" }}>{PLANLAR.ucretsiz.fiyatMetni}</strong>
        </div>
        <p style={{ fontSize: "0.82rem", color: "#93c5fd", marginTop: 6 }}>
          {PLANLAR.ucretsiz.faturalama}
        </p>
        <p style={{ fontSize: "0.85rem", color: "#8b7fae", lineHeight: 1.6 }}>
          • Günde 1 soru<br />
          • 5 dakika serbest sohbet<br />
          • Galaksi Kartı paylaşımı<br />
          • Zaman Tüneli erişimi yok<br />
          • Bilgeyle sesli konuşma yok
        </p>
        {!veri.premium && <p style={{ color: "#93c5fd" }}>Şu anki planın</p>}
      </div>

      <div className="kart" style={{ border: "1px solid #a855f7" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
          <h3 style={{ margin: 0 }}>{PLANLAR.premium.isim}</h3>
          <strong style={{ fontSize: "1.15rem", color: "#f5d0fe" }}>{PLANLAR.premium.fiyatMetni}</strong>
        </div>
        <p style={{ fontSize: "0.82rem", color: "#d8b4fe", marginTop: 6 }}>
          {PLANLAR.premium.faturalama} • İptal edilmediği sürece aylık yenilenir
        </p>
        <p style={{ fontSize: "0.85rem", color: "#8b7fae", lineHeight: 1.6, marginBottom: 14 }}>
          • Sınırsız soru<br />
          • Sınırsız serbest sohbet<br />
          • Zaman Tüneli erişimi<br />
          • Galaksi Kartı paylaşımı<br />
          • Bilgeyle sesli konuşma
        </p>

        {veri.premium ? (
          <p style={{ color: "#f5d0fe" }}>Bu plana sahipsin</p>
        ) : (
          <button className="buton" disabled>
            Ödeme altyapısı onay sürecinde
          </button>
        )}

        <p style={{ fontSize: "0.75rem", color: "#8b7fae", marginTop: 10, lineHeight: 1.5 }}>
          Premium abonelik ödemeleri güvenli ödeme altyapısı aktif edildiğinde kullanıma açılacaktır.
        </p>
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
