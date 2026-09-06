// Zihin Galaksisi Sistemi
// Profil verisini yıldız kümesi mantığına çevirir; rozetler, süpernova,
// ikiz yıldızlar, kör nokta, dilek yıldızı gibi tüm özellikleri yönetir.

import { BOYUTLAR, BOYUT_ISIMLERI } from "./analysisEngine";

export function yildizSayisiHesapla(puan) {
  // Puan arttıkça yıldız sayısı ve parlaklığı artar
  if (puan >= 90) return { sayi: 12, parlaklik: 1.0 };
  if (puan >= 75) return { sayi: 9, parlaklik: 0.85 };
  if (puan >= 60) return { sayi: 6, parlaklik: 0.65 };
  if (puan >= 40) return { sayi: 3, parlaklik: 0.4 };
  return { sayi: 1, parlaklik: 0.2 };
}

export function karanlikMaddeTespiti(puanlar) {
  // Düşük puanlı, keşfedilmemiş boyutlar için gizemli halka
  return BOYUTLAR.filter((b) => puanlar[b] < 35);
}

export function ikizYildizTespiti(puanlar) {
  // İki dengeli/yüksek boyut arasında altın bağlantı çizgisi
  const yuksekBoyutlar = BOYUTLAR.filter((b) => puanlar[b] >= 70);
  const ciftler = [];
  for (let i = 0; i < yuksekBoyutlar.length; i++) {
    for (let j = i + 1; j < yuksekBoyutlar.length; j++) {
      const fark = Math.abs(puanlar[yuksekBoyutlar[i]] - puanlar[yuksekBoyutlar[j]]);
      if (fark <= 5) {
        ciftler.push([yuksekBoyutlar[i], yuksekBoyutlar[j]]);
      }
    }
  }
  return ciftler;
}

export function sentezAniTespiti(puanlar) {
  // İki boyut 80+ olunca özel kart
  const yuksekBoyutlar = BOYUTLAR.filter((b) => puanlar[b] >= 80);
  return yuksekBoyutlar.length >= 2 ? yuksekBoyutlar : null;
}

export function supernovaTespiti(oncekiPuanlar, yeniPuanlar) {
  // Büyük gelişim sıçraması: herhangi bir boyutta +20 veya daha fazla artış
  if (!oncekiPuanlar) return null;
  for (const boyut of BOYUTLAR) {
    if (yeniPuanlar[boyut] - oncekiPuanlar[boyut] >= 20) {
      return { boyut, artis: yeniPuanlar[boyut] - oncekiPuanlar[boyut] };
    }
  }
  return null;
}

export function zihinHavasiHesapla(sonNCevap) {
  // Son cevaplara göre açık / parçalı bulutlu / fırtınalı
  if (!sonNCevap || sonNCevap.length === 0) return "açık";
  const ortalama =
    sonNCevap.reduce((toplam, c) => {
      const puanOrtalama = BOYUTLAR.reduce((t, b) => t + c.puanlar[b], 0) / BOYUTLAR.length;
      return toplam + puanOrtalama;
    }, 0) / sonNCevap.length;

  if (ortalama >= 70) return "açık";
  if (ortalama >= 45) return "parçalı bulutlu";
  return "fırtınalı";
}

export function kozmikMevsimHesapla(toplamCevapSayisi) {
  const mevsimler = ["ilkbahar", "yaz", "sonbahar", "kış"];
  const index = Math.floor(toplamCevapSayisi / 5) % mevsimler.length;
  return mevsimler[index];
}

// Rozet tanımları
export const ROZETLER = [
  { id: "ilk-isik", isim: "İlk Işık", kosul: (istatistik) => istatistik.toplamCevap >= 1 },
  { id: "bes-yildiz", isim: "Beş Yıldız", kosul: (istatistik) => istatistik.toplamCevap >= 5 },
  { id: "yirmi-cevap", isim: "Kalıcı Gözlemci", kosul: (istatistik) => istatistik.toplamCevap >= 20 },
  { id: "ilk-supernova", isim: "İlk Süpernova", kosul: (istatistik) => istatistik.supernovaSayisi >= 1 },
  { id: "ikiz-yildizlar", isim: "İkiz Yıldızlar", kosul: (istatistik) => istatistik.ikizYildizSayisi >= 1 },
  { id: "gece-yolcusu", isim: "Gece Yolcusu", kosul: (istatistik) => istatistik.ruyaModuCevapSayisi >= 5 },
  { id: "sentez-ustasi", isim: "Sentez Ustası", kosul: (istatistik) => istatistik.sentezSayisi >= 1 },
  { id: "kararli-gozlemci", isim: "Kararlı Gözlemci", kosul: (istatistik) => istatistik.ardisikGunSayisi >= 7 },
];

export function kazanilanRozetleriHesapla(istatistik) {
  return ROZETLER.filter((r) => r.kosul(istatistik)).map((r) => ({ id: r.id, isim: r.isim }));
}

// Dilek yıldızı: ana sayfada ara sıra kayan yıldız
export function dilekYildiziGorunsunMu() {
  return Math.random() < 0.12; // yaklaşık %12 ihtimalle
}

// Yankı: geçmişte söylenen bir cevap ara sıra karşına çıkar
export function yankiSecimiYap(gecmisCevaplar) {
  if (!gecmisCevaplar || gecmisCevaplar.length < 3) return null;
  if (Math.random() < 0.15) {
    const rastgeleIndex = Math.floor(Math.random() * gecmisCevaplar.length);
    return gecmisCevaplar[rastgeleIndex];
  }
  return null;
}

// Zaman kapsülü: mühürlenmiş mesaj, bir sonraki cevaptan sonra açılır
export function zamanKapsuluOlusturVerisi(mesaj) {
  return {
    mesaj,
    muhurlenmeTarihi: new Date().toISOString(),
    acildi: false,
  };
}

// Kutup yıldızı: en baskın boyutu öne çıkar
export function kutupYildiziHesapla(puanlar) {
  const enYuksekBoyut = BOYUTLAR.reduce((a, b) => (puanlar[a] > puanlar[b] ? a : b));
  return { boyut: enYuksekBoyut, isim: BOYUT_ISIMLERI[enYuksekBoyut], puan: puanlar[enYuksekBoyut] };
}

// Takımyıldıza isim verme: 65+ puana ulaşınca
export function isimVerilebilirBoyutlar(puanlar) {
  return BOYUTLAR.filter((b) => puanlar[b] >= 65);
}
