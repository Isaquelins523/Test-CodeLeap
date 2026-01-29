import { PostCard } from '../PostCard/PostCard';
import type { Post } from '../../types/post';

interface PostListProps {
  posts: Post[];
  currentUsername: string;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
  onLike?: (postId: number) => void;
  onComment?: (postId: number, comment: string) => void;
  isLoading?: boolean;
}

export function PostList({
  posts,
  currentUsername,
  onEdit,
  onDelete,
  onLike,
  onComment,
  isLoading,
}: PostListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-8 gap-4">
        <div className="w-12 h-12 border-4 border-[#7695EC] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#777777] animate-pulse-slow">Loading posts...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-[#777777]">No posts yet. Be the first to post!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {posts.map((post, index) => (
        <div key={post.id} style={{ animationDelay: `${index * 0.1}s` }} className="animate-slideIn">
          <PostCard
            post={post}
            currentUsername={currentUsername}
            onEdit={onEdit}
            onDelete={onDelete}
            onLike={onLike}
            onComment={onComment}
          />
        </div>
      ))}
    </div>
  );
}

