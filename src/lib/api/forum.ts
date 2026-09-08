import { apiDelete, apiGet, apiPatch, apiPost } from "../api";

const B = "/api/proxy/forum";

export interface ForumAuthor {
  user_id: number;
  email?: string;
  role: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string | null;
  detail?: string | null;
}

export interface ForumComment {
  comment_id: number;
  post_id: number;
  author_user_id: number;
  content: string;
  created_at: string;
  author: ForumAuthor;
}

export interface ForumPost {
  post_id: number;
  title: string;
  content: string;
  category?: string | null;
  views_count: number;
  is_pinned: boolean;
  author_user_id: number;
  created_at: string;
  updated_at: string;
  author: ForumAuthor;
  comments_count?: number;
  comments?: ForumComment[];
}

export interface PaginatedPostsResponse {
  total: number;
  page: number;
  limit: number;
  posts: ForumPost[];
}

export function getPosts(params?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedPostsResponse> {
  const qs = new URLSearchParams();
  if (params?.category && params.category !== "all") qs.set("category", params.category);
  if (params?.search) qs.set("search", params.search);
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  const query = qs.toString();
  return apiGet<PaginatedPostsResponse>(`${B}/posts${query ? `?${query}` : ""}`);
}

export function getPostById(id: number): Promise<ForumPost> {
  return apiGet<ForumPost>(`${B}/posts/${id}`);
}

export function createPost(data: { title: string; content: string; category?: string }): Promise<ForumPost> {
  return apiPost<ForumPost>(`${B}/posts`, data);
}

export function addComment(postId: number, data: { content: string }): Promise<ForumComment> {
  return apiPost<ForumComment>(`${B}/posts/${postId}/comments`, data);
}

export function deletePost(id: number): Promise<{ success: boolean }> {
  return apiDelete<{ success: boolean }>(`${B}/posts/${id}`);
}

export function deleteComment(id: number): Promise<{ success: boolean }> {
  return apiDelete<{ success: boolean }>(`${B}/comments/${id}`);
}

export function togglePin(id: number): Promise<ForumPost> {
  return apiPatch<ForumPost>(`${B}/posts/${id}/pin`);
}
