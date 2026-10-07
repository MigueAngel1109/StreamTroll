import { useEffect, useState } from 'react';

const channel = new BroadcastChannel('stream_troll_channel');

function Overlay() {
  const [activeEffect, setActiveEffect] = useState('');
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Set a slight dark background for testing in browser so text is visible
    // In a real OBS environment, this should be fully transparent.
    document.body.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    document.body.style.backgroundImage = 'none';
    document.body.style.color = 'white';

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
      channel.onmessage = null;
      document.body.style.backgroundColor = '';
      document.body.style.backgroundImage = '';
      document.body.style.color = '';
    };
  }, []);

  return (
    <div className={`overlay-container ${activeEffect}`}>
      <div style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '8px', border: '1px solid #4ade80' }}>
        <span style={{color: '#4ade80'}}>🟢 OVERLAY ACTIVO Y CONECTADO</span>
        <br/>
        <span style={{fontSize: '12px', color: '#ccc'}}>Si ves esto, está listo para recibir alertas.</span>
      </div>
      
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
