import { useState } from 'react';
import { toast } from 'react-toastify';
import { createPostSchema, type CreatePostFormData } from '../../schemas/post.schema';
import type { CreatePostData } from '../../types/post';

type PostFormState = {
  title: string;
  content: string;
  imageUrl: string;
};

const initialFormState: PostFormState = {
  title: '',
  content: '',
  imageUrl: '',
};

interface PostFormProps {
  username: string;
  onCreatePost: (postData: CreatePostData) => Promise<void>;
}

export function PostForm({ username, onCreatePost }: PostFormProps) {
  const [formData, setFormData] = useState<PostFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

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

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const validationResult = createPostSchema.safeParse(formData);

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

      const validatedData: CreatePostFormData = validationResult.data;
      await onCreatePost({
        username,
        title: validatedData.title,
        content: validatedData.content,
        imageUrl: formData.imageUrl || undefined,
      });

      setFormData(initialFormState);
      toast.success('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormEmpty = formData.title.trim() === '' || formData.content.trim() === '';

  return (
    <div className="bg-white rounded-2xl border border-[#CCCCCC] overflow-hidden animate-fadeIn hover-lift">
      <div className="bg-[#7695EC] px-6 py-4">
        <h2 className="text-[22px] font-bold text-white">What's on your mind?</h2>
      </div>
      <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="title" className="text-base font-normal text-black">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Hello world"
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? 'title-error' : undefined}
            className={`w-full h-8 px-3 py-2 border rounded-lg text-sm text-black box-border placeholder:text-[#999999] focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-offset-1 ${
              errors.title
                ? 'border-red-500 focus:border-red-600 focus:ring-red-300'
                : 'border-[#CCCCCC] focus:border-[#7695EC] focus:ring-[#7695EC] focus:shadow-md'
            }`}
          />
          {errors.title && (
            <span id="title-error" className="text-xs text-red-500 mt-1">
              {errors.title}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="content" className="text-base font-normal text-black">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Content here"
            rows={4}
            aria-invalid={!!errors.content}
            aria-describedby={errors.content ? 'content-error' : undefined}
            className={`w-full px-3 py-2 border rounded-lg text-sm text-black box-border placeholder:text-[#999999] focus:outline-none transition-all duration-300 resize-none focus:ring-2 focus:ring-offset-1 ${
              errors.content
                ? 'border-red-500 focus:border-red-600 focus:ring-red-300'
                : 'border-[#CCCCCC] focus:border-[#7695EC] focus:ring-[#7695EC] focus:shadow-md'
            }`}
          />
          {errors.content && (
            <span id="content-error" className="text-xs text-red-500 mt-1">
              {errors.content}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="image" className="text-base font-normal text-black">
            Image (optional)
          </label>
          <div className="flex flex-col gap-2">
            <input
              id="image"
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

        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={isFormEmpty || isSubmitting}
            className={`w-[111px] h-8 rounded-lg border-none text-base font-bold uppercase cursor-pointer transition-all duration-300 transform ${
              isFormEmpty
                ? 'bg-[#CCCCCC] cursor-not-allowed opacity-60'
                : 'bg-[#7695EC] text-white hover:bg-[#5a7dd8] active:bg-[#4a6bc7] hover:scale-105 active:scale-95 hover:shadow-lg'
            }`}
          >
            CREATE
          </button>
        </div>
      </form>
    </div>
  );
}

