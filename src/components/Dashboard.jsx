import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="page">
      <h1>Dashboard</h1>
      <div className="nav">
        <Link to="/lessons">Lessons</Link>
        <Link to="/practice">Practice</Link>
        <Link to="/profile">Profile</Link>
      </div>
      <p>Welcome to your SAT Math prep dashboard. Choose a section to begin.</p>
    </div>
  );
}
