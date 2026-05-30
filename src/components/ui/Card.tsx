// src/components/ui/Card.tsx
import type { FC, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'gradient';
  gradientColor?: 'blue' | 'cyan' | 'green' | 'purple' | 'pink';
}

export const Card: FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  gradientColor = 'blue'
}) => {
  const baseClasses = 'rounded-xl border border-gray-200 overflow-hidden shadow-sm';
  
  const variantClasses = {
    default: 'bg-white',
    gradient: ''
  };
  
  const gradientClasses = {
    blue: 'bg-gradient-to-r from-blue-500 to-blue-600',
    cyan: 'bg-gradient-to-r from-cyan-500 to-cyan-600',
    green: 'bg-gradient-to-r from-green-500 to-green-600',
    purple: 'bg-gradient-to-r from-purple-500 to-purple-600',
    pink: 'bg-gradient-to-r from-pink-500 to-pink-600'
  };
  
  const cardClasses = [
    baseClasses,
    variant === 'default' ? variantClasses.default : '',
    variant === 'gradient' ? `${variantClasses.gradient} ${gradientClasses[gradientColor]} text-white` : '',
    className
  ].join(' ');
  
  return (
    <div className={cardClasses}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export const CardHeader: FC<CardHeaderProps> = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export const CardContent: FC<CardContentProps> = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
};

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export const CardFooter: FC<CardFooterProps> = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
};
