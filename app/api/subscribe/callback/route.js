import { NextResponse } from "next/server";

export async function POST(request) {
  const SITE_URL = process.env.SITE_URL || "";
  return NextResponse.redirect(`${SITE_URL}/abonelik?iptal=1`);
}
