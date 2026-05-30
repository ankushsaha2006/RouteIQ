// src/components/ui/EmptyState.tsx
import type { FC } from 'react';
import { Button } from './Button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      {Icon && (
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      )}
      
      <h3 className="mt-4 text-lg font-medium text-primary">{title}</h3>
      <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
        {description}
      </p>
      
      {actionText && onAction && (
        <div className="mt-6">
          <Button onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
};
