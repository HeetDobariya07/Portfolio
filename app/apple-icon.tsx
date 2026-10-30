import { ImageResponse } from "next/og";

// iOS home-screen icon: the same Archivo ExtraBold "HD" (as vector paths) + papaya underline as app/icon.svg, full-bleed (iOS rounds it).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#0e0f11" }}>
      <svg width="180" height="180" viewBox="0 0 64 64" fill="none">
        <path transform="translate(11.04 36.99) scale(0.2617)" d="M25.40 0L7.50 0L7.50-68.70L25.40-68.70L25.40-42.30L53.30-42.30L53.30-68.70L71.20-68.70L71.20 0L53.30 0L53.30-27.70L25.40-27.70M117.90 0L89.20 0L89.20-68.70L117.90-68.70Q129.10-68.70 136.85-65Q144.60-61.30 148.65-53.75Q152.70-46.20 152.70-34.40Q152.70-22.70 148.65-15.05Q144.60-7.40 136.85-3.70Q129.10 0 117.90 0M107.10-54.70L107.10-14L117.70-14Q121.90-14 125-15.20Q128.10-16.40 130.20-18.70Q132.30-21 133.30-24.40Q134.30-27.80 134.30-32.20L134.30-36.40Q134.30-40.90 133.30-44.30Q132.30-47.70 130.20-50Q128.10-52.30 125-53.50Q121.90-54.70 117.70-54.70" fill="#ffffff" />
        <rect x="13.00" y="40.99" width="38.00" height="4" rx="2" fill="#ff7a1a" />
      </svg>
    </div>,
    size,
  );
}
