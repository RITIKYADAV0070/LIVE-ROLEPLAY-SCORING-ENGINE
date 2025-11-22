import { useEffect, useState } from "react";

export default function Home() {
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState([]);

  const [activePage, setActivePage] = useState("evaluate");

  const sample = `Hi, I'm Ritik. I built an AI-powered real estate valuation tool 
focused on Gurugram micro-markets. It combines property listings, 
renovation cost adjustments, and comparable sales to generate 
reliable price estimates.`;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedTheme = window.localStorage.getItem("ps_theme");
    if (savedTheme === "dark") setDarkMode(true);

    const savedHistory = window.localStorage.getItem("ps_history");
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) setHistory(parsed);
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("ps_theme", darkMode ? "dark" : "light");
  }, [darkMode]);

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
    setActivePage("evaluate");
  }

  const numEvals = history.length;
  const avgScore =
    numEvals === 0
      ? 0
      : history.reduce((sum, h) => sum + (h.score || 0), 0) / numEvals;

  const bestScore =
    numEvals === 0
      ? null
      : history.reduce(
          (max, h) => (h.score > max ? h.score : max),
          history[0].score
        );

  const lastEval = numEvals > 0 ? history[0] : null;

  const categoryAverages = (() => {
    if (numEvals === 0) return {};
    const totals = {};
    history.forEach((h) => {
      const cs = h.result?.category_scores || {};
      Object.keys(cs).forEach((key) => {
        const value = cs[key] || 0;
        totals[key] = (totals[key] || 0) + value;
      });
    });
    const avgs = {};
    Object.keys(totals).forEach((k) => {
      avgs[k] = totals[k] / numEvals;
    });
    return avgs;
  })();

  function generateImprovementTips(overall, categories) {
    const tips = [];
    const clarity = categories.clarity ?? 0;
    const depth = categories.depth ?? 0;
    const structure = categories.structure ?? 0;

    if (overall < 0.4) {
      tips.push(
        "Your overall score is low — try a simple structure: who you are, what you built, and why it matters."
      );
    }
    if (clarity < 0.5) {
      tips.push(
        "Clarity is weak — avoid long sentences, remove filler words, and get to the point quickly."
      );
    }
    if (depth < 0.5) {
      tips.push(
        "Depth is low — add specific numbers or examples to show impact."
      );
    }
    if (structure < 0.5) {
      tips.push(
        "Structure is weak — use a flow: Problem → Solution → How it works → Value."
      );
    }
    if (tips.length === 0) {
      tips.push("Your pitches look strong! Fine-tune delivery and storytelling.");
    }
    return tips;
  }

  function scoreBuckets(hist) {
    const buckets = {
      "0–0.2": 0,
      "0.2–0.4": 0,
      "0.4–0.6": 0,
      "0.6–0.8": 0,
      "0.8–1.0": 0,
    };

    hist.forEach((h) => {
      const s = h.score ?? 0;
      if (s <= 0.2) buckets["0–0.2"]++;
      else if (s <= 0.4) buckets["0.2–0.4"]++;
      else if (s <= 0.6) buckets["0.4–0.6"]++;
      else if (s <= 0.8) buckets["0.6–0.8"]++;
      else buckets["0.8–1.0"]++;
    });

    return buckets;
  }

  function exportHistory() {
    if (history.length === 0) {
      alert("No history to export yet.");
      return;
    }
    const blob = new Blob([JSON.stringify(history, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pitchsense-history.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function clearAllHistory() {
    const ok = window.confirm("Clear all evaluation history?");
    if (!ok) return;
    setHistory([]);
  }

  function resetTheme() {
    setDarkMode(false);
  }

  const colors = darkMode
    ? {
        pageBg: "#020617",
        sidebarBg: "#020617",
        sidebarText: "#E5E7EB",
        mainBg: "#020617",
        cardBg: "#020617",
        cardBorder: "#111827",
        heading: "#F9FAFB",
        bodyText: "#E5E7EB",
        mutedText: "#9CA3AF",
        buttonPrimary: "#4F46E5",
        buttonSecondary: "#111827",
        inputBg: "#020617",
        inputBorder: "#1F2937",
        inputText: "#F9FAFB",
      }
    : {
        pageBg: "#F3F4F6",
        sidebarBg: "#0F172A",
        sidebarText: "#FFFFFF",
        mainBg: "#F3F4F6",
        cardBg: "#FFFFFF",
        cardBorder: "#E5E7EB",
        heading: "#0F172A",
        bodyText: "#111827",
        mutedText: "#6B7280",
        buttonPrimary: "#2563EB",
        buttonSecondary: "#E5E7EB",
        inputBg: "#F9FAFB",
        inputBorder: "#D1D5DB",
        inputText: "#111827",
      };

  const pageCard = {
    background: colors.cardBg,
    padding: 20,
    borderRadius: 16,
    border: `1px solid ${colors.cardBorder}`,
    boxShadow: darkMode
      ? "0 18px 45px rgba(15,23,42,0.85)"
      : "0 18px 45px rgba(15,23,42,0.10)",
  };

  const pageTitle = {
    margin: 0,
    fontSize: 22,
    fontWeight: 600,
    color: colors.heading,
  };

  const miniCard = {
    flex: 1,
    minWidth: 160,
    padding: 14,
    borderRadius: 12,
    border: `1px solid ${colors.cardBorder}`,
    background: darkMode ? "#020617" : "#F9FAFB",
  };

  const DashboardPage = () => {
    const tips =
      numEvals === 0 ? [] : generateImprovementTips(avgScore, categoryAverages);

    return (
      <div style={{ ...pageCard, marginTop: 24 }}>
        <h2 style={pageTitle}>Dashboard</h2>
        <p style={{ marginTop: 6, color: colors.mutedText, fontSize: 14 }}>
          Quick snapshot of how your pitches are performing.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            marginTop: 18,
          }}
        >
          <div style={miniCard}>
            <div style={{ fontSize: 11, opacity: 0.7, textTransform: "uppercase" }}>
              Total evaluations
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, marginTop: 4 }}>
              {numEvals}
            </div>
          </div>

          <div style={miniCard}>
            <div style={{ fontSize: 11, opacity: 0.7, textTransform: "uppercase" }}>
              Average score
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, marginTop: 4 }}>
              {avgScore.toFixed(2)}
            </div>
          </div>

          <div style={miniCard}>
            <div style={{ fontSize: 11, opacity: 0.7, textTransform: "uppercase" }}>
              Best score
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, marginTop: 4 }}>
              {bestScore == null ? "—" : bestScore.toFixed(2)}
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 24,
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ ...miniCard, flex: 2 }}>
            <h4
              style={{
                margin: 0,
                marginBottom: 8,
                fontSize: 14,
                color: colors.heading,
              }}
            >
              Latest evaluation
            </h4>
            {lastEval ? (
              <>
                <div style={{ fontSize: 13, marginBottom: 4 }}>
                  <strong>Score:</strong> {lastEval.score.toFixed(2)} at{" "}
                  {lastEval.createdAt}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    opacity: 0.85,
                    lineHeight: 1.4,
                  }}
                >
                  {lastEval.snippet}
                </div>
              </>
            ) : (
              <p style={{ fontSize: 13, opacity: 0.8 }}>
                No evaluations yet — run your first pitch from the{" "}
                <strong>Evaluate</strong> tab.
              </p>
            )}
          </div>

          <div style={{ ...miniCard, flex: 1 }}>
            <h4
              style={{
                margin: 0,
                marginBottom: 8,
                fontSize: 14,
                color: colors.heading,
              }}
            >
              Category overview
            </h4>
            {numEvals === 0 ? (
              <p style={{ fontSize: 13, opacity: 0.8 }}>No data yet.</p>
            ) : (
              Object.keys(categoryAverages).map((key) => {
                const value = categoryAverages[key];
                return (
                  <div key={key} style={{ marginBottom: 8 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 12,
                      }}
                    >
                      <span style={{ textTransform: "capitalize" }}>{key}</span>
                      <span>{value.toFixed(2)}</span>
                    </div>
                    <div
                      style={{
                        height: 6,
                        borderRadius: 999,
                        background: darkMode ? "#020617" : "#E5E7EB",
                        overflow: "hidden",
                        marginTop: 3,
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${Math.min(1, value) * 100}%`,
                          background:
                            key === "clarity"
                              ? "#3B82F6"
                              : key === "depth"
                              ? "#22C55E"
                              : "#F97316",
                          transition: "width 0.3s",
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <h4
            style={{
              margin: 0,
              marginBottom: 8,
              fontSize: 14,
              color: colors.heading,
            }}
          >
            AI-style improvement suggestions
          </h4>
          {numEvals === 0 ? (
            <p style={{ fontSize: 13, opacity: 0.8 }}>
              Run at least one evaluation to get targeted suggestions.
            </p>
          ) : (
            <ul style={{ paddingLeft: 18, fontSize: 13, lineHeight: 1.5 }}>
              {tips.map((t, idx) => (
                <li key={idx}>{t}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  };

  const MetricsPage = () => {
    const buckets = scoreBuckets(history);

    const categoryEntries = Object.entries(categoryAverages);
    const strongest =
      categoryEntries.length === 0
        ? null
        : categoryEntries.reduce((best, current) =>
            current[1] > best[1] ? current : best
          );
    const weakest =
      categoryEntries.length === 0
        ? null
        : categoryEntries.reduce((worst, current) =>
            current[1] < worst[1] ? current : worst
          );

    return (
      <div style={{ ...pageCard, marginTop: 24 }}>
        <h2 style={pageTitle}>Metrics</h2>
        <p style={{ marginTop: 6, color: colors.mutedText, fontSize: 14 }}>
          Trends and breakdown of your pitch scores.
        </p>

        {numEvals === 0 ? (
          <p style={{ marginTop: 16, fontSize: 13 }}>
            No data yet. Evaluate some pitches to see insights.
          </p>
        ) : (
          <>
            <div style={{ marginTop: 20 }}>
              <h4
                style={{
                  margin: 0,
                  marginBottom: 8,
                  fontSize: 14,
                  color: colors.heading,
                }}
              >
                Overall average score
              </h4>
              <div
                style={{
                  height: 10,
                  borderRadius: 999,
                  background: darkMode ? "#020617" : "#E5E7EB",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${Math.min(1, avgScore) * 100}%`,
                    background: "#3B82F6",
                    transition: "width 0.3s",
                  }}
                />
              </div>
              <div
                style={{
                  marginTop: 4,
                  fontSize: 12,
                  color: colors.mutedText,
                }}
              >
                Average: {avgScore.toFixed(2)} / 1.00 over {numEvals} runs
              </div>
            </div>

            <div
              style={{
                marginTop: 24,
                display: "flex",
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <div style={{ ...miniCard, flex: 1 }}>
                <h4
                  style={{
                    margin: 0,
                    marginBottom: 8,
                    fontSize: 14,
                    color: colors.heading,
                  }}
                >
                  Category averages
                </h4>
                {categoryEntries.map(([key, value]) => (
                  <div key={key} style={{ marginBottom: 10 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 12,
                      }}
                    >
                      <span style={{ textTransform: "capitalize" }}>{key}</span>
                      <span>{value.toFixed(2)}</span>
                    </div>
                    <div
                      style={{
                        height: 6,
                        borderRadius: 999,
                        background: darkMode ? "#020617" : "#E5E7EB",
                        overflow: "hidden",
                        marginTop: 3,
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${Math.min(1, value) * 100}%`,
                          background: "#22C55E",
                          transition: "width 0.3s",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ ...miniCard, flex: 1 }}>
                <h4
                  style={{
                    margin: 0,
                    marginBottom: 8,
                    fontSize: 14,
                    color: colors.heading,
                  }}
                >
                  Score distribution
                </h4>
                {Object.entries(buckets).map(([range, count]) => (
                  <div
                    key={range}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 6,
                      fontSize: 12,
                    }}
                  >
                    <span style={{ width: 60 }}>{range}</span>
                    <div
                      style={{
                        flex: 1,
                        height: 6,
                        borderRadius: 999,
                        background: darkMode ? "#020617" : "#E5E7EB",
                        overflow: "hidden",
                        marginRight: 8,
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${count * 25}%`,
                          background: "#6366F1",
                          transition: "width 0.3s",
                        }}
                      />
                    </div>
                    <span>{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              <h4
                style={{
                  margin: 0,
                  marginBottom: 8,
                  fontSize: 14,
                  color: colors.heading,
                }}
              >
                Strength & weakness
              </h4>
              {strongest && weakest ? (
                <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                  <p>
                    <strong>Strongest:</strong>{" "}
                    <span style={{ textTransform: "capitalize" }}>
                      {strongest[0]}
                    </span>{" "}
                    ({strongest[1].toFixed(2)})
                  </p>
                  <p>
                    <strong>Weakest:</strong>{" "}
                    <span style={{ textTransform: "capitalize" }}>
                      {weakest[0]}
                    </span>{" "}
                    ({weakest[1].toFixed(2)})
                  </p>
                  <p style={{ marginTop: 4, color: colors.mutedText }}>
                    Focus next practice sessions on improving your weakest area.
                  </p>
                </div>
              ) : (
                <p style={{ fontSize: 13, opacity: 0.8 }}>Not enough data.</p>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  const SettingsPage = () => (
    <div style={{ ...pageCard, marginTop: 24 }}>
      <h2 style={pageTitle}>Settings</h2>
      <p style={{ marginTop: 6, color: colors.mutedText, fontSize: 14 }}>
        Configure theme and manage local data.
      </p>

      <div
        style={{
          marginTop: 20,
          padding: 16,
          borderRadius: 12,
          border: `1px solid ${colors.cardBorder}`,
        }}
      >
        <h4
          style={{
            margin: 0,
            marginBottom: 6,
            fontSize: 14,
            color: colors.heading,
          }}
        >
          Appearance
        </h4>
        <button
          type="button"
          onClick={() => setDarkMode((m) => !m)}
          style={{
            marginTop: 10,
            padding: "8px 14px",
            borderRadius: 999,
            border: `1px solid ${colors.cardBorder}`,
            background: colors.cardBg,
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          {darkMode ? "☀ Switch to light mode" : "🌙 Switch to dark mode"}
        </button>

        <button
          type="button"
          onClick={resetTheme}
          style={{
            marginLeft: 10,
            marginTop: 10,
            padding: "8px 14px",
            borderRadius: 999,
            border: `1px solid ${colors.cardBorder}`,
            background: "transparent",
            cursor: "pointer",
            fontSize: 12,
          }}
        >
          Reset to default
        </button>
      </div>

      <div
        style={{
          marginTop: 20,
          padding: 16,
          borderRadius: 12,
          border: `1px solid ${colors.cardBorder}`,
        }}
      >
        <h4
          style={{
            margin: 0,
            marginBottom: 6,
            fontSize: 14,
            color: colors.heading,
          }}
        >
          Data & history
        </h4>

        <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
          <button
            type="button"
            onClick={exportHistory}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "none",
              background: "#2563EB",
              color: "white",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            ⬇ Export history (JSON)
          </button>

          <button
            type="button"
            onClick={clearAllHistory}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "none",
              background: "#DC2626",
              color: "white",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            🗑 Clear all history
          </button>
        </div>
      </div>

      <div
        style={{
          marginTop: 20,
          padding: 16,
          borderRadius: 12,
          border: `1px solid ${colors.cardBorder}`,
        }}
      >
        <h4
          style={{
            margin: 0,
            marginBottom: 6,
            fontSize: 14,
            color: colors.heading,
          }}
        >
          About PitchSense
        </h4>
        <p style={{ margin: 0, fontSize: 13, color: colors.mutedText }}>
          A lightweight pitch evaluation tool. All data is stored locally in
          your browser for privacy.
        </p>
      </div>
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: colors.pageBg,
        color: colors.bodyText,
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <aside
        style={{
          width: 260,
          background: colors.sidebarBg,
          color: colors.sidebarText,
          padding: "28px 22px",
          display: "flex",
          flexDirection: "column",
          borderRight: darkMode
            ? "1px solid #111827"
            : "1px solid rgba(148,163,184,0.4)",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: "-0.5px",
          }}
        >
          PitchSense
        </h2>

        <div
          style={{
            marginTop: 32,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            fontSize: 17,
            fontWeight: 500,
          }}
        >
          {[
            { key: "dashboard", label: "Dashboard", icon: "📊" },
            { key: "evaluate", label: "Evaluate Pitch", icon: "📝" },
            { key: "metrics", label: "Metrics", icon: "📈" },
            { key: "settings", label: "Settings", icon: "⚙" },
          ].map((item) => {
            const active = activePage === item.key;

            return (
              <div
                key={item.key}
                onClick={() => setActivePage(item.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  cursor: "pointer",
                  padding: "12px 14px",
                  borderRadius: 10,
                  position: "relative",
                  background: active
                    ? "rgba(255,255,255,0.10)"
                    : "transparent",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = active
                    ? "rgba(255,255,255,0.12)"
                    : "rgba(255,255,255,0.06)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = active
                    ? "rgba(255,255,255,0.10)"
                    : "transparent")
                }
              >
                {active && (
                  <div
                    style={{
                      position: "absolute",
                      left: -14,
                      width: 4,
                      height: "70%",
                      background: "#6366F1",
                      borderRadius: 6,
                    }}
                  />
                )}

                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <span
                  style={{
                    fontWeight: active ? 700 : 500,
                    color: active ? "#FFFFFF" : colors.sidebarText,
                  }}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: "auto",
            fontSize: 14,
            opacity: 0.7,
            paddingTop: 20,
          }}
        >
          © {new Date().getFullYear()} Ritik
        </div>
      </aside>

      <main
        style={{
          flex: 1,
          padding: "24px 32px",
          background: colors.mainBg,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,
                  color: colors.heading,
                  fontSize: 26,
                  letterSpacing: "-0.03em",
                }}
              >
                {activePage === "dashboard" && "Dashboard"}
                {activePage === "evaluate" && "LIVE ROLEPLAY SCORING ENGINE"}
                {activePage === "metrics" && "Metrics"}
                {activePage === "settings" && "Settings"}
              </h1>

              {activePage === "evaluate" && (
                <p style={{ marginTop: 4, color: colors.mutedText, fontSize: 14 }}>
                  Paste your pitch and get quick AI feedback.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => setDarkMode((m) => !m)}
              style={{
                borderRadius: 999,
                border: `1px solid ${colors.cardBorder}`,
                padding: "7px 16px",
                fontSize: 13,
                background: colors.cardBg,
                cursor: "pointer",
                boxShadow: darkMode
                  ? "0 0 0 1px rgba(148,163,184,0.08)"
                  : "0 1px 2px rgba(15,23,42,0.08)",
              }}
            >
              {darkMode ? "☀ Light mode" : "🌙 Dark mode"}
            </button>
          </div>

          {activePage === "dashboard" && <DashboardPage />}
          {activePage === "metrics" && <MetricsPage />}
          {activePage === "settings" && <SettingsPage />}

          {activePage === "evaluate" && (
            <>
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  marginTop: 20,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    borderRadius: 16,
                    border: `1px solid ${colors.cardBorder}`,
                    background: darkMode
                      ? "linear-gradient(145deg,#020617,#020b25)"
                      : "linear-gradient(145deg,#ffffff,#f9fafb)",
                    boxShadow: darkMode
                      ? "0 18px 45px rgba(15,23,42,0.85)"
                      : "0 18px 45px rgba(15,23,42,0.08)",
                    padding: 20,
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      marginBottom: 12,
                      color: colors.heading,
                      fontSize: 18,
                    }}
                  >
                    Enter Pitch Transcript
                  </h3>

                  <textarea
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    rows={9}
                    placeholder="Write or paste your pitch here..."
                    style={{
                      width: "100%",
                      padding: 12,
                      borderRadius: 10,
                      border: `1px solid ${colors.inputBorder}`,
                      background: colors.inputBg,
                      color: colors.inputText,
                      fontSize: 14,
                      lineHeight: 1.5,
                      resize: "vertical",
                    }}
                  />

                  <div
                    style={{
                      marginTop: 14,
                      display: "flex",
                      gap: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      disabled={loading}
                      onClick={submit}
                      style={{
                        background: colors.buttonPrimary,
                        color: "white",
                        padding: "10px 20px",
                        borderRadius: 999,
                        border: "none",
                        cursor: loading ? "default" : "pointer",
                        opacity: loading ? 0.9 : 1,
                        fontWeight: 500,
                        fontSize: 14,
                      }}
                    >
                      {loading ? "Evaluating..." : "Evaluate"}
                    </button>

                    <button
                      onClick={() => setTranscript(sample)}
                      style={{
                        padding: "10px 20px",
                        borderRadius: 999,
                        background: colors.buttonSecondary,
                        border: "none",
                        cursor: "pointer",
                        fontWeight: 500,
                        fontSize: 14,
                        color: colors.bodyText,
                      }}
                    >
                      Load Sample
                    </button>

                    <button
                      onClick={() => {
                        setTranscript("");
                        setResult(null);
                        setError(null);
                      }}
                      style={{
                        padding: "10px 20px",
                        borderRadius: 999,
                        border: `1px solid ${colors.cardBorder}`,
                        background: "transparent",
                        cursor: "pointer",
                        fontWeight: 500,
                        fontSize: 14,
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
                        borderRadius: 10,
                        background: "#FEE2E2",
                        color: "#B91C1C",
                        fontSize: 13,
                      }}
                    >
                      <strong>Error:</strong> {error}
                    </div>
                  )}
                </div>

                {result && (
                  <div
                    style={{
                      flex: 1,
                      borderRadius: 16,
                      border: `1px solid ${colors.cardBorder}`,
                      background: colors.cardBg,
                      boxShadow: darkMode
                        ? "0 18px 45px rgba(15,23,42,0.85)"
                        : "0 18px 45px rgba(15,23,42,0.08)",
                      padding: 20,
                    }}
                  >
                    <h3
                      style={{
                        marginTop: 0,
                        color: colors.heading,
                        fontSize: 18,
                      }}
                    >
                      Evaluation Result
                    </h3>

                    <p style={{ marginTop: 4 }}>
                      <strong>Overall Score:</strong>{" "}
                      <span style={{ color: "#2563EB", fontWeight: 700 }}>
                        {result.score}
                      </span>
                    </p>

                    <h4
                      style={{
                        marginTop: 16,
                        marginBottom: 6,
                        color: colors.heading,
                        fontSize: 14,
                      }}
                    >
                      Category Scores:
                    </h4>
                    <pre
                      style={{
                        background: colors.inputBg,
                        padding: 12,
                        borderRadius: 10,
                        border: `1px solid ${colors.inputBorder}`,
                        color: colors.inputText,
                        fontSize: 13,
                        overflowX: "auto",
                      }}
                    >
                      {JSON.stringify(result.category_scores, null, 2)}
                    </pre>

                    <h4
                      style={{
                        marginTop: 16,
                        marginBottom: 6,
                        color: colors.heading,
                        fontSize: 14,
                      }}
                    >
                      Insights:
                    </h4>
                    <ul
                      style={{
                        paddingLeft: 18,
                        fontSize: 14,
                        lineHeight: 1.5,
                      }}
                    >
                      {result.insights.map((i, idx) => (
                        <li key={idx}>{i}</li>
                      ))}
                    </ul>

                    <h4
                      style={{
                        marginTop: 16,
                        marginBottom: 6,
                        color: colors.heading,
                        fontSize: 14,
                      }}
                    >
                      Verdict:
                    </h4>
                    <p style={{ fontSize: 14 }}>{result.verdict}</p>
                  </div>
                )}
              </div>

              <div style={{ marginTop: 32 }}>
                <h3
                  style={{
                    color: colors.heading,
                    fontSize: 18,
                    marginBottom: 8,
                  }}
                >
                  Recent Evaluations
                </h3>

                {history.length === 0 && (
                  <p style={{ opacity: 0.7, fontSize: 13 }}>No evaluations yet.</p>
                )}

                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    marginTop: 4,
                    overflowX: "auto",
                    paddingBottom: 4,
                  }}
                >
                  {history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => loadFromHistory(item)}
                      style={{
                        cursor: "pointer",
                        background: colors.cardBg,
                        border: `1px solid ${colors.cardBorder}`,
                        borderRadius: 14,
                        padding: 12,
                        width: 220,
                        flexShrink: 0,
                        boxShadow: darkMode
                          ? "0 10px 24px rgba(15,23,42,0.8)"
                          : "0 10px 24px rgba(15,23,42,0.08)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          marginBottom: 4,
                        }}
                      >
                        Score: {item.score.toFixed(2)}
                      </div>
                      <p
                        style={{
                          opacity: 0.85,
                          fontSize: 13,
                          marginTop: 2,
                          lineHeight: 1.35,
                        }}
                      >
                        {item.snippet}
                      </p>
                      <span
                        style={{
                          opacity: 0.6,
                          fontSize: 12,
                          display: "block",
                          marginTop: 4,
                        }}
                      >
                        {item.createdAt}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
