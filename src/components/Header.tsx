type Props = { done: number; total: number };

export default function Header({ done, total }: Props) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <header className="hdr">
      <div className="hdr-row">
        <div className="hdr-title">Лето 2026</div>
        <div className="hdr-count">{done} / {total}</div>
      </div>
      <div className="bar"><div className="bar-fill" style={{ width: pct + '%' }} /></div>
      <div className="hdr-sub">{pct}% выполнено</div>
    </header>
  );
}
