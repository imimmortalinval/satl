import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [userCount, setUserCount] = useState(7);

  return (
    <div className="hero">
      <h1>Welcome to <span className="highlight">SatLab</span></h1>
      <p>The most immersive SAT prep experience. Built by students, for students.</p>
      <div className="stats">
        <div className="stat-box">
          <h2>📚 1000+ Practice Questions</h2>
          <p>Real Questions You Will See On The Sat. Made By The Same People Who Design The Sat!</p>
        </div>
        <div className="stat-box">
          <h2>👥 {userCount.toLocaleString()} Registered Users</h2>
          <p>{userCount} people are improving their math sat scores as fast as possible!</p>
        </div>

      </div>
<div className="contact-box">
  <h2>📬 Suggest a Problem</h2>
  <p>
    Have a math question you'd like for me to solve using desmos? Or just an issue with the website? Message me!
  </p>
</div>

      <div className="cta-buttons">
        <NavLink to="/questions" className="cta-btn">Explore Question Bank</NavLink>
        <NavLink to="/tutoring" className="cta-btn">Try Desmos Tutoring</NavLink>
      </div>
    </div>
  );
}


