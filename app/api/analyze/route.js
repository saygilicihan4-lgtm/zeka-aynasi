import { NextResponse } from "next/server";
import { cevapAnaliziYap, korNoktaTespitiYap } from "../../../lib/analysisEngine";
import {
  supernovaTespiti,
  ikizYildizTespiti,
  sentezAniTespiti,
  zihinHavasiHesapla,
  kozmikMevsimHesapla,
  kazanilanRozetleriHesapla,
} from "../../../lib/galaxySystem";

export async function POST(request) {
  try {
    const body = await request.json();
    const { cevapMetni, gecmisPuanlar, gecmisCevaplar, istatistik } = body;

    if (!cevapMetni || typeof cevapMetni !== "string") {
      return NextResponse.json({ hata: "cevapMetni gerekli" }, { status: 400 });
    }

    // Tamamen yerel/ücretsiz motor; dış servise çağrı yapılmaz
    const analiz = cevapAnaliziYap(cevapMetni, gecmisPuanlar || null);
    const supernova = supernovaTespiti(gecmisPuanlar, analiz.puanlar);
    const ikizYildizlar = ikizYildizTespiti(analiz.puanlar);
    const sentez = sentezAniTespiti(analiz.puanlar);
    const zihinHavasi = zihinHavasiHesapla(gecmisCevaplar || []);
    const kozmikMevsim = kozmikMevsimHesapla((istatistik && istatistik.toplamCevap) || 0);
    const korNokta = korNoktaTespitiYap([...(gecmisCevaplar || []).map((c) => c.metin || ""), cevapMetni]);

    const guncelIstatistik = {
      toplamCevap: ((istatistik && istatistik.toplamCevap) || 0) + 1,
      supernovaSayisi: ((istatistik && istatistik.supernovaSayisi) || 0) + (supernova ? 1 : 0),
      ikizYildizSayisi: ((istatistik && istatistik.ikizYildizSayisi) || 0) + (ikizYildizlar.length > 0 ? 1 : 0),
      sentezSayisi: ((istatistik && istatistik.sentezSayisi) || 0) + (sentez ? 1 : 0),
      ruyaModuCevapSayisi: (istatistik && istatistik.ruyaModuCevapSayisi) || 0,
      ardisikGunSayisi: (istatistik && istatistik.ardisikGunSayisi) || 0,
    };

    const yeniRozetler = kazanilanRozetleriHesapla(guncelIstatistik);

    return NextResponse.json({
      analiz,
      supernova,
      ikizYildizlar,
      sentez,
      zihinHavasi,
      kozmikMevsim,
      korNokta,
      istatistik: guncelIstatistik,
      rozetler: yeniRozetler,
    });
  } catch (hata) {
    return NextResponse.json({ hata: "Analiz sırasında bir sorun oluştu" }, { status: 500 });
  }
}
