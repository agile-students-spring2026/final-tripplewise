// ...existing code...
import { useState, useMemo } from "react";
import { styles } from "../styles";
import BackButton from "./BackButton";

export default function StudySyncMatches({ onBack, onViewProfile }) {
  const [matches] = useState([
    {
      id: 1,
      username: "John_Doe",
      location: "Bobst LL2",
      method: "In-Person",
      matchPercentage: 92,
    },
    {
      id: 2,
      username: "Sarah_Smith",
      location: "NYU Library",
      method: "Virtual",
      matchPercentage: 87,
    },
    {
      id: 3,
      username: "Mike_Johnson",
      location: "Coffee Shop",
      method: "In-Person",
      matchPercentage: 78,
    },
    {
      id: 4,
      username: "Emma_Wilson",
      location: "Bobst LL2",
      method: "Hybrid",
      matchPercentage: 85,
    },
  ]);

  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("match");

  // Filter logic
  const filteredMatches = useMemo(() => {
    if (filterBy === "all") return matches;
    if (filterBy === "location") {
      return matches.filter((m) => m.location === "Bobst LL2");
    }
    if (filterBy === "method") {
      return matches.filter((m) => m.method === "In-Person");
    }
    return matches;
  }, [matches, filterBy]);

  // Sort logic
  const sortedMatches = useMemo(() => {
    const sorted = [...filteredMatches];
    if (sortBy === "match") {
      sorted.sort((a, b) => b.matchPercentage - a.matchPercentage);
    } else if (sortBy === "name") {
      sorted.sort((a, b) => a.username.localeCompare(b.username));
    } else if (sortBy === "location") {
      sorted.sort((a, b) => a.location.localeCompare(b.location));
    }
    return sorted;
  }, [filteredMatches, sortBy]);

  return (
    <div style={styles.page}>
      {/* Header with Back Button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "24px",
          gap: "16px",
        }}
      >
        <BackButton onClick={onBack} />
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            margin: 0,
            letterSpacing: "0.1em",
          }}
        >
          STUDY SYNC<br />
          MATCHES
        </h1>
      </div>

      {/* Filter and Sort Controls */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <div style={{ flex: 1 }}>
          <label
            style={{
              display: "block",
              fontSize: "11px",
              fontWeight: "bold",
              marginBottom: "6px",
              letterSpacing: "0.05em",
            }}
          >
            FILTER BY:
          </label>
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid black",
              backgroundColor: "white",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            <option value="all">All Matches</option>
            <option value="location">Bobst LL2</option>
            <option value="method">In-Person</option>
          </select>
        </div>

        <div style={{ flex: 1 }}>
          <label
            style={{
              display: "block",
              fontSize: "11px",
              fontWeight: "bold",
              marginBottom: "6px",
              letterSpacing: "0.05em",
            }}
          >
            SORT BY:
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid black",
              backgroundColor: "white",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            <option value="match">% Match</option>
            <option value="name">Username</option>
            <option value="location">Location</option>
          </select>
        </div>
      </div>

      {/* Matches List */}
      <div style={{ marginBottom: "16px" }}>
        {sortedMatches.length > 0 ? (
          sortedMatches.map((match) => (
            <div
              key={match.id}
              style={{
                display: "flex",
                gap: "12px",
                marginBottom: "12px",
                padding: "12px",
                border: "1px solid #ddd",
                backgroundColor: "white",
              }}
            >
              {/* Profile Placeholder - clickable */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => onViewProfile?.(match)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") onViewProfile?.(match);
                }}
                style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: "#e0e0e0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: "bold",
                  flexShrink: 0,
                  color: "#999",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
                aria-label={`View ${match.username} profile`}
              >
                PROFILE
              </div>

              {/* Match Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "bold",
                    marginBottom: "4px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {match.username}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    lineHeight: "1.5",
                    color: "#333",
                  }}
                >
                  <div>
                    <strong>Location:</strong> {match.location}
                  </div>
                  <div>
                    <strong>Method:</strong> {match.method}
                  </div>
                  <div>
                    <strong>% Match:</strong> {match.matchPercentage}%
                  </div>
                </div>
              </div>

              {/* Add Button */}
              <button
                style={{
                  backgroundColor: "black",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  fontSize: "10px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  height: "fit-content",
                  alignSelf: "center",
                }}
              >
                ADD
              </button>
            </div>
          ))
        ) : (
          <div
            style={{
              border: "1px solid #ddd",
              padding: "24px",
              textAlign: "center",
              fontSize: "14px",
              color: "#666",
              backgroundColor: "white",
            }}
          >
            No matches found. Try adjusting your filters.
          </div>
        )}
      </div>
    </div>
  );
}
// ...existing code...