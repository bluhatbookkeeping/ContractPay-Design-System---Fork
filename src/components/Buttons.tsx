import React from 'react';
import { Loader2, Check, X } from 'lucide-react';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
export function PrimaryButton({
  children,
  loading,
  fullWidth,
  size = 'md',
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
  'inline-flex items-center justify-center font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-900';
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm h-8',
    md: 'px-6 py-3 text-base h-12',
    lg: 'px-8 py-4 text-lg h-14'
  };
  const widthStyles = fullWidth ? 'w-full' : '';
  const variantStyles = disabled ?
  'bg-gray-200 text-gray-400 cursor-not-allowed' :
  'bg-navy-900 text-white hover:bg-navy-800 active:bg-[#102a43] shadow-sm';
  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${widthStyles} ${variantStyles} ${className}`}
      disabled={disabled || loading}
      {...props}>

      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : children}
    </button>);

}
export function SecondaryButton({
  children,
  loading,
  fullWidth,
  size = 'md',
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
  'inline-flex items-center justify-center font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-900';
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm h-8',
    md: 'px-[22px] py-[10px] text-base h-12',
    lg: 'px-[30px] py-[14px] text-lg h-14'
  };
  const widthStyles = fullWidth ? 'w-full' : '';
  const variantStyles = disabled ?
  'border-2 border-gray-200 text-gray-400 cursor-not-allowed' :
  'bg-transparent border-2 border-navy-900 text-navy-900 hover:bg-[#f0f4f8] active:bg-[#d9e2ec]';
  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${widthStyles} ${variantStyles} ${className}`}
      disabled={disabled || loading}
      {...props}>

      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : children}
    </button>);

}
export function SuccessButton({
  children,
  loading,
  fullWidth,
  size = 'md',
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
  'inline-flex items-center justify-center font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600';
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm h-8',
    md: 'px-6 py-3 text-base h-12',
    lg: 'px-8 py-4 text-lg h-14'
  };
  const widthStyles = fullWidth ? 'w-full' : '';
  const variantStyles = disabled ?
  'bg-gray-200 text-gray-400 cursor-not-allowed' :
  'bg-green-600 text-white hover:bg-green-700 shadow-sm';
  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${widthStyles} ${variantStyles} ${className}`}
      disabled={disabled || loading}
      {...props}>

      {loading ?
      <Loader2 className="w-5 h-5 animate-spin" /> :

      <>
          <Check className="w-5 h-5 mr-2" />
          {children}
        </>
      }
    </button>);

}
export function DangerButton({
  children,
  loading,
  fullWidth,
  size = 'md',
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
  'inline-flex items-center justify-center font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600';
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm h-8',
    md: 'px-[22px] py-[10px] text-base h-12',
    lg: 'px-[30px] py-[14px] text-lg h-14'
  };
  const widthStyles = fullWidth ? 'w-full' : '';
  const variantStyles = disabled ?
  'border-2 border-gray-200 text-gray-400 cursor-not-allowed' :
  'bg-white border-2 border-red-600 text-red-600 hover:bg-red-50';
  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${widthStyles} ${variantStyles} ${className}`}
      disabled={disabled || loading}
      {...props}>

      {loading ?
      <Loader2 className="w-5 h-5 animate-spin" /> :

      <>
          <X className="w-5 h-5 mr-2" />
          {children}
        </>
      }
    </button>);

}
interface IconButtonProps extends
  React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
}
export function IconButton({
  icon,
  label,
  className = '',
  disabled,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={`w-11 h-11 inline-flex items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-900 ${disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'} ${className}`}
      aria-label={label}
      disabled={disabled}
      {...props}>

      {icon}
    </button>);

}