// NEW AND IMPROVED APP/PAGE.JS CODE WITH ALL STYLING ACTIVATED!
// REPLACES ALL EXISTING CODE IN YOUR app/page.js FILE

'use client';

import { useState, useEffect } from 'react';

// STYLING: Define the cyberpunk visual aesthetics
const colors = {
    background: '#0a0b0d', // Near-black deep void
    panelBg: 'rgba(255, 255, 255, 0.03)', // Subtle glassmorphism
    accent: '#ff003c', // Sharp crimson red
    text: '#ffffff', // Clean white
    border: 'rgba(255, 0, 60, 0.3)', // Red glow border
    puleColor: 'rgba(255, 0, 60, 0.7)', // Red glow border
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
            // Simplified fetch for this demo, assumes single game.
            // Replace with robust multi-game/date logic for production.
            try {
                const response = await fetch(`https://api.balldontlie.io/v1/games?seasons[]=${new Date().getFullYear()}&start_date=${new Date().toISOString().split('T')[0]}`, {
                    headers: { 'Authorization': apiKey }
                });
                const data = await response.json();
                const firstGame = data.data?.[0]; // Assume the first game is live

                if (!firstGame) return;

                const isCurrentlyLive = firstGame.status === 'Live' || firstGame.status.includes('Q');
                setGameState(prev => ({
                    ...prev,
                    isLive: isCurrentlyLive,
                    score: { home: firstGame.home_team_score, away: firstGame.visitor_team_score },
                    // Simple logic for win% and index (for UI demonstration)
                    winPercentage: isCurrentlyLive ? (Math.random() * 50 + 50).toFixed(1) : 50,
                    index: isCurrentlyLive ? (Math.random() < 0.3 ? 'MARKET TURMOIL' : 'UNSTABLE ADVANTAGE') : 'STABLE GROWTH',
                    gameLog: isCurrentlyLive ? [...prev.gameLog.slice(-10), `Score updated: ${firstGame.home_team_score} - ${firstGame.visitor_team_score}`] : prev.gameLog,
                    lastUpdated: new Date().toLocaleTimeString(),
                }));

            catch (error) {
                console.error("Error fetching data:", error);
                // Handle API error in UI (not shown in simple demo)
            }
        };

        fetchGameData(); // Initial load
        const intervalId = setInterval(fetchGameData, 5000); // 5s pulse

        return () => clearInterval(intervalId); // Cleanup
    }, []);

    // INLINE CSS IN JS (Simpler for this initial setup)
    const styles = {
        container: {
            fontFamily: "'Courier New', Courier, monospace", // Retro computer terminal feel
            color: colors.text,
            backgroundColor: colors.background,
            padding: '40px',
            lineHeight: '1.6',
            boxSizing: 'border-box',
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%',
        },
        header: {
            fontSize: '3em',
            borderBottom: `2px solid ${colors.accent}`,
            display: 'inline-block',
            paddingBottom: '10px',
            marginBottom: '30px',
            fontWeight: 'normal',
        },
        subHeader: {
            fontSize: '0.9em',
            marginBottom: '15px',
            opacity: 0.8,
        },
        dashboardWrapper: {
            display: 'grid',
            gridTemplateColumns: '300px 1fr', // Layout with zombie image
            gap: '20px',
        },
        zombieContainer: {
            border: `1px solid ${colors.border}`,
            padding: '10px',
            textAlign: 'center',
            position: 'relative',
        },
        zombieImage: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
            // Simple visual check/placeholder if image fails (for demo)
            backgroundColor: 'rgba(255, 0, 60, 0.05)',
        },
        zombiePlaceholder: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '350px', // Matches your placeholder image aspect ratio
            border: `1px solid ${colors.border}`,
            color: colors.accent,
            backgroundColor: 'rgba(255, 0, 60, 0.1)',
            textTransform: 'uppercase',
            fontWeight: 'bold',
        },
        mainPanel: {
            border: `1px solid ${colors.border}`,
            padding: '20px',
            position: 'relative',
        },
        pulseContainer: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
        },
        pulseRing: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '220px',
            height: '220px',
            borderRadius: '50%',
            border: `2px solid ${colors.accent}`,
            opacity: 0.6,
            animation: `pulseRing ${gameState.isLive ? '0.8s' : '5s'} infinite ease-out`,
        },
        largeMetric: {
            fontSize: '5em',
            color: colors.accent,
            marginBottom: '5px',
            textAlign: 'center',
            zIndex: 2,
        },
        metricSubtitle: {
            fontSize: '1em',
            opacity: 0.7,
            textTransform: 'uppercase',
            textAlign: 'center',
            zIndex: 2,
        },
        statusPanel: {
            backgroundColor: colors.panelBg,
            padding: '10px 15px',
            borderRadius: '4px',
            marginBottom: '15px',
            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
        },
        highlight: {
            color: colors.accent,
            fontWeight: 'bold',
        },
        footer: {
            marginTop: '40px',
            borderTop: `1px solid ${colors.border}`,
            paddingTop: '10px',
            fontSize: '0.8em',
            opacity: 0.6,
        },
        gameLog: {
            fontSize: '0.85em',
            marginTop: '20px',
            maxHeight: '150px',
            overflowY: 'auto',
            border: `1px solid rgba(255, 255, 255, 0.1)`,
            padding: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
        },
        // CSS ANIMATIONS (Crucial for the "living" feel)
        stylesTag: (
            <style>
                {`
                    @keyframes pulseRing {
                        0% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.8; }
                        50% { opacity: 0.3; }
                        100% { transform: translate(-50%, -50%) scale(1.1); opacity: 0; }
                    }
                    /* Simple keyframe for subtle metric pulsing */
                    @keyframes metricPulse {
                        0% { opacity: 1; }
                        50% { opacity: 0.8; }
                        100% { opacity: 1; }
                    }
                `}
            </style>
        )
    };

    return (
        <div style={styles.container}>
            {styles.stylesTag} {/* Inject the animations */}

            <h1 style={styles.header}>ZOMBIEBET // ALPHA</h1>
            <div style={styles.subHeader}>
                LIVE DATA STREAM [3-5S] <span style={styles.highlight}>{gameState.lastUpdated}</span>
            </div>

            <div style={styles.dashboardWrapper}>
                <div style={styles.zombieContainer}>
                    {/* ZOMBIE IMAGE Task 2 placeholder */}
                    <div style={styles.zombiePlaceholder}>
                        ZOMBIE [IMG]
                    </div>
                    {/* Uncomment this once Task 2 is complete
                    <img src="/zombie.png" alt="Zombie" style={styles.zombieImage} />
                    */}
                </div>

                <div style={styles.mainPanel}>
                    <div style={styles.pulseContainer}>
                        <div style={styles.pulseRing} />
                        <div style={styles.largeMetric}>
                            {gameState.winPercentage}<span style={{fontSize: '0.5em'}}>%</span>
                        </div>
                        <div style={styles.metricSubtitle}>WINNER IS LIKELY %</div>
                    </div>
                </div>
            </div>

            <div style={{marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px'}}>
                <div style={styles.statusPanel}>
                    INDEX: <span style={styles.highlight}>{gameState.index}</span>
                </div>
                <div style={styles.statusPanel}>
                    SCORE: <span style={styles.highlight}>HOME {gameState.score.home} — {gameState.score.away} AWAY</span>
                </div>
            </div>

            <div style={styles.gameLog}>
                {gameState.gameLog.map((log, index) => (
                    <div key={index}>{`>>> ${log}`}</div>
                ))}
            </div>

            <div style={styles.footer}>TIP Stability detected. Scoring patterns match efficiency models. Trend likely to continue. | ZOMBIEBET BY K4</div>
        </div>
    );
}
