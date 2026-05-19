type Props = {
  active: 6 | 7 | 8;
  onChange: (m: 6 | 7 | 8) => void;
};

const TABS: Array<{ m: 6 | 7 | 8; label: string }> = [
  { m: 6, label: 'Июнь' },
  { m: 7, label: 'Июль' },
  { m: 8, label: 'Август' },
];

export default function MonthTabs({ active, onChange }: Props) {
  return (
    <nav className="tabs">
      {TABS.map(t => (
        <button
          key={t.m}
          className={'tab ' + (t.m === active ? 'tab--on' : '')}
          onClick={() => onChange(t.m)}
        >{t.label}</button>
      ))}
    </nav>
  );
}
