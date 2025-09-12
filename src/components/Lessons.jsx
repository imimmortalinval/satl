import React from "react";
import { Link } from "react-router-dom";

export default function Lessons() {
  return (
    <div className="page">
      <h1>Lessons</h1>
      <div className="nav">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/practice">Practice</Link>
        <Link to="/profile">Profile</Link>
      </div>
      <p>Interactive lessons will go here—covering topics like algebra, geometry, and calculator tricks.</p>
    </div>
  );
}
