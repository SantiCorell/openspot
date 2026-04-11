"use client";

import {
  LandingMunicipioShowdown,
  type ShowdownMunicipio,
} from "@/components/landing/LandingCharts";
import { LandingPopulationTrafficExplorer } from "@/components/landing/LandingPopulationTrafficExplorer";
import { ValenciaHeatmap } from "@/components/landing/ValenciaHeatmap";

type Props = {
  showdown: ShowdownMunicipio[];
};

/** Bloque pesado (mapa + Recharts) cargado en chunk aparte para mejor TBT/LCP en móvil. */
export function HomeBelowFoldDemo({ showdown }: Props) {
  return (
    <>
      <ValenciaHeatmap />
      <LandingPopulationTrafficExplorer municipalities={showdown} />
      <LandingMunicipioShowdown data={showdown} landingSimple />
    </>
  );
}
