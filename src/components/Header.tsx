/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, Plus, Sparkles, RotateCcw } from 'lucide-react';
import { GoalStats } from '../types/goal';

interface HeaderProps {
  stats: GoalStats;
  onOpenCreateModal: () => void;
  onResetSamples: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  onOpenCreateModal,
  onResetSamples,
}) => {
  return (
    <header className="border-b border-stone-200 bg-white/90 backdrop-blur-md sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Marca / Identidade */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center border border-amber-200 shadow-xs">
            <BookOpen className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
                StudyFlow
              </h1>
              <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200">
                Guia de Estudos
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 hidden sm:block">
              Organize seus objetivos de estudo com clareza, prazos e ritmo
            </p>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onResetSamples}
            title="Restaurar objetivos de exemplo para iniciantes"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Exemplos</span>
          </button>

          <button
            type="button"
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all cursor-pointer active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Objetivo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
