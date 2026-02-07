"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "@/context/ThemeContext";
import CareerTimeline from "@/components/CareerTimeline";
import TechStack3D from "@/components/TechStack3D";

const ParticleBackground = dynamic(() => import("@/components/ParticleBackground"), {
  ssr: false,
});

const projects = [
  // Top row: CodeGraph, Lovos Media, Rofox
  {
    name: "CodeGraph",
    description: "Interactive 3D code visualization tool. Transform codebases into explorable graphs with impact analysis and AI queries.",
    url: "https://codegraph.rofox.be",
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
    tags: [".NET", "Neo4j", "Three.js", "Roslyn"],
  },
  {
    name: "Lovos Media",
    description: "My photography business for events and weddings. Professional media services with a personal touch.",
    url: "https://lovosmedia.com",
    gradient: "from-amber-500 via-orange-500 to-red-500",
    tags: ["Photography", "Events", "Weddings"],
  },
  {
    name: "Rofox",
    description: "Belgian tech startup I co-founded with Davey Verleg. Building software that matters - from code visualization to housing platforms.",
    url: "https://rofox.be",
    gradient: "from-orange-500 via-red-500 to-purple-600",
    tags: ["Startup", "Next.js", "TypeScript"],
  },
  // Bottom row: Arxis, Memora, Convivo
  {
    name: "Arxis",
    description: "Desktop media manager for photographers. Organize, sort, and prepare photos across multiple storage locations.",
    url: "https://mediamanager.rofox.be",
    gradient: "from-neutral-400 via-zinc-500 to-neutral-600",
    tags: ["Tauri", "React", "Desktop", "Rust"],
  },
  {
    name: "Memora",
    description: "Client gallery platform for photographers. Deliver galleries with ZIP downloads and beautiful presentations.",
    url: "https://mediamanager.rofox.be",
    gradient: "from-rose-400 via-pink-500 to-fuchsia-500",
    tags: ["Next.js", "Supabase", "S3", "SaaS"],
  },
  {
    name: "Convivo",
    description: "Cohousing platform. AI-powered matching connecting landlords and tenants based on compatibility.",
    url: "https://cohousing.rofox.be",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    tags: ["AI", "Matching", "Next.js", "Supabase"],
  },
];

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary transition-colors duration-500">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg-node/80 backdrop-blur-sm text-text-secondary transition-all hover:border-accent hover:text-accent"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </button>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Particle background */}
        <ParticleBackground />


        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          {/* Greeting */}
          <p className="text-text-tertiary text-lg mb-2">{greeting}, I&apos;m</p>

          {/* Name */}
          <h1 className="text-6xl sm:text-8xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-text-primary via-accent to-accent-secondary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Laurens Vos
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-xl sm:text-2xl text-text-secondary max-w-2xl mx-auto mb-10">
            Software Engineer at{" "}
            <a href="https://www.asml.com/en" target="_blank" rel="noopener noreferrer" className="text-accent font-medium hover:underline">ASML</a> via{" "}
            <a href="https://www.siouxtechnologies.com/en/" target="_blank" rel="noopener noreferrer" className="text-accent-secondary font-medium hover:underline">Sioux Technologies</a>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#career"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-medium rounded-lg transition-all hover:bg-accent-secondary hover:gap-3"
            >
              View my journey
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border bg-bg-node/50 backdrop-blur-sm font-medium rounded-lg transition-all hover:border-accent hover:text-accent"
            >
              Get in touch
            </a>
          </div>

        </div>

        {/* Scroll indicator - at bottom of section */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          <div className="h-10 w-6 rounded-full border-2 border-text-tertiary/30 flex justify-center pt-2">
            <div className="h-2 w-1 rounded-full bg-accent animate-bounce" />
          </div>
        </div>
      </section>

      {/* Career Section */}
      <section id="career" className="py-24 bg-bg-secondary/50">
        <div className="text-center mb-12 px-6">
          <p className="text-accent text-sm font-medium uppercase tracking-wider mb-2">Career</p>
          <h2 className="text-4xl font-bold mb-4">My Journey</h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            From engineering student to software engineer — a path of continuous learning.
          </p>
        </div>

        {/* Career Timeline - Full width */}
        <div className="px-4">
          <div className="border border-border rounded-xl bg-bg-node/30 backdrop-blur-sm p-6 overflow-hidden">
            <CareerTimeline />
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-accent text-sm font-medium uppercase tracking-wider mb-2">Expertise</p>
            <h2 className="text-4xl font-bold mb-4">Tech Stack</h2>
            <p className="text-text-secondary">Technologies I work with daily. Hover to explore.</p>
          </div>

          <TechStack3D />
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-6 bg-bg-secondary/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-accent text-sm font-medium uppercase tracking-wider mb-2">Side Projects</p>
            <h2 className="text-4xl font-bold mb-4">What I Build</h2>
            <p className="text-text-secondary">Personal ventures and projects I actively maintain.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <a
                key={project.name}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-2xl border border-border bg-bg-node/30 backdrop-blur-sm transition-all duration-300 hover:border-accent hover:shadow-[0_0_30px_var(--accent-glow)]"
              >
                {/* Gradient header */}
                <div className={`h-2 bg-gradient-to-r ${project.gradient}`} />

                <div className="p-6">
                  {/* Title with arrow */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-text-primary group-hover:text-accent transition-colors">
                      {project.name}
                    </h3>
                    <svg
                      className="w-5 h-5 text-text-tertiary group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </div>

                  {/* Description */}
                  <p className="text-text-secondary text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 text-xs font-medium rounded-full border border-border bg-bg-primary/50 text-text-tertiary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-5`} />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 bg-bg-secondary/50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">My Socials</h2>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-8">
            <a
              href="https://linkedin.com/in/laurens-vos-3325921b7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent/60 hover:text-accent transition-colors"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a
              href="https://github.com/Lovos98"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent/60 hover:text-accent transition-colors"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/laurensvos_"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent/60 hover:text-accent transition-colors"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="https://www.youtube.com/@LovosMedia"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent/60 hover:text-accent transition-colors"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
            <a
              href="https://lovosmedia.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent/60 hover:text-accent transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-text-tertiary">
            © {new Date().getFullYear()} Laurens Vos
          </p>
        </div>
      </footer>
    </div>
  );
}
