"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import YildizAlani from "../../components/YildizAlani";
import ZihinGalaksisi from "../../components/ZihinGalaksisi";
import { veriOku, veriGuncelle } from "../../lib/localStore";
import { isimVerilebilirBoyutlar } from "../../lib/galaxySystem";

export default function SonucSayfasi() {
  const [sonuc, setSonuc] = useState(null);
  const [veri, setVeri] = useState(null);
  const [isimVerModu, setIsimVerModu] = useState(false);
  const [seciliBoyut, setSeciliBoyut] = useState(null);
  const [girilenIsim, setGirilenIsim] = useState("");
  const router = useRouter();

  useEffect(() => {
    const ham = sessionStorage.getItem("son-analiz");
    if (ham) setSonuc(JSON.parse(ham));
    setVeri(veriOku());
  }, []);

  if (!sonuc || !veri) {
    return (
      <div className="merkez">
        <YildizAlani kozmikMevsim="ilkbahar" />
        <p>Henüz bir analiz yok.</p>
        <button className="buton" onClick={() => router.push("/soru")}>Soruya dön</button>
      </div>
    );
  }

  const isimlenebilirler = isimVerilebilirBoyutlar(sonuc.analiz.puanlar);

  function isimKaydet() {
    if (!seciliBoyut || !girilenIsim.trim()) return;
    veriGuncelle((mevcut) => ({
      ...mevcut,
      isimlendirilmisBoyutlar: { ...mevcut.isimlendirilmisBoyutlar, [seciliBoyut]: girilenIsim.trim() },
    }));
    setIsimVerModu(false);
    setGirilenIsim("");
  }

  function favorileEkle() {
    veriGuncelle((mevcut) => ({
      ...mevcut,
      favoriler: [...mevcut.favoriler, { ...veri.gecmisCevaplar[veri.gecmisCevaplar.length - 1] }],
    }));
  }

  return (
    <div className="merkez" style={{ paddingBottom: 90 }}>
      <YildizAlani kozmikMevsim={sonuc.kozmikMevsim} />
      <h1 className="baslik">Analiz Tamamlandı</h1>

      {sonuc.supernova && (
        <div className="kart" style={{ marginBottom: 16, border: "1px solid #f5d0fe", boxShadow: "0 0 30px rgba(245,208,254,0.4)" }}>
          <strong style={{ color: "#f5d0fe" }}>Süpernova Anı!</strong>
          <p style={{ fontSize: "0.85rem", marginTop: 6 }}>
            {sonuc.supernova.boyut} boyutunda büyük bir sıçrama yaşadın: artı {sonuc.supernova.artis} puan.
          </p>
        </div>
      )}

      {sonuc.sentez && (
        <div className="kart" style={{ marginBottom: 16, border: "1px solid #93c5fd" }}>
          <strong style={{ color: "#93c5fd" }}>Sentez Anı</strong>
          <p style={{ fontSize: "0.85rem", marginTop: 6 }}>
            İki güçlü boyutun bir arada zirveye çıktı, zihnin nadir bir uyum anı yakaladı.
          </p>
        </div>
      )}

      <ZihinGalaksisi puanlar={sonuc.analiz.puanlar} oncekiPuanlar={veri.gecmisPuanlar} galaksiAdi={veri.galaksiAdi} />

      <div className="kart" style={{ marginTop: 12 }}>
        <p><strong>Güçlü yön:</strong> {sonuc.analiz.gucluIsim}</p>
        <p><strong>Gölgede kalan:</strong> {sonuc.analiz.golgedeIsim}</p>
        <p style={{ marginTop: 12, fontStyle: "italic", color: "#e8ddff" }}>{sonuc.analiz.kocYorumu}</p>

        {sonuc.korNokta && (
          <p style={{ marginTop: 12, fontSize: "0.85rem", color: "#facc15" }}>{sonuc.korNokta.mesaj}</p>
        )}

        <p style={{ marginTop: 12, fontSize: "0.8rem", color: "#8b7fae" }}>
          Zihin havası: {sonuc.zihinHavasi}
        </p>
      </div>

      {isimlenebilirler.length > 0 && (
        <div className="kart" style={{ marginTop: 12 }}>
          <p style={{ fontSize: "0.85rem" }}>Bir takımyıldıza isim vermek ister misin?</p>
          {!isimVerModu ? (
            <button className="buton buton-ikincil" onClick={() => setIsimVerModu(true)}>
              İsim Ver
            </button>
          ) : (
            <div>
              <select
                value={seciliBoyut || ""}
                onChange={(e) => setSeciliBoyut(e.target.value)}
                style={{ padding: 8, borderRadius: 8, marginBottom: 8, width: "100%" }}
              >
                <option value="">Boyut seç</option>
                {isimlenebilirler.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <input
                className="metin-alani"
                style={{ minHeight: "auto", padding: 10 }}
                value={girilenIsim}
                onChange={(e) => setGirilenIsim(e.target.value)}
                placeholder="Takımyıldızın adı"
              />
              <button className="buton" onClick={isimKaydet}>Kaydet</button>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <button className="buton" onClick={favorileEkle}>Favorilere Ekle</button>
        <button className="buton buton-ikincil" onClick={() => router.push("/ana-sayfa")}>
          Ana Sayfaya Dön
        </button>
      </div>

      <div className="nav-alt">
        <div className="nav-oge" onClick={() => router.push("/ana-sayfa")}>Ana Sayfa</div>
        <div className="nav-oge" onClick={() => router.push("/zaman-tuneli")}>Zaman Tüneli</div>
        <div className="nav-oge" onClick={() => router.push("/profil")}>Profil</div>
        <div className="nav-oge" onClick={() => router.push("/abonelik")}>Premium</div>
      </div>
    </div>
  );
}
