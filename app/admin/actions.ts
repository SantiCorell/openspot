"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/admin/isAdmin";
import { prisma } from "@/lib/prisma";

export async function markInvoiceRequestFulfilled(id: string): Promise<{ ok: boolean }> {
  const s = await auth();
  if (!isAdminEmail(s?.user?.email)) {
    return { ok: false };
  }
  await prisma.invoiceRequest.update({
    where: { id },
    data: { status: "fulfilled" },
  });
  revalidatePath("/admin");
  return { ok: true };
}
