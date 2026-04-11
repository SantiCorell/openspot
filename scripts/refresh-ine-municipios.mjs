#!/usr/bin/env node
/**
 * Regenera lib/data/ine-municipios-padron.json desde el servicio oficial INE (tabla 29005).
 * Uso: node scripts/refresh-ine-municipios.mjs
 */
import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const url =
  "https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/29005?nult=1&tip=AM";

https
  .get(url, (r) => {
    let d = "";
    r.on("data", (c) => (d += c));
    r.on("end", () => {
      const arr = JSON.parse(d);
      const out = [];
      for (const row of arr) {
        const md = row.MetaData || [];
        const mun = md.find((m) => m.T3_Variable === "Municipios");
        const sex = md.find((m) => m.T3_Variable === "Sexo");
        if (!mun || sex?.Codigo !== "0") continue;
        const data = row.Data || [];
        const last = [...data].sort((a, b) => b.Anyo - a.Anyo)[0];
        if (last)
          out.push({
            n: mun.Nombre,
            c: mun.Codigo,
            p: Math.round(last.Valor),
            y: last.Anyo,
          });
      }
      const target = path.join(
        __dirname,
        "..",
        "lib/data/ine-municipios-padron.json",
      );
      fs.writeFileSync(target, JSON.stringify(out));
      console.log("OK", out.length, "municipios →", target);
    });
  })
  .on("error", (e) => {
    console.error(e);
    process.exit(1);
  });
