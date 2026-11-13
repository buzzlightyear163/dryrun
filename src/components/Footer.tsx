import { Link } from 'react-router-dom';
import { BRAND } from '../config/brand';

export default function Footer() {
  return (
    <footer className="wide foot2">
      <span>{BRAND.name} · an AI examiner uses the project in a sandbox browser with a sandbox wallet, and nothing is ever signed</span>
      <Link to="/feed">run log</Link>
      <Link to="/docs">docs</Link>
      <span className="nfa">Not financial advice</span>
    </footer>
  );
}
