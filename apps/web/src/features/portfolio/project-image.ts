const STORAGE_OBJECT_PREFIX = '/storage/v1/object/public/portfolio/';

export function getProjectImageUrl(path?: string | null) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return null;

  const encodedPath = path
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/');
  return `${supabaseUrl.replace(/\/$/, '')}${STORAGE_OBJECT_PREFIX}${encodedPath}`;
}
