import React, { useState, useMemo } from "react";
import { styles } from "../styles";

export default function SyncMatch({ users: propUsers = [] }) {
  // sample fallback data since none is provided 
  const sample = [
    {
      id: 1,
      name: "Aisha K.",
      avatarColor: "#6c5ce7",
      preferredLocations: ["Library", "Cafe"],
      preferredMethods: ["Pomodoro", "Group"],
      matchPercent: 86,
    },
    {
      id: 2,
      name: "Daniel R.",
      avatarColor: "#00b894",
      preferredLocations: ["Park", "Study Hall"],
      preferredMethods: ["Silent", "Solo"],
      matchPercent: 72,
    },
    {
      id: 3,
      name: "Maya L.",
      avatarColor: "#3498db",
      preferredLocations: ["Cafe"],
      preferredMethods: ["Group", "Discuss"],
      matchPercent: 94,
    },
  ];

  const users = propUsers.length ? propUsers : sample;

  const [selectedId, setSelectedId] = useState(users[0]?.id ?? null);
  const [filterLocation, setFilterLocation] = useState("All");
  const [sortBy, setSortBy] = useState("matchDesc");

  // derive list of all locations for filter dropdown
  const locations = useMemo(() => {
    const set = new Set();
    users.forEach((u) => (u.preferredLocations || []).forEach((l) => set.add(l)));
    return ["All", ...Array.from(set)];
  }, [users]);
  // This is the filtered list based on the selected location
  const filtered = useMemo(() => {
    let list = users.slice();
    if (filterLocation !== "All") {
      list = list.filter((u) => (u.preferredLocations || []).includes(filterLocation));
    }
    if (sortBy === "matchDesc") list.sort((a, b) => b.matchPercent - a.matchPercent);
    if (sortBy === "matchAsc") list.sort((a, b) => a.matchPercent - b.matchPercent);
    if (sortBy === "nameAsc") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "nameDesc") list.sort((a, b) => b.name.localeCompare(a.name));
    return list;
  }, [users, filterLocation, sortBy]);
  // This is the selected user based on the filtered list and selectedId. If the selectedId is not in the filtered list, it defaults to the first user in the filtered list.
  const selected = filtered.find((u) => u.id === selectedId) ?? filtered[0] ?? null;

  return (
    <div style={{ ...styles.page, padding: 20 }}>
      <h2>Study Sync Match</h2>

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <strong>Filter:</strong>
          <select
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            style={{ padding: 8 }}
          >
            {locations.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <strong>Sort by:</strong>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: 8 }}>
            <option value="matchDesc">Match % (high → low)</option>
            <option value="matchAsc">Match % (low → high)</option>
            <option value="nameAsc">Name (A → Z)</option>
            <option value="nameDesc">Name (Z → A)</option>
          </select>
        </label>
      </div>

      <div style={{ display: "flex", gap: 20 }}>
        {/* Left: avatars list */}
        <div
          style={{
            width: 140,
            borderRight: "1px solid #eee",
            paddingRight: 12,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {filtered.map((u) => (
            <button
              key={u.id}
              onClick={() => setSelectedId(u.id)}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                padding: "8px 10px",
                background: u.id === selectedId ? "#f0f8ff" : "white",
                border: "1px solid #ddd",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: u.avatarColor || "#ccc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: 700,
                }}
              >
                {(u.name || "U").split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase()}
              </div>
              <div style={{ fontSize: 14 }}>{u.name}</div>
            </button>
          ))}
          {filtered.length === 0 && <div style={{ color: "#666" }}>No matches</div>}
        </div>

        {/* Right: selected user details */}
        <div style={{ flex: 1, padding: 10 }}>
          {selected ? (
            <div style={{ display: "grid", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{selected.name}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#2d9cdb" }}>
                  {selected.matchPercent}% match
                </div>
              </div>

              <div>
                <div style={{ fontSize: 13, color: "#666", marginBottom: 6 }}>Preferred locations</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {(selected.preferredLocations || []).map((l) => (
                    <div
                      key={l}
                      style={{
                        padding: "6px 8px",
                        background: "#f1f5f9",
                        borderRadius: 6,
                        fontSize: 13,
                      }}
                    >
                      {l}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 13, color: "#666", marginBottom: 6 }}>Preferred study methods</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {(selected.preferredMethods || []).map((m) => (
                    <div
                      key={m}
                      style={{
                        padding: "6px 8px",
                        background: "#f7f9fb",
                        borderRadius: 6,
                        fontSize: 13,
                      }}
                    >
                      {m}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => alert(`Requested to connect with ${selected.name}`)}
                  style={{
                    padding: "10px 14px",
                    background: "#3498db",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: 6,
                  }}
                >
                  Request to connect
                </button>
              </div>
            </div>
          ) : (
            <div style={{ color: "#666" }}>Select a user to see details</div>
          )}
        </div>
      </div>
    </div>
  );
}