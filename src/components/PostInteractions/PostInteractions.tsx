import { useState } from 'react';
import type { Post } from '../../types/post';
import { extractMentions } from '../../utils/mentions';
import { formatRelativeTime } from '../../utils/date';

interface PostInteractionsProps {
  post: Post;
  onLike?: (postId: number) => void;
  onComment?: (postId: number, comment: string) => void;
}

export function PostInteractions({ post, onLike, onComment }: PostInteractionsProps) {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');
  const mentions = extractMentions(post.content);
  const likesCount = post.likes ?? 0;
  const commentsList = post.commentsList ?? [];
  const commentsCount = commentsList.length;
  const mentionsCount = mentions.length;

  const handleCommentClick = () => {
    setShowCommentInput((prev) => !prev);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim() && onComment) {
      onComment(post.id, commentText.trim());
      setCommentText('');
    }
  };

  const handleCancelComment = () => {
    setCommentText('');
    setShowCommentInput(false);
  };

  return (
    <div className="flex flex-col gap-4 pt-4 border-t border-[#CCCCCC]">
      <div className="flex items-center gap-6">
        {onLike && (
          <button
            onClick={() => onLike(post.id)}
            className="flex items-center gap-2 text-[#777777] hover:text-[#7695EC] transition-all duration-300 transform hover:scale-110 active:scale-95"
            aria-label="Like post"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm font-normal">{likesCount}</span>
          </button>
        )}

        {onComment && (
          <button
            onClick={handleCommentClick}
            className="flex items-center gap-2 text-[#777777] hover:text-[#7695EC] transition-all duration-300 transform hover:scale-110 active:scale-95"
            aria-label="Comment on post"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm font-normal">{commentsCount}</span>
          </button>
        )}

        {mentionsCount > 0 && (
          <div className="flex items-center gap-2 text-[#777777]">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.54 0 2.98-.41 4.22-1.13l-1.5-1.5c-.72.3-1.5.48-2.32.48-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8c0 1.19-.26 2.32-.72 3.35l1.48 1.48C21.54 15.69 22 13.91 22 12c0-5.52-4.48-10-10-10zm0 3c-3.87 0-7 3.13-7 7s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 2c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5z"
                fill="currentColor"
              />
            </svg>
            <span className="text-sm font-normal">{mentionsCount}</span>
          </div>
        )}
      </div>

      {commentsList.length > 0 && (
        <div className="flex flex-col gap-3">
          {commentsList.map((comment, index) => (
            <div key={comment.id ?? index} className="flex flex-col gap-1 pl-2 border-l-2 border-[#CCCCCC] animate-slideIn">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-black">@{comment.username}</span>
                <span className="text-xs text-[#777777]">{formatRelativeTime(comment.created_datetime)}</span>
              </div>
              <p className="text-sm text-black">{comment.content}</p>
            </div>
          ))}
        </div>
      )}

      {showCommentInput && (
        <form onSubmit={handleCommentSubmit} className="flex flex-col gap-2 animate-scaleIn">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="w-full px-3 py-2 border border-[#CCCCCC] rounded-lg text-sm text-black focus:outline-none focus:border-[#7695EC] placeholder:text-[#999999] transition-all duration-300 focus:ring-2 focus:ring-[#7695EC] focus:ring-offset-1 focus:shadow-md"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancelComment}
              className="px-4 py-2 text-sm text-[#777777] hover:text-black transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!commentText.trim()}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all duration-300 transform ${
                commentText.trim()
                  ? 'bg-[#7695EC] text-white hover:bg-[#5a7dd8] hover:scale-105 active:scale-95 hover:shadow-lg'
                  : 'bg-[#CCCCCC] text-white cursor-not-allowed opacity-60'
              }`}
            >
              Comment
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

