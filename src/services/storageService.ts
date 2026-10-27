/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Goal, GoalFormData, GoalStats } from '../types/goal';

const STORAGE_KEY = 'studyflow_goals_v1';
const INITIALIZED_KEY = 'studyflow_has_initialized_v1';

/**
 * Exemplos iniciais acolhedores para estudantes iniciantes
 * fornecendo referências reais de como estruturar objetivos de estudo.
 */
export const DEFAULT_INITIAL_GOALS: Goal[] = [
  {
    id: 'sample-1',
    title: 'Compreender os fundamentos de Lógica de Programação',
    description: 'Estudar variáveis, condicionais (if/else) e estruturas de repetição com exercícios práticos.',
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'em_andamento',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-2',
    title: 'Ler o resumo do Capítulo 1 sobre Métodos de Estudo',
    description: 'Aprender técnicas de repetição espaçada e auto-explicação ativa para fixação do conteúdo.',
    deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'concluido',
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-3',
    title: 'Resolver 10 exercícios práticos no fim de semana',
    description: 'Colocar a mão na massa sem consultar gabarito de imediato para testar a retenção.',
    deadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'nao_iniciado',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const storageService = {
  /**
   * Obtém a lista de objetivos persistida no localStorage.
   * Se for o primeiro acesso, inicializa com exemplos acolhedores.
   */
  getGoals(): Goal[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const hasInitialized = localStorage.getItem(INITIALIZED_KEY);

      if (!stored && !hasInitialized) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_INITIAL_GOALS));
        localStorage.setItem(INITIALIZED_KEY, 'true');
        return DEFAULT_INITIAL_GOALS;
      }

      if (!stored) {
        return [];
      }

      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch (error) {
      console.error('Falha ao ler objetivos do localStorage:', error);
      return [];
    }
  },

  /**
   * Salva a lista inteira de objetivos no localStorage.
   */
  saveGoals(goals: Goal[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
      localStorage.setItem(INITIALIZED_KEY, 'true');
    } catch (error) {
      console.error('Falha ao salvar objetivos no localStorage:', error);
    }
  },

  /**
   * Adiciona um novo objetivo de estudo e persiste.
   */
  addGoal(formData: GoalFormData): Goal {
    const goals = this.getGoals();
    const newGoal: Goal = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `goal-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title: formData.title.trim(),
      description: formData.description.trim(),
      deadline: formData.deadline,
      status: formData.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedGoals = [newGoal, ...goals];
    this.saveGoals(updatedGoals);
    return newGoal;
  },

  /**
   * Atualiza os campos de um objetivo existente e persiste.
   */
  updateGoal(id: string, formData: Partial<GoalFormData>): Goal | null {
    const goals = this.getGoals();
    const index = goals.findIndex((g) => g.id === id);
    if (index === -1) return null;

    const existing = goals[index];
    const updated: Goal = {
      ...existing,
      ...formData,
      title: formData.title !== undefined ? formData.title.trim() : existing.title,
      description: formData.description !== undefined ? formData.description.trim() : existing.description,
      updatedAt: new Date().toISOString(),
    };

    goals[index] = updated;
    this.saveGoals(goals);
    return updated;
  },

  /**
   * Exclui um objetivo por ID e persiste.
   */
  deleteGoal(id: string): boolean {
    const goals = this.getGoals();
    const filtered = goals.filter((g) => g.id !== id);
    if (filtered.length !== goals.length) {
      this.saveGoals(filtered);
      return true;
    }
    return false;
  },

  /**
   * Alterna rapidamente o status de um objetivo (para fácil conclusão).
   */
  toggleGoalStatus(id: string): Goal | null {
    const goals = this.getGoals();
    const goal = goals.find((g) => g.id === id);
    if (!goal) return null;

    const nextStatus = goal.status === 'concluido' ? 'em_andamento' : 'concluido';
    return this.updateGoal(id, { status: nextStatus });
  },

  /**
   * Calcula estatísticas sumarizadas dos objetivos.
   */
  calculateStats(goals: Goal[]): GoalStats {
    const total = goals.length;
    const naoIniciados = goals.filter((g) => g.status === 'nao_iniciado').length;
    const emAndamento = goals.filter((g) => g.status === 'em_andamento').length;
    const concluidos = goals.filter((g) => g.status === 'concluido').length;
    const taxaConclusao = total > 0 ? Math.round((concluidos / total) * 100) : 0;

    return {
      total,
      naoIniciados,
      emAndamento,
      concluidos,
      taxaConclusao,
    };
  },

  /**
   * Restaura os exemplos demonstrativos se o estudante quiser recomeçar.
   */
  resetToSampleGoals(): Goal[] {
    this.saveGoals(DEFAULT_INITIAL_GOALS);
    return DEFAULT_INITIAL_GOALS;
  },

  /**
   * Limpa todos os objetivos.
   */
  clearAllGoals(): void {
    this.saveGoals([]);
  },
};
