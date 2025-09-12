import React, { useEffect, useRef } from "react";
import Desmos from "desmos";
import Draggable from "react-draggable";
import "./DesmosModal.css";

export default function DesmosModal({ onClose }) {
  const calcRef = useRef(null);
  const nodeRef = useRef(null); // NEW: for react-draggable

  useEffect(() => {
    if (!calcRef.current) return;
    const calculator = Desmos.GraphingCalculator(calcRef.current, {
      expressions: true,
      keypad: true,
    });
    return () => calculator.destroy();
  }, []);

  return (
    <Draggable handle=".desmos-header" nodeRef={nodeRef}>
      <div className="desmos-modal" ref={nodeRef}>
        <div className="desmos-header">
          <span>📐 Desmos Calculator</span>
<button className="close-btn" onClick={onClose} aria-label="Close Calculator">
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
</button>

        </div>
        <div className="desmos-body" ref={calcRef}></div>
      </div>
    </Draggable>
  );
}
