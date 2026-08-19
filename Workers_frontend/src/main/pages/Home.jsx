import { useState } from "react";

const THEME = {
  light: {
    bg: "#E3E1DB",
    surface: "#2F363F",
    text: "#3A3F44",
    onSurface: "#F4F3EF",
    accent: "#E85F2C",
    accentText: "#1A1D20",
    border: "#C9CDD2",
    muted: "#6B7280",
  },
  dark: {
    bg: "#141A21",
    surface: "#1E2731",
    text: "#D7DEE4",
    onSurface: "#D7DEE4",
    accent: "#5B8DEF",
    accentText: "#0F1620",
    border: "#2C3844",
    muted: "#7C8A99",
  },
};

const FEATURES = [
  {
    code: "W-01",
    title: "Find Workers",
    desc: "Browse verified profiles by trade, rating, and availability. Filter by job type and location.",
    icon: (color) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.1-3.1a4 4 0 0 1-5.1 5.1L6.3 20.7a1.5 1.5 0 0 1-2.1-2.1l9.4-9.4a4 4 0 0 1 5.1-5.1l-3.1 3.1z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    code: "W-02",
    title: "Post a Job",
    desc: "List the work, set your budget, and get matched with workers ready to start.",
    icon: (color) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <rect x="5" y="4" width="14" height="17" rx="1" />
        <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M9 11h6M9 15h6M9 19h3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    code: "W-03",
    title: "Track Progress",
    desc: "See job status update from open to closed out — no chasing people for updates.",
    icon: (color) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function Home() {
  const [mode, setMode] = useState("light");
  const t = THEME[mode];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: t.bg,
        color: t.text,
        fontFamily: "'Inter', system-ui, sans-serif",
        transition: "background 150ms ease, color 150ms ease",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@700;800&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        .wd-mono { font-family: 'IBM Plex Mono', monospace; }
        .wd-display { font-family: 'Archivo', system-ui, sans-serif; }
        .wd-btn { transition: background 150ms ease, transform 80ms ease; }
        .wd-btn:active { transform: translateY(1px); }
        .wd-card { transition: border-color 150ms ease; }
        .wd-switch-knob { transition: transform 150ms ease; }
        .wd-grain { position: relative; }
        .wd-grain::after {
          content: "";
          position: absolute;
          inset: 0;
          opacity: 0.05;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
        @media (prefers-reduced-motion: reduce) {
          .wd-btn, .wd-card, .wd-switch-knob { transition: none !important; }
        }
      `}</style>

      <header style={{ maxWidth: 960, margin: "0 auto", padding: "28px 24px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              className="wd-grain"
              style={{
                width: 28,
                height: 28,
                background: t.surface,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <div style={{ width: 10, height: 10, background: t.accent }} />
            </div>
            <span className="wd-display" style={{ fontSize: 18, fontWeight: 800, letterSpacing: "0.02em" }}>
              WORTERSDEN
            </span>
          </div>

          <button
            onClick={() => setMode(mode === "light" ? "dark" : "light")}
            aria-label="Toggle color mode"
            className="wd-mono wd-btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "transparent",
              border: `1px solid ${t.border}`,
              padding: "6px 10px",
              cursor: "pointer",
              color: t.text,
              fontSize: 11,
              letterSpacing: "0.06em",
            }}
          >
            <span>{mode === "light" ? "LIGHT" : "DARK"}</span>
            <span
              style={{
                position: "relative",
                width: 32,
                height: 16,
                background: t.border,
                display: "inline-block",
              }}
            >
              <span
                className="wd-switch-knob"
                style={{
                  position: "absolute",
                  top: 2,
                  left: 2,
                  width: 12,
                  height: 12,
                  background: t.accent,
                  transform: mode === "dark" ? "translateX(16px)" : "translateX(0)",
                }}
              />
            </span>
          </button>
        </div>

        <div
          className="wd-mono"
          style={{
            marginTop: 20,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 11,
            letterSpacing: "0.06em",
            color: t.muted,
          }}
        >
          <span style={{ width: 6, height: 6, background: t.accent, display: "inline-block" }} />
          STATUS: OPEN &nbsp;·&nbsp; 3 JOBS ON THE BOARD
        </div>

        <div style={{ marginTop: 16, borderTop: `1px dashed ${t.border}` }} />
      </header>

      <section style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px 8px" }}>
        <h1
          className="wd-display"
          style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 800, lineHeight: 1.15, margin: 0, maxWidth: 560 }}
        >
          Post the job. Find the worker. Get it closed out.
        </h1>
        <p style={{ marginTop: 14, fontSize: 15, lineHeight: 1.6, color: t.muted, maxWidth: 480 }}>
          No clutter, no chasing people for updates. Built for a screen you'll
          check every day, not once a quarter.
        </p>
      </section>

      <section
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "24px 24px 0",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
        }}
      >
        {FEATURES.map((f) => (
          <div
            key={f.code}
            className="wd-card"
            style={{ border: `1px solid ${t.border}`, padding: "20px 18px", background: "transparent" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              {f.icon(t.text)}
              <span className="wd-mono" style={{ fontSize: 11, letterSpacing: "0.06em", color: t.accent }}>
                {f.code}
              </span>
            </div>
            <h3 className="wd-display" style={{ fontSize: 17, fontWeight: 700, margin: "0 0 8px" }}>
              {f.title}
            </h3>
            <p style={{ fontSize: 13.5, lineHeight: 1.55, color: t.muted, margin: 0 }}>{f.desc}</p>
          </div>
        ))}
      </section>

      <section
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "36px 24px 64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          borderTop: `1px solid ${t.border}`,
          marginTop: 32,
        }}
      >
        <div>
          <div className="wd-mono" style={{ fontSize: 11, color: t.muted, letterSpacing: "0.06em" }}>
            NEED SOMETHING BUILT?
          </div>
          <div className="wd-display" style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>
            Get in touch and we'll match you today.
          </div>
        </div>
        <button
          className="wd-btn"
          style={{
            background: t.accent,
            color: t.accentText,
            border: "none",
            padding: "14px 28px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
        >
          Get in Touch
        </button>
      </section>
    </div>
  );
}