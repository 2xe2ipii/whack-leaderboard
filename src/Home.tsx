import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Loader2, Check, AlertCircle } from 'lucide-react';
import { supabase } from './lib/supabase';

// --- SUB-COMPONENT: Smart Player Input ---
interface PlayerInputProps {
  label: string;
  color: string; // Tailwind class like 'bg-brand-blue'
  onConfirm: (name: string) => void;
  onClear: () => void;
}

const PlayerInput = ({ label, color, onConfirm, onClear }: PlayerInputProps) => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'conflict' | 'confirmed'>('idle');
  const [isReturning, setIsReturning] = useState(false);

  const handleBlur = async () => {
    const trimmedName = name.trim().toUpperCase();
    if (!trimmedName) {
      setStatus('idle');
      onClear();
      return;
    }

    // Don't re-check if nothing changed or already confirmed
    if (status === 'confirmed') return;

    setStatus('checking');

    try {
      // Check if player exists in DB
      const { data, error } = await supabase
        .from('players')
        .select('username')
        .eq('username', trimmedName)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        // Name exists -> Ask "Is this you?"
        setStatus('conflict');
      } else {
        // New Name -> Auto confirm
        setStatus('confirmed');
        setIsReturning(false);
        onConfirm(trimmedName);
      }
    } catch (err) {
      console.error(err);
      // Fallback: just let them play if DB fails
      setStatus('confirmed');
      onConfirm(trimmedName);
    }
  };

  const handleConflictResolve = (isMe: boolean) => {
    if (isMe) {
      setStatus('confirmed');
      setIsReturning(true);
      onConfirm(name.trim().toUpperCase());
    } else {
      setName('');
      setStatus('idle');
      onClear();
    }
  };

  return (
    <div className={`flex-1 ${color} neo-box p-8 flex flex-col gap-4 relative transition-all`}>
      <div className="absolute -top-5 left-6 bg-black text-white px-4 py-1 font-bold">
        {label}
      </div>

      {status === 'confirmed' ? (
        <div className="flex flex-col items-center justify-center h-full gap-2 animate-in fade-in zoom-in duration-300">
          <div className="text-4xl font-black break-all text-center">{name}</div>
          <div className="flex items-center gap-2 bg-black/10 px-3 py-1 rounded-full">
            {isReturning ? (
              <span className="font-bold text-sm">WELCOME BACK!</span>
            ) : (
              <span className="font-bold text-sm">NEW PLAYER</span>
            )}
            <Check size={16} />
          </div>
          <button 
            onClick={() => { setStatus('idle'); onClear(); }}
            className="text-xs underline mt-2 opacity-50 hover:opacity-100"
          >
            CHANGE NAME
          </button>
        </div>
      ) : status === 'conflict' ? (
        <div className="flex flex-col items-center justify-center h-full gap-3 animate-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2 text-red-600 font-bold">
            <AlertCircle size={24} />
            <span>NAME TAKEN</span>
          </div>
          <p className="text-center font-bold text-lg leading-tight">
            Is "{name}" you?
          </p>
          <div className="flex gap-2 w-full mt-2">
            <button 
              onClick={() => handleConflictResolve(true)}
              className="flex-1 bg-black text-white py-2 font-bold hover:bg-gray-800"
            >
              YES
            </button>
            <button 
              onClick={() => handleConflictResolve(false)}
              className="flex-1 bg-white border-2 border-black py-2 font-bold hover:bg-gray-100"
            >
              NO
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <input 
            value={name}
            onChange={(e) => {
              setName(e.target.value.toUpperCase());
              setStatus('idle');
              onClear();
            }}
            onBlur={handleBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
            placeholder="ENTER NAME" 
            className="neo-input pr-12"
            disabled={status === 'checking'}
          />
          {status === 'checking' && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Loader2 className="animate-spin" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};


// --- MAIN COMPONENT ---
export default function Home() {
  const navigate = useNavigate();
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');

  const handleStart = () => {
    if (!p1 || !p2) return;
    navigate('/match', { state: { p1, p2 } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-8 bg-[radial-gradient(#3b82f6_2px,transparent_2px)] [background-size:30px_30px]">
      
      {/* Header */}
      <div className="text-center space-y-2 transform -rotate-2">
        <h1 className="text-7xl md:text-9xl font-black text-brand-yellow [-webkit-text-stroke:4px_black] drop-shadow-[6px_6px_0px_rgba(0,0,0,1)]">
          WHACK.IO
        </h1>
        <div className="inline-block bg-black text-white px-6 py-2 text-xl font-bold rotate-[-2deg]">
          JPCS FOUNDATION WEEK
        </div>
      </div>

      {/* Main Form Area */}
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl mt-8">
        
        <PlayerInput 
          label="PLAYER 1" 
          color="bg-brand-blue" 
          onConfirm={setP1} 
          onClear={() => setP1('')}
        />

        {/* VS Badge */}
        <div className="flex items-center justify-center">
          <span className="text-6xl font-black italic drop-shadow-md">VS</span>
        </div>

        <PlayerInput 
          label="PLAYER 2" 
          color="bg-brand-green" 
          onConfirm={setP2} 
          onClear={() => setP2('')}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-6 mt-8">
        <button 
          onClick={() => navigate('/leaderboard')}
          className="neo-btn neo-box bg-white px-8 py-4 flex items-center gap-2 hover:bg-gray-100"
        >
          <Trophy size={24} /> LEADERBOARD
        </button>

        <button 
          disabled={!p1 || !p2}
          onClick={handleStart}
          className="neo-btn neo-box bg-brand-yellow px-12 py-4 text-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
        >
          START MATCH
        </button>
      </div>
    </div>
  );
}