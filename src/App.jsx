import { HashRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard.jsx';
import Overlay from './Overlay.jsx';
import './index.css';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/overlay" element={<Overlay />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
