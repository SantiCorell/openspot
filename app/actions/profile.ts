"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(80),
  phone: z
    .string()
    .trim()
    .max(40)
    .optional()
    .transform((s) => (s === "" ? null : s)),
  company: z
    .string()
    .trim()
    .max(120)
    .optional()
    .transform((s) => (s === "" ? null : s)),
  bio: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((s) => (s === "" ? null : s)),
});

export type ProfileActionState =
  | { ok: true; message: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> };

export async function updateProfileAction(
  _prev: ProfileActionState | undefined,
  formData: FormData,
): Promise<ProfileActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, message: "Sesión no válida." };
  }

  const raw = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    company: formData.get("company"),
    bio: formData.get("bio"),
  };

  const parsed = profileSchema.safeParse({
    name: typeof raw.name === "string" ? raw.name : "",
    phone: typeof raw.phone === "string" ? raw.phone : "",
    company: typeof raw.company === "string" ? raw.company : "",
    bio: typeof raw.bio === "string" ? raw.bio : "",
  });

  if (!parsed.success) {
    const fe = parsed.error.flatten().fieldErrors;
    return {
      ok: false,
      message: "Revisa los campos marcados.",
      fieldErrors: fe as Record<string, string[]>,
    };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone,
      company: parsed.data.company,
      bio: parsed.data.bio,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/perfil");
  revalidatePath("/", "layout");

  return { ok: true, message: "Perfil actualizado correctamente." };
}
