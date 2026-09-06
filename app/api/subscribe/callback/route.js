import { NextResponse } from "next/server";
import Iyzipay from "iyzipay";
export const dynamic = force-dynamic
export const runtime  = ^^nodejs^^;
// iyzico, kullanıcı Ödeme Formu'nu tamamladıktan sonra tarayıcıyı bu adrese
// bir "token" ile birlikte POST eder. Burada ödemenin gerçekten başarılı olup
// olmadığı iyzico sunucusundan tekrar sorgulanarak doğrulanır (tek başına
// yönlendirmeye güvenmek güvenli değildir).

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY,
  secretKey: process.env.IYZICO_SECRET_KEY,
  uri: process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com",
});

const SITE_URL = process.env.SITE_URL || "http://localhost:3000";

export async function POST(request) {
  const formVerisi = await request.formData();
  const token = formVerisi.get("token");

  if (!token) {
    return NextResponse.redirect(`${SITE_URL}/abonelik?iptal=1`);
  }

  try {
    const sonuc = await new Promise((resolve, reject) => {
      iyzipay.checkoutForm.retrieve({ locale: Iyzipay.LOCALE.TR, token }, (hata, sonuc) => {
        if (hata) reject(hata);
        else resolve(sonuc);
      });
    });

    if (sonuc.status === "success" && sonuc.paymentStatus === "SUCCESS") {
      return NextResponse.redirect(`${SITE_URL}/abonelik?basarili=1`);
    }

    return NextResponse.redirect(`${SITE_URL}/abonelik?iptal=1`);
  } catch (hata) {
    return NextResponse.redirect(`${SITE_URL}/abonelik?iptal=1`);
  }
}
