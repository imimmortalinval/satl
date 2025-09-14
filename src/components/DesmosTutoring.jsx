import React from "react";
import "./DesmosTutoring.css";

const tutoringSlots = [
  {
    id: 1,
    title: "Problem #1",
    image: "https://i.gyazo.com/4baf1548e0b22b9af06f9580c77ffd60.png",
    desmosUrl: "https://www.desmos.com/calculator/yxtdrv87wa",
  },
  {
    id: 2,
    title: "Problem #2",
    image: "https://i.gyazo.com/48146e18d0938631faf2bdda9061ce00.png",
    desmosUrl: "https://www.desmos.com/calculator/eey3purgqo",
  },
  {
    id: 3,
    title: "Problem #3",
    image: "https://i.gyazo.com/cf1056f7c35e12bd1322400948fbf5fa.png",
    desmosUrl: "https://www.desmos.com/calculator/lbf4gjk8mr",
  },
  {
    id: 4,
    title: "Problem #4",
    image: "https://i.gyazo.com/9621872ce896d8613f20716a92fbe7ea.png",
    desmosUrl: "https://www.desmos.com/calculator/zcyb6sxnl6",
  },
  {
    id: 5,
    title: "Problem #5",
    image: "https://i.gyazo.com/96973a92f5c7f9313681e70105172d6d.png",
    desmosUrl: "https://www.desmos.com/calculator/hufz9nc3kd",
  },
  {
    id: 6,
    title: "Problem #6",
    image: "https://i.gyazo.com/ef742a7c3d259e4a292fdaa797356e32.png",
    desmosUrl: "https://www.desmos.com/calculator/kx07i8enup",
  },
  {
    id: 7,
    title: "Problem #7",
    image: "https://i.gyazo.com/583b8fa55666153e8d97c3e47647e2e3.png",
    desmosUrl: "https://www.desmos.com/calculator/0cmwfs7biw",
  },
];

export default function DesmosTutoring() {
  return (
    <div className="desmos-gallery">
      <h2>📚 Desmos Tutoring</h2>
      <p>Click any image to open its interactive graph in Desmos.</p>
      <div className="tutoring-grid">
        {tutoringSlots.map((slot) => (
          <a
            key={slot.id}
            href={slot.desmosUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="tutoring-card"
          >
            <img src={slot.image} alt={slot.title} />
            <div className="tutoring-label">{slot.title}</div>
          </a>
        ))}
      </div>
    </div>
  );
}


