import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle, Info } from 'lucide-react';

export type ConfirmVariant = 'danger' | 'warning' | 'info';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  variant?: ConfirmVariant;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  variant = 'warning',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isLoading = false
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'danger': return <AlertTriangle className="h-6 w-6 text-red-400" aria-hidden="true" />;
      case 'warning': return <AlertTriangle className="h-6 w-6 text-amber-400" aria-hidden="true" />;
      case 'info': return <Info className="h-6 w-6 text-blue-400" aria-hidden="true" />;
    }
  };

  const getButtonClass = () => {
    switch (variant) {
      case 'danger': return 'bg-red-500 hover:bg-red-600 text-white';
      case 'warning': return 'bg-amber-500 hover:bg-amber-600 text-navy-950 font-bold';
      case 'info': return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-navy-900 border border-gold-500/20">
            {getIcon()}
          </div>
          <p className="text-xs text-slate-300">
            {message}
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            className="px-4 py-2 rounded-lg text-xs text-slate-300 hover:bg-navy-800"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${getButtonClass()}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Procesando...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
