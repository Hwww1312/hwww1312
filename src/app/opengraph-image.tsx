import { ImageResponse } from "next/og";
import { BUSINESS } from "@/data/siteContent";

export const alt = `${BUSINESS.name} - Khmer kitchen in ${BUSINESS.suburb}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Drawn at build time rather than shipped as a photograph: the same celadon
 * plate and fanned skewers as the hero, reduced to flat shapes that survive
 * the small crops social cards use.
 */
export default function OpengraphImage() {
  // Five skewers fanned across the plate, beef dark and pork light, the same
  // read as the hero. Each row is placed absolutely and rotated about its own
  // centre, because Satori has no SVG transform to lean on.
  const skewers = [
    { rotate: -13, top: 208, meat: "#5c2d18" },
    { rotate: -6.5, top: 262, meat: "#c99062" },
    { rotate: 0, top: 316, meat: "#69361d" },
    { rotate: 6.5, top: 370, meat: "#d39c72" },
    { rotate: 13, top: 424, meat: "#4e2614" },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#fbf6ec",
          color: "#16251f",
          position: "relative",
          overflow: "hidden",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* The plate, held fully inside the frame so no crop clips it. */}
        <div
          style={{
            position: "absolute",
            right: 24,
            top: 138,
            width: 552,
            height: 350,
            borderRadius: "50%",
            background: "#95ac9d",
            display: "flex",
          }}
        />
        {skewers.map(({ rotate, top, meat }, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              right: 40,
              top,
              width: 512,
              height: 30,
              display: "flex",
              alignItems: "center",
              transform: `rotate(${rotate}deg)`,
            }}
          >
            {/* the stick, running the full length behind the meat */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 13,
                width: 540,
                height: 5,
                borderRadius: 3,
                background: "#b8945a",
                display: "flex",
              }}
            />
            {[0, 1, 2, 3].map((j) => (
              <div
                key={j}
                style={{
                  position: "absolute",
                  left: 66 + j * 108,
                  width: 92,
                  height: 30,
                  borderRadius: 15,
                  background: meat,
                  display: "flex",
                }}
              />
            ))}
          </div>
        ))}

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 84px",
          }}
        >
          <div
            style={{
              fontSize: 26,
              letterSpacing: 8,
              textTransform: "uppercase",
              color: "#2a5a4c",
              display: "flex",
            }}
          >
            {BUSINESS.suburb}
          </div>
          <div style={{ fontSize: 96, lineHeight: 1.02, marginTop: 22, display: "flex" }}>
            {BUSINESS.name}
          </div>
          <div
            style={{
              fontSize: 32,
              marginTop: 26,
              color: "#47574d",
              maxWidth: 540,
              display: "flex",
            }}
          >
            A Khmer kitchen on Buckingham Avenue. Dine in or take away, from{" "}
            {BUSINESS.openingTime}.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
