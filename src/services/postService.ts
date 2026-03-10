import axios from 'axios';
import { buildApiUrl } from '../config/api';
import type { Post, CreatePostData, UpdatePostData } from '../types/post';

interface PostsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Post[];
}

export async function fetchPostsApi(limit = 1000, offset = 0): Promise<PostsResponse> {
  const response = await axios.get<PostsResponse>(`${buildApiUrl()}?limit=${limit}&offset=${offset}`);
  return response.data;
}

export async function createPostApi(postData: CreatePostData): Promise<Post> {
  const response = await axios.post<Post>(buildApiUrl(), postData);
  return response.data;
}

export async function updatePostApi(postId: number, postData: UpdatePostData): Promise<Post> {
  const response = await axios.patch<Post>(buildApiUrl(`${postId}`), postData);
  return response.data;
}

export async function deletePostApi(postId: number): Promise<void> {
  await axios.delete(buildApiUrl(`${postId}`));
}

