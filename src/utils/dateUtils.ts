/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Utilitários para formatação e cálculo de datas de prazos de estudo em português do Brasil.
 */
export function formatDeadline(dateString: string): {
  formatted: string;
  isOverdue: boolean;
  isToday: boolean;
  isSoon: boolean;
  relativeText: string;
} {
  if (!dateString) {
    return {
      formatted: 'Sem prazo',
      isOverdue: false,
      isToday: false,
      isSoon: false,
      relativeText: 'Sem prazo definido',
    };
  }

  // Parse no formato local considerando YYYY-MM-DD
  const [year, month, day] = dateString.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const formatted = targetDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const isOverdue = diffDays < 0;
  const isToday = diffDays === 0;
  const isSoon = diffDays > 0 && diffDays <= 3;

  let relativeText = '';
  if (isOverdue) {
    const absDays = Math.abs(diffDays);
    relativeText = absDays === 1 ? 'Atrasado há 1 dia' : `Atrasado há ${absDays} dias`;
  } else if (isToday) {
    relativeText = 'Prazo vence hoje!';
  } else if (diffDays === 1) {
    relativeText = 'Vence amanhã';
  } else if (diffDays <= 7) {
    relativeText = `Vence em ${diffDays} dias`;
  } else {
    relativeText = `Prazo até ${formatted}`;
  }

  return {
    formatted,
    isOverdue,
    isToday,
    isSoon,
    relativeText,
  };
}
