import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const targetDate = new Date("2025-10-04T08:00:00-04:00");
    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate - now;
      if (diff <= 0) {
        setCountdown("It's SAT day!");
        clearInterval(interval);
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      setCountdown(`${days}d ${hours}h ${minutes}m`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    ["📚", "1000+ Practice Questions", "Real SAT-style questions crafted by test experts."],
    ["📊", "Progress Tracking", "Track your stats, see practice scores."],
    ["🧠", "Desmos Tutoring", "Step-by-step math help powered by Desmos and AI."],
    ["🎯", "Targeted Practice", "Focus on your weakest skills with adaptive practice."],
    ["📈", "Score Simulator", "Estimate your SAT score based on real-time performance."],
    ["🧪", "Lab Challenges", "Test critical thinking inside real SAT pressure."]
  ];

  return (
    <main className="home">
      <section className="hero-section fade-in">
        <h1 className="hero-title">Welcome to <span className="highlight">SatLab</span></h1>
        <p className="hero-subtitle">The most immersive SAT prep experience. Built by students, for students.</p>
        <div className="countdown-box glass">
          <h2>🕒 Next SAT: <span className="countdown">{countdown}</span></h2>
          <p>Lock in. Your score starts now.</p>
        </div>
      </section>

      <section className="features-grid fade-in">
        {features.map(([icon, title, desc], i) => (
          <div key={i} className="feature-card glass">
            <div className="feature-icon">{icon}</div>
            <h3>{title}</h3>
            <p>{desc}</p>
          </div>
        ))}
      </section>

      <section className="cta-section fade-in">
        <NavLink to="/questions" className="cta-btn">🧠 Explore Question Bank</NavLink>
        <NavLink to="/tutoring" className="cta-btn">📈 Try Desmos Tutoring</NavLink>
      </section>

<section className="contact-box glass fade-in">
  <h2>📬 Suggest a Problem</h2>
  <p>
    Got a tricky math question or feedback? <br />
    DM me on Discord <span className="discord-handle">@root_lol</span>
  </p>
</section>

    </main>
  );
}
