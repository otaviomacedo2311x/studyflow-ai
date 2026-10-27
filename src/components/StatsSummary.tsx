/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Target, Clock, CheckCircle2, CircleDashed } from 'lucide-react';
import { GoalStats, FilterStatus } from '../types/goal';

interface StatsSummaryProps {
  stats: GoalStats;
  currentFilter: FilterStatus;
  onSelectFilter: (filter: FilterStatus) => void;
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({
  stats,
  currentFilter,
  onSelectFilter,
}) => {
  return (
    <section className="mb-8" aria-labelledby="stats-heading">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h2 id="stats-heading" className="text-base font-semibold text-stone-900">
            Resumo do seu Aprendizado
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Acompanhe o ritmo dos seus objetivos e celebre cada avanço
          </p>
        </div>

        {/* Indicador de progresso geral */}
        {stats.total > 0 && (
          <div className="flex items-center gap-3 bg-stone-50 px-3.5 py-2 rounded-xl border border-stone-200">
            <span className="text-xs font-medium text-stone-600">
              Taxa de conclusão: <strong className="text-stone-900">{stats.taxaConclusao}%</strong>
            </span>
            <div className="w-24 sm:w-28 bg-stone-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${stats.taxaConclusao}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Grid de Contadores Interativos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Cadastrados */}
        <button
          type="button"
          onClick={() => onSelectFilter('todos')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            currentFilter === 'todos'
              ? 'bg-amber-50/60 border-amber-300 ring-2 ring-amber-500/20 shadow-xs'
              : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
          }`}
        >
          <div className="flex items-center justify-between text-stone-600 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-stone-500">
              Total Cadastrados
            </span>
            <Target className="w-4 h-4 text-stone-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
              {stats.total}
            </span>
            <span className="text-xs text-stone-500">
              {stats.total === 1 ? 'objetivo' : 'objetivos'}
            </span>
          </div>
        </button>

        {/* Não Iniciados */}
        <button
          type="button"
          onClick={() => onSelectFilter('nao_iniciado')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            currentFilter === 'nao_iniciado'
              ? 'bg-stone-100 border-stone-300 ring-2 ring-stone-400/20 shadow-xs'
              : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
          }`}
        >
          <div className="flex items-center justify-between text-stone-600 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-stone-500">
              Não Iniciados
            </span>
            <CircleDashed className="w-4 h-4 text-stone-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-700">
              {stats.naoIniciados}
            </span>
            <span className="text-xs text-stone-500">na fila</span>
          </div>
        </button>

        {/* Em Andamento */}
        <button
          type="button"
          onClick={() => onSelectFilter('em_andamento')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            currentFilter === 'em_andamento'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-500/20 shadow-xs'
              : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
          }`}
        >
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-amber-700">
              Em Andamento
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-amber-800">
              {stats.emAndamento}
            </span>
            <span className="text-xs text-amber-700/80">em foco</span>
          </div>
        </button>

        {/* Concluídos */}
        <button
          type="button"
          onClick={() => onSelectFilter('concluido')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            currentFilter === 'concluido'
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
              : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
          }`}
        >
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-emerald-700">
              Concluídos
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-800">
              {stats.concluidos}
            </span>
            <span className="text-xs text-emerald-700/80">alcançados</span>
          </div>
        </button>
      </div>
    </section>
  );
};
