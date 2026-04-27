import React, { useState, useEffect, useMemo } from "react";
import { styles } from "../styles";
import BackButton from "./BackButton";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function StudySyncMatches({ onBack, onViewProfile }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("match");

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/api/matches`, {
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
    })
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setMatches(Array.isArray(data.data) ? data.data : data);
      })
      .catch((err) => {
        console.warn("Could not load matches:", err.message);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filteredMatches = useMemo(() => {
    if (filterBy === "all") return matches;
    if (filterBy === "location") return matches.filter((m) => m.preferredLocations?.includes("Bobst Library"));
    if (filterBy === "method") return matches.filter((m) => m.preferredMethods?.includes("Group Study"));
    return matches;
  }, [matches, filterBy]);

  const sortedMatches = useMemo(() => {
    const sorted = [...filteredMatches];
    if (sortBy === "match") {
      sorted.sort((a, b) => b.matchPercentage - a.matchPercentage);
    } else if (sortBy === "location") {
      sorted.sort((a, b) => {
        const aHas = (a.preferredLocations?.length || 0) > 0 ? 1 : 0;
        const bHas = (b.preferredLocations?.length || 0) > 0 ? 1 : 0;
        if (bHas !== aHas) return bHas - aHas;
        return b.matchPercentage - a.matchPercentage;
      });
    } else if (sortBy === "method") {
      sorted.sort((a, b) => {
        const aHas = (a.preferredMethods?.length || 0) > 0 ? 1 : 0;
        const bHas = (b.preferredMethods?.length || 0) > 0 ? 1 : 0;
        if (bHas !== aHas) return bHas - aHas;
        return b.matchPercentage - a.matchPercentage;
      });
    }
    return sorted;
  }, [filteredMatches, sortBy]);

  const selectStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #e5e4e7",
    borderRadius: "10px",
    backgroundColor: "white",
    color: "#08060d",
    fontSize: "13px",
    cursor: "pointer",
    appearance: "none",
    boxSizing: "border-box",
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={{ textAlign: "center", padding: "60px 0", color: "#bbb", fontSize: "14px" }}>
          ⏳ Finding your matches…
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>

      {/* ── HEADER ── */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "20px", gap: "14px", width: "100%" }}>
        <BackButton onClick={onBack} />
        <div>
          <p style={{ fontSize: "11px", color: "#aaa", margin: "0 0 2px 0", fontWeight: "600", letterSpacing: "0.5px", textTransform: "uppercase" }}>
            Discover
          </p>
          <h1 style={{ fontSize: "24px", fontWeight: "800", margin: 0, color: "var(--text-h)", letterSpacing: "-0.5px" }}>
            Study Matches
          </h1>
        </div>
      </div>

      {/* ── FILTER & SORT ── */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", width: "100%" }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", fontSize: "11px", fontWeight: "700", marginBottom: "6px", color: "#888", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Filter
          </label>
          <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)} style={selectStyle}>
            <option value="all">All Matches</option>
            <option value="location">Bobst LL2</option>
            <option value="method">In-Person</option>
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", fontSize: "11px", fontWeight: "700", marginBottom: "6px", color: "#888", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Sort By
          </label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={selectStyle}>
            <option value="match">% Match</option>
            <option value="location">Location</option>
            <option value="method">Study Method</option>
          </select>
        </div>
      </div>

      {/* ── RESULTS COUNT ── */}
      <p style={{ fontSize: "12px", color: "#aaa", fontWeight: "600", marginBottom: "12px", width: "100%" }}>
        {sortedMatches.length} match{sortedMatches.length !== 1 ? "es" : ""} found
      </p>

      {/* ── MATCHES LIST ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", marginBottom: "20px" }}>
        {sortedMatches.length > 0 ? sortedMatches.map((match) => {
          const pct = match.matchPercentage || 0;
          const barColor = pct >= 75 ? "#4CAF50" : pct >= 50 ? "#aa3bff" : "#f59e0b";

          return (
            <button
              key={match.id}
              onClick={() => onViewProfile?.(match)}
              style={{
                display: "flex",
                gap: "14px",
                padding: "14px 16px",
                backgroundColor: "white",
                border: "none",
                borderRadius: "16px",
                cursor: "pointer",
                width: "100%",
                boxSizing: "border-box",
                alignItems: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                textAlign: "left",
              }}
            >
              {/* Avatar */}
              <div style={{
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                backgroundColor: "var(--accent-bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                flexShrink: 0,
              }}>
                🎓
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-h)", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {match.firstName} {match.lastName}
                </div>
                <div style={{ fontSize: "12px", color: "#888", marginBottom: "6px" }}>
                  {match.major} · {match.year}
                </div>
                {/* Match bar */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ flex: 1, height: "5px", backgroundColor: "#f0f0f5", borderRadius: "10px", overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", backgroundColor: barColor, borderRadius: "10px" }} />
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: barColor, whiteSpace: "nowrap" }}>
                    {pct}% match
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <div style={{ color: "#ccc", fontSize: "18px", flexShrink: 0 }}>›</div>
            </button>
          );
        }) : (
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "40px 20px",
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
          }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
            <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-h)", marginBottom: "6px" }}>No matches found</div>
            <div style={{ fontSize: "12px", color: "#aaa" }}>Try adjusting your filters to see more results.</div>
          </div>
        )}
      </div>
    </div>
  );
}
