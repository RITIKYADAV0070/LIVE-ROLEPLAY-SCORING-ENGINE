import { useEffect, useState } from "react";

export default function Home() {
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // dark mode + history
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState([]); // [{ id, score, snippet, createdAt, transcript, result }]

  const sample = `Hi, I'm Ritik. I built an AI-powered real estate valuation tool 
focused on Gurugram micro-markets. It combines property listings, 
renovation cost adjustments, and comparable sales to generate 
reliable price estimates.`;

  // Load theme + history from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedTheme = window.localStorage.getItem("ps_theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
    }

    const savedHistory = window.localStorage.getItem("ps_history");
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) setHistory(parsed);
      } catch {
        // ignore parse error
      }
    }
  }, []);

  // Persist theme
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("ps_theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Persist history whenever it changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("ps_history", JSON.stringify(history));
  }, [history]);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });

      const data = await res.json();
      if (!data.ok) {
        setError(data.error);
      } else {
        setResult(data.result);

        // create history entry (keep max 5)
        const now = new Date();
        const snippet =
          transcript.length > 40
            ? transcript.slice(0, 40).replace(/\s+/g, " ") + "..."
            : transcript.replace(/\s+/g, " ");
        const entry = {
          id: Date.now(),
          score: data.result.score,
          createdAt: now.toLocaleTimeString(),
          snippet,
          transcript,
          result: data.result,
        };
        setHistory((prev) => [entry, ...prev].slice(0, 5));
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  function loadFromHistory(entry) {
    setTranscript(entry.transcript);
    setResult(entry.result);
    setError(null);
  }

  // ---------- THEME COLORS ----------
  const colors = darkMode
    ? {
        pageBg: "#020617",
        sidebarBg: "#020617",
        sidebarText: "#E5E7EB",
        mainBg: "#020617",
        cardBg: "#0F172A",
        cardBorder: "#1F2937",
        heading: "#F9FAFB",
        bodyText: "#E5E7EB",
        mutedText: "#9CA3AF",
        buttonPrimary: "#4F46E5",
        buttonSecondary: "#1F2937",
        inputBg: "#020617",
        inputBorder: "#1F2937",
        inputText: "#F9FAFB",
      }
    : {
        pageBg: "#F1F5F9",
        sidebarBg: "#0F172A",
        sidebarText: "#FFFFFF",
        mainBg: "#F1F5F9",
        cardBg: "#FFFFFF",
        cardBorder: "#D1D5DB",
        heading: "#0F172A",
        bodyText: "#111827",
        mutedText: "#475569",
        buttonPrimary: "#2563EB",
        buttonSecondary: "#E2E8F0",
        inputBg: "#F8FAFC",
        inputBorder: "#CBD5E1",
        inputText: "#0F172A",
      };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: colors.pageBg,
        color: colors.bodyText,
      }}
    >
      {/* ---------------- SIDEBAR ---------------- */}
      <aside
        style={{
          width: 250,
          background: colors.sidebarBg,
          color: colors.sidebarText,
          padding: 20,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 style={{ marginTop: 0, fontSize: 20, fontWeight: 700 }}>PitchSense</h2>

        <div
          style={{
            marginTop: 24,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            fontSize: 15,
          }}
        >
          <span>📊 Dashboard</span>
          <span style={{ fontWeight: 600 }}>📝 Evaluate Pitch</span>
          <span>📈 Metrics</span>
          <span>⚙ Settings</span>
        </div>

        {/* Recent evaluations */}
        <div style={{ marginTop: 30 }}>
          <h4 style={{ fontSize: 13, marginBottom: 8 }}>Recent evaluations</h4>
          {history.length === 0 && (
            <p style={{ fontSize: 12, opacity: 0.7 }}>No evaluations yet.</p>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => loadFromHistory(item)}
                style={{
                  textAlign: "left",
                  border: "none",
                  borderRadius: 6,
                  padding: "6px 8px",
                  fontSize: 12,
                  cursor: "pointer",
                  background: "rgba(15,23,42,0.6)",
                  color: "#E5E7EB",
                }}
              >
                <div>
                  <strong>Score:</strong> {item.score}
                </div>
                <div style={{ opacity: 0.8 }}>{item.snippet}</div>
                <div style={{ opacity: 0.6 }}>at {item.createdAt}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "auto", fontSize: 13, opacity: 0.7 }}>
          © {new Date().getFullYear()} Ritik
        </div>
      </aside>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <main
        style={{
          flex: 1,
          padding: 30,
          background: colors.mainBg,
        }}
      >
        {/* Top bar with title + dark mode toggle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 24,
                fontWeight: 700,
                color: colors.heading,
              }}
            >
              LIVE ROLEPLAY SCORING ENGINE
            </h1>
            <p style={{ marginTop: 4, color: colors.mutedText }}>
              Paste your pitch and get quick AI feedback.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setDarkMode((m) => !m)}
            style={{
              borderRadius: 999,
              border: `1px solid ${colors.cardBorder}`,
              padding: "6px 14px",
              fontSize: 13,
              cursor: "pointer",
              background: colors.cardBg,
              color: colors.bodyText,
            }}
          >
            {darkMode ? "☀ Light mode" : "🌙 Dark mode"}
          </button>
        </div>

        {/* Form + Results row */}
        <div
          style={{
            display: "flex",
            gap: 20,
            marginTop: 24,
            alignItems: "flex-start",
          }}
        >
          {/* ------------ LEFT: INPUT PANEL ------------ */}
          <div
            style={{
              flex: 1,
              background: colors.cardBg,
              padding: 20,
              borderRadius: 10,
              border: `1px solid ${colors.cardBorder}`,
              boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
            }}
          >
            <h3
              style={{
                margin: 0,
                marginBottom: 12,
                fontSize: 18,
                fontWeight: 600,
                color: colors.heading,
              }}
            >
              Enter Pitch Transcript
            </h3>

            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={10}
              placeholder="Write or paste your pitch here..."
              style={{
                width: "100%",
                fontSize: 15,
                padding: 12,
                borderRadius: 8,
                border: `1px solid ${colors.inputBorder}`,
                background: colors.inputBg,
                color: colors.inputText,
                lineHeight: 1.5,
                outline: "none",
              }}
            />

            <div style={{ marginTop: 15, display: "flex", gap: 10 }}>
              <button
                disabled={loading}
                onClick={submit}
                style={{
                  background: colors.buttonPrimary,
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontWeight: 500,
                  opacity: loading ? 0.8 : 1,
                }}
              >
                {loading ? "Evaluating..." : "Evaluate"}
              </button>

              <button
                type="button"
                onClick={() => setTranscript(sample)}
                style={{
                  padding: "10px 20px",
                  borderRadius: 6,
                  background: colors.buttonSecondary,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 500,
                  color: colors.bodyText,
                }}
              >
                Load Sample
              </button>

              <button
                type="button"
                onClick={() => {
                  setTranscript("");
                  setResult(null);
                  setError(null);
                }}
                style={{
                  padding: "10px 20px",
                  borderRadius: 6,
                  background: "transparent",
                  border: `1px solid ${colors.cardBorder}`,
                  cursor: "pointer",
                  fontWeight: 500,
                  color: colors.bodyText,
                }}
              >
                Clear
              </button>
            </div>

            {error && (
              <div
                style={{
                  marginTop: 16,
                  padding: 12,
                  borderRadius: 8,
                  background: "#FEE2E2",
                  color: "#B91C1C",
                  fontSize: 13,
                }}
              >
                <strong>Error:</strong> {error}
              </div>
            )}
          </div>

          {/* ------------ RIGHT: RESULT PANEL ------------ */}
          {result && (
            <div
              style={{
                flex: 1,
                background: colors.cardBg,
                padding: 20,
                borderRadius: 10,
                border: `1px solid ${colors.cardBorder}`,
                boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                color: colors.bodyText,
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                  fontSize: 18,
                  fontWeight: 600,
                  color: colors.heading,
                }}
              >
                Evaluation Result
              </h3>

              <p style={{ marginBottom: 12, fontSize: 16 }}>
                <strong>Overall Score:</strong>{" "}
                <span style={{ color: "#2563EB", fontWeight: 700 }}>
                  {result.score}
                </span>
              </p>

              <h4 style={{ marginBottom: 6, color: colors.heading }}>
                Category Scores:
              </h4>
              <pre
                style={{
                  background: colors.inputBg,
                  padding: 12,
                  borderRadius: 8,
                  border: `1px solid ${colors.inputBorder}`,
                  fontSize: 14,
                  overflowX: "auto",
                  color: colors.inputText,
                }}
              >
                {JSON.stringify(result.category_scores, null, 2)}
              </pre>

              <h4 style={{ marginBottom: 6, marginTop: 14, color: colors.heading }}>
                Insights:
              </h4>
              <ul style={{ paddingLeft: 18 }}>
                {result.insights.map((i, idx) => (
                  <li key={idx} style={{ marginBottom: 4 }}>
                    {i}
                  </li>
                ))}
              </ul>

              <h4 style={{ marginBottom: 6, marginTop: 14, color: colors.heading }}>
                Verdict:
              </h4>
              <p style={{ lineHeight: 1.5, fontSize: 15 }}>{result.verdict}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
