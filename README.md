# Zeka Aynasi (Prototip - Next.js)

Bu proje, psikolojik oz-farkindalik uygulamasi "Zeka Aynasi"nin
calisir prototipidir.

Onemli: Bu surumde SADECE odeme sistemi (iyzico) gercek bir dis servise
baglidir, cunku musterilerden Premium abonelik ucreti almak icin bu gerekli.
iyzico Turkiye'de yerlesik oldugu icin Turk kimligi ve Turk banka hesabiyla
dogrudan hesap acilabilir; kurulumda sabit bir ucret yoktur, sadece basarili
islemlerden komisyon kesilir. Analiz motoru ve ses motoru ise TAMAMEN yerel
ve ucretsiz calisir; herhangi bir dis servise (Anthropic, ElevenLabs vb.)
baglanmaz, dolayisiyla sana hicbir kullanim ucreti cikarmaz.

## Calistirmak icin
1. npm install
2. .env.local.example dosyasinin bir kopyasini olusturup adini .env.local yap
3. Asagidaki "iyzico hesabi acma" bolumune gore anahtarlari doldur
4. npm run dev
5. Tarayicida http://localhost:3000 ac

## iyzico hesabi acma (adim adim) - musterilerden odeme almak icin

- iyzico.com adresinden "Hemen Basvur" ile ucretsiz kayit ol (Turk kimlik/vergi
  numarasi ve bir Turk banka hesabi/IBAN istenecek)
- Basvuru onaylandiktan sonra iyzico Merchant Panel'e giris yap
- Sol menuden "Ayarlar" -> "API Anahtarlari" bolumune gir
- Once "Sandbox" (test) anahtarlarini kopyala: API Key ve Secret Key
  degerlerini .env.local dosyasinda IYZICO_API_KEY ve IYZICO_SECRET_KEY
  alanlarina yapistir
- Test asamasinda IYZICO_BASE_URL degerini sandbox-api.iyzipay.com olarak birak
- Musterilerden gercek tahsilat yapmaya hazir oldugunda basvurunun "canli"ya
  gecmesini bekleyip (kimlik/evrak onayi gerekir), canli API anahtarlarini
  alip IYZICO_BASE_URL degerini api.iyzipay.com olarak degistirmen yeterli;
  musterinin odedigi para dogrudan senin bagladigin banka hesabina duser,
  senin ekstra bir odeme yapman gerekmez, sadece komisyon kesilir

## Icerik ozeti
- app/page.js: Giris ekrani (5 cumle + galaksiye giris)
- app/ana-sayfa: Ana menu (gunluk soru / serbest sohbet / sesli sohbet)
- app/soru: Gunluk soru ekrani, meteor yagmuru, ruya modu
- app/sonuc: Analiz sonucu, zihin galaksisi, supernova/sentez anlari, takimyildiza isim verme
- app/profil: Profil, rozetler, galaksi/bilge adlandirma, favoriler
- app/zaman-tuneli: Gecmis cevaplarin boyuta gore filtrelenmis listesi
- app/sohbet: Yazili serbest sohbet
- app/sesli-sohbet: Nefes molasi + sesli tanima/okuma ile bilgeyle konusma (tamamen ucretsiz, tarayici tabanli)
- app/abonelik: Freemium/Premium plan, iyzico Odeme Formu ile gercek odeme akisi (musteriden ucret alinir)
- app/api/analyze: Analiz istegini isler - tamamen yerel/ucretsiz motor
- app/api/subscribe: iyzico Odeme Formu oturumu olusturur
- app/api/subscribe/callback: iyzico'dan donen odeme sonucunu dogrular
- lib/analysisEngine.js: 5 boyutlu puanlama, anahtar kelime tabanli, tamamen yerel
- lib/galaxySystem.js: Yildiz sayisi, karanlik madde, ikiz yildizlar, supernova, rozetler
- lib/subscription.js: Plan tanimlari ve erisim kontrolu
- lib/localStore.js: Prototip icin yerel depolama (gercek surumde veritabanina tasinmali)
- data/questions.js: Sablon+degisken tabanli soru uretici + ruya modu sorulari

## Hala yapilmasi gerekenler (gercek urun icin)
- lib/localStore.js yerine gercek bir veritabani (Postgres/Supabase vb.) baglanmali
- Su anki akis her ay icin tek seferlik bir odeme baslatir (kullanici her ay
  tekrar "Premium'a Gec" butonuna basar); gercek otomatik tekrarlayan tahsilat
  icin iyzico'nun ucretli "Abonelik Yonetimi" eklentisi (ilk 3 ay ucretsiz,
  sonra aylik 199 TL) veya kayitli kartla otomatik yeniden tahsilat mantigi
  eklenmelidir
- Kullanici kimlik dogrulama (auth) eklenmeli
- iyzico basvurusu test (sandbox) modundan canli moda gecirilmeli (musterilerden gercek para almak icin)
