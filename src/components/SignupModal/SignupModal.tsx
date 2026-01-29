import { useState } from 'react';
import { toast } from 'react-toastify';
import { signupSchema, type SignupFormData } from '../../schemas/signup.schema';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { User } from '../../types/user';

type FormState = {
  username: string;
};

const initialFormState: FormState = {
  username: '',
};

export function SignupModal() {
  const [, setUser] = useLocalStorage<User | null>('user', null);
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      const validationResult = signupSchema.safeParse(formData);
      
      if (!validationResult.success) {
        const firstError = validationResult.error.issues[0];
        setError(firstError.message);
        toast.error(firstError.message);
        return;
      }

      const validatedData: SignupFormData = validationResult.data;
      setUser({ username: validatedData.username });
      toast.success(`Welcome, ${validatedData.username}!`);
    } catch (error) {
      console.error('Error saving username:', error);
      const errorMessage = 'Error saving username. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isUsernameEmpty = formData.username.trim() === '';

  return (
    <div className="fixed inset-0 bg-[#DDDDDD] flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-[500px] min-h-[205px] rounded-2xl border border-[#CCCCCC] bg-white p-6 flex flex-col gap-6 animate-scaleIn shadow-lg">
        <h1 className="text-[22px] font-bold text-black leading-tight m-0">
          Welcome to CodeLeap network!
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
          <label htmlFor="username" className="text-base font-normal text-black m-0">
            Please enter your username
          </label>
          <div className="flex flex-col gap-1">
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="John doe"
              aria-invalid={!!error}
              aria-describedby={error ? 'username-error' : undefined}
              className={`w-full h-8 px-3 py-2 border rounded-lg text-sm text-black box-border placeholder:text-[#999999] focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-offset-1 ${
                error
                  ? 'border-red-500 focus:border-red-600 focus:ring-red-300'
                  : 'border-[#CCCCCC] focus:border-[#7695EC] focus:ring-[#7695EC] focus:shadow-md'
              }`}
              autoFocus
            />
            {error && (
              <span id="username-error" className="text-xs text-red-500 mt-1">
                {error}
              </span>
            )}
          </div>
          <div className="flex justify-end mt-auto">
            <button
              type="submit"
              disabled={isUsernameEmpty || isSubmitting}
              className={`w-[111px] h-8 rounded-lg border-none text-base font-bold uppercase cursor-pointer transition-all duration-300 transform ${
                isUsernameEmpty
                  ? 'bg-[#CCCCCC] cursor-not-allowed opacity-60'
                  : 'bg-[#7695EC] text-white hover:bg-[#5a7dd8] active:bg-[#4a6bc7] hover:scale-105 active:scale-95 hover:shadow-lg'
              }`}
            >
              ENTER
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

