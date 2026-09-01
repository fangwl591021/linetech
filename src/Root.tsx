import { useEffect, useState } from 'react';
import App from './App';
import { MobileRichMenuSimulator } from './mobile/MobileRichMenuSimulator';

type TeachingMode = 'desktop' | 'mobile';

const MODE_KEY = 'linetech.teaching.mode';

function loadMode(): TeachingMode {
  const saved = localStorage.getItem(MODE_KEY);
  return saved === 'mobile' ? 'mobile' : 'desktop';
}

export default function Root() {
  const [mode, setMode] = useState<TeachingMode>(() => loadMode());

  useEffect(() => {
    localStorage.setItem(MODE_KEY, mode);
  }, [mode]);

  return (
    <>
      {mode === 'desktop' ? <App /> : <MobileRichMenuSimulator />}
      <div className="teaching-mode-switcher" aria-label="教學版本切換">
        <span>教學版本</span>
        <button className={mode === 'desktop' ? 'active' : ''} onClick={() => setMode('desktop')}>電腦版</button>
        <button className={mode === 'mobile' ? 'active' : ''} onClick={() => setMode('mobile')}>手機版</button>
      </div>
    </>
  );
}
