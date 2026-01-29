import type { Post } from '../../types/post';

interface DeletePostAlertProps {
  post: Post | null;
  onClose: () => void;
  onConfirm: (postId: number) => Promise<void>;
}

export function DeletePostAlert({ post, onConfirm, onClose }: DeletePostAlertProps) {
  const handleConfirm = async () => {
    if (!post) {
      return;
    }

    try {
      await onConfirm(post.id);
      onClose();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (!post) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-[#777777CC] flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl border border-[#CCCCCC] w-full max-w-[660px] overflow-hidden animate-bounceIn shadow-2xl">
        <div className="px-6 py-4">
          <h2 className="text-[22px] font-bold text-black">Are you sure you want to delete this item?</h2>
        </div>
        <div className="px-6 py-4 flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="w-[120px] h-8 rounded-lg border border-[#999999] text-base font-bold text-black bg-white hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="w-[120px] h-8 rounded-lg border-none text-base font-bold text-white bg-[#FF5151] hover:bg-[#FF3333] transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

