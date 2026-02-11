import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import MatchAdmin from './MatchAdmin';
import Leaderboard from './Leaderboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/match" element={<MatchAdmin />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  );
}