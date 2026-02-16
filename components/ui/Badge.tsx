import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline' | 'purple';
  className?: string;
}

const Badge = ({ children, variant = 'default', className }: BadgeProps) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800 border border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    danger: 'bg-red-100 text-red-800 border border-red-200',
    purple: 'bg-purple-100 text-purple-800 border border-purple-200',
    outline: 'bg-transparent border border-gray-300 text-gray-600'
  };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center", variants[variant], className)}>
      {children}
    </span>
  );
};

export default Badge;