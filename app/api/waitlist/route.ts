import { NextResponse } from "next/server";
import { validateWaitlist } from "@/lib/waitlist/shared";
import { joinWaitlist } from "@/lib/waitlist/server";

/**
 * POST /api/waitlist — "Çıkınca haber ver" / "Şehrime gelince haber ver".
 *
 * Yanıt gövdesi yalnız sonuç türünü taşır; e-posta hiçbir yanıtta, başlıkta
 * veya log satırında geri yansıtılmaz. Aynı e-posta ikinci kez gelirse yine
 * `ok: true` döner: "bu adres zaten listede" demek, listede kimin olduğunu
 * dışarıya sızdırmak olurdu.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid", field: "email" }, { status: 400 });
  }

  // Bal küpü: insanlar görmez, basit botlar doldurur. Bota başarı gösterilir
  // ki alanı atlamayı öğrenmesin; hiçbir şey yazılmaz.
  const trap = (body as Record<string, unknown> | null)?.website;
  if (typeof trap === "string" && trap.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const parsed = validateWaitlist(body);
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, error: "invalid", field: parsed.field }, { status: 400 });
  }

  const result = await joinWaitlist(parsed.value);
  if (result.ok) return NextResponse.json({ ok: true });

  const status =
    result.reason === "not_configured" || result.reason === "rpc_missing"
      ? 503
      : result.reason === "rejected"
        ? 400
        : 502;
  // Sebep görünür kalır (sessiz fallback yasak) ama kişisel veri taşımaz.
  return NextResponse.json({ ok: false, error: result.reason }, { status });
}
