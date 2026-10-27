/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Goal } from '../types/goal';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  goal: Goal | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  goal,
  onCancel,
  onConfirm,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen || !goal) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-desc"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full border border-stone-200 shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 id="delete-dialog-title" className="text-base font-semibold text-stone-900">
                Confirmar Exclusão
              </h3>
              <p id="delete-dialog-desc" className="mt-1 text-sm text-stone-600">
                Tem certeza de que deseja excluir este objetivo de estudo?
              </p>

              {/* Destaque do objetivo */}
              <div className="mt-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-0.5">
                  Objetivo:
                </p>
                <p className="text-sm font-medium text-stone-900 line-clamp-2">
                  "{goal.title}"
                </p>
              </div>

              <p className="mt-2 text-xs text-stone-500">
                Esta ação removerá o objetivo do seu plano e não poderá ser desfeita.
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-all cursor-pointer active:scale-98"
            >
              <Trash2 className="w-4 h-4" />
              <span>Sim, excluir objetivo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
