import { z } from "zod";

import { isBusinessType, type BusinessType } from "@/lib/types/analysis";

export const analyzeRequestSchema = z
  .object({
    city: z.string().min(2).max(120),
    budget: z.coerce.number().min(5_000).max(5_000_000),
    businessType: z.custom<BusinessType>(
      (v) => typeof v === "string" && isBusinessType(v),
      { message: "Tipo de negocio no válido" },
    ),
    studyName: z
      .string()
      .max(120)
      .optional()
      .transform((s) => (s?.trim() ? s.trim() : undefined)),
    pinLat: z.number().gte(-90).lte(90).optional(),
    pinLng: z.number().gte(-180).lte(180).optional(),
    pinRadiusM: z.coerce.number().min(80).max(5000).optional(),
  })
  .refine(
    (d) =>
      (d.pinLat == null && d.pinLng == null) ||
      (d.pinLat != null && d.pinLng != null),
    { message: "Coordenadas del pin incompletas", path: ["pinLat"] },
  );

export type AnalyzeRequestInput = z.infer<typeof analyzeRequestSchema>;
