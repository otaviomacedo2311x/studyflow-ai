/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Calendar, AlignLeft, Flag, CheckCircle2, CircleDashed, Clock, Sparkles } from 'lucide-react';
import { Goal, GoalFormData, GoalStatus } from '../types/goal';

interface GoalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GoalFormData) => void;
  editingGoal: Goal | null;
}

const STATUS_OPTIONS: { value: GoalStatus; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: 'nao_iniciado',
    label: 'Não iniciado',
    description: 'Planejado para breve',
    icon: <CircleDashed className="w-4 h-4 text-stone-500" />,
  },
  {
    value: 'em_andamento',
    label: 'Em andamento',
    description: 'Sendo estudado agora',
    icon: <Clock className="w-4 h-4 text-amber-600" />,
  },
  {
    value: 'concluido',
    label: 'Concluído',
    description: 'Objetivo alcançado!',
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
  },
];

export const GoalFormModal: React.FC<GoalFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingGoal,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<GoalStatus>('nao_iniciado');
  const [error, setError] = useState<string | null>(null);

  // Inicializa os campos quando abrir ou mudar o objetivo em edição
  useEffect(() => {
    if (editingGoal) {
      setTitle(editingGoal.title);
      setDescription(editingGoal.description || '');
      setDeadline(editingGoal.deadline || '');
      setStatus(editingGoal.status);
    } else {
      // Sugere por padrão um prazo de 7 dias à frente para estimular planejamento
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 7);
      const defaultDeadlineStr = defaultDate.toISOString().split('T')[0];

      setTitle('');
      setDescription('');
      setDeadline(defaultDeadlineStr);
      setStatus('nao_iniciado');
    }
    setError(null);
  }, [editingGoal, isOpen]);

  // Tecla ESC para fechar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Por favor, informe um título para o seu objetivo de estudo.');
      return;
    }

    if (trimmedTitle.length < 3) {
      setError('O título deve ter pelo menos 3 caracteres para ser claro.');
      return;
    }

    onSubmit({
      title: trimmedTitle,
      description: description.trim(),
      deadline: deadline || new Date().toISOString().split('T')[0],
      status,
    });

    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho do Modal */}
        <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <h3 id="modal-title" className="text-base font-semibold text-stone-900">
                {editingGoal ? 'Editar Objetivo de Estudo' : 'Cadastrar Novo Objetivo'}
              </h3>
              <p className="text-xs text-stone-500">
                {editingGoal
                  ? 'Atualize os detalhes e o progresso da sua meta'
                  : 'Defina o que você quer aprender com passos claros'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar formulário"
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Campo: Título */}
          <div>
            <label htmlFor="goal-title" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Título do Objetivo <span className="text-red-500">*</span>
            </label>
            <input
              id="goal-title"
              type="text"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Ex.: Aprender laços de repetição (for e while) em JavaScript"
              className="w-full px-3.5 py-2.5 text-sm text-stone-900 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 transition-all placeholder:text-stone-400"
              autoFocus
            />
            <p className="mt-1 text-xs text-stone-500">
              Dica: Seja específico e foque em um aprendizado alcançável.
            </p>
          </div>

          {/* Campo: Descrição */}
          <div>
            <label htmlFor="goal-description" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5 text-stone-400" />
              <span>Descrição ou Anotações</span>
            </label>
            <textarea
              id="goal-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex.: Assistir às aulas 04 e 05, resolver os 3 exercícios propostos e anotar dúvidas no caderno."
              className="w-full px-3.5 py-2.5 text-sm text-stone-900 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 transition-all placeholder:text-stone-400 resize-none"
            />
          </div>

          {/* Campo: Prazo */}
          <div>
            <label htmlFor="goal-deadline" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              <span>Prazo para Concluir <span className="text-red-500">*</span></span>
            </label>
            <input
              id="goal-deadline"
              type="date"
              required
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm text-stone-900 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 transition-all"
            />
          </div>

          {/* Campo: Status */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Flag className="w-3.5 h-3.5 text-stone-400" />
              <span>Status Inicial do Objetivo</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {STATUS_OPTIONS.map((opt) => {
                const isSelected = status === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStatus(opt.value)}
                    className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/70 ring-1 ring-amber-500'
                        : 'border-stone-200 bg-stone-50/50 hover:bg-stone-50 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {opt.icon}
                      <span className={`text-xs font-semibold ${isSelected ? 'text-amber-900' : 'text-stone-700'}`}>
                        {opt.label}
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-500 leading-tight">
                      {opt.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rodapé de Ações */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-all cursor-pointer active:scale-98"
            >
              {editingGoal ? 'Salvar Alterações' : 'Cadastrar Objetivo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
