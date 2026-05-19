export type TaskKey =
  | 'math' | 'rowing' | 'genealogy' | 'ai_course'
  | 'reading' | 'walk' | 'meals' | 'phone_ok';

export const TASK_LABELS: Record<TaskKey, string> = {
  math:      'Математика (17:00–18:00)',
  rowing:    'Гребля (9:00–10:30)',
  genealogy: 'Генеалогия (1 час)',
  ai_course: 'Курс ИИ (14:00–16:00)',
  reading:   'Чтение 10 страниц',
  walk:      'Прогулка 4 часа',
  meals:     'Еда 3 раза',
  phone_ok:  'Телефон не больше 2 часов',
};

export const TASK_EMOJI: Record<TaskKey, string> = {
  math:      '➗',
  rowing:    '🚣',
  genealogy: '🌳',
  ai_course: '🤖',
  reading:   '📖',
  walk:      '🚶',
  meals:     '🍽️',
  phone_ok:  '📵',
};

// JS getDay(): 0=Sun,1=Mon,...,6=Sat. Convert to ISO weekday (0=Mon..6=Sun).
export function isoWeekday(d: Date): 0|1|2|3|4|5|6 {
  return ((d.getDay() + 6) % 7) as 0|1|2|3|4|5|6;
}

export const WEEKDAY_TASKS: Record<0|1|2|3|4|5|6, TaskKey[]> = {
  0: ['math', 'genealogy', 'reading', 'walk', 'meals', 'phone_ok'],          // Пн
  1: ['rowing', 'ai_course', 'reading', 'walk', 'meals', 'phone_ok'],        // Вт
  2: ['math', 'genealogy', 'reading', 'walk', 'meals', 'phone_ok'],          // Ср
  3: ['rowing', 'ai_course', 'reading', 'walk', 'meals', 'phone_ok'],        // Чт
  4: ['genealogy', 'reading', 'walk', 'meals', 'phone_ok'],                  // Пт
  5: ['rowing', 'reading', 'walk', 'meals', 'phone_ok'],                     // Сб
  6: ['reading', 'walk', 'meals', 'phone_ok'],                               // Вс
};

export const WEEKDAY_SHORT = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
export const WEEKDAY_LONG  = ['Понедельник','Вторник','Среда','Четверг','Пятница','Суббота','Воскресенье'];
export const MONTH_NAMES   = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];

export function fmtDateISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

export function parseDateISO(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export const SEASON_START = new Date(2026, 5, 1);   // 2026-06-01
export const SEASON_END   = new Date(2026, 7, 31);  // 2026-08-31

export function allSeasonDates(): Date[] {
  const out: Date[] = [];
  for (let t = SEASON_START.getTime(); t <= SEASON_END.getTime(); t += 86400000) {
    out.push(new Date(t));
  }
  return out;
}

export function totalTasksForDate(d: Date): number {
  return WEEKDAY_TASKS[isoWeekday(d)].length;
}

export function totalSeasonTasks(): number {
  return allSeasonDates().reduce((sum, d) => sum + totalTasksForDate(d), 0);
}
