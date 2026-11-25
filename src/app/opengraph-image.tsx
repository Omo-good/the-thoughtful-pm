import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/site-config";

export const alt = "The Thoughtful PM: building products with curiosity, clarity & care";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px", background: "#F7F3ED", color: "#1F1F1F" }}>
        <div style={{ display: "flex", fontSize: 30, letterSpacing: 4, textTransform: "uppercase", color: "#174C48" }}>{siteConfig.brandName}</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 76, lineHeight: 1.1 }}>
          <span>Building products with</span>
          <span style={{ color: "#174C48" }}>curiosity, clarity &amp; care.</span>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#77736E" }}>{siteConfig.professionalName} · Product Manager &amp; Consultant</div>
      </div>
    ),
    size,
  );
}
