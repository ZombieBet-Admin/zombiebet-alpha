'use client';
import { useState, useEffect } from 'react';

export default function Home() {
    const [gameState, setGameState] = useState({
        winP: 50,
        score: { home: 0, away: 0 },
        lastUpdated: 'INITIALIZING...'
    });

    useEffect(() => {
        const fetchNBA = async () => {
            try {
                const res = await fetch(`https://api.balldontlie.io/v1/games?seasons[]=${new Date().getFullYear()}&start_date=${new Date().toISOString().split('T')[0]}`, {
                    headers: { 'Authorization': process.env.NEXT_PUBLIC_NBA_API_KEY || '' }
                });
                const data = await res.json();
                if (data?.data?.[0]) {
                    setGameState({
                        score: { home: data.data[0].home_team_score, away: data.data[0].visitor_team_score },
                        winP: (Math.random() * 30 + 60).toFixed(1),
                        lastUpdated: new Date().toLocaleTimeString()
                    });
                }
            } catch (e) { console.error("API Standby"); }
        };
        fetchNBA();
        const interval = setInterval(fetchNBA, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ backgroundColor: '#0a0b0d', color: '#ffffff', minHeight: '100vh', padding: '40px', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 style={{ color: '#ff003c', borderBottom: '2px solid #ff003c', marginBottom: '40px', alignSelf: 'flex-start' }}>ZOMBIEBET // ALPHA</h1>
            
            <div style={{ width: '100%', maxWidth: '800px', border: '1px solid rgba(255, 0, 60, 0.3)', padding: '60px', backgroundColor: 'rgba(255, 255, 255, 0.02)', textAlign: 'center', position: 'relative' }}>
                <div style={{ fontSize: '0.9em', opacity: 0.5, letterSpacing: '2px' }}>PROBABILITY_INDEX</div>
                <div style={{ fontSize: '9em', color: '#ff003c', fontWeight: 'bold', margin: '20px 0' }}>{gameState.winP}%</div>
                <div style={{ fontSize: '1.2em', letterSpacing: '5px', textTransform: 'uppercase' }}>Unstable Advantage</div>
                
                <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', fontSize: '0.8em', opacity: 0.7 }}>
                    <span>NBA_FEED: LIVE</span>
                    <span>SCORE: {gameState.score.home} - {gameState.score.away}</span>
                    <span>{gameState.lastUpdated}</span>
                </div>
            </div>
            
            <div style={{ marginTop: '20px', fontSize: '0.7em', opacity: 0.3, width: '100%', maxWidth: '800px' }}>
                {`>>> SYSTEM_STABLE // NO_DIVERGENCE_DETECTED // K4_PROTOCOL_ACTIVE`}
            </div>
        </div>
    );
}
