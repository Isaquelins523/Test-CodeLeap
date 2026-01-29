import { formatRelativeTime } from '../../utils/date';
import { PostInteractions } from '../PostInteractions/PostInteractions';
import type { Post } from '../../types/post';

interface PostCardProps {
  post: Post;
  currentUsername: string;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
  onLike?: (postId: number) => void;
  onComment?: (postId: number, comment: string) => void;
}

export function PostCard({ post, currentUsername, onEdit, onDelete, onLike, onComment }: PostCardProps) {
  const isOwner = post.username === currentUsername;

  const renderContentWithMentions = (text: string) => {
    const parts = text.split(/(@\w+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        return (
          <span key={index} className="text-[#7695EC] font-semibold">
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-[#CCCCCC] overflow-hidden animate-slideIn hover-lift transition-smooth">
      <div className="bg-[#7695EC] px-6 py-4 flex justify-between items-center">
        <h3 className="text-[22px] font-bold text-white">{post.title}</h3>
        {isOwner && (
          <div className="flex gap-4">
            <button
              onClick={() => onDelete(post)}
              className="text-white hover:text-red-200 transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="Delete post"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={() => onEdit(post)}
              className="text-white hover:text-blue-200 transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="Edit post"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center text-sm text-[#777777]">
          <span>@{post.username}</span>
          <span>{formatRelativeTime(post.created_datetime)}</span>
        </div>
        <p className="text-base text-black whitespace-pre-wrap">
          {renderContentWithMentions(post.content)}
        </p>
        {post.imageUrl && (
          <div className="w-full rounded-lg overflow-hidden border border-[#CCCCCC] animate-imageFadeIn group cursor-pointer">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-auto object-cover image-hover transition-smooth"
              loading="lazy"
              onLoad={(e) => {
                e.currentTarget.classList.add('animate-imageZoom');
              }}
            />
          </div>
        )}
        <PostInteractions post={post} onLike={onLike} onComment={onComment} />
      </div>
    </div>
  );
}

