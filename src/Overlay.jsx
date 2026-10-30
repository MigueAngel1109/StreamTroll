import { useEffect, useState } from 'react';

const channel = new BroadcastChannel('stream_troll_channel');

function Overlay() {
  const [activeEffect, setActiveEffect] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [graphicsEnabled, setGraphicsEnabled] = useState(true);
  const [showGrid, setShowGrid] = useState(false);

  const [showStatus, setShowStatus] = useState(true);

  const isChroma = window.location.href.includes('chroma=true');

  useEffect(() => {
    // In OBS browser source, background is transparent; in Chroma mode, it's green #00ff00
    document.body.style.backgroundColor = isChroma ? '#00ff00' : 'transparent';
    document.body.style.backgroundImage = 'none';
    document.body.style.color = 'white';

    // Hide status banner after 4 seconds so it doesn't show in live stream
    const timer = setTimeout(() => setShowStatus(false), 4000);

    channel.onmessage = (event) => {
      const data = event.data;
      if (data.type === 'ENGINE_CONFIG') {
        if (typeof data.graphicsEngine === 'boolean') {
          setGraphicsEnabled(data.graphicsEngine);
        }
        if (typeof data.alignmentGrid === 'boolean') {
          setShowGrid(data.alignmentGrid);
        }
      } else if (data.type === 'SHADER') {
        if (graphicsEnabled) {
          setActiveEffect(data.effect);
          setTimeout(() => setActiveEffect(''), data.duration || 5000);
        }
      } else if (data.type === 'ALERT') {
        const id = Date.now();
        
        if (data.tts && window.speechSynthesis) {
          const textToRead = `${data.user} ha donado ${data.amount}. Dice: ${data.message}`;
          const utterance = new SpeechSynthesisUtterance(textToRead);
          utterance.lang = 'es-ES';
          utterance.rate = 1.1; // A bit faster for streaming hype
          window.speechSynthesis.speak(utterance);
        }

        setAlerts((prev) => [...prev, { ...data, id }]);
        setTimeout(() => {
          setAlerts((prev) => prev.filter((a) => a.id !== id));
        }, 8000);
      }
    };

    return () => {
      clearTimeout(timer);
      channel.onmessage = null;
      document.body.style.backgroundColor = '';
      document.body.style.backgroundImage = '';
      document.body.style.color = '';
    };
  }, [graphicsEnabled, isChroma]);

  return (
    <div className={`overlay-container ${activeEffect}`}>
      {/* Alignment Grid Overlay */}
      {showGrid && (
        <div style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: 'linear-gradient(to right, rgba(59, 130, 246, 0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.25) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          border: '2px dashed rgba(59, 130, 246, 0.6)',
          zIndex: 9998
        }}>
          <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.8)', color: '#38bdf8', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
            📐 ALIGNMENT GRID (OBS STUDIO / TROLL ME)
          </div>
        </div>
      )}

      {showStatus && (
        <div style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'rgba(0,0,0,0.7)', padding: '10px 14px', borderRadius: '8px', border: '1px solid #4ade80', transition: 'opacity 0.5s' }}>
          <span style={{color: '#4ade80', fontWeight: 'bold'}}>🟢 OVERLAY ACTIVO Y CONECTADO</span>
          <br/>
          <span style={{fontSize: '12px', color: '#ccc'}}>Listo para recibir alertas en OBS.</span>
        </div>
      )}
      
      <div className="alerts-container">
        {alerts.map((alert) => (
          <div key={alert.id} className="fake-alert slide-in">
            <div className="alert-icon">💸</div>
            <div className="alert-content">
              <div className="alert-title">
                <span className="alert-user">{alert.user}</span> donó <span className="alert-amount">{alert.amount}</span>
              </div>
              <div className="alert-msg">"{alert.message}"</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Overlay;
