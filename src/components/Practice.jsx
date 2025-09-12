import React from "react";
import { Link } from "react-router-dom";

export default function Practice() {
  return (
    <div className="page">
      <h1>Practice</h1>
      <div className="nav">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/lessons">Lessons</Link>
        <Link to="/profile">Profile</Link>
      </div>
      <p>Practice problems and quizzes will appear here.</p>
    </div>
  );
}
