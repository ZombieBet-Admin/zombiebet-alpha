'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [winP, setWinP] = useState(50);

  useEffect(() => {
    const timer = setInterval(() => {
      setWinP((Math.random() * 30 + 60).toFixed(1));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main style={{ backgroundColor: '#0a0b0d', color: '#ff003c', minHeight: '100vh', padding: '40px', fontFamily: 'monospace' }}>
      <h1 style={{ borderBottom: '2px solid #ff003c', display: 'inline-block', marginBottom: '40px' }}>ZOMBIEBET // ALPHA</h1>
      
      <div style={{ border: '1px solid rgba(255, 0, 60, 0.3)', padding: '60px', textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
        <div style={{ fontSize: '0.9em', opacity: 0.5 }}>WINNER_PROBABILITY_INDEX</div>
        <div style={{ fontSize: '8em', fontWeight: 'bold', margin: '20px 0' }}>{winP}%</div>
        <div style={{ letterSpacing: '5px', textTransform: 'uppercase' }}>Unstable Advantage</div>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '0.8em', opacity: 0.4 }}>
        <span>FEED: LIVE_ALPHA_v1</span>
        <span>STATUS: SYSTEM_READY</span>
      </div>
    </main>
  );
}
