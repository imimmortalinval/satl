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
    image: "https://via.placeholder.com/300x180?text=Problem+7",
    desmosUrl: "https://www.desmos.com/calculator/yxtdrv87wa",
  },
  {
    id: 8,
    title: "Problem #8",
    image: "https://via.placeholder.com/300x180?text=Problem+8",
    desmosUrl: "https://www.desmos.com/calculator/yxtdrv87wa",
  },
  {
    id: 9,
    title: "Problem #9",
    image: "https://via.placeholder.com/300x180?text=Problem+9",
    desmosUrl: "https://www.desmos.com/calculator/yxtdrv87wa",
  },
  {
    id: 10,
    title: "Problem #10",
    image: "https://via.placeholder.com/300x180?text=Problem+10",
    desmosUrl: "https://www.desmos.com/calculator/yxtdrv87wa",
  },
  {
    id: 11,
    title: "Problem #11",
    image: "https://via.placeholder.com/300x180?text=Problem+11",
    desmosUrl: "https://www.desmos.com/calculator/yxtdrv87wa",
  },
  {
    id: 12,
    title: "Problem #12",
    image: "https://via.placeholder.com/300x180?text=Problem+12",
    desmosUrl: "https://www.desmos.com/calculator/yxtdrv87wa",
  },
  {
    id: 13,
    title: "Problem #13",
    image: "https://via.placeholder.com/300x180?text=Problem+13",
    desmosUrl: "https://www.desmos.com/calculator/yxtdrv87wa",
  },
  {
    id: 14,
    title: "Problem #14",
    image: "https://via.placeholder.com/300x180?text=Problem+14",
    desmosUrl: "https://www.desmos.com/calculator/yxtdrv87wa",
  },
  {
    id: 15,
    title: "Problem #15",
    image: "https://via.placeholder.com/300x180?text=Problem+15",
    desmosUrl: "https://www.desmos.com/calculator/yxtdrv87wa",
  },
  {
    id: 16,
    title: "Problem #16",
    image: "https://via.placeholder.com/300x180?text=Problem+16",
    desmosUrl: "https://www.desmos.com/calculator/yxtdrv87wa",
  },
  {
    id: 17,
    title: "Problem #17",
    image: "https://via.placeholder.com/300x180?text=Problem+17",
    desmosUrl: "https://www.desmos.com/calculator/yxtdrv87wa",
  },
  {
    id: 18,
    title: "Problem #18",
    image: "https://via.placeholder.com/300x180?text=Problem+18",
    desmosUrl: "https://www.desmos.com/calculator/yxtdrv87wa",
  },
  {
    id: 19,
    title: "Problem #19",
    image: "",
    desmosUrl: "",
  },
  {
    id: 20,
    title: "Problem #20",
    image: "",
    desmosUrl: "",
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
