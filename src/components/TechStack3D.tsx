"use client";

import { useRef, useState, useEffect } from "react";
import {
  SiPython, SiTypescript, SiJavascript,
  SiReact, SiTailwindcss, SiVite, SiNextdotjs, SiDotnet,
  SiDocker, SiJenkins, SiGit, SiBitbucket, SiSonarqube, SiKubernetes,
  SiApple, SiLinux, SiUnraid,
} from "react-icons/si";
import { FaJava, FaWindows } from "react-icons/fa6";
import { TbBrandCSharp } from "react-icons/tb";
import type { IconType } from "react-icons";

interface TechItem {
  name: string;
  icon: IconType;
  color: string;
}

const allTech: TechItem[] = [
  // Languages
  { name: "C#", icon: TbBrandCSharp, color: "#68217a" },
  { name: "Python", icon: SiPython, color: "#3776ab" },
  { name: "Java", icon: FaJava, color: "#ea2d2e" },
  { name: "TypeScript", icon: SiTypescript, color: "#3178c6" },
  { name: "JavaScript", icon: SiJavascript, color: "#f7df1e" },
  // Frameworks
  { name: "React", icon: SiReact, color: "#61dafb" },
  { name: "Next.js", icon: SiNextdotjs, color: "#ffffff" },
  { name: ".NET", icon: SiDotnet, color: "#512bd4" },
  { name: "Tailwind", icon: SiTailwindcss, color: "#06b6d4" },
  { name: "Vite", icon: SiVite, color: "#646cff" },
  // DevOps
  { name: "Docker", icon: SiDocker, color: "#2496ed" },
  { name: "Kubernetes", icon: SiKubernetes, color: "#326ce5" },
  { name: "Jenkins", icon: SiJenkins, color: "#d24939" },
  { name: "Git", icon: SiGit, color: "#f05032" },
  { name: "Bitbucket", icon: SiBitbucket, color: "#0052cc" },
  { name: "SonarQube", icon: SiSonarqube, color: "#4e9bcd" },
  // Infrastructure
  { name: "Linux", icon: SiLinux, color: "#fcc624" },
  { name: "Windows", icon: FaWindows, color: "#0078d4" },
  { name: "macOS", icon: SiApple, color: "#a3a3a3" },
  { name: "Unraid", icon: SiUnraid, color: "#f15a2c" },
];

export default function TechStack3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      setMousePos({ x: x * 15, y: y * -15 });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      return () => container.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ perspective: "1000px" }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setMousePos({ x: 0, y: 0 });
      }}
    >
      {/* 3D Container */}
      <div
        className="border border-border rounded-2xl bg-bg-node/30 backdrop-blur-sm p-8 transition-transform duration-300 ease-out"
        style={{
          transform: isHovering
            ? `rotateX(${mousePos.y}deg) rotateY(${mousePos.x}deg)`
            : "rotateX(0deg) rotateY(0deg)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Glowing background effect */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${50 + mousePos.x * 2}% ${50 - mousePos.y * 2}%, var(--accent-glow) 0%, transparent 50%)`,
            opacity: isHovering ? 1 : 0,
          }}
        />

        {/* Grid of tech icons */}
        <div className="relative grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-10 gap-4">
          {allTech.map((tech, index) => {
            const Icon = tech.icon;
            const isHovered = hoveredTech === tech.name;
            // Calculate depth based on position for 3D effect
            const row = Math.floor(index / 10);
            const col = index % 10;
            const depth = 20 + (row * 5) + (col * 2);

            return (
              <div
                key={tech.name}
                className="group relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300 cursor-pointer"
                style={{
                  transform: `translateZ(${isHovered ? depth + 30 : depth}px)`,
                  transformStyle: "preserve-3d",
                }}
                onMouseEnter={() => setHoveredTech(tech.name)}
                onMouseLeave={() => setHoveredTech(null)}
              >
                {/* Glow effect behind icon */}
                <div
                  className="absolute inset-0 rounded-xl transition-all duration-300"
                  style={{
                    background: isHovered ? `radial-gradient(circle, ${tech.color}40 0%, transparent 70%)` : "transparent",
                    boxShadow: isHovered ? `0 0 30px ${tech.color}60, 0 0 60px ${tech.color}30` : "none",
                  }}
                />

                {/* Icon */}
                <div
                  className="relative z-10 p-3 rounded-lg border border-border bg-bg-node/80 transition-all duration-300"
                  style={{
                    borderColor: isHovered ? tech.color : undefined,
                    boxShadow: isHovered ? `0 0 20px ${tech.color}50` : undefined,
                    transform: isHovered ? "scale(1.15)" : "scale(1)",
                  }}
                >
                  <Icon
                    className="w-7 h-7 sm:w-8 sm:h-8 transition-colors duration-300"
                    style={{ color: isHovered ? tech.color : "var(--text-tertiary)" }}
                  />
                </div>

                {/* Label - appears on hover */}
                <span
                  className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap transition-all duration-300 z-20"
                  style={{
                    opacity: isHovered ? 1 : 0,
                    transform: `translateX(-50%) translateY(${isHovered ? 0 : -10}px)`,
                    color: tech.color,
                    textShadow: `0 0 10px ${tech.color}`,
                  }}
                >
                  {tech.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-accent/30 animate-float"
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i * 0.5}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
