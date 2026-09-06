// Soru Üretici Sistemi
// Şablon + değişken tabanlı, matematiksel olarak binlerce farklı soru üretebilir.

export const kisiHavuzu = [
  "yakın bir arkadaşın", "iş arkadaşın", "ailenden biri", "hiç tanımadığın biri",
  "eski bir partnerin", "patronun", "bir öğretmenin", "kardeşin", "bir yabancı",
  "sosyal medyada tanıdığın biri", "komşun", "eski bir dostun", "bir çocuk",
  "senden çok daha genç biri", "senden çok daha yaşlı biri"
];

export const ortamHavuzu = [
  "kalabalık bir toplantıda", "sessiz bir kahve dükkanında", "gece yarısı bir mesajla",
  "işin ortasında", "tatildeyken", "bir düğünde", "hastane bekleme salonunda",
  "trafikte", "bir sınav öncesinde", "sosyal medyada", "aile yemeğinde",
  "bir sunum sırasında", "yalnız kaldığın bir anda", "bir kriz anında", "sıradan bir günde"
];

export const talepHavuzu = [
  "senden bir şey istedi ve bu seni zorladı", "seni eleştirdi", "senden özür diledi",
  "seninle aynı fikirde değildi", "sana yardım etmeni istedi", "seni görmezden geldi",
  "seninle dalga geçti", "sana içini döktü", "seni yalnız bıraktı",
  "seninle rekabete girdi", "sana güvendiğini söyledi", "seni hayal kırıklığına uğrattı",
  "senden bir sır istedi", "seni savundu", "sana yalan söyledi"
];

export const durumHavuzu = [
  "sen de aynı anda başka bir sorunla uğraşıyordun", "zamanın çok azdı",
  "yorgun ve tükenmiştin", "aslında haklı olduğunu biliyordun",
  "duygusal olarak hazır değildin", "başkaları da izliyordu",
  "geçmişte benzer bir durum yaşamıştın", "içten içe kızgındın",
  "ne yapacağını bilmiyordun", "kararını hızlı vermen gerekiyordu"
];

export const sonucHavuzu = [
  "Bu anda ne düşündün", "O sırada içinden ne geçti", "Buna nasıl tepki verdin",
  "Bunun ardından ne yaptın", "Bu durumu nasıl değerlendirdin",
  "Bu seni nasıl hissettirdi ve sonrasında ne yaptın", "İlk içgüdün ne oldu",
  "Bu durumla nasıl baş ettin"
];

const sablonlar = [
  (k, o, t, d, s) => `${k}, ${o} ${t}. Üstelik ${d}. ${s}?`,
  (k, o, t, d, s) => `${o}, ${k} ${t}. ${d}. ${s}?`,
  (k, o, t, d, s) => `${d} bir sırada, ${k} ${o} ${t}. ${s}?`,
  (k, o, t, d, s) => `${k} ${t}, hem de ${o}. ${d}. ${s}?`,
  (k, o, t, d, s) => `Düşün: ${o}, ${k} ${t}. ${d}. ${s}?`,
  (k, o, t, d, s) => `${o} ${k} ${t} ve ${d}. ${s}?`,
];

// Elle yazılmış kaliteli sorular (gündüz, %25 ihtimalle karışır)
export const elYazimiGunduz = [
  "Hayatında aldığın en zor kararı hatırla. O kararı bugün tekrar verecek olsan, neyi değiştirirdin?",
  "Seni en çok kızdıran şey ne zaman oldu ve o kızgınlığın altında gerçekte ne vardı?",
  "Biri senden özür dilediğinde, gerçekten kabul ettiğini mi yoksa sadece konuyu kapatmak istediğini mi anlarsın?",
  "Son zamanlarda kendini haklı çıkarmaya çalıştığın bir tartışmayı düşün. Karşındaki neden farklı düşünüyordu?",
  "Bir hata yaptığını fark ettiğin an, önce ne yaparsın: savunma mı, kabul mü, yoksa kaçma mı?",
  "Seni en iyi tanıyan biri, senin hakkında hangi gerçeği söylerdi ki sen bunu duymak istemezdin?",
  "Şu anki hayatındaki en büyük çelişki nedir: söylediğin ile yaptığın arasında bir fark var mı?",
  "Geçmişte pişman olduğun bir tepkini hatırla. O an neden farklı davranamadın?"
];

// Rüya modu soruları (23:00-05:00, elle yazılmış, sınırlı)
export const ruyaModuSorulari = [
  "Gözlerini kapat ve düşün: bugün seni en çok yoran şey neydi, gerçekten?",
  "Bilinçaltının şu an sana ne söylemeye çalışıyor olabilir?",
  "Eğer bu gece bir rüya görecek olsan, hangi duygunun rüyana sızmasından korkarsın?",
  "Gündüz bastırdığın bir duygu var mı? Şimdi, kimse görmüyorken, onu adlandırabilir misin?",
  "Yarın uyandığında hangi sen olmak istersin: bugünkünden nasıl farklı?"
];

function rastgele(dizi) {
  return dizi[Math.floor(Math.random() * dizi.length)];
}

let sonSoru = null;

export function gunlukSoruUret() {
  // %25 ihtimalle elle yazılmış kaliteli soru
  if (Math.random() < 0.25) {
    return rastgele(elYazimiGunduz);
  }

  let soru;
  let deneme = 0;
  do {
    const sablon = rastgele(sablonlar);
    soru = sablon(
      rastgele(kisiHavuzu),
      rastgele(ortamHavuzu),
      rastgele(talepHavuzu),
      rastgele(durumHavuzu),
      rastgele(sonucHavuzu)
    );
    deneme++;
  } while (soru === sonSoru && deneme < 5);

  sonSoru = soru;
  return soru;
}

export function ruyaModuSoruUret() {
  let soru;
  let deneme = 0;
  do {
    soru = rastgele(ruyaModuSorulari);
    deneme++;
  } while (soru === sonSoru && deneme < 5);
  sonSoru = soru;
  return soru;
}

export function gecemi() {
  const simdi = new Date();
  const saat = simdi.getHours();
  return saat >= 23 || saat < 5;
}

export function soruUret() {
  return gecemi() ? ruyaModuSoruUret() : gunlukSoruUret();
}
