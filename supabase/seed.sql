insert into public.site_settings (key, value) values
  ('hero', '{"name":"Alisher Sodiqov","role":"Frontend Developer","experience":"2+ years","availability":true}'::jsonb),
  ('contact', '{"heading":"Let''s build something worth hacking.","description":"Open to full-time roles, freelance projects, and security consulting.","email":"info@alisherdev.uz","location":"Tashkent, Uzbekistan"}'::jsonb)
on conflict (key) do update set value = excluded.value;

insert into public.projects
  (slug, title, subtitle, description, tech, color, accent_color, category, year, live_url, github_url, metrics, featured, status, sort_order)
values
  ('cipher-shield', 'CipherShield', 'Real-time threat detection platform', 'A full-stack web application that monitors network traffic, detects anomalies using ML models, and visualizes threats in real-time.', array['Next.js','TypeScript','WebSocket','Python','TensorFlow','PostgreSQL','Redis'], '#00FF87', '#00CC6A', 'Cybersecurity', '2024', '#', '#', '[{"label":"Threats Blocked","value":"2.4M+"},{"label":"Detection Rate","value":"99.2%"},{"label":"Response Time","value":"<50ms"}]'::jsonb, true, 'published', 0),
  ('nexus-ui', 'Nexus UI', 'Component library for security dashboards', 'An open-source React component library tailored for security and data-heavy applications.', array['React','TypeScript','Storybook','Vitest','CSS Modules','Rollup'], '#00D4FF', '#0099BB', 'Frontend', '2024', '#', '#', '[{"label":"Components","value":"60+"},{"label":"npm downloads","value":"14K/mo"},{"label":"GitHub Stars","value":"890"}]'::jsonb, true, 'published', 1),
  ('pentest-canvas', 'PentestCanvas', 'Visual penetration testing toolkit', 'A browser-based tool for security professionals to map attack surfaces, document findings, and generate compliance reports.', array['React','Canvas API','Node.js','Express','SQLite','Docker'], '#FF3B6B', '#CC2A55', 'Security Tools', '2023', '#', '#', '[{"label":"Active Users","value":"340+"},{"label":"Reports Generated","value":"1.2K"},{"label":"Integrations","value":"8"}]'::jsonb, true, 'published', 2),
  ('waveterm', 'WaveTerm', 'GPU-accelerated terminal emulator', 'A high-performance terminal emulator built with WebGL rendering for smooth 60fps scrollback.', array['Electron','WebGL','TypeScript','Rust','Node.js'], '#FFB800', '#CC9200', 'Developer Tools', '2023', '#', '#', '[{"label":"Render FPS","value":"60"},{"label":"Downloads","value":"4.1K"},{"label":"Plugin API calls","value":"22"}]'::jsonb, false, 'published', 3)
on conflict (slug) do nothing;

insert into public.skill_categories (name, slug, skills, status, sort_order) values
  ('Frontend', 'frontend', array['React.js','Next.js','JavaScript','TypeScript','HTML5 & CSS3','Tailwind CSS','Ant Design','shadcn/ui','GSAP','React Native','Vite','Zustand','TanStack Query','Socket.IO','REST API Integration','Responsive Design','Web Accessibility','Performance Optimization','Git','GitHub','GitLab','CI/CD · GitHub Actions'], 'published', 0),
  ('Security', 'security', array['Linux Systems','Windows Systems','Network Fundamentals','Cybersecurity Fundamentals','Web Security & OWASP','Wireshark','System Administration','Bash Scripting','Python Scripting'], 'published', 1),
  ('Other', 'other', array['Microsoft Word','Microsoft Excel','Microsoft PowerPoint','AI Tools & Prompt Engineering','Figma','Technical Documentation'], 'published', 2)
on conflict (slug) do nothing;

insert into public.social_links (label, handle, href, color, status, sort_order) values
  ('GitHub', '@Alisher0903', 'https://github.com/Alisher0903', '#E8F4FD', 'published', 0),
  ('LinkedIn', 'in/alisher-sodiqov-491183310', 'https://www.linkedin.com/in/alisher-sodiqov-491183310', '#0A66C2', 'published', 1),
  ('Twitter', '@ascyber777', 'https://x.com/ascyber777', '#1DA1F2', 'published', 2),
  ('Email', 'info@alisherdev.uz', 'mailto:info@alisherdev.uz', '#00FF87', 'published', 3);

insert into public.experiences
  (role, company, period, description, tags, status, sort_order)
values
  ('Senior Frontend Engineer', 'SecureNet Labs', '2023 — Present', 'Lead frontend architecture for enterprise security dashboard serving 50K+ users. Reduced TTI by 40% through code splitting and edge caching strategies.', array['Next.js','TypeScript','WebSocket','Security'], 'published', 0),
  ('Frontend Developer', 'Axiom Systems', '2021 — 2023', 'Built React component library from scratch, adopted across 6 internal products. Implemented OAuth 2.0 / OIDC flows and led frontend security audits.', array['React','OAuth','Storybook','Testing'], 'published', 1),
  ('Security Analyst (Part-time)', 'CyberGuard Uzbekistan', '2020 — 2021', 'Conducted web application penetration tests, authored vulnerability reports, and delivered remediation guidance to development teams.', array['Pentesting','OWASP','Burp Suite','Reports'], 'published', 2);

insert into public.project_details
  (project_id, challenge, solution, impact, timeline, team_size, role, highlights, code_snippet)
select
  id,
  'Enterprise clients needed fast, reliable threat detection without alert fatigue.',
  'Built a streaming pipeline and a responsive dashboard for high-volume security events.',
  'Reduced detection time and false-positive rates while improving operator workflow.',
  '6 months',
  '4 engineers',
  'Frontend Lead + Security Architect',
  array['Real-time event streaming','Accessible data-dense UI','Encrypted audit logs','Automated compliance reports'],
  '// Project code sample is managed from the admin panel.'
from public.projects where slug = 'cipher-shield'
on conflict (project_id) do nothing;
