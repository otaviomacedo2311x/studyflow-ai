/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GoalStatus = 'nao_iniciado' | 'em_andamento' | 'concluido';

export interface Goal {
  id: string;
  title: string;
  description: string;
  deadline: string; // Formato YYYY-MM-DD
  status: GoalStatus;
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
}

export interface GoalFormData {
  title: string;
  description: string;
  deadline: string;
  status: GoalStatus;
}

export interface GoalStats {
  total: number;
  naoIniciados: number;
  emAndamento: number;
  concluidos: number;
  taxaConclusao: number; // Porcentagem de 0 a 100
}

export type FilterStatus = 'todos' | GoalStatus;
export type SortOption = 'deadline_asc' | 'deadline_desc' | 'created_desc' | 'title_asc';
