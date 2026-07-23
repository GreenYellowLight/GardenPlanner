"use client";

import { useEffect, useState } from "react";

type Leaf = { x: number; y: number; angle: number; scale: number; opacity: number };

function FernFrond() {
  return (
    <g stroke="#4ade80" fill="none" strokeWidth="0.9" strokeLinecap="round">
      {/* Main rachis with fiddlehead curl at top */}
      <path d="M0,55 L0,-20 C0,-30 6,-42 13,-40 C18,-38 17,-31 12,-30 C9,-29 8,-34 10,-36" />
      {/* Pinnae pairs, widest in lower-middle, tapering at both ends */}
      <path d="M0,46 C-4,40 -10,40 -11,45" />
      <path d="M0,46 C4,40 10,40 11,45" />
      <path d="M0,36 C-8,28 -18,28 -19,34" />
      <path d="M0,36 C8,28 18,28 19,34" />
      <path d="M0,26 C-12,16 -24,16 -25,23" />
      <path d="M0,26 C12,16 24,16 25,23" />
      <path d="M0,16 C-13,5 -27,5 -27,13" />
      <path d="M0,16 C13,5 27,5 27,13" />
      <path d="M0,6 C-12,-4 -25,-4 -24,3" />
      <path d="M0,6 C12,-4 25,-4 24,3" />
      <path d="M0,-4 C-9,-13 -20,-14 -19,-7" />
      <path d="M0,-4 C9,-13 20,-14 19,-7" />
      <path d="M0,-13 C-6,-20 -14,-21 -13,-15" />
      <path d="M0,-13 C6,-20 14,-21 13,-15" />
      <path d="M0,-20 C-3,-26 -8,-26 -7,-21" />
      <path d="M0,-20 C3,-26 8,-26 7,-21" />
    </g>
  );
}

export default function LeafBackground() {
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    function generate() {
      setLeaves(
        Array.from({ length: 50 }, () => ({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          angle: Math.random() * 360,
          scale: 0.3 + Math.random() * Math.random() * 1.8,
          opacity: 0.15 + Math.random() * 0.3,
        }))
      );
    }
    const observer = new ResizeObserver(generate);
    observer.observe(document.documentElement);
    return () => observer.disconnect();
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
