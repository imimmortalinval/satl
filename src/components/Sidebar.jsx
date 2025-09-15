import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaChalkboardTeacher,
  FaQuestionCircle,
  FaChevronLeft,
  FaSun,
  FaMoon
} from "react-icons/fa";
import "./Sidebar.css";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(true);

  const links = [
    { to: "/home", label: "Home", icon: <FaHome /> },
    { to: "/tutoring", label: "Desmos Tutoring", icon: <FaChalkboardTeacher /> },
    { to: "/questions", label: "Question Bank", icon: <FaQuestionCircle /> },
    { to: "/studyroutine", label: "Study Routine", icon: <FaChalkboardTeacher /> }
  ];

  return (
    <aside className={`sidebar ${collapsed ? "is-collapsed" : ""} ${dark ? "theme-dark" : "theme-light"}`}>
      <div className="collapse-toggle-wrapper">
        <button
          className="icon-btn collapse-toggle"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setCollapsed(v => !v)}
        >
          <FaChevronLeft className={`chevron-icon ${collapsed ? "rotated" : ""}`} />
        </button>
      </div>

      {!collapsed && (
        <>
          <div className="sidebar-header">
            <div className="logo">
              <span className="logo-dot" />
              <span className="logo-text">SatLab</span>
            </div>
            <div className="header-actions">
              <button
                className="icon-btn theme-toggle"
                aria-label="Toggle theme"
                onClick={() => setDark(v => !v)}
              >
                {dark ? <FaSun /> : <FaMoon />}
              </button>
            </div>
          </div>

          <nav className="nav">
            <div className="section-label">Navigation</div>
            <ul className="nav-list">
              {links.map(({ to, label, icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                  >
                    <span className="nav-icon">{icon}</span>
                    <span className="nav-text">{label}</span>
                    <span className="active-glow" aria-hidden />
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="sidebar-footer">
            <div className="profile">
              <div className="profile-info">
                <div className="meta">SAT Lab</div>
              </div>
            </div>
            <div className="version-chip">v1.0</div>
          </div>
        </>
      )}
    </aside>
  );
}
