const LIKES_STORAGE_PREFIX = 'post_likes_';
const COMMENTS_STORAGE_PREFIX = 'post_comments_';

export function savePostLikes(postId: number, likes: number): void {
  try {
    localStorage.setItem(`${LIKES_STORAGE_PREFIX}${postId}`, likes.toString());
  } catch (error) {
    console.error(`Error saving likes for post ${postId}:`, error);
  }
}

export function getPostLikes(postId: number): number | null {
  try {
    const likes = localStorage.getItem(`${LIKES_STORAGE_PREFIX}${postId}`);
    return likes ? parseInt(likes, 10) : null;
  } catch (error) {
    console.error(`Error getting likes for post ${postId}:`, error);
    return null;
  }
}

export function removePostLikes(postId: number): void {
  try {
    localStorage.removeItem(`${LIKES_STORAGE_PREFIX}${postId}`);
  } catch (error) {
    console.error(`Error removing likes for post ${postId}:`, error);
  }
}

export function getAllPostLikes(): Record<number, number> {
  const likes: Record<number, number> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(LIKES_STORAGE_PREFIX)) {
        const postId = parseInt(key.replace(LIKES_STORAGE_PREFIX, ''), 10);
        if (!isNaN(postId)) {
          const likesValue = localStorage.getItem(key);
          if (likesValue) {
            likes[postId] = parseInt(likesValue, 10);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error getting all post likes:', error);
  }
  return likes;
}

export function savePostComments(postId: number, comments: string): void {
  try {
    localStorage.setItem(`${COMMENTS_STORAGE_PREFIX}${postId}`, comments);
  } catch (error) {
    console.error(`Error saving comments for post ${postId}:`, error);
  }
}

export function getPostComments(postId: number): string | null {
  try {
    return localStorage.getItem(`${COMMENTS_STORAGE_PREFIX}${postId}`);
  } catch (error) {
    console.error(`Error getting comments for post ${postId}:`, error);
    return null;
  }
}

export function removePostComments(postId: number): void {
  try {
    localStorage.removeItem(`${COMMENTS_STORAGE_PREFIX}${postId}`);
  } catch (error) {
    console.error(`Error removing comments for post ${postId}:`, error);
  }
}

export function getAllPostComments(): Record<number, string> {
  const comments: Record<number, string> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(COMMENTS_STORAGE_PREFIX)) {
        const postId = parseInt(key.replace(COMMENTS_STORAGE_PREFIX, ''), 10);
        if (!isNaN(postId)) {
          const commentsValue = localStorage.getItem(key);
          if (commentsValue) {
            comments[postId] = commentsValue;
          }
        }
      }
    }
  } catch (error) {
    console.error('Error getting all post comments:', error);
  }
  return comments;
}

