"use client";

import { useEffect, useState } from "react";

type Leaf = { x: number; y: number; angle: number; scale: number; opacity: number };

function FernFrond() {
  return (
    <g stroke="#4ade80" fill="none" strokeWidth="1.1" strokeLinecap="round">
      <path d="M0,35 C1,15 0,-10 0,-40" />
      <path d="M0,22 C-5,14 -16,12 -22,18" />
      <path d="M0,22 C5,14 16,12 22,18" />
      <path d="M0,10 C-4,2 -13,1 -18,7" />
      <path d="M0,10 C4,2 13,1 18,7" />
      <path d="M0,-2 C-3,-10 -10,-11 -14,-5" />
      <path d="M0,-2 C3,-10 10,-11 14,-5" />
      <path d="M0,-14 C-2,-20 -7,-21 -9,-16" />
      <path d="M0,-14 C2,-20 7,-21 9,-16" />
      <path d="M0,-26 C-1,-32 1,-34 0,-38" />
    </g>
  );
}

export default function LeafBackground() {
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    setLeaves(
      Array.from({ length: 50 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        angle: Math.random() * 360,
        scale: 0.3 + Math.random() * Math.random() * 1.8,
        opacity: 0.15 + Math.random() * 0.3,
      }))
    );
  }, []);

  if (leaves.length === 0) return null;

  return (
    <div style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", zIndex: 0, pointerEvents: "none" }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        {leaves.map((leaf, i) => (
          <g key={i} transform={`translate(${leaf.x},${leaf.y}) rotate(${leaf.angle}) scale(${leaf.scale})`} opacity={leaf.opacity}>
            <FernFrond />
          </g>
        ))}
      </svg>
    </div>
  );
}
