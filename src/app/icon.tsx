import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 30% 30%, #38bdf8, #0f172a 70%)",
          borderRadius: 16,
          fontSize: 38,
          color: "#f8fafc",
          fontWeight: 700,
          letterSpacing: "-0.08em",
          fontFamily: "Inter, 'Segoe UI', sans-serif",
        }}
      >
        V
      </div>
    ),
    {
      ...size,
    },
  );
}
