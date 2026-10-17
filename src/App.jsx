import { HashRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage.jsx';
import Dashboard from './Dashboard.jsx';
import Overlay from './Overlay.jsx';
import './index.css';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/overlay" element={<Overlay />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
