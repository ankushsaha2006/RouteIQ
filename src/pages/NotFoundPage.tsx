import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Sparkles, MapPinOff } from 'lucide-react';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="text-center max-w-md space-y-6">
        {/* Glowing visual */}
        <div className="mx-auto bg-gradient-to-tr from-blue-500/10 to-purple-500/10 border border-blue-500/20 dark:border-blue-500/30 rounded-3xl p-6 w-24 h-24 flex items-center justify-center shadow-lg relative">
          <MapPinOff className="h-12 w-12 text-brand-blue" />
          <div className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-red-500 border-2 border-slate-50 dark:border-slate-950" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-primary dark:text-primary-dark tracking-tight">404 — Route Lost</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            The operational manifest you requested does not exist or has been re-routed.
          </p>
        </div>

        <div className="pt-2">
          <Button 
            onClick={() => navigate('/dashboard')}
            icon={Sparkles}
            className="shadow-lg shadow-blue-500/15"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
