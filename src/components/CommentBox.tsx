import { useEffect, useState } from 'react';
import { useDebouncedEffect } from '../hooks/useDebounce';

type Props = {
  value: string;
  onSave: (next: string) => void;
};

export default function CommentBox({ value, onSave }: Props) {
  const [draft, setDraft] = useState(value);
  const [open, setOpen] = useState(false);

  useEffect(() => { setDraft(value); }, [value]);
  useDebouncedEffect(() => {
    if (draft !== value) onSave(draft);
  }, [draft], 800);

  return (
    <div className="cmt">
      <button
        type="button"
        className="cmt-toggle"
        onClick={() => setOpen(o => !o)}
      >
        {open ? '▾' : '▸'} Комментарий {value ? '• есть' : ''}
      </button>
      {open && (
        <textarea
          className="cmt-area"
          rows={3}
          placeholder="Что сделал, как себя чувствую, что не получилось…"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onFocus={e => e.target.scrollIntoView({ block: 'center', behavior: 'smooth' })}
        />
      )}
    </div>
  );
}
