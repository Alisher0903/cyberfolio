import { siteConfig } from '@/config/site';

export type SocialIconName =
  | 'telegram'
  | 'github'
  | 'linkedin'
  | 'twitter'
  | 'instagram'
  | 'email'
  | 'phone';

export const contactLinks = [
  {
    label: 'GitHub',
    handle: '@Alisher0903',
    href: siteConfig.github,
    handleClass: 'text-text-primary',
  },
  {
    label: 'LinkedIn',
    handle: 'in/alisher-sodiqov',
    href: siteConfig.linkedin,
    handleClass: 'text-[#0A66C2]',
  },
  {
    label: 'Twitter',
    handle: '@ascyber777',
    href: siteConfig.twitter,
    handleClass: 'text-[#1DA1F2]',
  },
  {
    label: 'Email',
    handle: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
    handleClass: 'text-accent',
  },
] as const;

export const socialLinks: Array<{
  label: string;
  href: string;
  icon: SocialIconName;
  external?: boolean;
}> = [
  { label: 'Telegram', href: siteConfig.telegram, icon: 'telegram', external: true },
  { label: 'GitHub', href: siteConfig.github, icon: 'github', external: true },
  { label: 'LinkedIn', href: siteConfig.linkedin, icon: 'linkedin', external: true },
  { label: 'X / Twitter', href: siteConfig.twitter, icon: 'twitter', external: true },
  { label: 'Instagram', href: siteConfig.instagram, icon: 'instagram', external: true },
  { label: 'Email', href: `mailto:${siteConfig.email}`, icon: 'email' },
  { label: 'Phone', href: 'tel:+998908800313', icon: 'phone' },
];
