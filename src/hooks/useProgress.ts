import { useEffect, useRef, useState } from 'react';
import { supabase, type DayRow } from '../lib/supabase';
import { WEEKDAY_TASKS, isoWeekday, parseDateISO, totalSeasonTasks } from '../lib/schedule';

export type ProgressMap = Record<string, DayRow>;

export function useProgress() {
  const [data, setData] = useState<ProgressMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data: rows, error } = await supabase
        .from('daily_progress')
        .select('*')
        .order('d', { ascending: true });
      if (!alive) return;
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      const map: ProgressMap = {};
      for (const r of (rows ?? []) as DayRow[]) map[r.d] = r;
      setData(map);
      setLoading(false);
    })();

    const ch = supabase.channel('daily_progress_changes')
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'daily_progress' },
        (payload) => {
          const row = payload.new as DayRow;
          setData(prev => ({ ...prev, [row.d]: row }));
        })
      .subscribe();
    channelRef.current = ch;

    return () => {
      alive = false;
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  }, []);

  async function toggleTask(date: string, col: keyof DayRow, next: boolean) {
    const prev = data[date];
    if (!prev) return;
    setData(p => ({ ...p, [date]: { ...prev, [col]: next } }));
    const { error } = await supabase
      .from('daily_progress')
      .update({ [col]: next })
      .eq('d', date);
    if (error) {
      setData(p => ({ ...p, [date]: prev }));
      setError(error.message);
    }
  }

  async function setComment(date: string, comment: string) {
    const prev = data[date];
    if (!prev) return;
    setData(p => ({ ...p, [date]: { ...prev, comment } }));
    const { error } = await supabase
      .from('daily_progress')
      .update({ comment })
      .eq('d', date);
    if (error) {
      setData(p => ({ ...p, [date]: prev }));
      setError(error.message);
    }
  }

  // Totals: sum only valid tasks (those listed in WEEKDAY_TASKS for that day's weekday)
  let done = 0;
  for (const iso of Object.keys(data)) {
    const r = data[iso];
    const wd = isoWeekday(parseDateISO(iso));
    for (const k of WEEKDAY_TASKS[wd]) {
      if ((r as any)[k]) done++;
    }
  }
  const total = totalSeasonTasks();

  return { data, loading, error, toggleTask, setComment, done, total };
}
