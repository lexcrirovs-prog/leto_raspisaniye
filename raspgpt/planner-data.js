export const categoryLabels = {
  study: "Учеба",
  sport: "Спорт",
  reading: "Чтение",
  walk: "Прогулка",
  phone: "Телефон",
  travel: "Дорога",
  meal: "Еда",
};

export const categoryOrder = ["study", "sport", "reading", "walk", "phone", "travel", "meal"];

const dayWindowHours = 14;
const weekdays = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
const monthConfigs = [
  { id: "june", label: "Июнь", monthIndex: 5, days: 30 },
  { id: "july", label: "Июль", monthIndex: 6, days: 31 },
  { id: "august", label: "Август", monthIndex: 7, days: 31 },
];

const courseTopics = new Map([
  ["2026-06-02", "Курс: сюжет и идея мультфильма"],
  ["2026-06-04", "Курс: раскадровка"],
  ["2026-06-09", "Курс: персонаж"],
  ["2026-06-11", "Курс: мир и сцены"],
  ["2026-06-16", "Курс: нейровидео"],
  ["2026-06-18", "Курс: анимация и движение"],
  ["2026-06-23", "Курс: режиссерский подход"],
  ["2026-06-25", "Курс: мини-ролик и портфолио"],
]);

function isoDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function displayDate(date) {
  return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function isRowingDay(date) {
  const day = date.getDay();
  return day === 1 || day === 3 || day === 5;
}

function isMathDay(date) {
  const day = date.getDay();
  return day === 2 || day === 4;
}

function isGenealogyDay(date) {
  return date.getMonth() === 5 && isRowingDay(date);
}

function task(dateKey, id, title, time, durationHours, category) {
  return { id: `${dateKey}-${id}`, title, time, durationHours, category };
}

function phoneTasks(dateKey, isMath, isCourse, isRowing) {
  if (isMath && isCourse) {
    return [
      task(dateKey, "phone-1", "Залипание в телефон", "12:30-13:00", 0.5, "phone"),
      task(dateKey, "phone-2", "Залипание в телефон", "21:30-22:00", 0.5, "phone"),
      task(dateKey, "phone-3", "Залипание в телефон", "22:00-23:00", 1, "phone"),
    ];
  }

  const eveningPhone = (isMath && isCourse) || isRowing ? "22:00-23:00" : "20:30-21:30";
  return [
    task(dateKey, "phone-1", "Залипание в телефон", "11:30-12:00", 0.5, "phone"),
    task(dateKey, "phone-2", "Залипание в телефон", isMath ? "18:30-19:00" : "18:00-18:30", 0.5, "phone"),
    task(dateKey, "phone-3", "Залипание в телефон", eveningPhone, 1, "phone"),
  ];
}

function sortTime(value) {
  const match = value.match(/^(\d{2}):(\d{2})/);
  if (!match) return 24 * 60;
  return Number(match[1]) * 60 + Number(match[2]);
}

function makeDay(date, month, monthLabel) {
  const dateKey = isoDate(date);
  const isMath = isMathDay(date);
  const isCourse = courseTopics.has(dateKey);
  const isRowing = isRowingDay(date);
  const tasks = [
    task(dateKey, "breakfast", "Завтрак", "09:00-10:00", 1, "meal"),
    task(dateKey, "reading", "Чтение 10 страниц", "10:00-11:30", 1.5, "reading"),
    ...phoneTasks(dateKey, isMath, isCourse, isRowing),
    task(dateKey, "lunch", "Обед", "13:00-14:00", 1, "meal"),
  ];

  if (isGenealogyDay(date)) {
    tasks.push(task(dateKey, "genealogy", "Генеалогическое древо", "12:00-13:00", 1, "study"));
  }

  if (isCourse) {
    tasks.push(task(dateKey, "course", courseTopics.get(dateKey), "14:00-16:00", 2, "study"));
  }

  if (isMath) {
    tasks.push(task(dateKey, "math-go", "Дорога к математике", "16:30-17:00", 0.5, "travel"));
    tasks.push(task(dateKey, "math", "Репетитор: математика", "17:00-18:00", 1, "study"));
    tasks.push(task(dateKey, "math-back", "Дорога назад", "18:00-18:30", 0.5, "travel"));
  }

  if (isRowing) {
    tasks.push(task(dateKey, "rowing", "Тренировка: гребля", "16:00-18:00", 2, "sport"));
  }

  if (isCourse && isMath) {
    tasks.push(task(dateKey, "walk-1", "Прогулка", "11:00-12:00", 1, "walk"));
    tasks.push(task(dateKey, "walk-2", "Прогулка", "12:00-12:30", 0.5, "walk"));
    tasks.push(task(dateKey, "walk-3", "Прогулка", "16:00-16:30", 0.5, "walk"));
    tasks.push(task(dateKey, "walk-4", "Прогулка", "18:30-19:00", 0.5, "walk"));
    tasks.push(task(dateKey, "walk-5", "Прогулка", "20:00-21:30", 1.5, "walk"));
  } else if (isMath) {
    tasks.push(task(dateKey, "walk-1", "Прогулка", "12:00-13:00", 1, "walk"));
    tasks.push(task(dateKey, "walk-2", "Прогулка", "14:00-16:30", 2.5, "walk"));
    tasks.push(task(dateKey, "walk-3", "Прогулка", "20:00-20:30", 0.5, "walk"));
  } else if (isRowing) {
    tasks.push(task(dateKey, "walk-1", "Прогулка", "14:00-16:00", 2, "walk"));
    tasks.push(task(dateKey, "walk-2", "Прогулка", "18:30-19:00", 0.5, "walk"));
    tasks.push(task(dateKey, "walk-3", "Прогулка", "20:00-21:30", 1.5, "walk"));
  } else {
    tasks.push(task(dateKey, "walk", "Прогулка", "14:00-18:00", 4, "walk"));
  }

  tasks.push(task(dateKey, "dinner", "Ужин", "19:00-20:00", 1, "meal"));

  const orderedTasks = tasks.sort((a, b) => sortTime(a.time) - sortTime(b.time));
  const scheduledHours = orderedTasks.reduce((sum, item) => sum + item.durationHours, 0);

  return {
    dateKey,
    dateLabel: displayDate(date),
    weekday: weekdays[date.getDay()],
    month,
    monthLabel,
    tasks: orderedTasks,
    scheduledHours,
    freeHours: Math.round((dayWindowHours - scheduledHours) * 10) / 10,
  };
}

export function formatHours(hours) {
  return `${String(Math.abs(hours)).replace(".", ",")} ч`;
}

export function buildSummerPlanner() {
  return monthConfigs.map((config) => ({
    id: config.id,
    label: config.label,
    days: Array.from({ length: config.days }, (_, index) => makeDay(new Date(2026, config.monthIndex, index + 1), config.id, config.label)),
  }));
}
