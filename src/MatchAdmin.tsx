import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Minus, Swords } from 'lucide-react';

export default function MatchAdmin() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  
  // Fallback if accessed directly without state
  const p1 = state?.p1 || "PLAYER 1";
  const p2 = state?.p2 || "PLAYER 2";

  const handleResult = async (winner: 'p1' | 'p2' | 'draw') => {
    setSubmitting(true);
    try {
      // Call the Supabase RPC function we created earlier
      const { error } = await supabase.rpc('resolve_match', {
        p1_name: p1,
        p2_name: p2,
        result: winner
      });

      if (error) throw error;
      navigate('/leaderboard'); // Go to leaderboard after recording
    } catch (err) {
      alert('Error saving match result');
      console.error(err);
      setSubmitting(false);
    }
  };

  if (submitting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-4xl font-black">UPDATING SCORES...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      <h2 className="text-4xl font-black mb-12 border-b-4 border-black pb-2">SELECT WINNER</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl flex-1">
        
        {/* P1 Win Button */}
        <button 
          onClick={() => handleResult('p1')}
          className="neo-box neo-btn bg-brand-blue flex flex-col items-center justify-center gap-4 p-12 hover:scale-105"
        >
          <span className="text-3xl">{p1}</span>
          <span className="text-6xl">WINS</span>
          <span className="text-xl bg-black text-white px-3 py-1">+5 PTS</span>
        </button>

        {/* Draw Button */}
        <div className="flex flex-col gap-4">
           <button 
            onClick={() => handleResult('draw')}
            className="neo-box neo-btn bg-gray-200 flex-1 flex flex-col items-center justify-center gap-2 hover:bg-gray-300"
          >
            <Minus size={48} />
            <span className="text-3xl">DRAW</span>
            <span className="text-sm">0 PTS</span>
          </button>
          
          <div className="bg-white neo-box p-6 text-center">
            <Swords className="mx-auto mb-2" size={32}/>
            <p className="font-bold">GAME IN PROGRESS</p>
            <p className="text-sm text-gray-500">Wait for Arduino round to finish (60s)</p>
          </div>
        </div>

        {/* P2 Win Button */}
        <button 
          onClick={() => handleResult('p2')}
          className="neo-box neo-btn bg-brand-green flex flex-col items-center justify-center gap-4 p-12 hover:scale-105"
        >
          <span className="text-3xl">{p2}</span>
          <span className="text-6xl">WINS</span>
          <span className="text-xl bg-black text-white px-3 py-1">+5 PTS</span>
        </button>

      </div>
      
      <button onClick={() => navigate('/')} className="mt-12 font-bold underline">Cancel Match</button>
    </div>
  );
}