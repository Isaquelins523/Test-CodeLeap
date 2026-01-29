import { useState } from 'react';
import { toast } from 'react-toastify';
import { usePosts } from '../../hooks/usePosts';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { User } from '../../types/user';
import type { Post, CreatePostData, UpdatePostData } from '../../types/post';
import { PostForm } from '../PostForm/PostForm';
import { PostList } from '../PostList/PostList';
import { EditPostModal } from '../EditPostModal/EditPostModal';
import { DeletePostAlert } from '../DeletePostAlert/DeletePostAlert';

export function MainScreen() {
  const [user, setUser] = useLocalStorage<User | null>('user', null);
  const { posts, isLoading, error, createPost, updatePost, deletePost, toggleLike, addComment } = usePosts();
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deletingPost, setDeletingPost] = useState<Post | null>(null);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    setUser(null);
    toast.success('Logged out successfully!');
  };

  const handleCreatePost = async (postData: CreatePostData) => {
    await createPost(postData);
  };

  const handleUpdatePost = async (postId: number, postData: UpdatePostData) => {
    await updatePost(postId, postData);
  };

  const handleDeletePost = async (postId: number) => {
    try {
      await deletePost(postId);
      toast.success('Post deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete post. Please try again.');
    }
  };

  const handleEditClick = (post: Post) => {
    setEditingPost(post);
  };

  const handleDeleteClick = (post: Post) => {
    setDeletingPost(post);
  };

  const handleLike = (postId: number) => {
    toggleLike(postId);
  };

  const handleComment = (postId: number, comment: string) => {
    addComment(postId, comment, user.username);
    toast.success('Comment added!');
  };

  return (
    <div className="min-h-screen bg-[#DDDDDD] py-8 px-4">
      <div className="max-w-[800px] mx-auto flex flex-col gap-6 pb-8">
        <div className="flex justify-between items-center bg-white rounded-2xl border border-[#CCCCCC] px-6 py-4 animate-fadeIn hover-lift">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#7695EC] flex items-center justify-center animate-float transition-smooth">
              <span className="text-white font-bold text-lg">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-base font-semibold text-black">@{user.username}</span>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-[#FF5151] text-white rounded-lg text-sm font-bold hover:bg-[#FF3333] transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-lg"
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
        <PostForm username={user.username} onCreatePost={handleCreatePost} />
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Error loading posts:</p>
            <p>{error}</p>
          </div>
        )}
        <PostList
          posts={posts}
          currentUsername={user.username}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onLike={handleLike}
          onComment={handleComment}
          isLoading={isLoading}
        />
      </div>

      {editingPost && (
        <EditPostModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onUpdate={handleUpdatePost}
        />
      )}

      {deletingPost && (
        <DeletePostAlert
          post={deletingPost}
          onClose={() => setDeletingPost(null)}
          onConfirm={handleDeletePost}
        />
      )}
    </div>
  );
}

