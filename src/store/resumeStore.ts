import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ColorTheme = "green" | "cyan" | "red" | "amber" | "violet";
export type LayoutStyle = "modern" | "minimal" | "terminal";

export interface WorkItem {
  id: string; company: string; role: string;
  period: string; description: string; highlights: string;
}
export interface EduItem {
  id: string; school: string; degree: string;
  year: string; gpa?: string;
}
export interface ProjectItem {
  id: string; name: string; tech: string; description: string; link?: string;
}
export interface SkillGroup {
  id: string; category: string; skills: string;
}

export interface ResumeData {
  // Personal
  name: string; title: string; email: string;
  phone: string; location: string; website: string;
  github: string; linkedin: string; summary: string;
  // Sections
  work:     WorkItem[];
  education: EduItem[];
  projects:  ProjectItem[];
  skillGroups: SkillGroup[];
  // Style
  colorTheme:  ColorTheme;
  layoutStyle: LayoutStyle;
  showPhoto: boolean;
}

const defaultData: ResumeData = {
  name: "Your Name",
  title: "Frontend Engineer & Security Specialist",
  email: "you@example.com",
  phone: "+1 (555) 000-0000",
  location: "City, Country",
  website: "yoursite.dev",
  github: "github.com/you",
  linkedin: "linkedin.com/in/you",
  summary:
    "Passionate engineer building secure, high-performance web applications. 4+ years experience across frontend architecture and application security.",
  work: [
    {
      id: "w1", company: "Acme Corp", role: "Senior Frontend Engineer",
      period: "2022 – Present",
      description: "Lead frontend architecture for SaaS platform with 100K+ users.",
      highlights: "Reduced bundle size by 45%;Improved LCP from 4s to 0.9s;Built design system used across 5 products",
    },
    {
      id: "w2", company: "Startup XYZ", role: "Frontend Developer",
      period: "2020 – 2022",
      description: "Built React components and integrated REST/GraphQL APIs.",
      highlights: "Shipped 30+ features;Led migration from CRA to Next.js",
    },
  ],
  education: [
    {
      id: "e1", school: "Tashkent University of IT",
      degree: "B.Sc. Computer Science", year: "2020", gpa: "3.9",
    },
  ],
  projects: [
    {
      id: "p1", name: "SecureDash",
      tech: "Next.js, TypeScript, WebSockets",
      description: "Real-time security monitoring dashboard with ML anomaly detection.",
      link: "github.com/you/securedash",
    },
  ],
  skillGroups: [
    { id: "s1", category: "Frontend",  skills: "React, Next.js, TypeScript, GSAP, Tailwind" },
    { id: "s2", category: "Security",  skills: "OWASP, Burp Suite, Pentesting, CTF" },
    { id: "s3", category: "Backend",   skills: "Node.js, Python, PostgreSQL, Redis" },
  ],
  colorTheme:  "green",
  layoutStyle: "modern",
  showPhoto:   false,
};

interface ResumeStore {
  data: ResumeData;
  update: (partial: Partial<ResumeData>) => void;
  updateWork:       (id: string, partial: Partial<WorkItem>)    => void;
  addWork:          ()  => void;
  removeWork:       (id: string) => void;
  updateEdu:        (id: string, partial: Partial<EduItem>)     => void;
  addEdu:           ()  => void;
  removeEdu:        (id: string) => void;
  updateProject:    (id: string, partial: Partial<ProjectItem>) => void;
  addProject:       ()  => void;
  removeProject:    (id: string) => void;
  updateSkillGroup: (id: string, partial: Partial<SkillGroup>)  => void;
  addSkillGroup:    ()  => void;
  removeSkillGroup: (id: string) => void;
  reset:            ()  => void;
}

const uid = () => Math.random().toString(36).slice(2, 8);

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      data: defaultData,
      update: (p) => set((s) => ({ data: { ...s.data, ...p } })),

      updateWork: (id, p) => set((s) => ({
        data: { ...s.data, work: s.data.work.map((w) => w.id === id ? { ...w, ...p } : w) },
      })),
      addWork: () => set((s) => ({
        data: {
          ...s.data,
          work: [...s.data.work, { id: uid(), company: "", role: "", period: "", description: "", highlights: "" }],
        },
      })),
      removeWork: (id) => set((s) => ({ data: { ...s.data, work: s.data.work.filter((w) => w.id !== id) } })),

      updateEdu: (id, p) => set((s) => ({
        data: { ...s.data, education: s.data.education.map((e) => e.id === id ? { ...e, ...p } : e) },
      })),
      addEdu: () => set((s) => ({
        data: { ...s.data, education: [...s.data.education, { id: uid(), school: "", degree: "", year: "" }] },
      })),
      removeEdu: (id) => set((s) => ({ data: { ...s.data, education: s.data.education.filter((e) => e.id !== id) } })),

      updateProject: (id, p) => set((s) => ({
        data: { ...s.data, projects: s.data.projects.map((pr) => pr.id === id ? { ...pr, ...p } : pr) },
      })),
      addProject: () => set((s) => ({
        data: { ...s.data, projects: [...s.data.projects, { id: uid(), name: "", tech: "", description: "" }] },
      })),
      removeProject: (id) => set((s) => ({ data: { ...s.data, projects: s.data.projects.filter((p) => p.id !== id) } })),

      updateSkillGroup: (id, p) => set((s) => ({
        data: { ...s.data, skillGroups: s.data.skillGroups.map((sg) => sg.id === id ? { ...sg, ...p } : sg) },
      })),
      addSkillGroup: () => set((s) => ({
        data: { ...s.data, skillGroups: [...s.data.skillGroups, { id: uid(), category: "", skills: "" }] },
      })),
      removeSkillGroup: (id) => set((s) => ({ data: { ...s.data, skillGroups: s.data.skillGroups.filter((sg) => sg.id !== id) } })),

      reset: () => set({ data: defaultData }),
    }),
    { name: "portfolio-resume-v2", version: 2 }
  )
);

export const themeColors: Record<ColorTheme, { primary: string; dim: string; bg: string }> = {
  green:  { primary: "#00FF87", dim: "#00CC6A", bg: "rgba(0,255,135,0.06)" },
  cyan:   { primary: "#00D4FF", dim: "#0099BB", bg: "rgba(0,212,255,0.06)" },
  red:    { primary: "#FF3B6B", dim: "#CC2255", bg: "rgba(255,59,107,0.06)" },
  amber:  { primary: "#FFB800", dim: "#CC9200", bg: "rgba(255,184,0,0.06)"  },
  violet: { primary: "#A855F7", dim: "#7C3AED", bg: "rgba(168,85,247,0.06)" },
};
