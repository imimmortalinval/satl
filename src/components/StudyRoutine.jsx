import React, { useMemo, useState } from "react";
import "./StudyRoutine.css";

function daysBetween(startISO, endISO) {
  const start = new Date(new Date(startISO).toDateString());
  const end = new Date(new Date(endISO).toDateString());
  const ms = end.getTime() - start.getTime();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

function formatDateISO(date) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(dateISO, n) {
  const d = new Date(dateISO);
  d.setDate(d.getDate() + n);
  return formatDateISO(d);
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

const DEFAULT_MINUTES = 60;

const intensityFromMinutes = (weightedMinutes) => {
  if (weightedMinutes <= 45) return "light";
  if (weightedMinutes <= 90) return "moderate";
  return "heavy";
};

// Task factories (time-based, not capped counts)
const Tasks = {
  mathDesmosBootcamp: (minutes) => ({
    icon: "➗",
    title: "Math Bootcamp: Desmos + Hard Problems",
    details: [
      "Desmos mastery: table, trace, intersection, sliders",
      "Focused hard-problem sprints emphasizing setup + modeling",
      "Reflect: log errors, note trap patterns",
    ],
    minutes,
    tag: "Math",
    type: "bootcamp",
    weight: 1.2,
  }),
  mathHardOnly: (minutes) => ({
    icon: "🧮",
    title: "Math: Hard Problem Session",
    details: [
      "Timed block: 35–45 minutes of hard-level questions",
      "Prioritize weak topics from your error log",
      "Close with 3 grid-ins under time pressure",
    ],
    minutes,
    tag: "Math",
    type: "drill",
    weight: 1.1,
  }),
  mathMixedTimed: (minutes) => ({
    icon: "⏱️",
    title: "Math: Mixed Timed Drills",
    details: [
      "Two timed sprints (12–15 min) with strict pacing",
      "Alternate calculator and no-calculator sets",
      "Quick review between sprints",
    ],
    minutes,
    tag: "Math",
    type: "timed",
    weight: 1.0,
  }),
  rwGrammarRules: (minutes) => ({
    icon: "📘",
    title: "R&W: Grammar Rules Sprint",
    details: [
      "Hit core rules: commas, colons/semicolons, S–V, pronouns, modifiers",
      "Apply with 15–20 targeted items (timed sets)",
      "Micro-notes for any missed rule",
    ],
    minutes,
    tag: "R&W",
    type: "study",
    weight: 0.9,
  }),
  rwPracticePassages: (minutes) => ({
    icon: "📖",
    title: "R&W: Passage Drills",
    details: [
      "2–3 passages timed (9–11 min each)",
      "Emphasize evidence questions and transitions",
      "Annotate misreads and eliminate trap answers",
    ],
    minutes,
    tag: "R&W",
    type: "timed",
    weight: 1.0,
  }),
  fullLengthMini: (minutes) => ({
    icon: "✅",
    title: "Mini Practice Test",
    details: [
      "One Math section + one R&W section back-to-back",
      "Strict timing + bubble discipline",
      "Post-test: 3 takeaways into error log",
    ],
    minutes,
    tag: "Mixed",
    type: "mini-test",
    weight: 1.2,
  }),
  fullLengthMock: (minutes) => ({
    icon: "🧪",
    title: "Full-Length Practice Test",
    details: [
      "Simulate test conditions (morning start, minimal breaks)",
      "Score, update error log, refine pacing notes",
      "Compare first-third vs last-third accuracy",
    ],
    minutes,
    tag: "Mixed",
    type: "full-test",
    weight: 1.4,
  }),
  reviewReset: (minutes) => ({
    icon: "🧭",
    title: "Review + Reset",
    details: [
      "Error log sweep (Math + R&W)",
      "Re-do 6 previously missed questions",
      "Refine strategy for the next week",
    ],
    minutes,
    tag: "Review",
    type: "review",
    weight: 0.7,
  }),
};

function generatePlan({
  mathScore,
  rwScore,
  testDate,
  dailyMinutes,
  todayISO,
  preferredDays,
}) {
  const daysLeft = daysBetween(todayISO, testDate);
  if (daysLeft === 0) return [];

  const minutes = dailyMinutes || DEFAULT_MINUTES;

  const mathUnder700 = mathScore < 700;
  const rwUnder700 = rwScore < 700;

  // Allocation ratios by need (kept balanced and leaving room for mixed/tests)
  let mathRatio = mathUnder700 ? 0.58 : 0.46;
  let rwRatio = rwUnder700 ? 0.52 : 0.42;
  const sum = mathRatio + rwRatio;
  if (sum > 0.9) {
    mathRatio *= 0.9 / sum;
    rwRatio *= 0.9 / sum;
  }
  const mixedRatio = 1 - (mathRatio + rwRatio);

  const fullMocks = daysLeft >= 15 ? Math.max(1, Math.floor(daysLeft / 12)) : (daysLeft >= 7 ? 1 : 0);

  const plan = [];
  let bootcampMathDays = mathUnder700 ? Math.min(7, daysLeft) : 0;

  for (let i = 0; i < daysLeft; i++) {
    const dateISO = addDays(todayISO, i);
    const dayOfWeek = new Date(dateISO).getDay();
    const isPreferred = preferredDays.length ? preferredDays.includes(dayOfWeek) : true;
    const isReviewDay = isPreferred && i > 0 && i % 7 === 6;

    if (!isPreferred) {
      const t = Tasks.reviewReset(Math.round(minutes * 0.5));
      plan.push({
        date: dateISO,
        tasks: [t],
        intensity: "light",
        notes: "Light maintenance on a rest day.",
        completed: false,
      });
      continue;
    }

    if (isReviewDay) {
      const t = Tasks.reviewReset(Math.round(minutes * 0.8));
      plan.push({
        date: dateISO,
        tasks: [t],
        intensity: intensityFromMinutes(t.minutes * t.weight),
        notes: "Weekly consolidation and error-log work.",
        completed: false,
      });
      continue;
    }

    const tasks = [];
    let allocated = 0;

    // Math
    const mathMinutes = Math.round(minutes * mathRatio);
    if (bootcampMathDays > 0) {
      const t = Tasks.mathDesmosBootcamp(mathMinutes);
      tasks.push(t);
      allocated += mathMinutes;
      bootcampMathDays--;
    } else {
      const t = (i % 2 === 0) ? Tasks.mathHardOnly(mathMinutes) : Tasks.mathMixedTimed(mathMinutes);
      tasks.push(t);
      allocated += mathMinutes;
    }

    // Reading/Writing
    const rwMinutes = Math.round(minutes * rwRatio);
    if (rwUnder700) {
      const t = (i % 3 === 0 || i < 5) ? Tasks.rwGrammarRules(rwMinutes) : Tasks.rwPracticePassages(rwMinutes);
      tasks.push(t);
    } else {
      const t = (i % 4 === 0) ? Tasks.rwGrammarRules(Math.round(rwMinutes * 0.7)) : Tasks.rwPracticePassages(rwMinutes);
      tasks.push(t);
    }
    allocated += rwMinutes;

    // Mixed/tests
    const remaining = Math.max(0, minutes - allocated);
    let mixedTask = null;

    const wantsMock = fullMocks > 0 && (i > 0 && (i % 10 === 8 || i >= daysLeft - 3));
    if (wantsMock) {
      mixedTask = Tasks.fullLengthMock(Math.max(60, Math.round(minutes * 1.2)));
    } else if (mixedRatio > 0.05 && remaining >= 20) {
      mixedTask = Tasks.fullLengthMini(Math.round(remaining));
    }
    if (mixedTask) tasks.push(mixedTask);

    const totalWeighted = tasks.reduce((s, t) => s + t.minutes * t.weight, 0);
    const intensity = intensityFromMinutes(totalWeighted);

    plan.push({
      date: dateISO,
      tasks,
      intensity,
      notes: null,
      completed: false,
    });
  }

  // Ensure we don’t overschedule full mocks
  const mockIdxs = [];
  plan.forEach((d, idx) => {
    if (d.tasks.some((t) => t.type === "full-test")) mockIdxs.push(idx);
  });
  if (mockIdxs.length > fullMocks) {
    const extra = mockIdxs.length - fullMocks;
    for (let k = 0; k < extra; k++) {
      const idx = mockIdxs[mockIdxs.length - 1 - k];
      const fallback = Tasks.fullLengthMini(Math.round((plan[idx].tasks[0]?.minutes || DEFAULT_MINUTES) * 0.8));
      plan[idx].tasks = plan[idx].tasks.filter((t) => t.type !== "full-test");
      plan[idx].tasks.push(fallback);
      const totalWeighted = plan[idx].tasks.reduce((s, t) => s + t.minutes * t.weight, 0);
      plan[idx].intensity = intensityFromMinutes(totalWeighted);
    }
  }
  return plan;
}

export default function StudyRoutine() {
  const todayISO = formatDateISO(new Date());
  const [mathScore, setMathScore] = useState(650);
  const [rwScore, setRwScore] = useState(660);
  const [startDate, setStartDate] = useState(todayISO);
  const [testDate, setTestDate] = useState(addDays(todayISO, 30));
  const [dailyMinutes, setDailyMinutes] = useState(60);
  const [preferredDays, setPreferredDays] = useState([1, 2, 3, 4, 5]); // Mon–Fri
  const [plan, setPlan] = useState([]);

  const daysLeft = useMemo(() => daysBetween(todayISO, testDate), [todayISO, testDate]);
  const totalDays = useMemo(() => daysBetween(startDate, testDate), [startDate, testDate]);
  const elapsedDays = useMemo(() => daysBetween(startDate, todayISO), [startDate, todayISO]);
  const timeProgress = totalDays > 0 ? Math.min(100, Math.max(0, Math.round((elapsedDays / totalDays) * 100))) : 0;
  const completionProgress = plan.length > 0
    ? Math.round((plan.filter((d) => d.completed).length / plan.length) * 100)
    : 0;

  const handleGenerate = () => {
    const m = clamp(Number(mathScore) || 0, 200, 800);
    const r = clamp(Number(rwScore) || 0, 200, 800);
    const mins = clamp(Number(dailyMinutes) || DEFAULT_MINUTES, 20, 240);
    const p = generatePlan({
      mathScore: m,
      rwScore: r,
      testDate,
      dailyMinutes: mins,
      todayISO,
      preferredDays,
    });
    setPlan(p);
  };

  const handlePreferredToggle = (dow) => {
    setPreferredDays((prev) =>
      prev.includes(dow) ? prev.filter((d) => d !== dow) : [...prev, dow].sort()
    );
  };

  const markCompleted = (idx) => {
    setPlan((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], completed: !next[idx].completed };
      return next;
    });
  };

  const markMissedAndReschedule = (idx) => {
    setPlan((prev) => {
      const next = [...prev];
      const missed = next[idx];
      if (!missed) return prev;

      for (let j = idx + 1; j < next.length; j++) {
        const d = next[j];
        if (d && d.tasks) {
          d.tasks = [
            ...d.tasks,
            ...missed.tasks.map((t) => ({ ...t, minutes: Math.round(t.minutes * 0.9) })),
          ];
          const totalWeighted = d.tasks.reduce((s, t) => s + t.minutes * t.weight, 0);
          d.intensity = intensityFromMinutes(totalWeighted);
          break;
        }
      }
      next[idx] = {
        ...missed,
        tasks: [Tasks.reviewReset(Math.round((missed.tasks[0]?.minutes || DEFAULT_MINUTES) * 0.6))],
        notes: "Rescheduled original tasks forward. Use today for light review.",
        completed: false,
        intensity: "light",
      };
      return next;
    });
  };

  return (
    <div className="sr-root">
      <header className="sr-header glass">
        <div className="sr-header-top">
          <h1>Study Routine</h1>
          <p className="subtitle">
            Routine optimized for your current scores and time remaining.
          </p>
        </div>

        <div className="progress-wrap">
          <div className="progress-item">
            <div className="progress-label">
              <span>Time progress</span>
              <span className="progress-value">{timeProgress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${timeProgress}%` }} />
            </div>
            <div className="progress-meta">
              <span>Start: {startDate}</span>
              <span>Today: {todayISO}</span>
              <span>Test: {testDate}</span>
            </div>
          </div>

          <div className="progress-item">
            <div className="progress-label">
              <span>Plan completion</span>
              <span className="progress-value">{completionProgress}%</span>
            </div>
            <div className="progress-bar alt">
              <div className="progress-fill" style={{ width: `${completionProgress}%` }} />
            </div>
            <div className="progress-meta">
              <span>Days done: {plan.filter((d) => d.completed).length}</span>
              <span>Total days: {plan.length}</span>
            </div>
          </div>
        </div>

        <div className="inputs-grid">
          <div className="input-item">
            <label>Start date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="input-item">
            <label>Test date</label>
            <input
              type="date"
              value={testDate}
              onChange={(e) => setTestDate(e.target.value)}
            />
          </div>
          <div className="input-item">
            <label>Math score</label>
            <input
              type="number"
              min={200}
              max={800}
              value={mathScore}
              onChange={(e) => setMathScore(e.target.value)}
              placeholder="e.g., 650"
            />
          </div>
          <div className="input-item">
            <label>Reading/Writing score</label>
            <input
              type="number"
              min={200}
              max={800}
              value={rwScore}
              onChange={(e) => setRwScore(e.target.value)}
              placeholder="e.g., 680"
            />
          </div>
          <div className="input-item">
            <label>Daily minutes</label>
            <input
              type="number"
              min={20}
              max={240}
              step={5}
              value={dailyMinutes}
              onChange={(e) => setDailyMinutes(e.target.value)}
              placeholder="60"
            />
          </div>

          <div className="input-item days-select">
            <label>Preferred study days</label>
            <div className="days-row">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <button
                  key={i}
                  type="button"
                  className={`day-chip ${preferredDays.includes(i) ? "active" : ""}`}
                  onClick={() => handlePreferredToggle(i)}
                  aria-pressed={preferredDays.includes(i)}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="actions">
            <button className="btn primary" onClick={handleGenerate}>
              Generate plan
            </button>
          </div>
        </div>
      </header>

      <main className="plan-grid">
        {plan.length === 0 ? (
          <div className="empty glass">
            <h3>No plan yet</h3>
            <p>Enter your scores, set dates, and hit Generate.</p>
          </div>
        ) : (
          plan.map((day, idx) => (
            <article
              key={day.date}
              className={`day-card glass intensity-${day.intensity} ${day.completed ? "completed" : ""}`}
            >
              <header className="day-header">
                <div className="date">
                  <span className="dow">
                    {new Date(day.date).toLocaleDateString(undefined, { weekday: "short" })}
                  </span>
                  <h4>{new Date(day.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</h4>
                </div>
                <div className="tags">
                  {Array.from(new Set(day.tasks.map((t) => t.tag))).map((tag) => (
                    <span key={tag} className={`tag tag-${tag.replace("&", "").toLowerCase()}`}>{tag}</span>
                  ))}
                  <span className={`intensity chip ${day.intensity}`}>{day.intensity}</span>
                </div>
              </header>

              <ul className="tasks">
                {day.tasks.map((t, i2) => (
                  <li key={i2} className="task">
                    <div className="task-main">
                      <div className="task-title">
                        <span className="task-emoji" aria-hidden>{t.icon}</span>
                        {t.title}
                      </div>
                      <ul className="task-details">
                        {t.details.map((d, j) => (
                          <li key={j}>{d}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="task-meta">
                      <span className="pill">{t.minutes} min</span>
                      <span className="pill subtle">{t.type}</span>
                    </div>
                  </li>
                ))}
              </ul>

              {day.notes && <p className="notes">{day.notes}</p>}

              <footer className="day-actions">
                <button className="btn small" onClick={() => markCompleted(idx)}>
                  {day.completed ? "Undo complete" : "Mark complete"}
                </button>
                <button className="btn small ghost" onClick={() => markMissedAndReschedule(idx)}>
                  Mark missed + reschedule
                </button>
              </footer>
            </article>
          ))
        )}
      </main>
    </div>
  );
}
