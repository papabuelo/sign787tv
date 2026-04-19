'use client';

import { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes } from 'react';
import { X, Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
}

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glass' | 'elevated';
}

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

interface TabsProps {
  tabs: { id: string; label: string; content: ReactNode }[];
  defaultTab?: string;
  className?: string;
  onTabChange?: (tabId: string) => void;
  variant?: 'pills' | 'line' | 'card';
}

// Botón mejorado con más variantes y animaciones
export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false, 
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 hover:scale-105';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500 shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700 hover:border-gray-600 focus:ring-gray-500',
    outline: 'bg-transparent text-blue-400 border border-blue-500 hover:bg-blue-500 hover:text-white focus:ring-blue-500',
    ghost: 'bg-transparent text-gray-400 hover:bg-gray-800 hover:text-gray-200 focus:ring-gray-500',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500 shadow-lg hover:shadow-xl',
    success: 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 focus:ring-green-500 shadow-lg hover:shadow-xl',
    warning: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 focus:ring-yellow-500 shadow-lg hover:shadow-xl'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm gap-2',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-3',
    xl: 'px-8 py-4 text-lg gap-4'
  };
  
  const fullWidthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidthClass} ${disabledClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {icon && iconPosition === 'left' && !loading && icon}
      {children}
      {icon && iconPosition === 'right' && !loading && icon}
    </button>
  );
}

// Card mejorada con múltiples variantes
export function Card({ children, className = '', padding = 'md', variant = 'default' }: CardProps) {
  const baseClasses = 'rounded-2xl border transition-all duration-300';
  
  const variantClasses = {
    default: 'bg-gray-900 border-gray-800 shadow-xl',
    glass: 'bg-gray-900/50 backdrop-blur-xl border-gray-700/50 shadow-2xl',
    elevated: 'bg-gray-900 border-gray-700 shadow-2xl hover:shadow-3xl'
  };
  
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
}

// Badge mejorado con más variantes
export function Badge({ children, variant = 'default', size = 'md', className = '' }: BadgeProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200';
  
  const variantClasses = {
    default: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    success: 'bg-green-500/10 text-green-400 border border-green-500/20',
    error: 'bg-red-500/10 text-red-400 border border-red-500/20',
    warning: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    info: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
    outline: 'bg-transparent text-gray-400 border border-gray-600'
  };
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  );
}

// Input mejorado con validación y estados
export function Input({ 
  label, 
  error, 
  helperText, 
  icon, 
  iconPosition = 'left', 
  fullWidth = false,
  className = '',
  ...props 
}: InputProps) {
  const baseClasses = 'w-full bg-gray-800 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 hover:border-gray-600';
  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-blue-500';
  const fullWidthClass = fullWidth ? 'w-full' : '';
  const iconClasses = icon ? (iconPosition === 'left' ? 'pl-12' : 'pr-12') : '';
  
  return (
    <div className={`${fullWidthClass} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
            {icon}
          </div>
        )}
        <input
          className={`${baseClasses} ${errorClasses} ${iconClasses}`}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-500">
            {icon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-400">{helperText}</p>
      )}
    </div>
  );
}

// Select mejorado
export function Select({ 
  children, 
  label, 
  error, 
  helperText, 
  fullWidth = false,
  className = '',
  ...props 
}: SelectProps) {
  const baseClasses = 'w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-600';
  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-blue-500';
  const fullWidthClass = fullWidth ? 'w-full' : '';
  
  return (
    <div className={`${fullWidthClass} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      <select
        className={`${baseClasses} ${errorClasses}`}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-400">{helperText}</p>
      )}
    </div>
  );
}

// Modal mejorado con animaciones y múltiples tamaños
export function Modal({ 
  isOpen, 
  onClose, 
  children, 
  title, 
  size = 'md', 
  closeOnOverlayClick = true, 
  showCloseButton = true,
  className = ''
}: ModalProps) {
  if (!isOpen) return null;
  
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    full: 'max-w-7xl mx-4'
  };
  
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={handleOverlayClick}
    >
      <div 
        className={`${sizeClasses[size]} w-full bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl animate-scale-in ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

// Tabs mejorado con múltiples variantes
export function Tabs({ 
  tabs, 
  defaultTab, 
  className = '', 
  onTabChange,
  variant = 'pills'
}: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultTab || tabs[0]?.id);
  
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };
  
  const baseClasses = 'flex space-x-1';
  
  const variantClasses = {
    pills: 'bg-gray-800 p-1 rounded-xl',
    line: 'border-b border-gray-700',
    card: 'bg-gray-800 rounded-xl'
  };
  
  const tabClasses = {
    pills: 'px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
    line: 'px-4 py-2.5 text-sm font-medium border-b-2 transition-all duration-200',
    card: 'px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200'
  };
  
  const activeTabClasses = {
    pills: 'bg-blue-600 text-white shadow-lg',
    line: 'border-blue-500 text-blue-400',
    card: 'bg-gray-700 text-white'
  };
  
  const inactiveTabClasses = {
    pills: 'text-gray-400 hover:text-white hover:bg-gray-700',
    line: 'border-transparent text-gray-400 hover:text-white hover:border-gray-600',
    card: 'text-gray-400 hover:text-white hover:bg-gray-700'
  };
  
  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={`${tabClasses[variant]} ${
            activeTab === tab.id 
              ? activeTabClasses[variant] 
              : inactiveTabClasses[variant]
          }`}
        >
          {tab.label}
        </button>
      ))}
      <div className="mt-6">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}

import React from 'react';