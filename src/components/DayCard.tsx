import { useState } from 'react';
import TaskToggle from './TaskToggle';
import CommentBox from './CommentBox';
import { WEEKDAY_TASKS, WEEKDAY_SHORT, isoWeekday, parseDateISO, type TaskKey } from '../lib/schedule';
import type { DayRow } from '../lib/supabase';

type Props = {
  row: DayRow;
  isToday: boolean;
  onToggle: (col: keyof DayRow, next: boolean) => void;
  onComment: (next: string) => void;
};

export default function DayCard({ row, isToday, onToggle, onComment }: Props) {
  const date = parseDateISO(row.d);
  const wd = isoWeekday(date);
  const tasks = WEEKDAY_TASKS[wd];
  const done = tasks.filter(k => (row as any)[k]).length;
  const total = tasks.length;
  const [open, setOpen] = useState(isToday);

  const dayNum = date.getDate();
  const monthRu = ['янв.','фев.','мар.','апр.','мая','июня','июля','авг.','сент.','окт.','нояб.','дек.'][date.getMonth()];

  return (
    <article className={'day ' + (isToday ? 'day--today ' : '') + (done === total ? 'day--full' : '')}>
      <button className="day-hdr" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span className="day-date">
          <span className="day-num">{dayNum}</span>
          <span className="day-mo">{monthRu}</span>
        </span>
        <span className="day-wd">{WEEKDAY_SHORT[wd]}</span>
        {isToday && <span className="day-badge">сегодня</span>}
        <span className="day-prog">
          <span className={done === total ? 'day-prog-num day-prog-num--full' : 'day-prog-num'}>
            {done}/{total}
          </span>
        </span>
        <span className="day-chev">{open ? '▾' : '▸'}</span>
      </button>
      {open && (
        <div className="day-body">
          <div className="tasks">
            {tasks.map(k => (
              <TaskToggle
                key={k}
                taskKey={k as TaskKey}
                done={Boolean((row as any)[k])}
                onToggle={next => onToggle(k as keyof DayRow, next)}
              />
            ))}
          </div>
          <CommentBox value={row.comment ?? ''} onSave={onComment} />
        </div>
      )}
    </article>
  );
}
