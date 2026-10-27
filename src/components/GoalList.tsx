/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, ArrowUpDown, BookOpenCheck, Sparkles, FolderX } from 'lucide-react';
import { Goal, GoalStatus, FilterStatus, SortOption } from '../types/goal';
import { GoalCard } from './GoalCard';

interface GoalListProps {
  goals: Goal[];
  currentFilter: FilterStatus;
  onSelectFilter: (filter: FilterStatus) => void;
  onEdit: (goal: Goal) => void;
  onDeleteRequest: (goal: Goal) => void;
  onToggleStatus: (id: string) => void;
  onChangeStatusDirectly: (id: string, newStatus: GoalStatus) => void;
  onOpenCreateModal: () => void;
  onResetSamples: () => void;
}

export const GoalList: React.FC<GoalListProps> = ({
  goals,
  currentFilter,
  onSelectFilter,
  onEdit,
  onDeleteRequest,
  onToggleStatus,
  onChangeStatusDirectly,
  onOpenCreateModal,
  onResetSamples,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('deadline_asc');

  // Filtragem e Ordenação
  const filteredAndSortedGoals = useMemo(() => {
    let result = [...goals];

    // Filtro por status
    if (currentFilter !== 'todos') {
      result = result.filter((g) => g.status === currentFilter);
    }

    // Busca textual no título e descrição
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (g) => g.title.toLowerCase().includes(q) || (g.description && g.description.toLowerCase().includes(q))
      );
    }

    // Ordenação
    result.sort((a, b) => {
      if (sortBy === 'deadline_asc') {
        return (a.deadline || '').localeCompare(b.deadline || '');
      }
      if (sortBy === 'deadline_desc') {
        return (b.deadline || '').localeCompare(a.deadline || '');
      }
      if (sortBy === 'created_desc') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'title_asc') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return result;
  }, [goals, currentFilter, searchQuery, sortBy]);

  return (
    <section aria-labelledby="goals-list-heading">
      {/* Controles de Filtro e Busca */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200">
        {/* Barra de Busca */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por conteúdo ou matéria..."
            className="w-full pl-9 pr-4 py-2 text-sm text-stone-900 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 transition-all placeholder:text-stone-400"
          />
        </div>

        {/* Filtros por Abas e Ordenador */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Segmented Filter Control */}
          <div className="inline-flex items-center p-1 bg-stone-100 rounded-xl border border-stone-200/60 text-xs">
            <button
              type="button"
              onClick={() => onSelectFilter('todos')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-all cursor-pointer ${
                currentFilter === 'todos'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Todos ({goals.length})
            </button>
            <button
              type="button"
              onClick={() => onSelectFilter('nao_iniciado')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-all cursor-pointer ${
                currentFilter === 'nao_iniciado'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Não iniciados
            </button>
            <button
              type="button"
              onClick={() => onSelectFilter('em_andamento')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-all cursor-pointer ${
                currentFilter === 'em_andamento'
                  ? 'bg-white text-amber-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Em andamento
            </button>
            <button
              type="button"
              onClick={() => onSelectFilter('concluido')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-all cursor-pointer ${
                currentFilter === 'concluido'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Concluídos
            </button>
          </div>

          {/* Seletor de Ordenação */}
          <div className="flex items-center gap-1.5 pl-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              aria-label="Ordenar objetivos"
              className="text-xs font-medium text-stone-700 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              <option value="deadline_asc">Prazo mais próximo</option>
              <option value="deadline_desc">Prazo mais distante</option>
              <option value="created_desc">Mais recentes primeiro</option>
              <option value="title_asc">Título (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cabeçalho da Listagem */}
      <div className="flex items-center justify-between mb-4">
        <h2 id="goals-list-heading" className="text-sm font-semibold text-stone-700 uppercase tracking-wider">
          Objetivos de Estudo ({filteredAndSortedGoals.length})
        </h2>
        {filteredAndSortedGoals.length > 0 && (
          <span className="text-xs text-stone-500">
            Dica: clique em Concluir para celebrar seu progresso diário!
          </span>
        )}
      </div>

      {/* Grade de Cartões ou Estados Vazios */}
      {filteredAndSortedGoals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={onEdit}
              onDeleteRequest={onDeleteRequest}
              onToggleStatus={onToggleStatus}
              onChangeStatusDirectly={onChangeStatusDirectly}
            />
          ))}
        </div>
      ) : goals.length === 0 ? (
        /* Empty State Geral: Quando não há nenhum objetivo cadastrado */
        <div className="bg-stone-50/60 rounded-3xl border-2 border-dashed border-stone-200 p-8 sm:p-12 text-center max-w-xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center mb-4">
            <BookOpenCheck className="w-7 h-7 text-amber-800" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 mb-2">
            Nenhum objetivo cadastrado ainda
          </h3>
          <p className="text-sm text-stone-600 mb-6 leading-relaxed max-w-md mx-auto">
            Começar seus estudos fica muito mais fácil quando você divide matérias grandes em pequenos objetivos com prazos alcançáveis.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onOpenCreateModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Primeiro Objetivo</span>
            </button>
            <button
              type="button"
              onClick={onResetSamples}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-100 border border-stone-300 text-sm font-medium rounded-xl transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Carregar Exemplos Sugeridos</span>
            </button>
          </div>
        </div>
      ) : (
        /* Empty State de Busca/Filtro: Quando há objetivos, mas a busca ou filtro atual não encontrou nada */
        <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-400 mx-auto flex items-center justify-center mb-3">
            <FolderX className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-stone-900 mb-1">
            Nenhum objetivo encontrado
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mb-4">
            Não encontramos nenhum objetivo correspondente aos filtros ou ao termo pesquisado.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              onSelectFilter('todos');
            }}
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 underline underline-offset-4 cursor-pointer"
          >
            Limpar filtros e busca
          </button>
        </div>
      )}
    </section>
  );
};
