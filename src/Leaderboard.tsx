import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Home, RefreshCw } from 'lucide-react';

interface Player {
  username: string;
  score: number;
  wins: number;
  losses: number;
}

export default function Leaderboard() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('players')
      .select('username, score, wins, losses')
      .order('score', { ascending: false })
      .limit(20);
    
    if (data) setPlayers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen p-8 flex flex-col items-center">
      <div className="flex justify-between items-center w-full max-w-5xl mb-8">
        <button onClick={() => navigate('/')} className="neo-btn bg-white border-2 border-black px-4 py-2 hover:bg-gray-100 flex gap-2">
           <Home /> Back
        </button>
        <h1 className="text-5xl font-black bg-brand-yellow px-6 py-2 border-4 border-black shadow-[4px_4px_0px_0px_black]">
          TOP 20 RANKINGS
        </h1>
        <button onClick={fetchLeaderboard} className="neo-btn bg-white border-2 border-black px-4 py-2 hover:bg-gray-100">
          <RefreshCw className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column (1-10) */}
        <div className="bg-white neo-box p-6">
          <PlayerList players={players.slice(0, 10)} startIndex={0} />
        </div>

        {/* Right Column (11-20) */}
        <div className="bg-white neo-box p-6">
           <PlayerList players={players.slice(10, 20)} startIndex={10} />
        </div>
      </div>
    </div>
  );
}

// Helper component for list rows
const PlayerList = ({ players, startIndex }: { players: Player[], startIndex: number }) => (
  <table className="w-full text-left">
    <thead>
      <tr className="border-b-4 border-black">
        <th className="py-2 w-12">#</th>
        <th className="py-2">NAME</th>
        <th className="py-2 text-right">W/L</th>
        <th className="py-2 text-right">PTS</th>
      </tr>
    </thead>
    <tbody>
      {players.map((p, i) => (
        <tr key={p.username} className="border-b-2 border-gray-200 font-bold text-lg hover:bg-yellow-50">
          <td className="py-3 text-2xl font-black text-gray-400">{startIndex + i + 1}</td>
          <td className="py-3 uppercase">{p.username}</td>
          <td className="py-3 text-right text-sm text-gray-500">{p.wins}-{p.losses}</td>
          <td className={`py-3 text-right text-2xl ${p.score >= 0 ? 'text-brand-green' : 'text-brand-red'}`}>
            {p.score > 0 ? '+' : ''}{p.score}
          </td>
        </tr>
      ))}
      {players.length === 0 && (
        <tr><td colSpan={4} className="text-center py-8 text-gray-400">NO PLAYERS YET</td></tr>
      )}
    </tbody>
  </table>
);