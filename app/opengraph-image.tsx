import { ImageResponse } from "next/og";
import { profile } from "@/lib/content";

export const alt = `${profile.name}: ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#0c0a09",
        color: "#faf6f1",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, color: "#d6ccc2" }}>
        <div style={{ width: 14, height: 14, borderRadius: 999, background: "#ff5a52" }} />
        {profile.headline}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -3 }}>{profile.name}</div>
        <div style={{ fontSize: 30, color: "#ff5a52", letterSpacing: 8, marginTop: 8 }}>
          {profile.role.toUpperCase()}
        </div>
        <div style={{ fontSize: 30, color: "#d6ccc2", marginTop: 28, maxWidth: 900 }}>{profile.pitch}</div>
      </div>
      <div style={{ display: "flex", height: 10, borderRadius: 999, background: "#211b18", overflow: "hidden" }}>
        <div style={{ width: "82%", background: "linear-gradient(90deg, #d6ccc2, #faf6f1 60%, #ff5a52)" }} />
      </div>
    </div>,
    size,
  );
}
