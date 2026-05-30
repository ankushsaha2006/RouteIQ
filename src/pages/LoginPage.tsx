import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../components/ui/Toast';
import { Lock, Mail, Sparkles } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('sarah@routeiq.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { showToast } = useToastStore();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (success) {
        showToast('Logged in successfully', 'success');
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
        showToast('Failed to authenticate', 'error');
      }
    } catch (err) {
      setError('An error occurred during login');
      showToast('An unexpected error occurred', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card className="w-full max-w-md mx-auto relative overflow-hidden">
        {/* Glow styling overlay */}
        <div className="absolute -top-16 -left-16 h-32 w-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 h-32 w-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="px-6 py-8 relative">
          {/* Logo Title */}
          <div className="text-center mb-8">
            <div className="mx-auto bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl p-3.5 w-16 h-16 flex items-center justify-center mb-4 shadow-md shadow-blue-500/10">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
              Welcome to RouteIQ
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Enter your credentials to manage your fleet operations
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="operator@routeiq.com"
              icon={Mail}
              error={error ? ' ' : undefined} // spacing adjustment or empty
              required
            />

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-primary mb-1">Password</label>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-xs text-brand-blue hover:text-blue-700 font-semibold"
                >
                  Forgot password?
                </button>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                placeholder="••••••••"
                icon={Lock}
                required
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 font-semibold text-center mt-2">
                {error}
              </p>
            )}

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="mt-6 font-bold shadow-lg shadow-blue-500/15"
            >
              Sign In
            </Button>
          </form>

          {/* Guest Sign-in Quick Fill */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-center">
            <button
              type="button"
              onClick={() => {
                setEmail('operator@routeiq.com');
                setPassword('password123');
              }}
              className="text-xs text-gray-400 dark:text-gray-500 hover:text-brand-blue transition-colors font-medium"
            >
              Autofill mock credentials
            </button>
          </div>
        </div>
      </Card>
    </AuthLayout>
  );
};

export default LoginPage;
