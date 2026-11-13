import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '../config/brand';

export default function NotFound() {
  useEffect(() => {
    document.title = `Not found · ${BRAND.name}`;
  }, []);
  return (
    <main className="wide nf">
      <div className="eyebrow">404 · nothing here</div>
      <h2 className="px">
        Not found<span style={{ color: 'var(--acc)' }}>.</span>
      </h2>
      <p>This page does not exist. Run a project instead.</p>
      <Link className="btn w" to="/">
        New run <span className="ar">→</span>
      </Link>
    </main>
  );
}
