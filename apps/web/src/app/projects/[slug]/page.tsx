import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { getRequestLocale } from '@/lib/i18n/server';
import ProjectDetailClient from './ProjectDetailClient';
import { getPortfolioProject, getPortfolioProjects } from '@/features/portfolio/portfolio-api';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getPortfolioProjects('en')).map((p) => ({ slug: p.slug }));
}

export const dynamicParams = true;
// The layout resolves the locale from a cookie, so this route must render per
// request; project data itself is still cached for 60s at the fetch level.
export const dynamic = 'force-dynamic';
export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const result = await getPortfolioProject(slug, locale);
  const project = result?.project;
  if (!project) return {};
  return {
    title: `${project.title} — ${project.subtitle}`,
    description: project.description,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    openGraph: {
      title: project.title,
      description: project.description,
      type: 'article',
      url: `${siteConfig.url}/projects/${project.slug}`,
      images: [
        {
          url: `${siteConfig.url}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${project.title} by ${siteConfig.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
      images: [`${siteConfig.url}/opengraph-image`],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const [result, allProjects] = await Promise.all([
    getPortfolioProject(slug, locale),
    getPortfolioProjects(locale),
  ]);
  if (!result) notFound();
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const prev = allProjects[currentIndex - 1] ?? null;
  const next = allProjects[currentIndex + 1] ?? null;
  return (
    <ProjectDetailClient project={result.project} detail={result.detail} prev={prev} next={next} />
  );
}
