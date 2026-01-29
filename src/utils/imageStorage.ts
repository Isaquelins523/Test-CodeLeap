const STORAGE_PREFIX = 'post_image_';

export function savePostImage(postId: number, imageUrl: string): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${postId}`, imageUrl);
  } catch (error) {
    console.error(`Error saving image for post ${postId}:`, error);
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.warn('LocalStorage quota exceeded. Consider cleaning old images.');
    }
  }
}

export function getPostImage(postId: number): string | null {
  try {
    return localStorage.getItem(`${STORAGE_PREFIX}${postId}`);
  } catch (error) {
    console.error(`Error getting image for post ${postId}:`, error);
    return null;
  }
}

export function removePostImage(postId: number): void {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${postId}`);
  } catch (error) {
    console.error(`Error removing image for post ${postId}:`, error);
  }
}

export function getAllPostImages(): Record<number, string> {
  const images: Record<number, string> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        const postId = parseInt(key.replace(STORAGE_PREFIX, ''), 10);
        if (!isNaN(postId)) {
          const imageUrl = localStorage.getItem(key);
          if (imageUrl) {
            images[postId] = imageUrl;
          }
        }
      }
    }
  } catch (error) {
    console.error('Error getting all post images:', error);
  }
  return images;
}

