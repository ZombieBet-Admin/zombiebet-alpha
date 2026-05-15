'use client';
import React, { useState, useEffect } from 'react';

// --- THE ZOMBIEBRAIN ALGORITHM ---
const calculateUnrealWinProb = (scoreDiff, timeLeft, shotQuality, preGameSpread) => {
  // Normalize time (NBA game = 2880 seconds)
  const timeRemainingRatio = Math.max(0.01, timeLeft / 2880);
  
  // Regression Logic: If Shot Quality is low (contested 2s), we penalize the leader
  // High quality = 1.0, Low quality = 0.3
  const qualityFactor = shotQuality < 0.45 ? -4.5 : 1.2;
  
  // The Logit Model
  const x = (scoreDiff * 0.2) + (preGameSpread * 0.1) + (qualityFactor / timeRemainingRatio);
  const prob = 1 / (1 + Math.exp(-x));
  
  return (prob * 100).toFixed(1);
};

export default function ZombieBetAlpha() {
  const [gameState, setGameState] = useState({
    homeScore: 0, awayScore: 0, timeLeft: 2880,
    prob: 50.0, isFraud: false, logs: ["INITIALIZING FEED..."]
  });

  useEffect(() => {
    const pollLiveGames = async () => {
      try {
        const res = await fetch('https://api.balldontlie.io/v1/games/live', {
          headers: { 'Authorization': process.env.NEXT_PUBLIC_NBA_API_KEY }
        });
        const json = await res.json();
        
        if (json.data && json.data.length > 0) {
          const game = json.data[0]; // Tracking the primary live game
          const diff = game.home_team_score - game.visitor_team_score;
          
          // We simulate shot quality for now as most free APIs don't provide xFG in real-time
          // In a pro setup, we'd pull play-by-play coordinates
          const mockShotQuality = Math.random(); 
          const winProb = calculateUnrealWinProb(diff, 1440, mockShotQuality, -4.5);

          setGameState(prev => ({
            homeScore: game.home_team_score,
            awayScore: game.visitor_team_score,
            prob: winProb,
            isFraud: mockShotQuality < 0.4,
            logs: [`[EVENT] ${game.home_team.abbreviation} SCORE UPDATE: ${game.home_team_score}-${game.visitor_team_score}`, ...prev.logs].slice(0, 6)
          }));
        }
      } catch (err) {
        console.error("Data Fetch Error:", err);
      }
    };

    const interval = setInterval(pollLiveGames, 5000); // 5-second pulses
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen ${gameState.isFraud ? 'bg-red-950' : 'bg-black'} text-white font-mono p-4 md:p-10 transition-colors duration-700`}>
      <div className="max-w-6xl mx-auto border-4 border-white p-6 shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] bg-black/50 backdrop-blur-md">
        
        {/* HEADER */}
        <div className="flex justify-between items-center border-b-4 border-white pb-4 mb-8">
          <h1 className="text-3xl font-black tracking-tighter italic">ZOMBIEBET // ALPHA</h1>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold">LIVE DATA STREAM [3-5S]</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: AVATAR & FRAUD STATUS */}
          <div className="col-span-1 space-y-6">
            <div className="border-4 border-white bg-zinc-900 aspect-square flex items-center justify-center p-2 relative overflow-hidden">
              {/* Replace with your TIP.jpg URL later */}
              <img src="/zombie.png" alt="Zombie" className="w-full h-full object-cover pixelated opacity-80" />
              {gameState.isFraud && (
                <div className="absolute inset-0 bg-red-600/30 flex items-center justify-center">
                  <span className="bg-white text-red-600 font-black px-2 py-1 rotate-12 text-2xl border-2 border-red-600">FRAUD ALERT</span>
                </div>
              )}
            </div>
            <div className="bg-white text-black p-3 text-center font-black text-xl">
              INDEX: {gameState.isFraud ? "REGRESSION LIKELY" : "STABLE GROWTH"}
            </div>
          </div>

          {/* RIGHT COLUMN: DATA DISPLAY */}
          <div className="col-span-2 space-y-8">
            <div className="text-center py-10 bg-zinc-900/50 border-2 border-zinc-800 relative">
              <span className="text-[10px] text-zinc-500 absolute top-2 left-4">WINNER IS LIKELY %</span>
              <div className={`text-[10rem] leading-none font-black transition-all ${gameState.isFraud ? 'text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'text-green-400'}`}>
                {gameState.prob}%
              </div>
              <div className="text-4xl font-bold tracking-widest mt-4">
                HOME {gameState.homeScore} — {gameState.awayScore} AWAY
              </div>
            </div>

            {/* MOMENTUM PULSE LOG */}
            <div className="bg-zinc-900 border-2 border-white p-4 h-48 overflow-hidden">
              <div className="text-[10px] text-zinc-500 mb-2 font-bold uppercase tracking-widest">Live Game Log</div>
              <div className="space-y-1">
                {gameState.logs.map((log, i) => (
                  <div key={i} className={`text-xs ${i === 0 ? 'text-green-400 font-bold' : 'text-zinc-400'}`}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-10 pt-4 border-t-2 border-zinc-800 flex justify-between items-end">
          <div className="max-w-md">
            <span className="bg-green-500 text-black px-1 font-bold mr-2 text-xs text-[10px]">TIP</span>
            <span className="text-[10px] text-zinc-400 leading-tight">
              {gameState.isFraud 
                ? "WARNING: Current scoring run is low-quality. Expect momentum shift as regression to the mean occurs." 
                : "Stability detected. Scoring patterns match efficiency models. Trend likely to continue."}
            </span>
          </div>
          <div className="font-black text-xl italic text-green-500">ZOMBIEBET BY K4</div>
        </div>
      </div>
    </div>
  );
}
