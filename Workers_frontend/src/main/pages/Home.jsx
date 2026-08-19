import { useState } from "react";

// ---------------------------------------------------------------------------
// Design tokens — Modern Industrial / Utility palette
// Dark mode mirrors the light mode's restraint instead of inverting to
// pure black/white, so neither mode is harsher than the other.
// ---------------------------------------------------------------------------
const THEME = {
  light: {
    bg: "#EDECE7",       // Slightly deeper putty — less glare than stark white
    surface: "#2F363F",  // Slate Gray (containers)
    text: "#33383D",     // Softened charcoal — lower contrast than near-black
    onSurface: "#F4F3EF",
    accent: "#E85F2C",   // Slightly deepened Safety Orange — less searing on light bg
    accentText: "#1A1D20",
    border: "#D1D5DB",   // Steel Line
    muted: "#6B7280",
  },
  dark: {
    bg: "#1E2124",       // Graphite, not pure black
    surface: "#2A2F35",
    text: "#E4E2DC",     // Warm off-white, not pure white
    onSurface: "#E4E2DC",
    accent: "#FF8659",   // Softened Safety Orange
    accentText: "#1A1D20",
    border: "#3A4048",
    muted: "#8A9099",
  },
};

const FEATURES = [
  {
    code: "W-01",
    title: "Find Workers",
    desc: "Browse verified profiles by trade, rating, and availability. Filter by job type and location.",
  },
  {
    code: "W-02",
    title: "Post a Job",
    desc: "List the work, set your budget, and get matched with workers ready to start.",
  },
  {
    code: "W-03",
    title: "Track Progress",
    desc: "See job status at a glance — open, in progress, or complete. No surprises.",
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
        @media (prefers-reduced-motion: reduce) {
          .wd-btn, .wd-card, .wd-switch-knob { transition: none !important; }
        }
      `}</style>

      {/* ---------------------------------------------------------------- */}
      {/* Header / ticket stub                                             */}
      {/* ---------------------------------------------------------------- */}
      <header
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "28px 24px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 28,
                height: 28,
                background: t.surface,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ width: 10, height: 10, background: t.accent }} />
            </div>
            <span className="wd-display" style={{ fontSize: 18, fontWeight: 800, letterSpacing: "0.02em" }}>
              WORTERSDEN
            </span>
          </div>

          {/* Rocker-style theme switch — tactile, matches worker/industrial feel */}
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

        {/* Status line — real indicator, not decoration */}
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
          STATUS: OPEN &nbsp;·&nbsp; 3 ACTIVE MODULES
        </div>

        {/* Perforated divider — ticket tear line */}
        <div
          style={{
            marginTop: 16,
            borderTop: `1px dashed ${t.border}`,
          }}
        />
      </header>

      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                             */}
      {/* ---------------------------------------------------------------- */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px 8px" }}>
        <h1
          className="wd-display"
          style={{
            fontSize: "clamp(28px, 5vw, 40px)",
            fontWeight: 800,
            lineHeight: 1.15,
            margin: 0,
            maxWidth: 560,
          }}
        >
          Work orders, handled like paperwork should be — clean and fast.
        </h1>
        <p
          style={{
            marginTop: 14,
            fontSize: 15,
            lineHeight: 1.6,
            color: t.muted,
            maxWidth: 480,
          }}
        >
          Post a job, find a worker, track it through to done. No clutter, no noise —
          built for people who check this screen every day.
        </p>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Feature blocks — work-order cards                                */}
      {/* ---------------------------------------------------------------- */}
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
            style={{
              border: `1px solid ${t.border}`,
              padding: "20px 18px",
              background: "transparent",
            }}
          >
            <div
              className="wd-mono"
              style={{
                fontSize: 11,
                letterSpacing: "0.06em",
                color: t.accent,
                marginBottom: 10,
              }}
            >
              {f.code}
            </div>
            <h3
              className="wd-display"
              style={{ fontSize: 17, fontWeight: 700, margin: "0 0 8px" }}
            >
              {f.title}
            </h3>
            <p style={{ fontSize: 13.5, lineHeight: 1.55, color: t.muted, margin: 0 }}>
              {f.desc}
            </p>
          </div>
        ))}
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* CTA — the one place accent color does real work                  */}
      {/* ---------------------------------------------------------------- */}
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