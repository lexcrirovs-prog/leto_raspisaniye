import { useEffect, useMemo, useRef, useState } from 'react';
import Header from './components/Header';
import MonthTabs from './components/MonthTabs';
import DayCard from './components/DayCard';
import { useProgress } from './hooks/useProgress';
import { allSeasonDates, fmtDateISO } from './lib/schedule';
import type { DayRow } from './lib/supabase';

function currentMonthInRange(): 6 | 7 | 8 {
  const m = new Date().getMonth() + 1;
  if (m === 6) return 6;
  if (m === 7) return 7;
  if (m === 8) return 8;
  return 6;
}

export default function App() {
  const { data, loading, error, toggleTask, setComment, done, total } = useProgress();
  const [activeMonth, setActiveMonth] = useState<6 | 7 | 8>(currentMonthInRange);
  const dates = useMemo(() => allSeasonDates(), []);
  const todayISO = fmtDateISO(new Date());
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading) return;
    const node = listRef.current?.querySelector(`[data-month="${activeMonth}"]`);
    if (node) node.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [activeMonth, loading]);

  return (
    <div className="app">
      <Header done={done} total={total} />
      <MonthTabs active={activeMonth} onChange={setActiveMonth} />
      {error && <div className="err">Ошибка: {error}</div>}
      {loading && <div className="loading">Загружаю расписание…</div>}
      {!loading && (
        <div className="days" ref={listRef}>
          {dates.map(d => {
            const iso = fmtDateISO(d);
            const row = data[iso];
            if (!row) return null;
            const isFirstOfMonth = d.getDate() === 1;
            return (
              <div key={iso} data-month={isFirstOfMonth ? d.getMonth() + 1 : undefined}>
                <DayCard
                  row={row}
                  isToday={iso === todayISO}
                  onToggle={(col, next) => toggleTask(iso, col as keyof DayRow, next)}
                  onComment={next => setComment(iso, next)}
                />
              </div>
            );
          })}
        </div>
      )}
      <footer className="ftr">
        <div>Расписание июнь–август 2026. Синхронизация автоматическая.</div>
      </footer>
    </div>
  );
}
