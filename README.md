# Летнее расписание 2026

Веб-версия летнего календаря для ребёнка. Открывается на iPhone, синхронизируется между родителями через Supabase.

**Прод:** https://kotelgavno.ru/raspcld/

## Стек

- React 18 + TypeScript + Vite
- @supabase/supabase-js (Postgres + Realtime)

## Локально

```bash
npm install
npm run dev
```

Создай `.env.local` (см. `.env.example`):

```
VITE_SUPABASE_URL=https://<ref>.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_xxx
```

## Сборка и деплой

```bash
npm run build       # → dist/
```

`dist/` загружается по FTP в `kotelgavno.ru/public_html/raspcld/`.

## Схема БД

Таблица `daily_progress`: одна строка на дату июнь–август 2026 с булевыми колонками заданий и текстовым комментарием. RLS открыт для anon (read/update). Realtime включён.

## Функции

- Большие тапаемые чекбоксы по каждому заданию дня
- Авторазворачивание сегодняшнего дня
- Комментарий к каждому дню с автосохранением
- Общий счётчик выполненных заданий в шапке
- Синхронизация в реальном времени между устройствами
- PWA: «На экран Домой» в Safari → иконка без браузера
