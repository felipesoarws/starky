import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  withArrow?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  withArrow = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed rounded-full";
  
  const variants = {
    // Primary: Uses the new Accent Blue (#3B45F2)
    primary: "bg-(--accent-color) text-white hover:bg-(--accent-color)/90 shadow-lg shadow-(--accent-color)/25 focus:ring-(--accent-color)",
    // Secondary: Dark Gray background for Dark Mode
    secondary: "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-zinc-700 shadow-sm focus:ring-zinc-600",
    // Outline: Border only
    outline: "border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 focus:ring-zinc-700",
    // Ghost: Minimal
    ghost: "text-zinc-400 hover:text-white hover:bg-zinc-800 focus:ring-zinc-700",
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-5 py-2.5 gap-2",
    lg: "text-base px-7 py-3.5 gap-2.5",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
      {withArrow && <ArrowRight className="w-4 h-4" />}
    </button>
  );
};