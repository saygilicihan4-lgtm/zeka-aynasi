// Abonelik Sistemi (Freemium Modeli)
// Bireysel abonelik ile küçük ölçekte başlanacak; B2B koçluk/terapi tarafı ileride.

export const PLANLAR = {
  ucretsiz: {
    id: "ucretsiz",
    isim: "Ücretsiz",
    fiyat: 0,
    fiyatMetni: "0 TL",
    faturalama: "Süresiz ücretsiz",
    gunlukSoruLimiti: 1,
    serbestSohbetLimitiDakika: 5,
    zamanTuneliErisimi: false,
    galaksiKartiPaylasimi: true,
    bilgeSesliKonusma: false,
  },
  premium: {
    id: "premium",
    isim: "Premium",
    fiyat: 199.90,
    fiyatMetni: "199,90 TL / ay",
    faturalama: "Aylık abonelik",
    gunlukSoruLimiti: Infinity,
    serbestSohbetLimitiDakika: Infinity,
    zamanTuneliErisimi: true,
    galaksiKartiPaylasimi: true,
    bilgeSesliKonusma: true,
  },
};

export function kullaniciPlaniniGetir(kullanici) {
  return kullanici && kullanici.premium ? PLANLAR.premium : PLANLAR.ucretsiz;
}

export function ozellikErisimiVarMi(kullanici, ozellikAdi) {
  const plan = kullaniciPlaniniGetir(kullanici);
  return Boolean(plan[ozellikAdi]);
}

export function gunlukLimitAsildiMi(kullanici, bugunkuSoruSayisi) {
  const plan = kullaniciPlaniniGetir(kullanici);
  return bugunkuSoruSayisi >= plan.gunlukSoruLimiti;
}
