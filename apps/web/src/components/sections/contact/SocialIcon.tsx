import type { ReactNode } from 'react';
import type { SocialIconName } from './contact.config';

const paths: Record<SocialIconName, ReactNode> = {
  telegram: (
    <path d="m21 3-3.6 17.1c-.3 1.2-1 1.5-2 .9l-5.5-4.1-2.7 2.6c-.3.3-.5.5-1.1.5l.4-5.6L16.7 5c.4-.4-.1-.6-.7-.2L3.4 12.7c-1.1.7-1.1 1.6.2 2l3.2 1 7.5-4.7c.4-.2.7-.1.4.2l-6.1 5.5-.2 3.2c.4 0 .6-.2.8-.4l1.6-1.5 3.4 2.5c.6.4 1.1.2 1.3-.6L22 4.2C22.3 3.1 21.6 2.6 21 3Z" />
  ),
  github: (
    <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-2c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.6 1.1 1.6 1.1.9 1.6 2.4 1.1 3 .8.1-.7.4-1.1.7-1.3-2.3-.3-4.7-1.1-4.7-5A3.9 3.9 0 0 1 6.7 8.6a3.6 3.6 0 0 1 .1-2.7s.9-.3 2.8 1A9.7 9.7 0 0 1 12 6.6a9.7 9.7 0 0 1 2.5.3c2-1.3 2.8-1 2.8-1a3.6 3.6 0 0 1 .1 2.7 3.9 3.9 0 0 1 1.1 2.8c0 3.8-2.4 4.6-4.7 4.9.4.3.7 1 .7 2V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" />
  ),
  linkedin: (
    <path d="M6.5 8.2H3.2V21h3.3V8.2ZM4.9 3A1.9 1.9 0 1 0 5 6.8 1.9 1.9 0 0 0 5 3ZM21 13.7c0-3.9-2.1-5.7-4.9-5.7a4.2 4.2 0 0 0-3.8 2.1V8.2H9V21h3.3v-6.3c0-1.7.3-3.3 2.4-3.3s2.1 1.9 2.1 3.4V21H21v-7.3Z" />
  ),
  twitter: (
    <path d="M18.9 2H22l-6.8 7.8L23 22h-6.1l-4.8-6.2L6.7 22H3.5l7.1-8.2L3 2h6.3l4.3 5.7L18.9 2Zm-1.1 17.9h1.7L8.4 4H6.6l11.2 15.9Z" />
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  email: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  phone: (
    <path d="M7.2 3H4.8A1.8 1.8 0 0 0 3 4.9 16.2 16.2 0 0 0 19.1 21a1.8 1.8 0 0 0 1.9-1.8v-2.4l-4.5-1-1.1 2a13 13 0 0 1-9.2-9.2l2-1.1L7.2 3Z" />
  ),
};

export function SocialIcon({ name }: { name: SocialIconName }) {
  const filled = ['telegram', 'github', 'linkedin', 'twitter'].includes(name);

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
