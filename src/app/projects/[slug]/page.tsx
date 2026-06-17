import { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/lib/utils";
import ProjectDetailClient from "./ProjectDetailClient";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) return {};
  return {
    title: `${project.title} — ${project.subtitle}`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
    },
  };
}

export default function ProjectDetailPage({ params }: Props) {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) notFound();
  const currentIndex = projects.findIndex((p) => p.slug === params.slug);
  const prev = projects[currentIndex - 1] ?? null;
  const next = projects[currentIndex + 1] ?? null;
  return <ProjectDetailClient project={project} prev={prev} next={next} />;
}
