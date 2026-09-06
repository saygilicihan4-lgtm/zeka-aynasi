"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import YildizAlani from "../../components/YildizAlani";
import BilgeYuzu from "../../components/BilgeYuzu";
import { veriOku, veriGuncelle } from "../../lib/localStore";

const gununSozleri = [
  "Sessizlik bazen en dolu cevaptır.",
  "Zihin, izlendiğinde değil, dinlendiğinde açılır.",
  "Her karanlık köşe, bir gün ışık olmayı bekler.",
  "Kendini tanımak, bir varış değil, sürekli bir yolculuktur.",
  "Bugün sorulmayan soru, yarın daha yüksek sesle geri gelir.",
];

export default function SesliSohbetSayfasi() {
  const [nefesModu, setNefesModu] = useState(true);
  const [nefesAdimi, setNefesAdimi] = useState(0);
  const [dinliyor, setDinliyor] = useState(false);
  const [konusuyor, setKonusuyor] = useState(false);
  const [transkript, setTranskript] = useState("");
  const [bilgeCevabi, setBilgeCevabi] = useState("");
  const [gununSozu] = useState(gununSozleri[Math.floor(Math.random() * gununSozleri.length)]);
  const [veri, setVeri] = useState(null);
  const tanimaRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    setVeri(veriOku());
  }, []);

  useEffect(() => {
    if (!nefesModu) return;
    if (nefesAdimi >= 3) return;
    const t = setTimeout(() => setNefesAdimi((a) => a + 1), 4000);
    return () => clearTimeout(t);
  }, [nefesModu, nefesAdimi]);

  function konusmayaBasla() {
    setNefesModu(false);

    if (typeof window === "undefined") return;
    const TanimaAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!TanimaAPI) {
      setTranskript("Bu tarayıcı sesli tanımayı desteklemiyor, lütfen yazarak devam et.");
      return;
    }

    const tanima = new TanimaAPI();
    tanima.lang = "tr-TR";
    tanima.continuous = false;
    tanima.interimResults = false;

    tanima.onstart = () => setDinliyor(true);
    tanima.onend = () => setDinliyor(false);
    tanima.onresult = async (olay) => {
      const metin = olay.results[0][0].transcript;
      setTranskript(metin);
      await analizEtVeYanitla(metin);
    };
    tanima.onerror = () => setDinliyor(false);

    tanimaRef.current = tanima;
    tanima.start();
  }

  async function analizEtVeYanitla(metin) {
    const guncelVeri = veriOku();
    try {
      const yanit = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cevapMetni: metin,
          gecmisPuanlar: guncelVeri.gecmisPuanlar,
          gecmisCevaplar: guncelVeri.gecmisCevaplar,
          istatistik: guncelVeri.istatistik,
        }),
      });
      const sonuc = await yanit.json();

      veriGuncelle((mevcut) => ({
        ...mevcut,
        gecmisCevaplar: [
          ...mevcut.gecmisCevaplar,
          { metin, puanlar: sonuc.analiz.puanlar, tarih: sonuc.analiz.tarih, soru: "Sesli sohbet" },
        ].slice(-200),
        gecmisPuanlar: sonuc.analiz.puanlar,
        istatistik: sonuc.istatistik,
        rozetler: sonuc.rozetler,
      }));

      setBilgeCevabi(sonuc.analiz.kocYorumu);
      sesliOku(sonuc.analiz.kocYorumu, sonuc.zihinHavasi);
    } catch {
      const yedekCevap = "Seni duydum, ama şu an bir bulanıklık var. Devam edelim mi?";
      setBilgeCevabi(yedekCevap);
      sesliOku(yedekCevap, "parçalı bulutlu");
    }
  }

  // Tarayıcının kendi (ücretsiz) sesli okuma motoru kullanılır, dış servise gidilmez.
  function sesliOku(metin, zihinHavasi) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const konusma = new window.SpeechSynthesisUtterance(metin);
    konusma.lang = "tr-TR";
    if (zihinHavasi === "fırtınalı") {
      konusma.rate = 0.82;
      konusma.pitch = 0.85;
    } else if (zihinHavasi === "açık") {
      konusma.rate = 1.05;
      konusma.pitch = 1.1;
    } else {
      konusma.rate = 0.95;
      konusma.pitch = 1.0;
    }
    konusma.onstart = () => setKonusuyor(true);
    konusma.onend = () => setKonusuyor(false);
    window.speechSynthesis.speak(konusma);
  }

  useEffect(() => {
    if (!nefesModu) return;
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const konusma = new window.SpeechSynthesisUtterance(gununSozu);
    konusma.lang = "tr-TR";
    konusma.rate = 0.9;
    window.speechSynthesis.speak(konusma);
  }, []);

  if (nefesModu) {
    const nefesMetinleri = ["Derin bir nefes al...", "Yavaşça ver...", "Şimdi hazırsın."];
    return (
      <div className="merkez">
        <YildizAlani kozmikMevsim="kis" />
        <p style={{ fontSize: "0.85rem", color: "#93c5fd", marginBottom: 20 }}>{gununSozu}</p>
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(147,197,253,0.4), transparent)",
            animation: "nefesBuyume 4s ease-in-out infinite",
            marginBottom: 24,
          }}
        />
        <style>{`
          @keyframes nefesBuyume { 0%,100% { transform: scale(0.8); } 50% { transform: scale(1.3); } }
        `}</style>
        <p style={{ marginBottom: 24 }}>{nefesMetinleri[Math.min(nefesAdimi, 2)]}</p>
        <button className="buton buton-ikincil" onClick={konusmayaBasla}>
          Geç
        </button>
      </div>
    );
  }

  return (
    <div className="merkez" style={{ paddingBottom: 90 }}>
      <YildizAlani kozmikMevsim="kis" />
      <h1 className="baslik">{veri?.bilgeAdi || "Bilge"}</h1>

      <BilgeYuzu konusuyorMu={konusuyor} dinliyorMu={dinliyor} />

      <p style={{ marginTop: 20, color: "#8b7fae", fontSize: "0.85rem" }}>
        {dinliyor ? "Seni dinliyorum..." : konusuyor ? "Konuşuyor..." : "Konuşmaya başlamak için dokun"}
      </p>

      {transkript && (
        <div className="kart" style={{ marginTop: 16 }}>
          <p style={{ fontSize: "0.8rem", color: "#8b7fae" }}>Sen dedin ki:</p>
          <p>{transkript}</p>
        </div>
      )}

      {bilgeCevabi && (
        <div className="kart" style={{ marginTop: 12 }}>
          <p style={{ fontSize: "0.8rem", color: "#8b7fae" }}>{veri?.bilgeAdi || "Bilge"} dedi ki:</p>
          <p style={{ fontStyle: "italic" }}>{bilgeCevabi}</p>
        </div>
      )}

      <button className="buton" style={{ marginTop: 20 }} onClick={konusmayaBasla} disabled={dinliyor}>
        {dinliyor ? "Dinleniyor..." : "Tekrar Konuş"}
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
