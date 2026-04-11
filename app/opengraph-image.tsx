import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "OpenSpot — estudios de ubicación en España";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #fafafa 0%, #e0e7ff 45%, #c7d2fe 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#18181b",
            letterSpacing: "-0.04em",
          }}
        >
          OpenSpot
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 34,
            fontWeight: 600,
            color: "#3f3f46",
            lineHeight: 1.25,
            maxWidth: 920,
          }}
        >
          Dónde abrir tu negocio, con datos INE y análisis en toda España
        </div>
      </div>
    ),
    { ...size },
  );
}
