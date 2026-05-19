import { buildSummerPlanner, categoryLabels, categoryOrder, formatHours } from "./planner-data.js";

const storageKey = "summer-planner-2026-static-v1";
const months = buildSummerPlanner();
const allDays = months.flatMap((month) => month.days);
const app = document.querySelector("#app");

let activeMonth = "june";
let state = loadState();

function loadState() {
  const fallback = { completed: {}, comments: {} };
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

function saveState() {
  window.localStorage.setItem(storageKey, JSON.stringify(state));
}

function completedCount(tasks) {
  return tasks.filter((task) => state.completed[task.id]).length;
}

function totalCompleted() {
  return allDays.reduce((sum, day) => sum + completedCount(day.tasks), 0);
}

function totalTasks() {
  return allDays.reduce((sum, day) => sum + day.tasks.length, 0);
}

function monthDays() {
  return months.find((month) => month.id === activeMonth)?.days ?? months[0].days;
}

function categoryClass(category) {
  return `task-row task-${category}`;
}

function html(strings, ...values) {
  return strings.reduce((result, string, index) => result + string + (values[index] ?? ""), "");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function render() {
  const activeDays = monthDays();
  const monthTotal = activeDays.reduce((sum, day) => sum + day.tasks.length, 0);
  const monthDone = activeDays.reduce((sum, day) => sum + completedCount(day.tasks), 0);
  const done = totalCompleted();
  const total = totalTasks();
  const percent = total ? Math.round((done / total) * 100) : 0;

  app.innerHTML = html`
    <header class="topbar">
      <div class="headline">
        <div>
          <h1>Лето 2026</h1>
          <p>План отдыха и занятий</p>
        </div>
        <div class="total-box">
          <span>Выполнено</span>
          <strong data-testid="total-counter">${done}/${total}</strong>
        </div>
      </div>
      <div class="progress" aria-label="Общий прогресс"><span style="width:${percent}%"></span></div>
      <nav class="tabs" aria-label="Месяцы">
        ${months
          .map(
            (month) => html`
              <button class="tab ${month.id === activeMonth ? "active" : ""}" type="button" data-month="${month.id}">${month.label}</button>
            `,
          )
          .join("")}
      </nav>
    </header>

    <section class="stats-grid" aria-label="Сводка">
      <article class="stat-card"><span>За месяц</span><strong>${monthDone}/${monthTotal}</strong></article>
      <article class="stat-card"><span>Общий прогресс</span><strong>${percent}%</strong></article>
      <article class="stat-card"><span>Телефон</span><strong>2 ч/день</strong></article>
    </section>

    <section class="category-grid" aria-label="Категории">
      ${categoryOrder
        .map((category) => {
          const tasks = allDays.flatMap((day) => day.tasks).filter((task) => task.category === category);
          return html`
            <article class="category-card cat-${category}">
              <span>${categoryLabels[category]}</span>
              <strong>${completedCount(tasks)}/${tasks.length}</strong>
            </article>
          `;
        })
        .join("")}
    </section>

    <section class="counter-row">
      <strong>Счетчик занятий: ${done} из ${total}</strong>
      <button type="button" class="ghost-btn" data-action="reset">Сброс</button>
    </section>

    <section class="day-list" data-testid="day-list">
      ${activeDays.map(renderDay).join("")}
    </section>
  `;
}

function renderDay(day) {
  const done = completedCount(day.tasks);
  const freeText = day.freeHours >= 0 ? `Свободно ${formatHours(day.freeHours)}` : `Перегруз ${formatHours(day.freeHours)}`;
  const freeClass = day.freeHours >= 0 ? "good" : "bad";
  return html`
    <article class="day-card" data-day="${day.dateKey}" data-testid="day-${day.dateKey}">
      <div class="day-head">
        <div>
          <div class="date">${day.dateLabel}</div>
          <div class="weekday">${day.weekday}</div>
        </div>
        <div class="day-meta">
          <span class="free ${freeClass}">${freeText}</span>
          <span>${done}/${day.tasks.length}</span>
        </div>
      </div>
      <div class="day-actions">
        <button type="button" class="primary-btn" data-action="complete-day" data-day="${day.dateKey}">День готов</button>
        <button type="button" class="secondary-btn" data-action="clear-day" data-day="${day.dateKey}">Снять</button>
      </div>
      <div class="tasks">
        ${day.tasks
          .map((task) => {
            const checked = Boolean(state.completed[task.id]);
            return html`
              <label class="${categoryClass(task.category)} ${checked ? "done" : ""}">
                <input type="checkbox" data-task="${task.id}" ${checked ? "checked" : ""} aria-label="${escapeHtml(`${task.time} ${task.title}`)}" />
                <span class="task-main">
                  <span class="task-title">${escapeHtml(task.title)}</span>
                  <span class="task-time">${escapeHtml(task.time)} · ${formatHours(task.durationHours)}</span>
                </span>
                <span class="mark" aria-hidden="true">${checked ? "✓" : ""}</span>
              </label>
            `;
          })
          .join("")}
      </div>
      <label class="comment-box">
        <span>Комментарий дня</span>
        <textarea data-comment="${day.dateKey}" placeholder="Что получилось, что перенести, настроение...">${escapeHtml(state.comments[day.dateKey] ?? "")}</textarea>
      </label>
    </article>
  `;
}

function getDay(dateKey) {
  return allDays.find((day) => day.dateKey === dateKey);
}

app.addEventListener("click", (event) => {
  const target = event.target.closest("button");
  if (!target) return;

  const month = target.dataset.month;
  if (month) {
    activeMonth = month;
    render();
    return;
  }

  const action = target.dataset.action;
  if (action === "reset") {
    state = { completed: {}, comments: {} };
    saveState();
    render();
    return;
  }

  const dateKey = target.dataset.day;
  const day = dateKey ? getDay(dateKey) : null;
  if (!day) return;

  if (action === "complete-day" || action === "clear-day") {
    const value = action === "complete-day";
    for (const task of day.tasks) {
      state.completed[task.id] = value;
    }
    saveState();
    render();
  }
});

app.addEventListener("change", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement) || !target.dataset.task) return;
  state.completed[target.dataset.task] = target.checked;
  saveState();
  render();
});

app.addEventListener("input", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLTextAreaElement) || !target.dataset.comment) return;
  state.comments[target.dataset.comment] = target.value;
  saveState();
});

render();
