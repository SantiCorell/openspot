import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import type { AnalysisResult } from "@/lib/types/analysis";
import { BUSINESS_LABELS } from "@/lib/types/analysis";
import type { PdfAiSections } from "@/lib/services/aiAnalysisService";

const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 44,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1e1b4b",
  },
  headerBand: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: "#4f46e5",
  },
  brandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e7ff",
  },
  brand: {
    fontSize: 18,
    fontFamily: "Helvetica",
    fontWeight: "bold",
    color: "#312e81",
    letterSpacing: 0.5,
  },
  meta: {
    fontSize: 8,
    color: "#64748b",
    textAlign: "right",
    lineHeight: 1.4,
  },
  docTitle: {
    fontSize: 15,
    fontFamily: "Helvetica",
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 8,
    lineHeight: 1.35,
  },
  executive: {
    fontSize: 10.5,
    lineHeight: 1.55,
    color: "#334155",
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 8,
    fontFamily: "Helvetica",
    fontWeight: "bold",
    color: "#4f46e5",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 6,
    marginTop: 4,
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 4,
    paddingLeft: 2,
  },
  bulletDot: {
    width: 10,
    fontSize: 10,
    color: "#6366f1",
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    lineHeight: 1.45,
    color: "#475569",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginTop: 10,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  th: {
    fontSize: 7.5,
    fontFamily: "Helvetica",
    fontWeight: "bold",
    color: "#64748b",
    textTransform: "uppercase",
  },
  td: {
    fontSize: 9,
    color: "#334155",
  },
  col1: { width: "22%" },
  col2: { width: "12%" },
  col3: { width: "12%" },
  col4: { width: "18%" },
  col5: { width: "18%" },
  col6: { width: "18%" },
  tdSmall: {
    fontSize: 7.5,
    color: "#334155",
  },
  summaryBox: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "#f8fafc",
    borderLeftWidth: 3,
    borderLeftColor: "#4f46e5",
    borderRadius: 2,
  },
  summaryText: {
    fontSize: 9,
    lineHeight: 1.5,
    color: "#475569",
  },
  footer: {
    marginTop: 18,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    fontSize: 8,
    color: "#94a3b8",
    lineHeight: 1.45,
  },
  pageNum: {
    position: "absolute",
    bottom: 28,
    right: 44,
    fontSize: 8,
    color: "#94a3b8",
  },
});

type Props = {
  result: AnalysisResult;
  ai: PdfAiSections;
  studyTitle: string | null;
  exportedAtLabel: string;
};

export function AnalysisPdfDocument({
  result,
  ai,
  studyTitle,
  exportedAtLabel,
}: Props) {
  const sector = BUSINESS_LABELS[result.businessType];
  const headline =
    studyTitle?.trim() ||
    ai.executiveTitle ||
    `Informe — ${result.city}`;
  const ci = result.competitionInsight;

  return (
    <Document
      title={headline}
      author="OpenSpot"
      subject={`${result.city} · ${sector}`}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.headerBand} fixed />
        <View style={styles.brandRow}>
          <Text style={styles.brand}>OpenSpot</Text>
          <View>
            <Text style={styles.meta}>
              {exportedAtLabel}
              {"\n"}
              {result.city} · INE {result.ineMunicipioCode} · Padrón{" "}
              {result.ineYear}: {result.padronPopulation.toLocaleString("es-ES")}{" "}
              hab.
            </Text>
          </View>
        </View>

        <Text style={styles.docTitle}>{headline}</Text>
        <Text style={styles.executive}>{ai.executiveBody}</Text>

        <Text style={styles.sectionLabel}>Indicadores clave</Text>
        {ai.keyPoints.map((line, i) => (
          <View key={i} style={styles.bullet} wrap={false}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>{line}</Text>
          </View>
        ))}

        <Text style={styles.sectionLabel}>Contexto del estudio</Text>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>
            Sector: {sector}. Presupuesto referencia:{" "}
            {Math.round(result.budget).toLocaleString("es-ES")} €. Competencia
            municipal (modelo): {result.competitionLevel}.{" "}
            {ci
              ? ` Lectura población/competencia: ${ci.saturationVerdict.replace(/_/g, " ")}; ~${ci.avgCompetitorsPerZone.toLocaleString("es-ES", { maximumFractionDigits: 1 })} competidores/microzona (media); ~${ci.inhabitantsPerAvgCompetitor.toLocaleString("es-ES")} hab./unidad competitiva media. `
              : ""}
            {result.osmPinAnalysis
              ? `Pin OSM: ${result.osmPinAnalysis.osmNodeCount} nodos en radio ${result.osmPinAnalysis.radiusMeters} m (${result.osmPinAnalysis.tagsQueried}). `
              : ""}
          </Text>
        </View>

        {ci ? (
          <>
            <Text style={styles.sectionLabel}>Competencia por zona y padrón</Text>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryText}>{ci.narrative}</Text>
            </View>
          </>
        ) : null}

        <Text style={styles.sectionLabel}>Zonas priorizadas (métricas modelo)</Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.th, styles.col1]}>Zona</Text>
          <Text style={[styles.th, styles.col2]}>Comp.</Text>
          <Text style={[styles.th, styles.col3]}>Recom.</Text>
          <Text style={[styles.th, styles.col4]}>Ing. med./mes</Text>
          <Text style={[styles.th, styles.col5]}>Costes/mes</Text>
          <Text style={[styles.th, styles.col6]}>Satur.</Text>
        </View>
        {result.bestAreas.map((z) => (
          <View key={z.id} style={styles.tableRow} wrap={false}>
            <Text style={[styles.tdSmall, styles.col1]}>{z.name}</Text>
            <Text style={[styles.tdSmall, styles.col2]}>
              ~{Math.round(z.competitorCount ?? 0)}
            </Text>
            <Text style={[styles.tdSmall, styles.col3]}>
              {z.recommendationScore}
            </Text>
            <Text style={[styles.tdSmall, styles.col4]}>
              {z.revenue.monthlyMid.toLocaleString("es-ES")} €
            </Text>
            <Text style={[styles.tdSmall, styles.col5]}>
              {z.costs.totalMonthly.toLocaleString("es-ES")} €
            </Text>
            <Text style={[styles.tdSmall, styles.col6]}>{z.saturationScore}</Text>
          </View>
        ))}

        <Text style={styles.sectionLabel}>Glosario (lectura del cuadro)</Text>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>
            Ing. mediano/mes: ingreso mensual medio estimado del negocio en la microzona (no
            facturación garantizada). Costes/mes: coste operativo mensual modelo (alquiler,
            personal aprox., cargas). Satur.: presión por competidores 0–100. Recom.: puntuación
            compuesta rentabilidad/competencia/saturación. Compet.: competidores modelados en la
            microzona (estimación).
          </Text>
        </View>

        <Text style={styles.sectionLabel}>Síntesis analítica</Text>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>{result.summary}</Text>
        </View>

        <Text style={styles.sectionLabel}>Recomendación orientativa</Text>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>
            {ci?.recommendReason ??
              "Contrasta con visitas comerciales y, si procede, repite el estudio en otra ubicación para comparar población frente a competencia antes de invertir."}{" "}
            Puedes generar un nuevo informe en la aplicación (ruta /analyze).
          </Text>
        </View>

        <Text style={styles.footer}>{ai.closingNote}</Text>
        <Text style={styles.footer}>
          Locales tipo Idealista: función próximamente. OpenStreetMap © colaboradores ODbL. Datos
          OpenSpot: estimaciones orientativas del producto.
        </Text>
        <Text
          style={styles.pageNum}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}
