/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { StatsSummary } from './components/StatsSummary';
import { GoalList } from './components/GoalList';
import { GoalFormModal } from './components/GoalFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { storageService } from './services/storageService';
import { Goal, GoalFormData, GoalStatus, FilterStatus } from './types/goal';
import { Check, Info, Sparkles, BookOpen } from 'lucide-react';

export default function App() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [currentFilter, setCurrentFilter] = useState<FilterStatus>('todos');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [deletingGoal, setDeletingGoal] = useState<Goal | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Carrega os objetivos persistidos no localStorage na montagem inicial
  useEffect(() => {
    const loaded = storageService.getGoals();
    setGoals(loaded);
  }, []);

  // Exibe feedback temporário em português
  const showToast = useCallback((text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  // Estatísticas calculadas
  const stats = useMemo(() => {
    return storageService.calculateStats(goals);
  }, [goals]);

  // Abertura do formulário para novo objetivo
  const handleOpenCreateModal = useCallback(() => {
    setEditingGoal(null);
    setIsFormModalOpen(true);
  }, []);

  // Abertura do formulário para edição de objetivo existente
  const handleOpenEditModal = useCallback((goal: Goal) => {
    setEditingGoal(goal);
    setIsFormModalOpen(true);
  }, []);

  // Submissão do formulário (Criação ou Edição)
  const handleFormSubmit = useCallback(
    (formData: GoalFormData) => {
      if (editingGoal) {
        // Atualização
        const updated = storageService.updateGoal(editingGoal.id, formData);
        if (updated) {
          setGoals((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
          showToast(`Objetivo "${updated.title}" atualizado com sucesso!`);
        }
      } else {
        // Criação
        const created = storageService.addGoal(formData);
        setGoals((prev) => [created, ...prev]);
        showToast(`Novo objetivo "${created.title}" cadastrado com sucesso!`);
      }
      setIsFormModalOpen(false);
      setEditingGoal(null);
    },
    [editingGoal, showToast]
  );

  // Solicitação de exclusão (Abre modal com confirmação explícita)
  const handleDeleteRequest = useCallback((goal: Goal) => {
    setDeletingGoal(goal);
  }, []);

  // Confirmação final da exclusão
  const handleConfirmDelete = useCallback(() => {
    if (!deletingGoal) return;
    const removedTitle = deletingGoal.title;
    const success = storageService.deleteGoal(deletingGoal.id);
    if (success) {
      setGoals((prev) => prev.filter((g) => g.id !== deletingGoal.id));
      showToast(`Objetivo "${removedTitle}" excluído com sucesso.`, 'info');
    }
    setDeletingGoal(null);
  }, [deletingGoal, showToast]);

  // Alternar rapidamente status (Concluir / Em andamento)
  const handleToggleStatus = useCallback(
    (id: string) => {
      const updated = storageService.toggleGoalStatus(id);
      if (updated) {
        setGoals((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
        if (updated.status === 'concluido') {
          showToast(`Parabéns! Você concluiu "${updated.title}" 🎉`);
        } else {
          showToast(`Objetivo reaberto para acompanhamento.`);
        }
      }
    },
    [showToast]
  );

  // Mudança direta no seletor de status
  const handleChangeStatusDirectly = useCallback(
    (id: string, newStatus: GoalStatus) => {
      const updated = storageService.updateGoal(id, { status: newStatus });
      if (updated) {
        setGoals((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
        showToast(`Status atualizado.`);
      }
    },
    [showToast]
  );

  // Restaurar exemplos sugeridos
  const handleResetSamples = useCallback(() => {
    const samples = storageService.resetToSampleGoals();
    setGoals(samples);
    showToast(`Exemplos de objetivos de estudo restaurados.`);
  }, [showToast]);

  return (
    <div className="min-h-screen bg-stone-100/60 text-stone-900 font-sans flex flex-col">
      {/* Cabeçalho */}
      <Header
        stats={stats}
        onOpenCreateModal={handleOpenCreateModal}
        onResetSamples={handleResetSamples}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Banner Motivacional de Boas-vindas para Iniciantes */}
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-stone-900">
                Foco no aprendizado diário
              </p>
              <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
                Divida grandes matérias em metas curtas com prazo definido. Seus dados ficam salvos automaticamente neste navegador.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="text-xs font-semibold text-amber-800 hover:text-amber-900 bg-white hover:bg-stone-50 border border-amber-200 px-3.5 py-1.5 rounded-lg shadow-2xs transition-colors shrink-0 cursor-pointer"
          >
            + Adicionar objetivo
          </button>
        </div>

        {/* Resumo Quantitativo e Progresso */}
        <StatsSummary
          stats={stats}
          currentFilter={currentFilter}
          onSelectFilter={setCurrentFilter}
        />

        {/* Listagem, Filtros e Ações */}
        <GoalList
          goals={goals}
          currentFilter={currentFilter}
          onSelectFilter={setCurrentFilter}
          onEdit={handleOpenEditModal}
          onDeleteRequest={handleDeleteRequest}
          onToggleStatus={handleToggleStatus}
          onChangeStatusDirectly={handleChangeStatusDirectly}
          onOpenCreateModal={handleOpenCreateModal}
          onResetSamples={handleResetSamples}
        />
      </main>

      {/* Modal de Cadastro / Edição */}
      <GoalFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingGoal(null);
        }}
        onSubmit={handleFormSubmit}
        editingGoal={editingGoal}
      />

      {/* Modal de Confirmação de Exclusão */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingGoal)}
        goal={deletingGoal}
        onCancel={() => setDeletingGoal(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Notificação Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-stone-900 text-white rounded-xl shadow-lg text-xs sm:text-sm font-medium animate-in slide-in-from-bottom-3 duration-200"
        >
          {toastMessage.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Rodapé Informativo */}
      <footer className="border-t border-stone-200 bg-white/70 py-6 mt-12 text-center text-xs text-stone-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-semibold text-stone-800">StudyFlow</span>
            <span>— Seu companheiro para transformar estudos em conquistas diárias</span>
          </div>
          <p className="text-stone-400">
            Armazenamento 100% local no navegador · Sem necessidade de cadastro
          </p>
        </div>
      </footer>
    </div>
  );
}
