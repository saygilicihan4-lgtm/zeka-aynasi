// Abonelik Sistemi (Freemium Modeli)
// Bireysel abonelik ile küçük ölçekte başlanacak; B2B koçluk/terapi tarafı ileride.

export const PLANLAR = {
  ucretsiz: {
    id: "ucretsiz",
    isim: "Ücretsiz",
    gunlukSoruLimiti: 1,
    serbestSohbetLimitiDakika: 5,
    zamanTuneliErisimi: false,
    galaksiKartiPaylasimi: true,
    bilgeSesliKonusma: false,
  },
  premium: {
    id: "premium",
    isim: "Premium",
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
