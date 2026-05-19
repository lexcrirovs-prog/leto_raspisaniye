import assert from "node:assert/strict";
import { buildSummerPlanner } from "../raspgpt/planner-data.js";

const months = buildSummerPlanner();
const days = months.flatMap((month) => month.days);
const byDate = new Map(days.map((day) => [day.dateKey, day]));

function tasksOn(dateKey) {
  const day = byDate.get(dateKey);
  assert.ok(day, `missing day ${dateKey}`);
  return day.tasks;
}

function categoryHours(tasks, category) {
  return tasks
    .filter((task) => task.category === category)
    .reduce((sum, task) => sum + task.durationHours, 0);
}

function hasTitle(tasks, text) {
  return tasks.some((task) => task.title.includes(text));
}

function toMinutes(value) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function parseTimeRange(value) {
  const match = value.match(/^(\d{2}:\d{2})-(\d{2}:\d{2})$/);
  assert.ok(match, `expected fixed time range, got ${value}`);
  return [toMinutes(match[1]), toMinutes(match[2])];
}

assert.equal(months.length, 3);
assert.equal(days.length, 92);

for (const day of days) {
  const tasks = day.tasks;
  assert.equal(tasks.filter((task) => task.category === "meal").length, 3, `${day.dateKey}: meal count`);
  assert.equal(categoryHours(tasks, "meal"), 3, `${day.dateKey}: meal hours`);
  assert.equal(tasks.filter((task) => task.category === "reading").length, 1, `${day.dateKey}: reading count`);
  assert.equal(categoryHours(tasks, "reading"), 1.5, `${day.dateKey}: reading hours`);
  assert.equal(categoryHours(tasks, "walk"), 4, `${day.dateKey}: walk hours`);
  for (const walk of tasks.filter((task) => task.category === "walk")) {
    const [start, end] = parseTimeRange(walk.time);
    assert.ok(start >= toMinutes("11:00"), `${day.dateKey}: walk starts before 11:00`);
    assert.ok(end <= toMinutes("21:30"), `${day.dateKey}: walk ends after 21:30`);
  }
  assert.equal(categoryHours(tasks, "phone"), 2, `${day.dateKey}: phone hours`);
  assert.equal(tasks.filter((task) => task.category === "phone").length, 3, `${day.dateKey}: phone blocks`);
  assert.equal(Math.round((14 - day.scheduledHours) * 10) / 10, day.freeHours, `${day.dateKey}: free hours`);
}

for (const dateKey of ["2026-06-02", "2026-07-07", "2026-08-06"]) {
  const tasks = tasksOn(dateKey);
  assert.ok(hasTitle(tasks, "Дорога к математике"), `${dateKey}: math outbound travel`);
  assert.ok(hasTitle(tasks, "Репетитор: математика"), `${dateKey}: math tutor`);
  assert.ok(hasTitle(tasks, "Дорога назад"), `${dateKey}: math return travel`);
  assert.equal(tasks.find((task) => task.title === "Репетитор: математика").time, "17:00-18:00");
  assert.equal(tasks.find((task) => task.title === "Дорога к математике").time, "16:30-17:00");
  assert.equal(tasks.find((task) => task.title === "Дорога назад").time, "18:00-18:30");
}

const mathTasks = days.flatMap((day) => day.tasks.filter((task) => task.title === "Репетитор: математика"));
assert.equal(mathTasks.length, 26);

const rowingTasks = days.flatMap((day) => day.tasks.filter((task) => task.title === "Тренировка: гребля"));
assert.equal(rowingTasks.length, 40);

const juneDays = days.filter((day) => day.month === "june");
const genealogyTasks = juneDays.flatMap((day) => day.tasks.filter((task) => task.title === "Генеалогическое древо"));
assert.equal(genealogyTasks.length, 13);

const courseTasks = juneDays.flatMap((day) => day.tasks.filter((task) => task.title.startsWith("Курс:")));
assert.equal(courseTasks.length, 8);
for (const task of courseTasks) {
  assert.equal(task.durationHours, 2);
  assert.equal(task.time, "14:00-16:00");
}

for (const day of days) {
  if (new Date(`${day.dateKey}T00:00:00`).getDay() !== 0) continue;
  const titles = day.tasks.map((task) => task.title).join(" | ");
  assert.ok(!titles.includes("Репетитор"), `${day.dateKey}: no tutor on Sunday`);
  assert.ok(!titles.includes("Генеалогическое"), `${day.dateKey}: no genealogy on Sunday`);
  assert.ok(!titles.includes("Курс:"), `${day.dateKey}: no course on Sunday`);
  assert.ok(!titles.includes("гребля"), `${day.dateKey}: no rowing on Sunday`);
}

console.log(`OK: checked ${days.length} summer days`);
