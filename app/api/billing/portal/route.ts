import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { siteBaseUrl } from "@/lib/seo/siteBaseUrl";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  if (!stripe) {
    return NextResponse.json(
      { ok: false, error: "Stripe no está configurado en el servidor." },
      { status: 503 },
    );
  }

  const sub = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (!sub?.stripeCustomerId) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Aún no hay cliente de pago vinculado. Contrata un plan desde Precios para activar el portal.",
      },
      { status: 400 },
    );
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: sub.stripeCustomerId,
    return_url: `${siteBaseUrl()}/dashboard/facturacion`,
  });

  return NextResponse.json({ ok: true, url: portal.url });
}
