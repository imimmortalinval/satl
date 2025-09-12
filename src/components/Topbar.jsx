import React from "react";

export default function Topbar() {
  return (
    <div className="topbar">
      <div>Welcome to SatLab</div>
      <div>
        <input placeholder="Search..." style={{
          padding: "0.5rem",
          borderRadius: "8px",
          border: "1px solid #ddd"
        }} />
      </div>
    </div>
  );
}
