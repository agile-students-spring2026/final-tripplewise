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

  // Filter logic
  const filteredMatches = useMemo(() => {
    if (filterBy === "all") return matches;
    if (filterBy === "location") return matches.filter((m) => m.preferredLocations?.includes("Bobst Library"));
    if (filterBy === "method") return matches.filter((m) => m.preferredMethods?.includes("Group Study"));
    return matches;
  }, [matches, filterBy]);

  // Sort logic
  const sortedMatches = useMemo(() => {
    const sorted = [...filteredMatches];
    if (sortBy === "match") sorted.sort((a, b) => b.matchPercentage - a.matchPercentage);
    else if (sortBy === "name") sorted.sort((a, b) => a.username.localeCompare(b.username));
    else if (sortBy === "location") sorted.sort((a, b) => (a.preferredLocations?.[0] || "").localeCompare(b.preferredLocations?.[0] || ""));
    return sorted;
  }, [filteredMatches, sortBy]);

  if (loading) return <div style={styles.page}>Loading matches…</div>;

  return (
    <div style={styles.page}>
      {/* Header with Back Button */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "24px", gap: "16px" }}>
        <BackButton onClick={onBack} />
        <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: 0, letterSpacing: "0.1em", color: "#555" }}>
          STUDY SYNC<br />MATCHES
        </h1>
      </div>

      {/* Filter and Sort Controls */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", fontSize: "11px", fontWeight: "bold", marginBottom: "6px", letterSpacing: "0.05em" }}>
            FILTER BY:
          </label>
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            style={{ width: "100%", padding: "8px", border: "1px solid black", backgroundColor: "white", color: "black", fontSize: "12px", cursor: "pointer" }}
          >
            <option value="all">All Matches</option>
            <option value="location">Bobst LL2</option>
            <option value="method">In-Person</option>
          </select>
        </div>

        <div style={{ flex: 1 }}>
          <label style={{ display: "block", fontSize: "11px", fontWeight: "bold", marginBottom: "6px", letterSpacing: "0.05em" }}>
            SORT BY:
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ width: "100%", padding: "8px", border: "1px solid black", backgroundColor: "white", color: "black", fontSize: "12px", cursor: "pointer" }}
          >
            <option value="match">% Match</option>
            <option value="name">Username</option>
            <option value="location">Location</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: "center", color: "#666", padding: "24px" }}>Loading matches…</div>
      )}

      {/* Matches List */}
      {!loading && (
        <div style={{ marginBottom: "16px" }}>
          {sortedMatches.length > 0 ? (
            sortedMatches.map((match) => (
              <button
                key={match.id}
                onClick={() => onViewProfile?.(match)}
                style={{
                  display: "flex",
                  gap: "12px",
                  marginBottom: "12px",
                  padding: "12px",
                  border: "1px solid #ddd",
                  backgroundColor: "white",
                  cursor: "pointer",
                  width: "100%",
                  boxSizing: "border-box",
                  alignItems: "flex-start",
                }}
              >
                {/* Profile Placeholder */}
                <div style={{
                  width: "60px", height: "60px", backgroundColor: "#e0e0e0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "11px", fontWeight: "bold", flexShrink: 0, color: "#999",
                }}>
                  PROFILE
                </div>

                {/* Match Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "13px", fontWeight: "bold", marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {match.firstName} {match.lastName}
                  </div>
                  <div style={{ fontSize: "11px", lineHeight: "1.5", color: "#333" }}>
                    <div><strong>Major:</strong> {match.major}</div>
                    <div><strong>Year:</strong> {match.year}</div>
                    <div><strong>% Match:</strong> {match.matchPercentage}%</div>
                  </div>
                </div>

                {/* Add Button */}
                <div style={{
                  backgroundColor: "black", color: "white", border: "none",
                  padding: "8px 12px", fontSize: "10px", fontWeight: "bold",
                  cursor: "pointer", whiteSpace: "nowrap", height: "fit-content", alignSelf: "center",
                }}>
                  ADD
                </div>
              </button>
            ))
          ) : (
            <div style={{ border: "1px solid #ddd", padding: "24px", textAlign: "center", fontSize: "14px", color: "#666", backgroundColor: "white" }}>
              No matches found. Try adjusting your filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
