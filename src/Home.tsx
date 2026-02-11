import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');

  const handleStart = () => {
    if (!p1 || !p2) return;
    // Pass names to the Admin/Match screen
    navigate('/match', { state: { p1, p2 } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-7xl md:text-9xl font-black text-brand-yellow [-webkit-text-stroke:4px_black] drop-shadow-[6px_6px_0px_rgba(0,0,0,1)]">
          WHACK.IO
        </h1>
        <div className="inline-block bg-black text-white px-6 py-2 text-xl font-bold rotate-[-2deg]">
          JPCS FOUNDATION WEEK
        </div>
      </div>

      {/* Player Inputs */}
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl mt-8">
        {/* Player 1 */}
        <div className="flex-1 bg-brand-blue neo-box p-8 flex flex-col gap-4 relative">
          <div className="absolute -top-5 left-6 bg-black text-white px-4 py-1 font-bold">PLAYER 1</div>
          <input 
            value={p1}
            onChange={(e) => setP1(e.target.value.toUpperCase())}
            placeholder="ENTER NAME" 
            className="neo-input"
          />
        </div>

        {/* VS Badge */}
        <div className="flex items-center justify-center">
          <span className="text-6xl font-black italic">VS</span>
        </div>

        {/* Player 2 */}
        <div className="flex-1 bg-brand-green neo-box p-8 flex flex-col gap-4 relative">
          <div className="absolute -top-5 right-6 bg-black text-white px-4 py-1 font-bold">PLAYER 2</div>
          <input 
            value={p2}
            onChange={(e) => setP2(e.target.value.toUpperCase())}
            placeholder="ENTER NAME" 
            className="neo-input"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-6 mt-8">
        <button 
          onClick={() => navigate('/leaderboard')}
          className="neo-btn neo-box bg-white px-8 py-4 flex items-center gap-2 hover:bg-gray-100"
        >
          <Trophy size={24} /> Leaderboard
        </button>

        <button 
          disabled={!p1 || !p2}
          onClick={handleStart}
          className="neo-btn neo-box bg-brand-yellow px-12 py-4 text-2xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          START MATCH
        </button>
      </div>
    </div>
  );
}