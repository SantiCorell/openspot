import { z } from "zod";

import { isBusinessType, type BusinessType } from "@/lib/types/analysis";

export const compareZonesRequestSchema = z.object({
  municipalities: z
    .array(z.string().min(2).max(120))
    .min(2, "Mínimo 2 municipios")
    .max(6, "Máximo 6 municipios por comparación"),
  businessType: z
    .string()
    .refine((v): v is BusinessType => isBusinessType(v), "Tipo de negocio no válido"),
});

export type CompareZonesRequestInput = z.infer<typeof compareZonesRequestSchema>;
