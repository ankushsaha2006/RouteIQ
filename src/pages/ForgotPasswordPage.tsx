// src/pages/ForgotPasswordPage.tsx
import { useNavigate } from 'react-router-dom';
import type { ChangeEvent, FC, FormEvent } from 'react';
import { useState } from 'react';
import { AuthLayout } from '../components/AuthLayout';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Mail } from 'lucide-react';

export const ForgotPasswordPage: FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      if (email) {
        setIsSubmitted(true);
      } else {
        setError('Please enter your email address');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleResetSubmit = () => {
    setIsLoading(true);
    
    // Simulate password reset
    setTimeout(() => {
      navigate('/login');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <AuthLayout>
      <Card className="w-full max-w-md mx-auto">
        <div className="px-6 py-8">
          <div className="text-center mb-8">
            <div className="mx-auto bg-blue-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-primary">
              {isSubmitted ? 'Check Your Email' : 'Forgot Password?'}
            </h2>
            <p className="mt-2 text-gray-600">
              {isSubmitted
                ? 'We have sent a password reset link to your email address'
                : 'Enter your email and we\'ll send you a link to reset your password'}
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  error={error}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                isLoading={isLoading}
              >
                Send Reset Link
              </Button>
              
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-brand-blue hover:text-blue-700 text-sm font-medium"
                >
                  Back to Login
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                Didn't receive the email? Check your spam folder or
              </p>
              <Button 
                variant="outline" 
                className="w-full mb-4"
                onClick={handleResetSubmit}
                isLoading={isLoading}
              >
                Resend Email
              </Button>
              <button
                onClick={() => navigate('/login')}
                className="text-brand-blue hover:text-blue-700 text-sm font-medium"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </Card>
    </AuthLayout>
  );
};
