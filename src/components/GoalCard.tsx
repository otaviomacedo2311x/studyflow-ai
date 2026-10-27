/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Calendar, Edit3, Trash2, CheckCircle2, Clock, CircleDashed, AlertCircle } from 'lucide-react';
import { Goal, GoalStatus } from '../types/goal';
import { formatDeadline } from '../utils/dateUtils';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDeleteRequest: (goal: Goal) => void;
  onToggleStatus: (id: string) => void;
  onChangeStatusDirectly: (id: string, newStatus: GoalStatus) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onDeleteRequest,
  onToggleStatus,
  onChangeStatusDirectly,
}) => {
  const isConcluido = goal.status === 'concluido';
  const isEmAndamento = goal.status === 'em_andamento';
  const isNaoIniciado = goal.status === 'nao_iniciado';

  const deadlineInfo = formatDeadline(goal.deadline);

  return (
    <article
      className={`rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 relative group ${
        isConcluido
          ? 'bg-stone-50/70 border-stone-200/80'
          : isEmAndamento
          ? 'bg-white border-amber-200 shadow-xs hover:border-amber-300 hover:shadow-md'
          : 'bg-white border-stone-200 shadow-xs hover:border-stone-300 hover:shadow-md'
      }`}
    >
      {/* Topo do Card: Status e Ações */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          {/* Status com seletor interativo limpo */}
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                isConcluido
                  ? 'bg-emerald-500'
                  : isEmAndamento
                  ? 'bg-amber-500 animate-pulse'
                  : 'bg-stone-400'
              }`}
            />
            <select
              value={goal.status}
              onChange={(e) => onChangeStatusDirectly(goal.id, e.target.value as GoalStatus)}
              aria-label={`Alterar status do objetivo ${goal.title}`}
              className="text-xs font-semibold bg-transparent border-0 text-stone-700 hover:text-stone-900 focus:ring-0 cursor-pointer pr-4 py-0.5 rounded focus:bg-stone-100"
            >
              <option value="nao_iniciado">Não iniciado</option>
              <option value="em_andamento">Em andamento</option>
              <option value="concluido">Concluído</option>
            </select>
          </div>

          {/* Botões de Ação do Card */}
          <div className="flex items-center gap-1 text-stone-400">
            <button
              type="button"
              onClick={() => onEdit(goal)}
              title="Editar este objetivo"
              aria-label="Editar objetivo"
              className="p-1.5 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDeleteRequest(goal)}
              title="Excluir este objetivo"
              aria-label="Excluir objetivo"
              className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Título do Objetivo */}
        <h3
          className={`text-base font-semibold leading-snug mb-2 ${
            isConcluido ? 'line-through text-stone-500' : 'text-stone-900'
          }`}
        >
          {goal.title}
        </h3>

        {/* Descrição do Objetivo */}
        {goal.description && (
          <p
            className={`text-sm leading-relaxed mb-4 whitespace-pre-line line-clamp-3 ${
              isConcluido ? 'text-stone-400' : 'text-stone-600'
            }`}
          >
            {goal.description}
          </p>
        )}
      </div>

      {/* Rodapé do Card: Prazo e Botão de Conclusão Rápida */}
      <div className="pt-3 border-t border-stone-100 mt-2 flex items-center justify-between gap-2">
        {/* Prazo */}
        <div
          className={`flex items-center gap-1.5 text-xs font-medium ${
            isConcluido
              ? 'text-stone-400'
              : deadlineInfo.isOverdue
              ? 'text-red-600 font-semibold'
              : deadlineInfo.isToday
              ? 'text-amber-700 font-semibold'
              : deadlineInfo.isSoon
              ? 'text-amber-600'
              : 'text-stone-500'
          }`}
          title={deadlineInfo.formatted}
        >
          {deadlineInfo.isOverdue && !isConcluido ? (
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
          ) : (
            <Calendar className="w-3.5 h-3.5 shrink-0" />
          )}
          <span>{deadlineInfo.relativeText}</span>
        </div>

        {/* Botão de Toggle de Conclusão */}
        <button
          type="button"
          onClick={() => onToggleStatus(goal.id)}
          title={isConcluido ? 'Marcar como em andamento' : 'Marcar como concluído'}
          aria-label={isConcluido ? 'Reabrir objetivo' : 'Concluir objetivo'}
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
            isConcluido
              ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
              : 'text-stone-600 bg-stone-100 hover:bg-stone-200 hover:text-stone-900'
          }`}
        >
          <CheckCircle2
            className={`w-3.5 h-3.5 ${
              isConcluido ? 'text-emerald-600 fill-emerald-100' : 'text-stone-400'
            }`}
          />
          <span>{isConcluido ? 'Concluído' : 'Concluir'}</span>
        </button>
      </div>
    </article>
  );
};
