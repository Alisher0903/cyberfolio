"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skills } from "@/lib/utils";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const categories = Object.keys(skills) as Array<keyof typeof skills>;

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState<keyof typeof skills>("Frontend");
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        onEnter: () => {
          setAnimated(true);
          gsap.fromTo(".skill-card", { opacity:0, y:40 }, {
            opacity:1, y:0, stagger:0.08, duration:0.6, ease:"power2.out"
          });
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const tabColors: Record<string, string> = {
    Frontend: "#00FF87",
    Security: "#FF3B6B",
    Backend: "#00D4FF",
  };

  return (
    <section id="skills" ref={sectionRef} className="py-16 md:py-32" style={{backgroundColor:"#050A0E"}}>
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="flex items-center gap-4 mb-10 md:mb-16">
          <p className="font-mono text-xs" style={{color:"#00FF87"}}>04 / Skills</p>
          <div className="flex-1 h-px" style={{backgroundColor:"#0E2030"}} />
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Heading + tabs */}
          <div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold mb-8" style={{color:"#E8F4FD"}}>
              Capabilities &amp;{" "}
              <span className="gradient-text">Expertise</span>
            </h2>
            <p className="text-lg leading-relaxed mb-10" style={{color:"#7FA8C4"}}>
              I operate at the intersection of frontend engineering and
              application security — fluent in both the art of crafting
              interfaces and the science of breaking them.
            </p>

            {/* Tab buttons */}
            <div className="flex gap-2 mb-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className="px-4 py-2 font-mono text-sm rounded transition-all duration-300"
                  style={{
                    backgroundColor: activeTab === cat ? tabColors[cat] + "15" : "transparent",
                    color: activeTab === cat ? tabColors[cat] : "#3A5568",
                    border: `1px solid ${activeTab === cat ? tabColors[cat] + "40" : "#0E2030"}`,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Skills bars */}
            <div className="space-y-4">
              {skills[activeTab].map((skill, i) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-1.5">
                    <span className="font-mono text-sm" style={{color:"#E8F4FD"}}>{skill.name}</span>
                    <span className="font-mono text-xs" style={{color:tabColors[activeTab]}}>{skill.level}%</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{backgroundColor:"#0E2030"}}>
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: animated ? `${skill.level}%` : "0%",
                        backgroundColor: tabColors[activeTab],
                        transitionDelay: `${i * 0.1}s`,
                        boxShadow: `0 0 8px ${tabColors[activeTab]}60`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Tool grid */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: "Next.js", icon: "⬡", color: "#E8F4FD" },
              { name: "TypeScript", icon: "TS", color: "#3178C6" },
              { name: "React", icon: "⚛", color: "#61DAFB" },
              { name: "GSAP", icon: "⚡", color: "#88CE02" },
              { name: "Tailwind", icon: "💧", color: "#38BDF8" },
              { name: "Node.js", icon: "⬡", color: "#339933" },
              { name: "Python", icon: "🐍", color: "#FFD43B" },
              { name: "Docker", icon: "🐳", color: "#2496ED" },
              { name: "Burp Suite", icon: "🔐", color: "#FF6633" },
              { name: "PostgreSQL", icon: "🐘", color: "#336791" },
              { name: "Redis", icon: "⚡", color: "#FF4444" },
              { name: "Figma", icon: "🎨", color: "#A259FF" },
              { name: "WebGL", icon: "◈", color: "#00D4FF" },
              { name: "Rust", icon: "⚙", color: "#CE4A00" },
              { name: "Git", icon: "⊙", color: "#F05032" },
            ].map((tool) => (
              <div
                key={tool.name}
                className="skill-card group p-4 rounded-xl border cursor-default transition-all duration-300 flex flex-col items-center gap-2"
                style={{backgroundColor:"#0A1219",borderColor:"#0E2030"}}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = tool.color + "40";
                  (e.currentTarget as HTMLDivElement).style.backgroundColor = tool.color + "08";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "#0E2030";
                  (e.currentTarget as HTMLDivElement).style.backgroundColor = "#0A1219";
                }}
              >
                <span className="text-2xl">{tool.icon}</span>
                <span className="font-mono text-xs text-center" style={{color:"#7FA8C4"}}>{tool.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="mt-20">
          <h3 className="font-display text-2xl font-bold mb-8" style={{color:"#E8F4FD"}}>Certifications</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "OWASP Web Security", org: "OWASP Foundation", year: "2023", color: "#00FF87" },
              { name: "CEH Practical", org: "EC-Council", year: "2022", color: "#FF3B6B" },
              { name: "AWS Developer", org: "Amazon", year: "2023", color: "#FFB800" },
              { name: "Google UX Design", org: "Google", year: "2021", color: "#00D4FF" },
            ].map((cert) => (
              <div
                key={cert.name}
                className="p-5 rounded-xl border"
                style={{backgroundColor:"#0A1219",borderColor:"#0E2030"}}
              >
                <div
                  className="w-8 h-1 rounded mb-4"
                  style={{backgroundColor:cert.color}}
                />
                <div className="font-mono text-sm font-medium mb-1" style={{color:"#E8F4FD"}}>{cert.name}</div>
                <div className="font-mono text-xs" style={{color:"#3A5568"}}>{cert.org} · {cert.year}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
