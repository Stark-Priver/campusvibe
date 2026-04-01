import { ImageResponse } from "next/og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

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
          background: "#6C63FF",
          borderRadius: "7px",
        }}
      >
        <span
          style={{
            color: "white",
            fontSize: "18px",
            fontWeight: 900,
            fontFamily: "Arial Black, Arial",
            letterSpacing: "-1px",
          }}
        >
          CV
        </span>
      </div>
    ),
    { ...size }
  )
}
