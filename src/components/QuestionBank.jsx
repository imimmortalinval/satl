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
  }, []);

  const current = questions[currentIndex];
  const currentTopic = current ? mapDomainToTopic(current.domain) : "";

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
  }

  function handleNext() {
    setSelected(null);
    setFeedback("");
    setButtonText("Guess");
    setShowExplanation(false);
    const filteredIndexes = questions
      .map((q, i) => ({ topic: mapDomainToTopic(q.domain), index: i }))
      .filter((q) => activeTopics.includes(q.topic))
      .map((q) => q.index);
    const currentFilteredIndex = filteredIndexes.indexOf(currentIndex);
    const nextIndex = filteredIndexes[(currentFilteredIndex + 1) % filteredIndexes.length];
    setCurrentIndex(nextIndex);
  }

  function toggleTopic(topic) {
    setActiveTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  }

  if (!current) return <div>Loading questions...</div>;

  return (
    <>
      <div className="question-bank">
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
                  cursor: "pointer",
                  border: isActive ? `1px solid ${color}` : "1px solid #d1d5db",
                }}
                title={`Toggle ${topic}`}
              >
                {topic}
              </span>
            );
          })}
          <span className="difficulty">{current.difficulty}</span>
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
                aria-pressed={isSelected}
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
            ✅ {buttonText}
          </button>

          {feedback === "correct" && (
            <button className="action-btn next" onClick={handleNext}>
              ⏭️ Next Question
            </button>
          )}

          <button className="action-btn skip" onClick={handleNext}>
            ⏩ Skip
          </button>

          <button
            className={`action-btn explain ${showExplanation ? "open" : ""}`}
            onClick={() => setShowExplanation((prev) => !prev)}
          >
            📘 {showExplanation ? "Hide Explanation" : "Show Explanation"}
          </button>

          <button
            className={`action-btn map ${showNavigator ? "open" : ""}`}
            onClick={() => setShowNavigator((s) => !s)}
            aria-expanded={showNavigator}
          >
            🗺️ {showNavigator ? "Hide Map" : "Show Map"}
          </button>

          <button className="action-btn calc" onClick={() => setShowCalc(true)}>
            🧮 Open Calculator
          </button>
        </div>

        {showExplanation && (
          <div className="explanation-box">
            <strong>Explanation:</strong>
            <p>{renderWithMath(current.question.explanation)}</p>
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
              if (!activeTopics.includes(topic)) return null;

              const isActive = i === currentIndex;
              const color = topicColors[topic];

              return (
                <button
                  key={i}
                  className={`nav-btn ${isActive ? "active" : ""}`}
                  style={{ backgroundColor: color }}
                  title={`${i + 1}: ${topic}`}
                  onClick={() => {
                    setCurrentIndex(i);
                    setSelected(null);
                    setFeedback("");
                    setButtonText("Guess");
                    setShowExplanation(false);
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
    </>
  );
}
