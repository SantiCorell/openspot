import { readFile } from "fs/promises";
import path from "path";

export interface IneMunicipioRecord {
  n: string;
  c: string;
  p: number;
  y: number;
}

let cache: IneMunicipioRecord[] | null = null;

export async function loadMunicipios(): Promise<IneMunicipioRecord[]> {
  if (cache) return cache;
  const fp = path.join(process.cwd(), "lib/data/ine-municipios-padron.json");
  const raw = await readFile(fp, "utf-8");
  cache = JSON.parse(raw) as IneMunicipioRecord[];
  return cache;
}

export function normalizeMunicipioQuery(q: string): string {
  return q
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export async function searchMunicipios(
  query: string,
  limit = 25,
): Promise<IneMunicipioRecord[]> {
  const qn = normalizeMunicipioQuery(query);
  if (qn.length < 2) return [];
  const all = await loadMunicipios();
  const starts: IneMunicipioRecord[] = [];
  const includes: IneMunicipioRecord[] = [];
  for (const m of all) {
    const mn = normalizeMunicipioQuery(m.n);
    if (mn.startsWith(qn)) starts.push(m);
    else if (mn.includes(qn)) includes.push(m);
    if (starts.length >= limit) break;
  }
  const merged = [...starts, ...includes];
  return merged.slice(0, limit);
}

export async function findMunicipioExact(
  name: string,
): Promise<IneMunicipioRecord | undefined> {
  const qn = normalizeMunicipioQuery(name);
  const all = await loadMunicipios();
  return all.find((m) => normalizeMunicipioQuery(m.n) === qn);
}

export async function findMunicipioBest(
  name: string,
): Promise<IneMunicipioRecord | undefined> {
  const exact = await findMunicipioExact(name);
  if (exact) return exact;
  const hits = await searchMunicipios(name, 1);
  return hits[0];
}
