import { useState, useEffect, useCallback, useRef } from 'react';
import { buildApiUrl } from '../config/api';
import type { Post, CreatePostData, UpdatePostData, Comment } from '../types/post';
import { savePostImage, getPostImage, removePostImage, getAllPostImages } from '../utils/imageStorage';
import {
  savePostLikes,
  removePostLikes,
  getAllPostLikes,
  savePostComments,
  removePostComments,
  getAllPostComments,
} from '../utils/postInteractionsStorage';

type LoadingAction = 'fetch' | 'create' | 'update' | 'delete' | null;

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingAction, setLoadingAction] = useState<LoadingAction>('fetch');
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchPosts = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setLoadingAction('fetch');
    setError(null);
    try {
      const response = await fetch(`${buildApiUrl()}?limit=1000&offset=0`, { signal });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.results || !Array.isArray(data.results)) {
        console.error('Unexpected API response structure:', data);
        setPosts([]);
        return;
      }
      
      const storedImages = getAllPostImages();
      const storedLikes = getAllPostLikes();
      const storedComments = getAllPostComments();

      const postsWithInteractions = data.results.map((post: Post) => {
        const imageUrl = storedImages[post.id] || post.imageUrl;
        const likes = storedLikes[post.id] ?? post.likes ?? 0;
        
        let commentsList: Comment[] = post.commentsList ?? [];
        const storedCommentsJson = storedComments[post.id];
        if (storedCommentsJson) {
          try {
            commentsList = JSON.parse(storedCommentsJson);
          } catch (error) {
            console.error(`Error parsing comments for post ${post.id}:`, error);
          }
        }

        return {
          ...post,
          imageUrl,
          likes,
          commentsList,
          mentions: post.mentions ?? [],
        };
      });

      const sortedPosts = [...postsWithInteractions].sort((a: Post, b: Post) => {
        return new Date(b.created_datetime).getTime() - new Date(a.created_datetime).getTime();
      });
      setPosts(sortedPosts);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error fetching posts:', err);
      setPosts([]);
    } finally {
      if (!signal.aborted) {
        setLoadingAction(null);
      }
    }
  }, []);

  const createPost = async (postData: CreatePostData): Promise<Post | null> => {
    setLoadingAction('create');
    try {
      const response = await fetch(buildApiUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const newPost = await response.json();
      
      if (postData.imageUrl) {
        savePostImage(newPost.id, postData.imageUrl);
      }

      savePostLikes(newPost.id, 0);
      savePostComments(newPost.id, JSON.stringify([]));

      const postWithInteractions = {
        ...newPost,
        imageUrl: postData.imageUrl || getPostImage(newPost.id) || undefined,
        likes: 0,
        commentsList: [],
        mentions: [],
      };
      setPosts((prevPosts) => [postWithInteractions, ...prevPosts]);
      return postWithInteractions;
    } catch (err) {
      console.error('Error creating post:', err);
      throw err;
    } finally {
      setLoadingAction(null);
    }
  };

  const updatePost = async (postId: number, postData: UpdatePostData): Promise<Post | null> => {
    setLoadingAction('update');
    try {
      const response = await fetch(buildApiUrl(`${postId}/`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      const updatedPost = await response.json();
      
      let finalImageUrl: string | undefined;
      if (postData.imageUrl !== undefined) {
        if (postData.imageUrl) {
          savePostImage(postId, postData.imageUrl);
          finalImageUrl = postData.imageUrl;
        } else {
          removePostImage(postId);
          finalImageUrl = undefined;
        }
      } else {
        finalImageUrl = getPostImage(postId) || updatedPost.imageUrl;
      }

      const postWithImage = {
        ...updatedPost,
        imageUrl: finalImageUrl,
      };
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === postId ? postWithImage : post))
      );
      return postWithImage;
    } catch (err) {
      console.error('Error updating post:', err);
      throw err;
    } finally {
      setLoadingAction(null);
    }
  };

  const deletePost = async (postId: number): Promise<void> => {
    setLoadingAction('delete');
    try {
      const response = await fetch(buildApiUrl(`${postId}/`), {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      removePostImage(postId);
      removePostLikes(postId);
      removePostComments(postId);

      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (err) {
      console.error('Error deleting post:', err);
      throw err;
    } finally {
      setLoadingAction(null);
    }
  };

  useEffect(() => {
    fetchPosts();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchPosts]);

  const toggleLike = (postId: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const currentLikes = post.likes ?? 0;
          const newLikes = currentLikes + 1;
          
          savePostLikes(postId, newLikes);
          
          return {
            ...post,
            likes: newLikes,
          };
        }
        return post;
      })
    );
  };

  const addComment = (postId: number, comment: string, username: string) => {
    const newComment: Comment = {
      username,
      content: comment,
      created_datetime: new Date().toISOString(),
    };

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const currentCommentsList = post.commentsList ?? [];
          const updatedCommentsList = [...currentCommentsList, newComment];
          
          savePostComments(postId, JSON.stringify(updatedCommentsList));
          
          return {
            ...post,
            commentsList: updatedCommentsList,
          };
        }
        return post;
      })
    );
  };

  return {
    posts,
    isLoading: loadingAction === 'fetch',
    loadingAction,
    error,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    toggleLike,
    addComment,
  };
}

