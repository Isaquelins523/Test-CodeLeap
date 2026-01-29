import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { updatePostSchema, type UpdatePostFormData } from '../../schemas/post.schema';
import type { Post, UpdatePostData } from '../../types/post';

type EditFormState = {
  title: string;
  content: string;
  imageUrl: string;
};

interface EditPostModalProps {
  post: Post | null;
  onClose: () => void;
  onUpdate: (postId: number, postData: UpdatePostData) => Promise<void>;
}

export function EditPostModal({ post, onUpdate, onClose }: EditPostModalProps) {
  const [formData, setFormData] = useState<EditFormState>({
    title: '',
    content: '',
    imageUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        imageUrl: post.imageUrl || '',
      });
      setErrors({});
    }
  }, [post]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setFormData((prev) => ({ ...prev, imageUrl: '' }));
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        imageUrl: reader.result as string,
      }));
    };
    reader.onerror = () => {
      toast.error('Error reading image file');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!post || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const validationResult = updatePostSchema.safeParse(formData);

      if (!validationResult.success) {
        const fieldErrors: { title?: string; content?: string } = {};
        validationResult.error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof typeof fieldErrors;
          fieldErrors[field] = issue.message;
        });
        setErrors(fieldErrors);
        toast.error('Please fill in all fields correctly');
        return;
      }

      const validatedData: UpdatePostFormData = validationResult.data;
      await onUpdate(post.id, {
        title: validatedData.title,
        content: validatedData.content,
        imageUrl: formData.imageUrl || undefined,
      });

      toast.success('Post updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!post) {
    return null;
  }

  const isFormEmpty = formData.title.trim() === '' || formData.content.trim() === '';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl border border-[#CCCCCC] w-full max-w-[660px] overflow-hidden animate-scaleIn shadow-2xl">
        <div className="bg-[#7695EC] px-6 py-4">
          <h2 className="text-[22px] font-bold text-white">Edit item</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="edit-title" className="text-base font-normal text-black">
              Title
            </label>
            <input
              id="edit-title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Hello world"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? 'edit-title-error' : undefined}
              className={`w-full h-8 px-3 py-2 border rounded-lg text-sm text-black box-border placeholder:text-[#999999] focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-offset-1 ${
                errors.title
                  ? 'border-red-500 focus:border-red-600 focus:ring-red-300'
                  : 'border-[#CCCCCC] focus:border-[#7695EC] focus:ring-[#7695EC] focus:shadow-md'
              }`}
            />
            {errors.title && (
              <span id="edit-title-error" className="text-xs text-red-500 mt-1">
                {errors.title}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="edit-content" className="text-base font-normal text-black">
              Content
            </label>
            <textarea
              id="edit-content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Content here"
              rows={4}
              aria-invalid={!!errors.content}
              aria-describedby={errors.content ? 'edit-content-error' : undefined}
              className={`w-full px-3 py-2 border rounded-lg text-sm text-black box-border placeholder:text-[#999999] focus:outline-none transition-all duration-300 resize-none focus:ring-2 focus:ring-offset-1 ${
                errors.content
                  ? 'border-red-500 focus:border-red-600 focus:ring-red-300'
                  : 'border-[#CCCCCC] focus:border-[#7695EC] focus:ring-[#7695EC] focus:shadow-md'
              }`}
            />
            {errors.content && (
              <span id="edit-content-error" className="text-xs text-red-500 mt-1">
                {errors.content}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="edit-image" className="text-base font-normal text-black">
              Image (optional)
            </label>
            <div className="flex flex-col gap-2">
              <input
                id="edit-image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-[#CCCCCC] rounded-lg text-sm text-black box-border focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-offset-1 focus:border-[#7695EC] focus:ring-[#7695EC] focus:shadow-md file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#7695EC] file:text-white hover:file:bg-[#5a7dd8] cursor-pointer"
              />
              {formData.imageUrl && (
                <div className="relative group animate-imageFadeIn">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full max-h-64 object-cover rounded-lg border border-[#CCCCCC] image-hover transition-smooth"
                    onLoad={(e) => {
                      e.currentTarget.classList.add('animate-imageZoom');
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-all duration-300 transform hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100"
                    aria-label="Remove image"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-[120px] h-8 rounded-lg border border-[#999999] text-base font-bold text-black bg-white hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isFormEmpty || isSubmitting}
              className={`w-[120px] h-8 rounded-lg border-none text-base font-bold uppercase cursor-pointer transition-all duration-300 transform ${
                isFormEmpty
                  ? 'bg-[#CCCCCC] cursor-not-allowed opacity-60'
                  : 'bg-[#47B960] text-white hover:bg-[#3da050] active:bg-[#338740] hover:scale-105 active:scale-95 hover:shadow-lg'
              }`}
            >
              SAVE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

