import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { BRAND, lower } from '../config/brand';
import { copyText, short } from '../lib/format';
import { useRunSubmit } from '../hooks/useRunSubmit';
import { XIcon } from './Bits';

function CaPill() {
  const [copied, setCopied] = useState(false);
  if (!BRAND.ca) return <div id="t-ca" className="capill is-hidden" />;
  return (
    <div id="t-ca" className="capill">
      <button
        type="button"
        className={`ca-addr t-ca-btn${copied ? ' copied' : ''}`}
        title="Copy the contract address"
        onClick={() =>
          copyText(BRAND.ca).then((ok) => {
            if (!ok) return;
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          })
        }
      >
        <b>${BRAND.ticker}</b>
        <span>{short(BRAND.ca)}</span>
        <i>{copied ? 'Copied' : 'Copy'}</i>
      </button>
    </div>
  );
}

function NavRun() {
  const { value, setValue, busy, msg, onSubmit } = useRunSubmit();
  return (
    <form className="navca" autoComplete="off" onSubmit={onSubmit}>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={msg?.bad ? msg.text : 'Run a project: post, site, CA, wallet or @handle'}
        spellCheck={false}
        aria-label="Run a project"
      />
      <button disabled={busy}>run</button>
    </form>
  );
}

export default function Nav() {
  const { pathname } = useLocation();
  const home = pathname === '/';
  return (
    <header className="nav">
      <div className="in">
        <Link className="brand" to="/">
          <img src="/assets/brand/mark.svg" alt="" />
          <span>{lower}</span>
          <span className="tk">${BRAND.ticker}</span>
        </Link>
        <nav className="links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'on' : '')}>
            run
          </NavLink>
          <NavLink to="/feed" className={({ isActive }) => (isActive ? 'on' : '')}>
            run log
          </NavLink>
          <NavLink to="/docs" className={({ isActive }) => (isActive ? 'on' : '')}>
            docs
          </NavLink>
        </nav>
        <NavRun />
        <div className="acts">
          <CaPill />
          {BRAND.x && (
            <a className="xb" href={`https://x.com/${BRAND.x}`} target="_blank" rel="noopener noreferrer" aria-label="On X" title={`@${BRAND.x} on X`}>
              <XIcon />
            </a>
          )}
          {home ? (
            <Link className="btn w" to="/feed">
              Run log <span className="ar">→</span>
            </Link>
          ) : (
            <Link className="btn w" to="/">
              New run <span className="ar">→</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
