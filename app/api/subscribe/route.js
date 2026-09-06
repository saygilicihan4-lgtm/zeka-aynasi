export async function POST(request) {
  return Response.json(
    { error: "Odeme sistemi su anda bakimda, kisa sure sonra aktif olacak." },
    { status: 503 }
  );
}
