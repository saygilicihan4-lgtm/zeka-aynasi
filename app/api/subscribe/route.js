import { NextResponse } from "next/server";
import Iyzipay from "iyzipay";

// GEREKLİ: .env.local dosyasında IYZICO_API_KEY, IYZICO_SECRET_KEY tanımlı olmalı.
// Hesap açma adımları README.md'de anlatılmıştır.
// iyzico kurulumda sabit bir ücret almaz, sadece başarılı işlemlerden komisyon keser.

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY,
  secretKey: process.env.IYZICO_SECRET_KEY,
  // Test modunda sandbox-api.iyzipay.com, canlıya geçince api.iyzipay.com kullanılır.
  uri: process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com",
});

const SITE_URL = process.env.SITE_URL || "http://localhost:3000";
const PREMIUM_AYLIK_FIYAT = process.env.IYZICO_PREMIUM_FIYAT || "49.90";

export async function POST(request) {
  try {
    const body = await request.json();
    const { plan, kullaniciId } = body;

    if (plan !== "premium") {
      return NextResponse.json({ hata: "Geçersiz plan" }, { status: 400 });
    }

    if (!process.env.IYZICO_API_KEY || !process.env.IYZICO_SECRET_KEY) {
      return NextResponse.json(
        {
          hata: "Ödeme sağlayıcısı henüz yapılandırılmadı. IYZICO_API_KEY ve IYZICO_SECRET_KEY tanımlanmalı.",
        },
        { status: 500 }
      );
    }

    const conversationId = `zeka-aynasi-${kullaniciId || "misafir"}-${Date.now()}`;

    const istekVerisi = {
      locale: Iyzipay.LOCALE.TR,
      conversationId,
      price: PREMIUM_AYLIK_FIYAT,
      paidPrice: PREMIUM_AYLIK_FIYAT,
      currency: Iyzipay.CURRENCY.TRY,
      basketId: "premium-abonelik",
      // Kullanıcı ödemeyi iyzico'nun kendi güvenli sayfasında tamamlar (Ödeme Formu).
      callbackUrl: `${SITE_URL}/api/subscribe/callback`,
      enabledInstallments: [1],
      buyer: {
        id: kullaniciId || "misafir",
        name: "Kullanici",
        surname: "Zeka-Aynasi",
        gsmNumber: "+905000000000",
        email: "musteri@zeka-aynasi.app",
        identityNumber: "11111111111",
        registrationAddress: "Zeka Aynasi uygulamasi kullanicisi",
        ip: request.headers.get("x-forwarded-for") || "85.34.78.112",
        city: "Istanbul",
        country: "Turkey",
      },
      shippingAddress: {
        contactName: "Kullanici Zeka-Aynasi",
        city: "Istanbul",
        country: "Turkey",
        address: "Dijital urun - kargo yok",
      },
      billingAddress: {
        contactName: "Kullanici Zeka-Aynasi",
        city: "Istanbul",
        country: "Turkey",
        address: "Dijital urun - kargo yok",
      },
      basketItems: [
        {
          id: "premium-abonelik-1ay",
          name: "Zeka Aynasi Premium (1 Ay)",
          category1: "Yazilim",
          itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
          price: PREMIUM_AYLIK_FIYAT,
        },
      ],
    };

    const sonuc = await new Promise((resolve, reject) => {
      iyzipay.checkoutFormInitialize.create(istekVerisi, (hata, sonuc) => {
        if (hata) reject(hata);
        else resolve(sonuc);
      });
    });

    if (sonuc.status !== "success") {
      return NextResponse.json(
        { hata: sonuc.errorMessage || "Abonelik işlemi başlatılamadı." },
        { status: 500 }
      );
    }

    return NextResponse.json({ basarili: true, checkoutUrl: sonuc.paymentPageUrl });
  } catch (hata) {
    return NextResponse.json({ hata: "Abonelik işlemi başlatılamadı: " + hata.message }, { status: 500 });
  }
}
