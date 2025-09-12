import React from "react";
import { InlineMath } from "react-katex";

function sanitizeLatex(latex) {
  return latex
    .replace(/\\(?!\\)/g, "\\\\")            // escape single backslashes
    .replace(/[\f^]?racx/g, "\\frac{x}")     // fix fracx → \frac{x}
    .replace(/[\f^]?rac/g, "\\frac")         // fallback for corrupted frac
    .replace(/sqrt/g, "\\sqrt")
    .replace(/int/g, "\\int")
    .replace(/sum/g, "\\sum");
}


function SafeMath({ math }) {
  try {
    return <InlineMath math={math} />;
  } catch (err) {
    console.warn("KaTeX error:", err);
    return <span style={{ color: "inherit" }}>{math}</span>;
  }
}

export function renderWithMath(text) {
  const parts = [];
  const regex = /(?:\\\((.+?)\\\)|\$(.+?)\$)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const matchIndex = match.index;
    if (matchIndex > lastIndex) {
      parts.push(text.slice(lastIndex, matchIndex));
    }

    let mathContent = match[1] || match[2];
    mathContent = sanitizeLatex(mathContent);

    parts.push(<SafeMath key={parts.length} math={mathContent} />);
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length ? parts : text;
}
