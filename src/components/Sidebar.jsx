import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaCalculator, FaQuestionCircle, FaUser, FaChalkboardTeacher } from "react-icons/fa";
import "./Sidebar.css"; // Add this for styling

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="logo">SatLab</div>
      <nav className="nav-links">
        <NavLink to="/home" className="nav-link">
          <FaHome className="icon" />
          <span>Home</span>
        </NavLink>
        <NavLink to="/tutoring" className="nav-link">
          <FaChalkboardTeacher className="icon" />
          <span>Desmos Tutoring</span>
        </NavLink>
        <NavLink to="/questions" className="nav-link">
          <FaQuestionCircle className="icon" />
          <span>Question Bank</span>
        </NavLink>
      </nav>
    </div>
  );
}
