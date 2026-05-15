'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [win, setWin] = useState(50);

  return (
    <main style={{ backgroundColor: '#000', color: '#ff003c', minHeight: '100vh', padding: '50px', fontFamily: 'monospace' }}>
      <h1 style={{ borderBottom: '2px solid #ff003c', display: 'inline-block' }}>ZOMBIEBET // ALPHA</h1>
      <div style={{ border: '1px solid #ff003c', padding: '50px', marginTop: '30px', textAlign: 'center' }}>
        <p style={{ opacity: 0.5 }}>WIN_PROBABILITY</p>
        <h2 style={{ fontSize: '100px', margin: '20px 0' }}>{win}%</h2>
        <p>SYSTEM ACTIVE // FEED SECURE</p>
      </div>
    </main>
  );
}
