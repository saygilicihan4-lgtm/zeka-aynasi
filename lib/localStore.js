// Basit yerel depolama katmanı (prototip amaçlı). Gerçek uygulamada
// bir veritabanına (örn. Postgres/Supabase) bağlanmalıdır.

const ANAHTAR = "zeka-aynasi-veri";

const varsayilanVeri = {
  gecmisCevaplar: [],
  gecmisPuanlar: null,
  istatistik: {
    toplamCevap: 0,
    supernovaSayisi: 0,
    ikizYildizSayisi: 0,
    sentezSayisi: 0,
    ruyaModuCevapSayisi: 0,
    ardisikGunSayisi: 0,
  },
  rozetler: [],
  galaksiAdi: null,
  bilgeAdi: null,
  isimlendirilmisBoyutlar: {},
  favoriler: [],
  zamanKapsulleri: [],
  premium: false,
};

export function veriOku() {
  if (typeof window === "undefined") return varsayilanVeri;
  try {
    const ham = window.localStorage.getItem(ANAHTAR);
    if (!ham) return varsayilanVeri;
    return { ...varsayilanVeri, ...JSON.parse(ham) };
  } catch {
    return varsayilanVeri;
  }
}

export function veriYaz(veri) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ANAHTAR, JSON.stringify(veri));
}

export function veriGuncelle(guncelleyici) {
  const mevcut = veriOku();
  const yeni = guncelleyici(mevcut);
  veriYaz(yeni);
  return yeni;
}
