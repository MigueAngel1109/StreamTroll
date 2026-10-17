import { useEffect, useState } from 'react';

const channel = new BroadcastChannel('stream_troll_channel');

function Overlay() {
  const [activeEffect, setActiveEffect] = useState('');
  const [alerts, setAlerts] = useState([]);

  const [showStatus, setShowStatus] = useState(true);

  useEffect(() => {
    // In OBS, background must be fully transparent
    document.body.style.backgroundColor = 'transparent';
    document.body.style.backgroundImage = 'none';
    document.body.style.color = 'white';

    // Hide status banner after 4 seconds so it doesn't show in live stream
    const timer = setTimeout(() => setShowStatus(false), 4000);

    channel.onmessage = (event) => {
      const data = event.data;
      if (data.type === 'SHADER') {
        setActiveEffect(data.effect);
        setTimeout(() => setActiveEffect(''), data.duration || 5000);
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
  }, []);

  return (
    <div className={`overlay-container ${activeEffect}`}>
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
