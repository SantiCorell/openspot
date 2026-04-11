"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { CredentialsSignin } from "next-auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";

import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function signInGoogleAction() {
  await signIn("google", { redirectTo: "/dashboard" });
}

const signInPasswordSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export async function signInPasswordAction(
  _prev: { ok: false; message: string } | undefined,
  formData: FormData,
): Promise<{ ok: false; message: string } | undefined> {
  const parsed = signInPasswordSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { ok: false, message: "Introduce un email y una contraseña válidos." };
  }
  const email = parsed.data.email.toLowerCase();
  try {
    await signIn("credentials", {
      email,
      password: parsed.data.password,
      redirectTo: "/dashboard",
    });
  } catch (e) {
    if (isRedirectError(e)) throw e;
    if (e instanceof CredentialsSignin) {
      return { ok: false, message: "Email o contraseña incorrectos." };
    }
    throw e;
  }
}

const registerSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(128),
});

export async function registerAction(
  _prev: { ok: false; message: string } | undefined,
  formData: FormData,
): Promise<{ ok: false; message: string } | undefined> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return {
      ok: false,
      message:
        "Revisa los datos: nombre, email válido y contraseña de al menos 8 caracteres.",
    };
  }
  const { name, email, password } = parsed.data;
  const lower = email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email: lower } });
  if (existing) {
    return {
      ok: false,
      message: "Ya existe una cuenta con ese email. Inicia sesión o usa Google.",
    };
  }
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: lower,
        name,
        passwordHash,
        emailVerified: null,
      },
    });
    await tx.creditWallet.create({
      data: { userId: user.id, balance: 3 },
    });
  });

  try {
    await signIn("credentials", {
      email: lower,
      password,
      redirectTo: "/dashboard",
    });
  } catch (e) {
    if (isRedirectError(e)) throw e;
    redirect("/login?registered=1");
  }
}
