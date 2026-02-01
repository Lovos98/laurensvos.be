"use client";

import { useState, useRef, useCallback } from "react";

export default function ValentijnPage() {
  const [accepted, setAccepted] = useState(false);
  const [noButtonStyle, setNoButtonStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const moveNoButton = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current.getBoundingClientRect();
    const buttonWidth = 120;
    const buttonHeight = 50;
    const padding = 20;

    const maxX = container.width - buttonWidth - padding;
    const maxY = container.height - buttonHeight - padding;

    const newX = Math.random() * maxX + padding;
    const newY = Math.random() * maxY + padding;

    setNoButtonStyle({
      position: "absolute",
      left: `${newX}px`,
      top: `${newY}px`,
      transition: "all 0.15s ease-out",
    });
  }, []);

  if (accepted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-red-400 to-pink-500 flex items-center justify-center">
        <div className="text-center animate-bounce">
          <div className="text-[150px] mb-4">❤️</div>
          <h1 className="text-5xl font-bold text-white drop-shadow-lg">
            Zie je graag!
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-pink-300 via-pink-400 to-red-400 flex flex-col items-center justify-center relative overflow-hidden"
    >
      <div className="text-center z-10 mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg mb-4">
          Wil je mijn Valentijn zijn?
        </h1>
        <div className="text-6xl mb-8">💕</div>
      </div>

      <div className="flex gap-8 z-10">
        <button
          onClick={() => setAccepted(true)}
          className="px-12 py-4 text-2xl font-bold bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transform hover:scale-110 transition-all duration-200"
        >
          Ja!
        </button>

        <button
          style={noButtonStyle.position ? undefined : {}}
          className={`px-12 py-4 text-2xl font-bold bg-gray-400 hover:bg-gray-500 text-white rounded-full shadow-lg ${
            noButtonStyle.position ? "" : ""
          }`}
          onMouseEnter={moveNoButton}
          onTouchStart={(e) => {
            e.preventDefault();
            moveNoButton();
          }}
          {...(noButtonStyle.position && { style: noButtonStyle })}
        >
          Nee
        </button>
      </div>

      {/* Floating hearts background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            💗
          </div>
        ))}
      </div>
    </div>
  );
}
