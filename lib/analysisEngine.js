// Analiz Motoru
// Kullanıcı cevabını 5 boyutta puanlar:
// 1. Mantıksal Tutarlılık
// 2. Perspektif Genişliği
// 3. Duygusal Farkındalık
// 4. Esneklik
// 5. Öz-Farkındalık
//
// Bu motor tamamen yerel ve ücretsiz çalışır (anahtar kelime tabanlı analiz).
// Dış bir yapay zeka servisine bağlanmadığı için hiçbir kullanım ücreti oluşturmaz.

const BOYUTLAR = [
  "mantiksalTutarlilik",
  "perspektifGenisligi",
  "duygusalFarkindalik",
  "esneklik",
  "ozFarkindalik",
];

const BOYUT_ISIMLERI = {
  mantiksalTutarlilik: "Mantıksal Tutarlılık",
  perspektifGenisligi: "Perspektif Genişliği",
  duygusalFarkindalik: "Duygusal Farkındalık",
  esneklik: "Esneklik",
  ozFarkindalik: "Öz-Farkındalık",
};

const sinyaller = {
  mantiksalTutarlilik: {
    pozitif: ["çünkü", "bu yüzden", "sonuç olarak", "dolayısıyla", "eğer", "nedeni"],
    negatif: ["bilmiyorum", "sebepsiz", "öylesine", "rastgele"],
  },
  perspektifGenisligi: {
    pozitif: ["onun açısından", "belki de", "başka bir bakışla", "farklı biri", "onun yerinde olsam", "diğer taraftan"],
    negatif: ["sadece ben", "başkası önemli değil", "kimse anlamaz"],
  },
  duygusalFarkindalik: {
    pozitif: ["hissettim", "duygularım", "içimde", "üzüldüm", "kızdım", "sevindim", "endişelendim", "korktum"],
    negatif: ["hiçbir şey hissetmedim", "önemli değildi", "duygu yok"],
  },
  esneklik: {
    pozitif: ["fikrimi değiştirdim", "yeniden düşündüm", "farklı bir yol", "uyum sağladım", "denedim"],
    negatif: ["asla değişmem", "tek doğru bu", "hep aynı"],
  },
  ozFarkindalik: {
    pozitif: ["fark ettim", "kendimi", "aslında ben", "içgörü", "anladım ki", "öğrendim ki"],
    negatif: ["neden yaptığımı bilmiyorum", "kendimi hiç anlamıyorum"],
  },
};

function metinPuanla(metin, boyut) {
  const kucukMetin = metin.toLowerCase();
  let puan = 50;

  sinyaller[boyut].pozitif.forEach((kelime) => {
    if (kucukMetin.includes(kelime)) puan += 8;
  });
  sinyaller[boyut].negatif.forEach((kelime) => {
    if (kucukMetin.includes(kelime)) puan -= 8;
  });

  const kelimeSayisi = metin.trim().split(/\s+/).filter(Boolean).length;
  if (kelimeSayisi > 40) puan += 6;
  else if (kelimeSayisi > 20) puan += 3;
  else if (kelimeSayisi < 5) puan -= 5;

  return Math.max(0, Math.min(100, Math.round(puan)));
}

export function cevapAnaliziYap(cevapMetni, gecmisPuanlar = null) {
  const puanlar = {};
  BOYUTLAR.forEach((boyut) => {
    puanlar[boyut] = metinPuanla(cevapMetni, boyut);
  });

  if (gecmisPuanlar) {
    BOYUTLAR.forEach((boyut) => {
      puanlar[boyut] = Math.round(puanlar[boyut] * 0.7 + gecmisPuanlar[boyut] * 0.3);
    });
  }

  const siraliBoyutlar = [...BOYUTLAR].sort((a, b) => puanlar[b] - puanlar[a]);
  const guclu = siraliBoyutlar[0];
  const golgede = siraliBoyutlar[siraliBoyutlar.length - 1];

  return {
    puanlar,
    guclu,
    gucluIsim: BOYUT_ISIMLERI[guclu],
    golgede,
    golgedeIsim: BOYUT_ISIMLERI[golgede],
    kocYorumu: kocYorumuUret(puanlar, guclu, golgede),
    tarih: new Date().toISOString(),
  };
}

function kocYorumuUret(puanlar, guclu, golgede) {
  const ortalama = BOYUTLAR.reduce((t, b) => t + puanlar[b], 0) / BOYUTLAR.length;

  const acilisCumleleri = [
    "Bu cevabında ilginç bir denge gördüm.",
    "Sözlerinin arkasında derin bir şey seziyorum.",
    "Bu, düşünmeye değer bir cevaptı.",
    "İçindeki sesi biraz daha yakından dinledim.",
  ];

  const gucluCumle = `${BOYUT_ISIMLERI[guclu]} tarafın şu an en parlak yıldızın; bu, senin doğal gücün.`;
  const golgeCumle = `${BOYUT_ISIMLERI[golgede]} ise gölgede kalıyor, belki de üzerine biraz ışık düşürmenin vakti gelmiştir.`;

  let genelCumle;
  if (ortalama >= 75) {
    genelCumle = "Genel olarak zihnin bugün çok net ve dengeli çalışıyor.";
  } else if (ortalama >= 55) {
    genelCumle = "Zihnin sağlam bir yerde duruyor, gelişime hep açık.";
  } else {
    genelCumle = "Bugün biraz daha yorucu bir gün gibi görünüyor, kendine nazik ol.";
  }

  const acilis = acilisCumleleri[Math.floor(Math.random() * acilisCumleleri.length)];
  return `${acilis} ${gucluCumle} ${golgeCumle} ${genelCumle}`;
}

export function korNoktaTespitiYap(gecmisCevaplar) {
  const kelimeSayaci = {};
  const yokSayilacak = new Set(["bir", "bu", "şu", "ve", "ile", "de", "da", "ben", "çok", "gibi", "için"]);

  gecmisCevaplar.forEach((cevap) => {
    const kelimeler = cevap.toLowerCase().replace(/[^a-zçğıöşü\s]/g, "").split(/\s+/);
    kelimeler.forEach((kelime) => {
      if (kelime.length > 3 && !yokSayilacak.has(kelime)) {
        kelimeSayaci[kelime] = (kelimeSayaci[kelime] || 0) + 1;
      }
    });
  });

  const siraliKelimeler = Object.entries(kelimeSayaci).sort((a, b) => b[1] - a[1]);
  if (siraliKelimeler.length > 0 && siraliKelimeler[0][1] >= 3) {
    return {
      kelime: siraliKelimeler[0][0],
      sayac: siraliKelimeler[0][1],
      mesaj: `Fark ettim ki son zamanlarda "${siraliKelimeler[0][0]}" kelimesini sık sık kullanıyorsun. Bu senin için ne anlama geliyor olabilir?`,
    };
  }
  return null;
}

export { BOYUTLAR, BOYUT_ISIMLERI };
