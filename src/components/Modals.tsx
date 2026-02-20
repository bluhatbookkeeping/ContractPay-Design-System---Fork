import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';
import { PrimaryButton, SecondaryButton, DangerButton } from './Buttons';
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  confirmVariant?: 'primary' | 'danger';
  icon?: 'warning' | 'success';
}
export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  confirmVariant = 'primary',
  icon = 'warning'
}: ConfirmationModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl transform transition-all scale-100 animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${icon === 'warning' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>

            {icon === 'warning' ?
            <AlertTriangle className="w-6 h-6" /> :

            <CheckCircle className="w-6 h-6" />
            }
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-500 mb-6">{message}</p>

          <div className="flex gap-3 w-full">
            <SecondaryButton onClick={onClose} fullWidth>
              Cancel
            </SecondaryButton>
            {confirmVariant === 'danger' ?
            <DangerButton onClick={onConfirm} fullWidth>
                {confirmText}
              </DangerButton> :

            <PrimaryButton onClick={onConfirm} fullWidth>
                {confirmText}
              </PrimaryButton>
            }
          </div>
        </div>
      </div>
    </div>);

}
interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
export function BottomSheet({
  isOpen,
  onClose,
  title,
  children
}: BottomSheetProps) {
  if (!isOpen) return null;
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose} />


      <div className="relative w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-xl transform transition-transform duration-300 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-center pt-3 pb-2 sm:hidden">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">

            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>,
    document.body
  );
}
export type ToastVariant = 'success' | 'error' | 'warning' | 'info';
interface ToastProps {
  id: string;
  variant: ToastVariant;
  title: string;
  message: string;
  onClose: (id: string) => void;
}
export function Toast({ id, variant, title, message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [id, onClose]);
  const styles = {
    success: {
      border: 'border-green-500',
      icon: <CheckCircle className="w-5 h-5 text-green-500" />
    },
    error: {
      border: 'border-red-500',
      icon: <AlertCircle className="w-5 h-5 text-red-500" />
    },
    warning: {
      border: 'border-yellow-500',
      icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />
    },
    info: {
      border: 'border-blue-500',
      icon: <Info className="w-5 h-5 text-blue-500" />
    }
  };
  const style = styles[variant];
  return (
    <div
      className={`w-full max-w-sm bg-white rounded-lg shadow-lg border-l-4 ${style.border} p-4 flex items-start gap-3 animate-in slide-in-from-right duration-300`}>

      <div className="flex-shrink-0 mt-0.5">{style.icon}</div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
        <p className="text-sm text-gray-500 mt-1">{message}</p>
      </div>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600">

        <X className="w-4 h-4" />
      </button>
    </div>);

}
interface ToastContainerProps {
  toasts: Array<{
    id: string;
    variant: ToastVariant;
    title: string;
    message: string;
  }>;
  removeToast: (id: string) => void;
}
export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      <div className="pointer-events-auto flex flex-col gap-3">
        {toasts.map((toast) =>
        <Toast key={toast.id} {...toast} onClose={removeToast} />
        )}
      </div>
    </div>);

}