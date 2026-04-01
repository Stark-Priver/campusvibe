import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#6C63FF",
          borderRadius: "40px",
        }}
      >
        <span
          style={{
            color: "white",
            fontSize: "96px",
            fontWeight: 900,
            fontFamily: "Arial Black, Arial",
            letterSpacing: "-4px",
          }}
        >
          CV
        </span>
      </div>
    ),
    { ...size }
  )
}
