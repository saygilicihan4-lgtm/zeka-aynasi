"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import YildizAlani from "../../components/YildizAlani";
import ZihinGalaksisi from "../../components/ZihinGalaksisi";
import { veriOku, veriGuncelle } from "../../lib/localStore";
import { ROZETLER } from "../../lib/galaxySystem";

export default function ProfilSayfasi() {
  const [veri, setVeri] = useState(null);
  const [galaksiAdi, setGalaksiAdi] = useState("");
  const [bilgeAdi, setBilgeAdi] = useState("");
  const router = useRouter();

  useEffect(() => {
    setVeri(veriOku());
  }, []);

  if (!veri) return null;

  function galaksiyiKaydet() {
    if (!galaksiAdi.trim()) return;
    veriGuncelle((mevcut) => ({ ...mevcut, galaksiAdi: galaksiAdi.trim() }));
    setVeri(veriOku());
  }

  function bilgeyiKaydet() {
    if (!bilgeAdi.trim()) return;
    veriGuncelle((mevcut) => ({ ...mevcut, bilgeAdi: bilgeAdi.trim() }));
    setVeri(veriOku());
  }

  const cevapCekirdegiBoyutu = Math.min(80, 20 + veri.istatistik.toplamCevap * 1.2);

  return (
    <div className="merkez" style={{ paddingBottom: 90 }}>
      <YildizAlani kozmikMevsim="ilkbahar" />
      <h1 className="baslik">Profilin</h1>

      <div
        style={{
          width: cevapCekirdegiBoyutu,
          height: cevapCekirdegiBoyutu,
          borderRadius: "50%",
          background: "radial-gradient(circle, #f5d0fe, #7c3aed, #2d1b4e)",
          boxShadow: `0 0 ${cevapCekirdegiBoyutu / 2}px rgba(168,85,247,0.7)`,
          margin: "0 auto 24px",
        }}
      />
      <p style={{ color: "#8b7fae", marginBottom: 24 }}>
        Toplam {veri.istatistik.toplamCevap} cevap verdin
      </p>

      {veri.gecmisPuanlar ? (
        <ZihinGalaksisi puanlar={veri.gecmisPuanlar} galaksiAdi={veri.galaksiAdi} />
      ) : (
        <p>Henüz bir cevabın yok, galaksin şekillenmeyi bekliyor.</p>
      )}

      <div className="kart" style={{ marginTop: 16 }}>
        <p style={{ marginBottom: 8, fontSize: "0.9rem" }}>Galaksine bir isim ver</p>
        <input
          className="metin-alani"
          style={{ minHeight: "auto", padding: 10 }}
          value={galaksiAdi}
          onChange={(e) => setGalaksiAdi(e.target.value)}
          placeholder={veri.galaksiAdi || "Örn: Sessiz Rota"}
        />
        <button className="buton" onClick={galaksiyiKaydet}>Kaydet</button>
      </div>

      <div className="kart" style={{ marginTop: 16 }}>
        <p style={{ marginBottom: 8, fontSize: "0.9rem" }}>Bilgene bir isim ver</p>
        <input
          className="metin-alani"
          style={{ minHeight: "auto", padding: 10 }}
          value={bilgeAdi}
          onChange={(e) => setBilgeAdi(e.target.value)}
          placeholder={veri.bilgeAdi || "Örn: Orin"}
        />
        <button className="buton" onClick={bilgeyiKaydet}>Kaydet</button>
      </div>

      <div className="kart" style={{ marginTop: 16 }}>
        <p style={{ marginBottom: 12, fontSize: "0.9rem" }}>Rozetlerin</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
          {ROZETLER.map((r) => {
            const kazanildi = veri.rozetler.some((k) => k.id === r.id);
            return (
              <div
                key={r.id}
                style={{
                  padding: "8px 12px",
                  borderRadius: 999,
                  fontSize: "0.75rem",
                  background: kazanildi ? "rgba(124,58,237,0.4)" : "rgba(255,255,255,0.05)",
                  color: kazanildi ? "#f5d0fe" : "#5c5470",
                  border: kazanildi ? "1px solid #a855f7" : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {r.isim}
              </div>
            );
          })}
        </div>
      </div>

      {veri.favoriler.length > 0 && (
        <div className="kart" style={{ marginTop: 16 }}>
          <p style={{ marginBottom: 12, fontSize: "0.9rem" }}>Favori Anların</p>
          {veri.favoriler.slice(-5).map((f, i) => (
            <p key={i} style={{ fontSize: "0.8rem", color: "#c9bce8", marginBottom: 8 }}>
              "{f.metin.slice(0, 80)}{f.metin.length > 80 ? "..." : ""}"
            </p>
          ))}
        </div>
      )}

      <button className="buton" style={{ marginTop: 20 }} onClick={() => router.push("/abonelik")}>
        Paylaşılabilir Galaksi Kartı
      </button>

      <div className="nav-alt">
        <div className="nav-oge" onClick={() => router.push("/ana-sayfa")}>Ana Sayfa</div>
        <div className="nav-oge" onClick={() => router.push("/zaman-tuneli")}>Zaman Tüneli</div>
        <div className="nav-oge aktif" onClick={() => router.push("/profil")}>Profil</div>
        <div className="nav-oge" onClick={() => router.push("/abonelik")}>Premium</div>
      </div>
    </div>
  );
}
