import React from "react";
import { Link } from "react-router-dom";

export default function Profile() {
  return (
    <div className="page">
      <h1>Your Profile</h1>
      <div className="nav">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/lessons">Lessons</Link>
        <Link to="/practice">Practice</Link>
      </div>
      <p>View and edit your information here.</p>
    </div>
  );
}
