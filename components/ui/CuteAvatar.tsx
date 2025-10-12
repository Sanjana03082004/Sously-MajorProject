"use client";
import React, { useState, useEffect } from "react";

export type MouthShape = "rest" | "a" | "e" | "o" | "m";

export default function PrettyGirlFace({
  width = 260,
  height = 260,
  mouth = "rest",
  hairColor = "#322d28ff", // Rich brown for long hair
  skinColor = "#F9D5BE", 
  cheekColor = "#FFC9CF", 
  eyeAccentColor = "#2c3042ff", 
  blush = true, 
}: {
  width?: number;
  height?: number;
  mouth?: MouthShape;
  hairColor?: string; 
  skinColor?: string;
  cheekColor?: string;
  eyeAccentColor?: string; 
  blush?: boolean; 
}) {
  const cheekStyle = blush ? {
    animation: "blush 2s infinite alternate ease-in-out",
  } : {};

  return (
    <svg width={width} height={height} viewBox="0 0 260 260" aria-hidden="true" style={{ display: "block" }}>
      <style>
        {`
          @keyframes blush {
            0% { opacity: 0.8; }
            100% { opacity: 1; }
          }
        `}
      </style>
      <defs>
        <radialGradient id="headGlow" cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ==== LONG HAIR (BACK) - IMPROVED ==== */}
      <LongHairBack color={hairColor} />

      {/* ==== HEAD ==== */}
      <g transform="translate(50,50)"> 
        <rect x="0" y="0" width="145" height="160" rx="100" fill={skinColor} />
        <rect x="0" y="0" width="145" height="160" rx="100" fill="url(#headGlow)" />
      </g>
      
      {/* ==== LONG HAIR (FRONT FRINGE) - IMPROVED ==== */}
      <LongHairFront color={hairColor} />

      {/* ==== EYES (WITH MOVEMENT) ==== */}
      <EyeMovement 
        xLeft={90} 
        xRight={166} 
        y={110} 
        eyeAccentColor={eyeAccentColor} 
      />

      {/* ==== NOSE ==== */}
      <path d="M125 145 Q 128 143, 131 145" stroke="#A86F58" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* ==== CHEEKS ==== */}
      <g style={cheekStyle}>
        <ellipse cx="85" cy="150" rx="14" ry="8" fill={cheekColor} />
        <ellipse cx="170" cy="150" rx="14" ry="8" fill={cheekColor} />
      </g>

      {/* ==== MOUTH ==== */}
      <Mouth cx={128} cy={175} shape={mouth} color="#D9485B" />
    </svg>
  );
}

// -------------------------------------------------------------
// IMPROVED COMPONENT: Long Hair Background
// -------------------------------------------------------------
function LongHairBack({ color }: { color: string }) {
  // New shape: wider top, flowing curves down
  return (
    <path 
        d="M30 90 
           C 30 60, 40 -10, 130 10 
           C 160 10, 200 10, 215 90 
           L 230 250 
           C 200 240, 180 230, 130 230 
           C 80 230, 60 240, 30 250 Z" 
        fill={color} 
    />
  );
}

// -------------------------------------------------------------
// IMPROVED COMPONENT: Long Hair Fringe/Side Locks
// -------------------------------------------------------------
function LongHairFront({ color }: { color: string }) {
  return (
    <>
      {/* Fringe/Top Curve - Softer, more natural fringe */}
      <path 
        d="M60 85 
           C 50 40, 250 20, 100 85 
           L 100 55 
           C 160 70, 128 65, 60 95 Z" 
        fill={color} 
      />
      
      {/* Left flowing side lock, with a gentle wave */}
      <path 
        d="M56 100 
           Q 46 150, 60 200 
           C 65 220, 50 240, 50 250 
           L 50 100 Z" 
        fill={color} 
      />
      
      {/* Right flowing side lock, with a gentle wave */}
      <path 
        d="M204 100 
           Q 214 150, 200 200 
           C 195 220, 210 240, 210 250 
           L 210 100 Z" 
        fill={color} 
      />
    </>
  );
}


// -------------------------------------------------------------
// EyeMovement Component (Handles gaze and blink)
// -------------------------------------------------------------
function EyeMovement({
  xLeft,
  xRight,
  y,
  eyeAccentColor,
}: {
  xLeft: number;
  xRight: number;
  y: number;
  eyeAccentColor: string;
}) {
  const [gazeOffset, setGazeOffset] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);

  // Randomize gaze every few seconds
  useEffect(() => {
    const gazeInterval = setInterval(() => {
      const offsetX = Math.floor(Math.random() * 10) - 5; // -5 to 5
      const offsetY = Math.floor(Math.random() * 8) - 4;  // -4 to 4
      setGazeOffset({ x: offsetX, y: offsetY });
    }, 3000);

    return () => clearInterval(gazeInterval);
  }, []);

  // Randomize blinks
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150); // Blink duration
    }, Math.random() * 4000 + 2000); 

    return () => clearInterval(blinkInterval);
  }, []);

  if (blink) {
    return (
      <g stroke="#333" strokeWidth={4} strokeLinecap="round">
        <line x1={xLeft - 10} y1={y} x2={xLeft + 10} y2={y} />
        <line x1={xRight - 10} y1={y} x2={xRight + 10} y2={y} />
      </g>
    );
  }

  return (
    <>
      <Eye 
        cx={xLeft} 
        cy={y} 
        gazeOffset={gazeOffset} 
        eyeAccentColor={eyeAccentColor} 
      />
      <Eye 
        cx={xRight} 
        cy={y} 
        gazeOffset={gazeOffset} 
        eyeAccentColor={eyeAccentColor} 
      />
    </>
  );
}

// -------------------------------------------------------------
// Eye Component (Big, pretty eyes)
// -------------------------------------------------------------
function Eye({ cx, cy, gazeOffset, eyeAccentColor }: { cx: number; cy: number; gazeOffset: { x: number; y: number; }; eyeAccentColor: string; }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx="19" ry="20" fill="#fff" />
      
      {/* Iris and Pupil with gaze offset */}
      <circle 
        cx={cx + gazeOffset.x} 
        cy={cy + gazeOffset.y + 1} 
        r="11" 
        fill="#7A8598" 
      />
      <circle 
        cx={cx + gazeOffset.x + 1} 
        cy={cy + gazeOffset.y + 2} 
        r="6.5" 
        fill={eyeAccentColor} 
      />
      
      {/* Specular Highlights for sparkle */}
      <circle cx={cx + gazeOffset.x + 5} cy={cy + gazeOffset.y - 6} r="2.5" fill="#fff" opacity="0.9" />
      <circle cx={cx + gazeOffset.x - 7} cy={cy + gazeOffset.y - 2} r="1" fill="#fff" opacity="0.8" />
      
      {/* Soft Eyelid / Shadow */}
      <path d={`M ${cx - 19} ${cy - 5} Q ${cx} ${cy - 12} ${cx + 19} ${cy - 5} L ${cx + 19} ${cy - 10} L ${cx - 19} ${cy - 10} Z`} fill="#E8E2FF" />
    </g>
  );
}

// -------------------------------------------------------------
// Mouth Component
// -------------------------------------------------------------
function Mouth({ cx, cy, shape, color }: { cx: number; cy: number; shape: MouthShape; color: string }) {
  if (shape === "rest") return <path d={`M ${cx - 16} ${cy} Q ${cx} ${cy + 8} ${cx + 16} ${cy}`} stroke={color} strokeWidth={3} strokeLinecap="round" fill="none" />;
  if (shape === "a") return <ellipse cx={cx} cy={cy + 2} rx="14" ry="10" fill={color} />;
  if (shape === "e") return <ellipse cx={cx} cy={cy + 2} rx="18" ry="6" fill={color} />;
  if (shape === "o") return <circle cx={cx} cy={cy + 3} r="8" fill={color} />;
  return <rect x={cx - 14} y={cy - 2} width="28" height="5" rx="2.5" fill={color} />;
}