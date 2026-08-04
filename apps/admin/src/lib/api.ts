import { supabase } from './supabase';

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3002/api/v1';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const { data } = (await supabase?.auth.getSession()) ?? { data: { session: null } };
  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(data.session?.access_token
        ? { Authorization: `Bearer ${data.session.access_token}` }
        : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? `Request failed (${response.status})`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const adminApi = {
  projects: () => request<AdminProject[]>('/admin/projects'),
  createProject: (project: ProjectInput) =>
    request<AdminProject>('/admin/projects', { method: 'POST', body: JSON.stringify(project) }),
  updateProject: (id: string, project: Partial<ProjectInput>) =>
    request<AdminProject>(`/admin/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(project),
    }),
  deleteProject: (id: string) =>
    request<void>(`/admin/projects/${id}`, { method: 'DELETE' }),
  projectDetail: (id: string) => request<AdminProjectDetail | null>(`/admin/projects/${id}/detail`),
  saveProjectDetail: (id: string, detail: ProjectDetailInput) =>
    request<AdminProjectDetail>(`/admin/projects/${id}/detail`, {
      method: 'PUT',
      body: JSON.stringify(detail),
    }),
  collection: <T>(name: CollectionName) => request<T[]>(`/admin/${name}`),
  createItem: <T>(name: CollectionName, value: Record<string, unknown>) =>
    request<T>(`/admin/${name}`, { method: 'POST', body: JSON.stringify(value) }),
  updateItem: <T>(name: CollectionName, id: string, value: Record<string, unknown>) =>
    request<T>(`/admin/${name}/${id}`, { method: 'PATCH', body: JSON.stringify(value) }),
  deleteItem: (name: CollectionName, id: string) =>
    request<void>(`/admin/${name}/${id}`, { method: 'DELETE' }),
  settings: () => request<SiteSetting[]>('/admin/settings'),
  saveSetting: (key: string, value: Record<string, unknown>) =>
    request<SiteSetting>(`/admin/settings/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ value }),
    }),
};

export type CollectionName = 'experiences' | 'skills' | 'socials' | 'messages';

export interface CollectionItem {
  id: string;
  status: string;
  sort_order?: number;
  [key: string]: unknown;
}

export interface SiteSetting {
  key: string;
  value: Record<string, unknown>;
}

export interface AdminProject {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  year: string;
  tech: string[];
  color: string;
  accent_color: string;
  live_url: string;
  github_url: string;
  metrics: Array<{ label: string; value: string }>;
  cover_image_path?: string | null;
  featured: boolean;
  status: 'draft' | 'published';
  sort_order: number;
}

export type ProjectInput = Omit<AdminProject, 'id'>;

export interface ProjectDetailInput {
  challenge: string;
  solution: string;
  impact: string;
  timeline: string;
  team_size: string;
  role: string;
  highlights: string[];
  code_snippet: string;
}

export interface AdminProjectDetail extends ProjectDetailInput {
  project_id: string;
}
