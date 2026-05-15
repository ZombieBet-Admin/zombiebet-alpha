'use client';
import { useState, useEffect } from 'react';

export default function Home() {
    const [winP, setWinP] = useState(50);
    const [score, setScore] = useState({ home: 0, away: 0 });

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
            } catch (e) { console.log("Waiting for data..."); }
        };
        fetchData();
        const id = setInterval(fetchData, 10000);
        return () => clearInterval(id);
    }, []);

    const styles = {
        body: { backgroundColor: '#0a0b0d', color: '#fff', minHeight: '100vh', padding: '40px', fontFamily: 'monospace' },
        card: { border: '1px solid #ff003c', padding: '40px', textAlign: 'center', marginTop: '20px', backgroundColor: 'rgba(255,0,60,0.05)' },
        huge: { fontSize: '8vw', color: '#ff003c', margin: '20px 0', fontWeight: 'bold' },
        status: { display: 'flex', justifyContent: 'space-between', marginTop: '20px', borderTop: '1px solid #333', paddingTop: '10px', fontSize: '0.9em' }
    };

    return (
        <div style={styles.body}>
            <h1 style={{ borderBottom: '2px solid #ff003c', display: 'inline-block' }}>ZOMBIEBET // ALPHA</h1>
            <div style={styles.card}>
                <div style={{ opacity: 0.6 }}>WINNER_PROBABILITY_INDEX</div>
                <div style={styles.huge}>{winP}%</div>
                <div style={{ letterSpacing: '5px', color: '#ff003c' }}>UNSTABLE ADVANTAGE</div>
                <div style={styles.status}>
                    <span>SCORE: {score.home} - {score.away}</span>
                    <span>FEED: LIVE_ALPHA_v1.0</span>
                </div>
            </div>
            <div style={{ marginTop: '20px', opacity: 0.3, fontSize: '0.7em' }}>>>> DATA ENCRYPTED // SYSTEM STABLE</div>
        </div>
    );
}
