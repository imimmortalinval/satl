import React, { useState, useEffect } from "react";
import questionsData from "../data/questions.json";
import { renderWithMath } from "../utils/renderWithMath";
import DesmosModal from "./DesmosModal";
import "katex/dist/katex.min.css";
import "./QuestionBank.css";

export default function QuestionBank() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [buttonText, setButtonText] = useState("Guess");
  const [showExplanation, setShowExplanation] = useState(false);
  const [showNavigator, setShowNavigator] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const [activeTopics, setActiveTopics] = useState([]);
  const [bookmarked, setBookmarked] = useState([]);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [streak, setStreak] = useState(0);
  const [difficultyFilter, setDifficultyFilter] = useState(["Easy", "Medium", "Hard"]);
  const [startTime, setStartTime] = useState(Date.now());
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });
  const [showStats, setShowStats] = useState(true);


  const topicColors = {
    Algebra: "#f87171",
    "Advanced Math": "#a78bfa",
    "Problem-Solving and Data Analysis": "#34d399",
    "Geometry and Trigonometry": "#60a5fa",
  };

  function mapDomainToTopic(domain = "") {
    const d = domain.toLowerCase();
    if (d.includes("advanced")) return "Advanced Math";
    if (d.includes("problem") || d.includes("data")) return "Problem-Solving and Data Analysis";
    if (d.includes("geometry") || d.includes("trigonometry") || d.includes("additional")) {
      return "Geometry and Trigonometry";
    }
    if (d.includes("algebra")) return "Algebra";
    return "Algebra";
  }
useEffect(() => {
  const loadedQuestions = questionsData.math;
  setQuestions(loadedQuestions);

  const allTopics = [...new Set(loadedQuestions.map((q) => mapDomainToTopic(q.domain)))];
  setActiveTopics(allTopics);

  setStartTime(Date.now());
}, []);

useEffect(() => {
  const interval = setInterval(() => {
    setTimeElapsed(Math.round((Date.now() - startTime) / 1000));
  }, 1000);
  return () => clearInterval(interval);
}, [startTime]);

  const current = questions[currentIndex];
  const currentTopic = current ? mapDomainToTopic(current.domain) : "";
  const [timeElapsed, setTimeElapsed] = useState(0);


  function handleSelect(choiceKey) {
    if (feedback === "correct") return;
    setSelected(choiceKey);
    if (feedback === "incorrect") {
      setFeedback("");
      setButtonText("Guess");
    }
  }

  function handleGuess() {
    if (!selected || feedback === "correct") return;
    const isCorrect = selected === current.question.correct_answer;
    setFeedback(isCorrect ? "correct" : "incorrect");
    setButtonText(isCorrect ? "Correct" : "Guess");

    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    setSessionStats((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
    setStartTime(Date.now());

    if (isCorrect) {
      setStreak((s) => s + 1);
      if (autoAdvance) {
        setTimeout(() => handleNext(), 1500);
      }
    } else {
      setStreak(0);
    }
  }

  function handleNext() {
    setSelected(null);
    setFeedback("");
    setButtonText("Guess");
    setShowExplanation(false);
    const filteredIndexes = questions
      .map((q, i) => ({ topic: mapDomainToTopic(q.domain), index: i, difficulty: q.difficulty }))
      .filter((q) => activeTopics.includes(q.topic) && difficultyFilter.includes(q.difficulty))
      .map((q) => q.index);
    const currentFilteredIndex = filteredIndexes.indexOf(currentIndex);
    const nextIndex = filteredIndexes[(currentFilteredIndex + 1) % filteredIndexes.length];
    setCurrentIndex(nextIndex);
    setStartTime(Date.now());
  }

  function toggleTopic(topic) {
    setActiveTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  }

  function toggleDifficulty(level) {
    setDifficultyFilter((prev) =>
      prev.includes(level) ? prev.filter((d) => d !== level) : [...prev, level]
    );
  }

  function toggleBookmark() {
    setBookmarked((prev) =>
      prev.includes(currentIndex) ? prev.filter((i) => i !== currentIndex) : [...prev, currentIndex]
    );
  }

  if (!current) return <div>Loading questions...</div>;

  return (
    <>
      <div className="question-bank">
        <div className="top-bar">
          <div className="filters">
            {["Easy", "Medium", "Hard"].map((level) => (
              <button
                key={level}
                className={`filter-btn ${difficultyFilter.includes(level) ? "active" : ""}`}
                onClick={() => toggleDifficulty(level)}
              >
                {level}
              </button>
            ))}
            <div className="tooltip-container">
  <label className="auto-toggle">
    <input
      type="checkbox"
      checked={autoAdvance}
      onChange={() => setAutoAdvance((a) => !a)}
    />
    Auto-Advance
  </label>
  <span className="tooltip-text">
    Automatically moves to the next question after a correct guess
  </span>
</div>

            <div className="streak">🔥 Streak: {streak}</div>
          </div>
        </div>

        <div className="meta topic-filters">
          {Object.entries(topicColors).map(([topic, color]) => {
            const isActive = activeTopics.includes(topic);
            return (
              <span
                key={topic}
                className="domain"
                onClick={() => toggleTopic(topic)}
                style={{
                  backgroundColor: isActive ? `${color}20` : "#e5e7eb",
                  color: isActive ? "#111827" : "#9ca3af",
                  border: isActive ? `1px solid ${color}` : "1px solid #d1d5db",
                }}
              >
                {topic}
              </span>
            );
          })}
          <span className="difficulty">{current.difficulty}</span>
        </div>

        <div className="question-card">
          <div className="question-header">
            <button className="bookmark-btn" onClick={toggleBookmark}>
              {bookmarked.includes(currentIndex) ? "★ Bookmarked" : "☆ Bookmark"}
            </button>
<div className="time">Time: {timeElapsed}s</div>

          </div>

          <div className="question-text">{renderWithMath(current.question.question)}</div>

          <div className="choices">
            {Object.entries(current.question.choices).map(([key, value]) => {
              const isSelected = selected === key;
              const isMarked =
                feedback && isSelected ? (feedback === "correct" ? "correct" : "incorrect") : "";
              return (
                <button
                  key={key}
                  className={`choice-btn ${isSelected ? "selected" : ""} ${isMarked}`}
                  onClick={() => handleSelect(key)}
                >
                  {renderWithMath(value)}
                </button>
              );
            })}
          </div>

         <div className="actions">
  <button
    className={`action-btn submit ${feedback === "correct" ? "disabled" : ""}`}
    disabled={!selected || feedback === "correct"}
    onClick={handleGuess}
  >
    {buttonText}
  </button>

  {!autoAdvance && feedback === "correct" && (
    <button className="action-btn next" onClick={handleNext}>
      Next
    </button>
  )}

  <button className="action-btn skip" onClick={handleNext}>
    Skip
  </button>
</div>


          {showExplanation && (
            <div className="explanation-box">
              <strong>Explanation:</strong>
              <p>{renderWithMath(current.question.explanation)}</p>
            </div>
          )}


	{showStats && (
          <div className="session-stats">
            <h4>Session Stats</h4>
            <ul>
              <li>Questions Answered: {sessionStats.total}</li>
              <li>Correct Answers: {sessionStats.correct}</li>
              <li>
                Accuracy:{" "}
                {sessionStats.total > 0
                  ? `${Math.round((sessionStats.correct / sessionStats.total) * 100)}%`
                  : "—"}
              </li>
              <li>Bookmarked: {bookmarked.length}</li>
            </ul>
          </div>
)}
        </div>
      
        {showNavigator && (
          <div className="navigator">
            <div className="legend">
              {Object.entries(topicColors).map(([topic, color]) => (
                <div key={topic} className="legend-item">
                  <span
                    className="legend-color"
                    style={{
                      backgroundColor: activeTopics.includes(topic) ? color : "#d1d5db",
                    }}
                  ></span>
                  <span style={{ color: activeTopics.includes(topic) ? "#111827" : "#9ca3af" }}>
                    {topic}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid">
              {questions.map((q, i) => {
                const topic = mapDomainToTopic(q.domain);
                if (!activeTopics.includes(topic) || !difficultyFilter.includes(q.difficulty))
                  return null;

                const isActive = i === currentIndex;
                const color = topicColors[topic];

return (
  <button
    key={i}
    className={`nav-btn ${isActive ? "active" : ""} ${bookmarked.includes(i) ? "bookmarked" : ""}`}
    style={{ backgroundColor: color }}
    title={`${i + 1}: ${topic}${bookmarked.includes(i) ? " (Bookmarked)" : ""}`}
    onClick={() => {
      setCurrentIndex(i);
      setSelected(null);
      setFeedback("");
      setButtonText("Guess");
      setShowExplanation(false);
      setStartTime(Date.now());
    }}
  >
    {i + 1}
  </button>
);

              })}
            </div>
          </div>
        )}

        {showCalc && <DesmosModal onClose={() => setShowCalc(false)} />}
      </div>
<div className="toolbar">
  <div className="tool-wrapper">
    <button
      className={`tool-btn ${showCalc ? "active" : ""}`}
      onClick={() => setShowCalc(true)}
      aria-label="Open calculator"
    >
      🧮
    </button>
    <span className="tool-label">Calculator</span>
  </div>

  <div className="tool-wrapper">
    <button
      className={`tool-btn ${showExplanation ? "active" : ""}`}
      onClick={() => setShowExplanation((v) => !v)}
      aria-label="Toggle explanation"
    >
      ❓
    </button>
    <span className="tool-label">Explanation</span>
  </div>

  <div className="tool-wrapper">
    <button
      className={`tool-btn ${showNavigator ? "active" : ""}`}
      onClick={() => setShowNavigator((v) => !v)}
      aria-label="Toggle map"
    >
      🗺️
    </button>
    <span className="tool-label">Map</span>
  </div>

  <div className="tool-wrapper">
    <button
      className={`tool-btn ${showStats ? "active" : ""}`}
      onClick={() => setShowStats((v) => !v)}
      aria-label="Toggle stats"
    >
      🔧
    </button>
    <span className="tool-label">Stats</span>
  </div>
</div>


    </>
  );
}
