import { create } from 'zustand';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface ToastState {
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  showToast: (message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
}));

export const ToastContainer = () => {
  const { toasts, dismissToast } = useToastStore();

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />
  };

  const bgClasses = {
    success: 'bg-green-50 border border-green-200 text-green-800 dark:bg-green-950/30 dark:border-green-900/50 dark:text-green-200',
    error: 'bg-red-50 border border-red-200 text-red-800 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-200',
    warning: 'bg-yellow-50 border border-yellow-200 text-yellow-800 dark:bg-yellow-950/30 dark:border-yellow-900/50 dark:text-yellow-200',
    info: 'bg-blue-50 border border-blue-200 text-blue-800 dark:bg-blue-950/30 dark:border-blue-900/50 dark:text-blue-200'
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
            className={`flex items-start p-4 rounded-xl shadow-lg ${bgClasses[toast.type]} pointer-events-auto`}
          >
            <div className="flex-shrink-0 mr-3">{icons[toast.type]}</div>
            <div className="flex-1 text-sm font-medium pr-4">{toast.message}</div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="flex-shrink-0 ml-auto text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
