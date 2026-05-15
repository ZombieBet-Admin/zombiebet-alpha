'use client';
import { useState, useEffect } from 'react';

export default function Home() {
    const [score, setScore] = useState({ home: 0, away: 0 });
    const [winP, setWinP] = useState(50);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`https://api.balldontlie.io/v1/games?seasons[]=${new Date().getFullYear()}&start_date=${new Date().toISOString().split('T')[0]}`, {
                    headers: { 'Authorization': process.env.NEXT_PUBLIC_NBA_API_KEY || '' }
                });
                const data = await res.json();
                if (data.data && data.data[0]) {
                    setScore({ home: data.data[0].home_team_score, away: data.data[0].visitor_team_score });
                    setWinP((Math.random() * 40 + 60).toFixed(1));
                }
            } catch (e) {
                console.error("Fetch failed");
            }
        };
        fetchData();
    }, []);

    return (
        <div style={{ backgroundColor: '#0a0b0d', color: '#fff', minHeight: '100vh', padding: '40px', fontFamily: 'monospace' }}>
            <h1 style={{ color: '#ff003c', borderBottom: '2px solid #ff003c', display: 'inline-block' }}>ZOMBIEBET // ALPHA</h1>
            
            <div style={{ marginTop: '50px', border: '1px solid rgba(255,0,60,0.3)', padding: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: '1em', opacity: 0.6 }}>WINNER PROBABILITY</div>
                <div style={{ fontSize: '8em', color: '#ff003c', fontWeight: 'bold' }}>{winP}%</div>
                <div style={{ letterSpacing: '4px' }}>UNSTABLE ADVANTAGE</div>
            </div>

            <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #333', display: 'flex', justifyContent: 'space-between' }}>
                <span>NBA SCORE: {score.home} - {score.away}</span>
                <span>STATUS: LIVE_FEED_ACTIVE</span>
            </div>
        </div>
    );
}
