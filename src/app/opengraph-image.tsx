import { ImageResponse } from "next/og";
import { BUSINESS } from "@/data/siteContent";

export const alt = `${BUSINESS.name} - Khmer kitchen in ${BUSINESS.suburb}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Drawn at build time rather than shipped as a photograph: the same bowl of
 * fish curry noodle soup as the hero, reduced to flat shapes that survive the
 * small crops social cards use, on the same dark ground as the page.
 */
export default function OpengraphImage() {
  // The garnishes, laid over the curry at the angles they settle at in the
  // modelled dish. Each is placed absolutely and rotated about its own centre,
  // because Satori has no SVG transform to lean on.
  const garnish = [
    { left: 92, top: 96, w: 150, h: 30, rotate: -17, color: "#4f7d33" },
    { left: 254, top: 74, w: 138, h: 28, rotate: 24, color: "#4f7d33" },
    { left: 60, top: 176, w: 128, h: 22, rotate: 7, color: "#efe9d8" },
    { left: 190, top: 206, w: 146, h: 24, rotate: -6, color: "#d5e5ab" },
    { left: 316, top: 168, w: 112, h: 22, rotate: 15, color: "#bf3319" },
    { left: 148, top: 40, w: 92, h: 26, rotate: -32, color: "#43843b" },
    { left: 286, top: 30, w: 84, h: 24, rotate: 20, color: "#43843b" },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#100d0b",
          color: "#f4ebdd",
          position: "relative",
          overflow: "hidden",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* The pool of warm light the bowl floats in. */}
        <div
          style={{
            position: "absolute",
            right: -60,
            top: -110,
            width: 860,
            height: 860,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(230,165,66,0.22) 0%, rgba(176,96,32,0.09) 42%, rgba(16,13,11,0) 70%)",
            display: "flex",
          }}
        />

        {/* The bowl, held fully inside the frame so no crop clips it. */}
        <div
          style={{
            position: "absolute",
            right: 42,
            top: 132,
            width: 528,
            height: 340,
            borderRadius: "50%",
            background: "#e9e1d2",
            display: "flex",
          }}
        />
        {/* The curry. */}
        <div
          style={{
            position: "absolute",
            right: 76,
            top: 158,
            width: 460,
            height: 288,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 36% 28%, #f6bc55 0%, #d8952a 52%, #8f5711 100%)",
            display: "flex",
          }}
        />
        {/* And what is laid over it. */}
        <div
          style={{
            position: "absolute",
            right: 76,
            top: 158,
            width: 460,
            height: 288,
            display: "flex",
          }}
        >
          {garnish.map((g, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: g.left,
                top: g.top,
                width: g.w,
                height: g.h,
                borderRadius: g.h / 2,
                background: g.color,
                transform: `rotate(${g.rotate}deg)`,
                display: "flex",
              }}
            />
          ))}
        </div>

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
              color: "#e6a542",
              display: "flex",
            }}
          >
            {BUSINESS.suburb}
          </div>
          <div
            style={{
              fontSize: 104,
              lineHeight: 1,
              marginTop: 22,
              textTransform: "uppercase",
              letterSpacing: -2,
              display: "flex",
            }}
          >
            A taste of
          </div>
          <div
            style={{
              fontSize: 104,
              lineHeight: 1,
              textTransform: "uppercase",
              letterSpacing: -2,
              display: "flex",
            }}
          >
            Cambodia.
          </div>
          <div
            style={{
              fontSize: 30,
              marginTop: 28,
              color: "#b0a291",
              maxWidth: 520,
              display: "flex",
            }}
          >
            {BUSINESS.name}, Buckingham Avenue. Dine in or take away, from{" "}
            {BUSINESS.openingTime}.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
