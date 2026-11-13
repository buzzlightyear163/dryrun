import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { startRun } from '../lib/demoRun';

/** Formulärlogik för "Run a project" (hero-terminalen och navfältet). */
export function useRunSubmit() {
  const nav = useNavigate();
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ text: string; bad?: boolean } | null>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = value.trim();
    const input = e.currentTarget.querySelector('input');
    if (!v) {
      input?.focus();
      return;
    }
    setBusy(true);
    setMsg({ text: 'starting the run…' });
    // TODO(backend): POST /api/run { input, from: "web" } → { id }
    const r = startRun(v);
    window.setTimeout(() => {
      setBusy(false);
      if (r.id) {
        setValue('');
        setMsg(null);
        nav(`/c/${r.id}`);
      } else setMsg({ text: r.error || 'No answer. Try again in a moment.', bad: true });
    }, 350);
  };

  return { value, setValue, busy, msg, onSubmit };
}
