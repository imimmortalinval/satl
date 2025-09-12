import React from "react";

export default function Home() {
  return (
    <div className="content">
      <div className="stats">
        <div className="stat-card">
          <h3>Registered Users</h3>
          <p style={{fontSize: "2rem", fontWeight: "bold"}}>1,234</p>
        </div>
        <div className="stat-card">
          <h3>Unique Questions</h3>
          <p style={{fontSize: "2rem", fontWeight: "bold"}}>482</p>
        </div>
      </div>
      <div className="placeholder">
        <h3>Recent Activity</h3>
        <p>Here you can display recent signups or question activity.</p>
      </div>
    </div>
  );
}
