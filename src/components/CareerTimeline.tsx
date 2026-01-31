"use client";

import { useEffect, useRef, useState } from "react";
import experiencesData from "@/data/experiences.json";

interface Badge {
  name: string;
  category: string;
}

interface SkillCategoryDef {
  name: string;
  bg: string;
  border: string;
  text: string;
}

interface Experience {
  id: string;
  company: string;
  role: string;
  description: string;
  badges?: Badge[];
  skills?: Record<string, string[]>;
  startYear: number;
  startMonth: number;
  endYear: number | null;
  endMonth: number | null;
  category: string;
  color: string;
  link?: string;
  row: number;
}

interface ColorConfig {
  label: string;
  bg: string;
  bgHover: string;
  border: string;
  borderSelected: string;
  ring: string;
  dot: string;
  text: string;
}

const experiences: Experience[] = experiencesData.experiences as Experience[];
const colors: Record<string, ColorConfig> = experiencesData.colors as Record<string, ColorConfig>;
const rowLabels: string[] = experiencesData.rowLabels as string[];
const skillCategories: Record<string, SkillCategoryDef> = experiencesData.skillCategories as Record<string, SkillCategoryDef>;

const START_YEAR = 2016;
const END_YEAR = 2026;
const years = Array.from({ length: END_YEAR - START_YEAR + 1 }, (_, i) => START_YEAR + i);

export default function CareerTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedExp, setSelectedExp] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState({ year: 2026, month: 1, day: 30 });
  const [zoomLevel, setZoomLevel] = useState(320); // yearWidth in pixels

  const yearWidth = zoomLevel;
  const monthWidth = yearWidth / 12;
  const rowHeights = [25, 25, 100, 100]; // Company, Role, Project, Personal
  const labelWidth = 80;
  const totalRows = rowLabels.length;

  const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 80, 640));
  const zoomOut = () => setZoomLevel((prev) => Math.max(prev - 80, 160));

  const getRowTop = (row: number) => {
    let top = 0;
    for (let i = 0; i < row; i++) {
      top += rowHeights[i] || 100;
    }
    return top;
  };

  const getTotalHeight = () => {
    return rowHeights.reduce((sum, h) => sum + h, 0);
  };

  // Update current time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime({
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
      });
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to right on mount
  useEffect(() => {
    if (containerRef.current) {
      const scrollWidth = containerRef.current.scrollWidth;
      const clientWidth = containerRef.current.clientWidth;
      containerRef.current.scrollLeft = scrollWidth - clientWidth;
    }
  }, []);

  // Snap to exact month boundaries (like an agenda)
  const getMonthPosition = (year: number, month: number) => {
    return (year - START_YEAR) * yearWidth + (month - 1) * monthWidth;
  };

  const getItemWidth = (startYear: number, startMonth: number, endYear: number | null, endMonth: number | null) => {
    const endY = endYear ?? currentTime.year;
    const endM = endMonth ?? currentTime.month;
    const totalStartMonths = (startYear - START_YEAR) * 12 + (startMonth - 1);
    const totalEndMonths = (endY - START_YEAR) * 12 + endM;
    return (totalEndMonths - totalStartMonths) * monthWidth;
  };

  const getCurrentTimePosition = () => {
    const monthPos = getMonthPosition(currentTime.year, currentTime.month);
    const dayOffset = ((currentTime.day - 1) / 30) * monthWidth;
    return monthPos + dayOffset;
  };

  const formatDateRange = (exp: Experience) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const start = `${months[exp.startMonth - 1]} ${exp.startYear}`;
    const end = exp.endYear ? `${months[(exp.endMonth || 12) - 1]} ${exp.endYear}` : "Present";
    return `${start} — ${end}`;
  };

  const getColorClasses = (colorKey: string, isSelected: boolean) => {
    const config = colors[colorKey];
    if (!config) {
      return {
        node: "bg-gray-500/15 border-gray-500/50 hover:bg-gray-500/25",
        dot: "bg-gray-500",
        text: "text-gray-500",
        border: "border-gray-500/50",
      };
    }
    return {
      node: isSelected
        ? `${config.bg} ${config.borderSelected} ring-2 ${config.ring}`
        : `${config.bg} ${config.border} ${config.bgHover}`,
      dot: config.dot,
      text: config.text,
      border: isSelected ? config.borderSelected : config.border,
    };
  };

  return (
    <div className="flex flex-col">
      <div className="flex">
        {/* Row labels column */}
        <div className="flex-shrink-0 border-r border-border/30 pb-1" style={{ width: labelWidth }}>
          {/* Zoom controls */}
          <div className="h-[44px] border-b border-border/50 flex items-center justify-center gap-1">
            <button
              onClick={zoomOut}
              className="w-6 h-6 flex items-center justify-center rounded border border-border/50 text-text-tertiary hover:text-text-primary hover:border-accent transition-colors text-sm font-medium"
              title="Zoom out"
            >
              -
            </button>
            <button
              onClick={zoomIn}
              className="w-6 h-6 flex items-center justify-center rounded border border-border/50 text-text-tertiary hover:text-text-primary hover:border-accent transition-colors text-sm font-medium"
              title="Zoom in"
            >
              +
            </button>
          </div>
          <div className="h-[28px] border-b border-border/30" />
          {/* Row labels */}
          {rowLabels.map((label, i) => (
            <div
              key={label}
              className="flex items-center justify-end pr-4 text-xs font-medium text-text-tertiary border-b border-border/20"
              style={{ height: rowHeights[i] || 100 }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Scrollable timeline */}
        <div ref={containerRef} className="relative overflow-x-auto scroll-smooth flex-1 timeline-scroll">
          <div className="min-w-max" style={{ width: years.length * yearWidth }}>
            {/* Year headers */}
            <div className="flex border-b border-border/50 sticky top-0 bg-bg-node/90 backdrop-blur-sm z-20">
              {years.map((year) => (
                <div
                  key={year}
                  className="flex-shrink-0 py-3 text-center border-l border-border/30 first:border-l-0"
                  style={{ width: yearWidth }}
                >
                  <span className={`text-sm font-semibold ${year === currentTime.year ? 'text-accent' : 'text-text-secondary'}`}>
                    {year}
                  </span>
                </div>
              ))}
            </div>

            {/* Month sub-headers */}
            <div className="flex border-b border-border/30 sticky top-[44px] bg-bg-node/80 backdrop-blur-sm z-20">
              {years.map((year) => (
                <div key={year} className="flex" style={{ width: yearWidth }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
                    <div
                      key={`${year}-${month}`}
                      className="flex-shrink-0 py-1.5 text-center border-l border-border/20 first:border-l-border/30"
                      style={{ width: monthWidth }}
                    >
                      <span className="text-[9px] text-text-tertiary">
                        {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][month - 1]}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

          {/* Grid lines container */}
          <div className="absolute top-[76px] left-0 right-0 pointer-events-none" style={{ height: getTotalHeight() + 20 }}>
            {/* Year lines (strong) */}
            {years.map((year, i) => (
              <div
                key={`year-${year}`}
                className="absolute top-0 bottom-0 border-l border-border/50"
                style={{ left: i * yearWidth }}
              />
            ))}
            {/* Month lines */}
            {years.map((year, yearIndex) => (
              Array.from({ length: 12 }, (_, monthIndex) => (
                <div
                  key={`month-${year}-${monthIndex}`}
                  className={`absolute top-0 bottom-0 border-l ${monthIndex % 3 === 0 ? 'border-border/30' : 'border-border/15'}`}
                  style={{ left: yearIndex * yearWidth + monthIndex * monthWidth }}
                />
              ))
            ))}
            {/* Row lines */}
            {Array.from({ length: totalRows + 1 }, (_, i) => (
              <div
                key={`row-${i}`}
                className="absolute left-0 right-0 border-t border-border/20"
                style={{ top: getRowTop(i) }}
              />
            ))}
          </div>

          {/* Timeline rows */}
          <div className="relative" style={{ height: getTotalHeight() + 20 }}>
            {experiences.map((exp) => {
              const left = getMonthPosition(exp.startYear, exp.startMonth);
              const width = getItemWidth(exp.startYear, exp.startMonth, exp.endYear, exp.endMonth);
              const currentRowHeight = rowHeights[exp.row] || 100;
              const isSmallRow = currentRowHeight < 50;
              const top = getRowTop(exp.row) + (isSmallRow ? 2 : 4);
              const isSelected = selectedExp === exp.id;
              const colorClasses = getColorClasses(exp.color, isSelected);
              // Calculate max badges based on width (approx 55px per badge)
              const maxBadges = Math.max(2, Math.floor((width - 20) / 55));

              return (
                <div
                  key={exp.id}
                  className={`absolute flex flex-col gap-1 px-3 ${isSmallRow ? 'py-0.5' : 'py-2'} border rounded-lg transition-all cursor-pointer z-10 ${colorClasses.node}`}
                  style={{
                    left,
                    width,
                    top,
                    height: currentRowHeight - (isSmallRow ? 4 : 8),
                  }}
                  onClick={() => setSelectedExp(isSelected ? null : exp.id)}
                >
                  {isSmallRow ? (
                    /* Compact layout for small rows (Company/Role) */
                    <div className="flex items-center gap-1.5 h-full">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${colorClasses.dot}`} />
                      <span className="text-xs font-medium text-text-primary truncate">
                        {exp.company}
                      </span>
                      {!exp.endYear && (
                        <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full ${colorClasses.dot} animate-pulse ml-auto`} />
                      )}
                    </div>
                  ) : (
                    /* Full layout for larger rows (Project/Personal) */
                    <>
                      {/* Title row */}
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colorClasses.dot}`} />
                        <span className="text-sm font-semibold text-text-primary truncate">
                          {exp.company}
                        </span>
                        {exp.link && (
                          <a
                            href={exp.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 text-text-tertiary hover:text-accent transition-colors ml-auto"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                            </svg>
                          </a>
                        )}
                        {!exp.endYear && (
                          <span className={`flex-shrink-0 w-2 h-2 rounded-full ${colorClasses.dot} animate-pulse ${exp.link ? '' : 'ml-auto'}`} />
                        )}
                      </div>
                      {/* Role - shown on personal nodes */}
                      {exp.role && (
                        <div className="text-xs text-text-secondary truncate">
                          {exp.role}
                        </div>
                      )}
                      {/* Badges - shown on project nodes (2 rows worth) */}
                      {exp.badges && exp.badges.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-auto overflow-hidden" style={{ maxHeight: '44px' }}>
                          {exp.badges.slice(0, maxBadges * 2).map((badge) => {
                            const catColor = skillCategories[badge.category];
                            return (
                              <span
                                key={badge.name}
                                className={`px-1.5 py-0.5 text-[9px] rounded truncate max-w-[80px] ${catColor ? `${catColor.bg} ${catColor.border} ${catColor.text}` : 'bg-bg-primary/50 border border-border/40 text-text-tertiary'}`}
                              >
                                {badge.name}
                              </span>
                            );
                          })}
                          {exp.badges.length > maxBadges * 2 && (
                            <span className="px-1.5 py-0.5 text-[9px] text-text-tertiary">
                              +{exp.badges.length - maxBadges * 2}
                            </span>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Current time indicator */}
          <div
            className="absolute top-[76px] w-0.5 bg-gradient-to-b from-accent via-accent to-transparent z-30 pointer-events-none"
            style={{ left: getCurrentTimePosition(), height: getTotalHeight() + 20 }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent shadow-[0_0_12px_var(--accent-glow)]" />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-2 py-1 bg-accent text-white text-[10px] font-medium rounded whitespace-nowrap shadow-lg">
              Today
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Selected experience details - outside scrollable area */}
      {selectedExp && (() => {
        const exp = experiences.find((e) => e.id === selectedExp);
        if (!exp) return null;

        const colorClasses = getColorClasses(exp.color, false);

        return (
          <div className={`mt-6 p-6 border ${colorClasses.border} rounded-xl bg-bg-node/50 backdrop-blur-sm`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-text-primary">{exp.company}</h3>
                  {exp.link && (
                    <a
                      href={exp.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${colorClasses.text} hover:underline text-sm`}
                    >
                      Visit website →
                    </a>
                  )}
                </div>
                <p className={`text-sm font-medium ${colorClasses.text} mb-1`}>{exp.role}</p>
                <p className="text-sm text-text-tertiary mb-4">{formatDateRange(exp)}</p>
                <p className="text-text-secondary leading-relaxed">{exp.description}</p>
                {exp.skills && Object.keys(exp.skills).length > 0 && (
                  <div className="mt-6 space-y-4">
                    {Object.entries(exp.skills).map(([categoryKey, skills]) => {
                      const catDef = skillCategories[categoryKey];
                      if (!catDef || skills.length === 0) return null;
                      return (
                        <div key={categoryKey}>
                          <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${catDef.text}`}>
                            {catDef.name}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {skills.map((skill) => (
                              <span
                                key={skill}
                                className={`px-3 py-1 text-xs rounded-lg ${catDef.bg} ${catDef.border} ${catDef.text}`}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <button
                onClick={() => setSelectedExp(null)}
                className="flex-shrink-0 p-2 text-text-tertiary hover:text-text-primary transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
