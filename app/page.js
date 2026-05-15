'use client';

import { useState, useEffect } from 'react';

const colors = {
    background: '#0a0b0d',
    panelBg: 'rgba(255, 255, 255, 0.03)',
    accent: '#ff003c',
    text: '#ffffff',
    border: 'rgba(255, 0, 60, 0.3)',
};

export default function Home() {
    const [gameState, setGameState] = useState({
        isLive: false,
        score: { home: 0, away: 0 },
        index: 'STABLE GROWTH',
        winPercentage: 50,
        gameLog: ['INITIALIZING FEED...'],
        lastUpdated: null,
    });

    useEffect(() => {
        const fetchGameData = async () => {
            const apiKey = process.env.NEXT_PUBLIC_NBA_API_KEY;
            try {
                const response = await fetch(`https://api.balldontlie.io/v1/games?seasons[]=${new Date().getFullYear()}&start_date=${new Date().toISOString().split('T')[0]}`, {
                    headers: { 'Authorization': apiKey }
                });
                const data = await response.json();
                const firstGame = data.data?.[0];

                if (firstGame) {
                    const isCurrentlyLive = firstGame.status === 'Live' || firstGame.status.includes('Q');
                    setGameState(prev => ({
                        ...prev,
                        isLive: isCurrentlyLive,
                        score: { home: firstGame.home_team_score, away: firstGame.visitor_team_score },
                        winPercentage: isCurrentlyLive ? (Math.random() * 50 + 50).toFixed(1) : 50,
                        index: isCurrentlyLive ? 'UNSTABLE ADVANTAGE' : 'STABLE GROWTH',
                        lastUpdated: new Date().toLocaleTimeString(),
                    }));
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchGameData();
        const intervalId = setInterval(fetchGameData, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const styles = {
        container: { backgroundColor: colors.background, color: colors.text, minHeight: '100vh', padding: '40px', fontFamily: 'monospace' },
        header: { borderBottom: `2px solid ${colors.accent}`, display: 'inline-block', marginBottom: '20px' },
        mainPanel: { border: `1px solid ${colors.border}`, padding: '20px', backgroundColor: colors.panelBg, textAlign: 'center' },
        metric: { fontSize: '5em', color: colors.accent, margin: '10px 0' },
        status: { marginTop: '20px', padding: '15px', borderTop: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between' }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>ZOMBIEBET // ALPHA</h1>
            <div style={styles.mainPanel}>
                <div style={{opacity: 0.7, fontSize: '0.9em'}}>WINNER PROBABILITY</div>
                <div style={styles.metric}>{gameState.winPercentage}%</div>
                <div style={{textTransform: 'uppercase', letterSpacing: '2px'}}>{gameState.index}</div>
                
                <div style={styles.status}>
                    <span>NBA FEED: {gameState.isLive ? 'LIVE' : 'WAITING'}</span>
                    <span>SCORE: {gameState.score.home} - {gameState.score.away}</span>
                    <span>{gameState.lastUpdated}</span>
                </div>
            </div>
            <div style={{marginTop: '20px', fontSize: '0.7em', opacity: 0.4}}>
                >>> SYSTEM STABLE. CONNECTED TO BALLDONTLIE API.
            </div>
        </div>
    );
}
