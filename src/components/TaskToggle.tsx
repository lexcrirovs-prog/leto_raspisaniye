import { TASK_LABELS, TASK_EMOJI, type TaskKey } from '../lib/schedule';

type Props = {
  taskKey: TaskKey;
  done: boolean;
  onToggle: (next: boolean) => void;
};

export default function TaskToggle({ taskKey, done, onToggle }: Props) {
  function handle() {
    if ('vibrate' in navigator) {
      try { navigator.vibrate(15); } catch { /* ignore */ }
    }
    onToggle(!done);
  }
  return (
    <button
      type="button"
      className={'task ' + (done ? 'task--done' : '')}
      aria-pressed={done}
      onClick={handle}
    >
      <span className="task-emoji" aria-hidden="true">{TASK_EMOJI[taskKey]}</span>
      <span className="task-label">{TASK_LABELS[taskKey]}</span>
      <span className={'task-check ' + (done ? 'task-check--on' : '')}>
        {done ? '✓' : ''}
      </span>
    </button>
  );
}
