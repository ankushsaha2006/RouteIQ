// src/components/ui/input.tsx
import React, { InputHTMLAttributes, ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon: Icon,
  iconPosition = 'left',
  helperText,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-primary mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        
        <input
          id={inputId}
          className={`
            block w-full rounded-md border ${
              error 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:ring-brand-blue focus:border-brand-blue'
            }
            shadow-sm py-2 px-3 ${
              Icon && iconPosition === 'left' ? 'pl-10' : ''
            } ${
              Icon && iconPosition === 'right' ? 'pr-10' : ''
            }
            bg-white text-primary placeholder-gray-400
            ${className}
          `}
          {...props}
        />
        
        {Icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
      </div>
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
