import { useState } from 'react';

const channel = new BroadcastChannel('stream_troll_channel');

function Dashboard() {
  const [activeTab, setActiveTab] = useState('gift-triggers');
  const [version, setVersion] = useState('Free');
  const [alertUser, setAlertUser] = useState('');
  const [alertAmount, setAlertAmount] = useState('');
  const [alertMsg, setAlertMsg] = useState('');

  const sendEffect = (effectName) => {
    channel.postMessage({ type: 'SHADER', effect: effectName, duration: 8000 });
  };

  const sendAlert = () => {
    channel.postMessage({
      type: 'ALERT',
      user: alertUser || 'Anónimo',
      amount: alertAmount || '$100.00',
      message: alertMsg || 'Trolleando el stream...'
    });
  };

  const playSound = (soundName) => {
    alert(`(Simulación) Reproduciendo sonido: ${soundName}`);
  };

  const sendChatMessage = () => {
    alert('(Simulación) Comando enviado al chat del Streamer.');
  };

  return (
    <div className="app-container">
      <div className="sidebar" style={{ overflowY: 'auto' }}>
        <div className="logo-container">
          <div className="logo-icon">ST</div>
          <div className="logo-text">StreamTroll</div>
        </div>
        
        <div style={{ marginBottom: '1rem', background: 'rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '10px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Licencia actual:</span>
          <div style={{ fontWeight: 'bold', color: version === 'Ultimate' ? '#fbbf24' : '#a1a1aa' }}>
            {version === 'Ultimate' ? '👑 Ultimate' : '🆓 Free'}
          </div>
        </div>

        <div className="nav-links">
          <div className={`nav-item ${activeTab === 'gift-triggers' ? 'active' : ''}`} onClick={() => setActiveTab('gift-triggers')}>🎁 Mapeo de Regalos</div>
          <div className={`nav-item ${activeTab === 'shaders' ? 'active' : ''}`} onClick={() => setActiveTab('shaders')}>✨ Shaders y Efectos</div>
          <div className={`nav-item ${activeTab === 'alertas' ? 'active' : ''}`} onClick={() => setActiveTab('alertas')}>💸 Alertas Fake</div>
          <div className={`nav-item ${activeTab === 'soundboard' ? 'active' : ''}`} onClick={() => setActiveTab('soundboard')}>🔊 Soundboard</div>
          <div className={`nav-item ${activeTab === 'chatbot' ? 'active' : ''}`} onClick={() => setActiveTab('chatbot')}>🤖 Chat Bot</div>
          <div className={`nav-item ${activeTab === 'config' ? 'active' : ''}`} onClick={() => setActiveTab('config')}>⚙️ Configuración</div>
          <div className={`nav-item ${activeTab === 'overlay' ? 'active' : ''}`} onClick={() => setActiveTab('overlay')}>🖥️ Overlay (OBS)</div>
          <div className={`nav-item ${activeTab === 'upgrade' ? 'active' : ''}`} onClick={() => setActiveTab('upgrade')}>💎 Upgrade</div>
        </div>
      </div>

      <div className="main-content">
        <div className="header">
          <h1>Panel de Control Principal</h1>
          <p>La herramienta definitiva para trollear y automatizar interacciones en tu stream.</p>
        </div>

        <div className="glass-panel">
          
          {activeTab === 'gift-triggers' && (
            <div>
              <h2>🎁 Mapeo de Regalos (Gift Triggers)</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                <strong>Función:</strong> Detecta automáticamente cuando un espectador envía un regalo específico en TikTok Live y ejecuta un efecto visual en el OBS sin que tengas que presionar nada.
              </p>
              <div className="grid-container" style={{ marginBottom: '2rem' }}>
                <div className="feature-card">
                  <div className="input-group">
                    <label>Regalo de TikTok</label>
                    <select className="input-field"><option>🌹 Rosa</option><option>🐼 Panda</option></select>
                  </div>
                  <div className="input-group">
                    <label>Efecto Visual a Lanzar</label>
                    <select className="input-field"><option>Drunk (Mareo)</option><option>Mirror</option></select>
                  </div>
                  <button className="btn" style={{ width: '100%' }}>Guardar Mapeo</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shaders' && (
            <div>
              <h2>✨ Catálogo de Efectos (Shaders en pantalla)</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                <strong>Función:</strong> Aplica filtros temporales que deforman o alteran lo que se ve en la transmisión usando CSS y aceleración gráfica. Presiona "Probar" para enviarlo al Overlay.
              </p>
              <div className="grid-container">
                <div className="feature-card">
                  <div className="feature-icon">🥴</div>
                  <div className="feature-title">Drunk</div>
                  <p className="feature-desc">Distorsión de pantalla con efecto de mareo y movimiento fluido.</p>
                  <button className="btn btn-secondary" style={{ marginTop: '1rem', width: '100%' }} onClick={() => sendEffect('drunk')}>Probar Drunk</button>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🪞</div>
                  <div className="feature-title">Mirror / Flip</div>
                  <p className="feature-desc">Invierte la pantalla horizontalmente para confundir la visión.</p>
                  <button className="btn btn-secondary" style={{ marginTop: '1rem', width: '100%' }} onClick={() => sendEffect('mirror')}>Probar Mirror</button>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">👾</div>
                  <div className="feature-title">Glitch Retro</div>
                  <p className="feature-desc">Artefactos visuales y aberración cromática simulando un fallo.</p>
                  <button className="btn btn-secondary" style={{ marginTop: '1rem', width: '100%' }} onClick={() => sendEffect('glitch')}>Probar Glitch</button>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">💥</div>
                  <div className="feature-title">Flashbang (Cegador)</div>
                  <p className="feature-desc">Ilumina toda la pantalla de blanco puro, dejándola completamente cegada.</p>
                  <button className="btn btn-secondary" style={{ marginTop: '1rem', width: '100%' }} onClick={() => sendEffect('flashbang')}>Probar Flashbang</button>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🟩</div>
                  <div className="feature-title">Game Boy</div>
                  <p className="feature-desc">Tonalidad verde monocromática y alto contraste tipo consola clásica.</p>
                  <button className="btn btn-secondary" style={{ marginTop: '1rem', width: '100%' }} onClick={() => sendEffect('gameboy')}>Probar Game Boy</button>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">☯️</div>
                  <div className="feature-title">Invert (Colores)</div>
                  <p className="feature-desc">Invierte todos los colores de la pantalla como si fuera un negativo fotográfico.</p>
                  <button className="btn btn-secondary" style={{ marginTop: '1rem', width: '100%' }} onClick={() => sendEffect('invert')}>Probar Invert</button>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🌋</div>
                  <div className="feature-title">Earthquake (Temblor)</div>
                  <p className="feature-desc">Agita violentamente toda la pantalla simulando un fuerte terremoto.</p>
                  <button className="btn btn-secondary" style={{ marginTop: '1rem', width: '100%' }} onClick={() => sendEffect('earthquake')}>Probar Temblor</button>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">👓</div>
                  <div className="feature-title">Blur (Miopía)</div>
                  <p className="feature-desc">Aplica un desenfoque intenso que hace imposible leer o jugar correctamente.</p>
                  <button className="btn btn-secondary" style={{ marginTop: '1rem', width: '100%' }} onClick={() => sendEffect('blur')}>Probar Blur</button>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🎞️</div>
                  <div className="feature-title">Sepia Vintage</div>
                  <p className="feature-desc">Aplica un filtro sepia antiguo, dándole aspecto de película del siglo pasado.</p>
                  <button className="btn btn-secondary" style={{ marginTop: '1rem', width: '100%' }} onClick={() => sendEffect('vintage')}>Probar Sepia</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'alertas' && (
            <div>
              <h2>💸 Generador de Alertas Falsas</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                <strong>Función:</strong> Envía notificaciones de donaciones masivas o suscripciones que aparecen directamente en la pantalla para sorprender al creador.
              </p>
              <div className="grid-container">
                <div className="input-group">
                  <label>Nombre del Usuario Falso</label>
                  <input type="text" className="input-field" placeholder="Ej: MrBeast" onChange={(e)=>setAlertUser(e.target.value)}/>
                </div>
                <div className="input-group">
                  <label>Monto de la Donación</label>
                  <input type="text" className="input-field" placeholder="Ej: $10,000" onChange={(e)=>setAlertAmount(e.target.value)}/>
                </div>
              </div>
              <div className="input-group">
                <label>Mensaje Personalizado</label>
                <input type="text" className="input-field" placeholder="Ej: Cómprate una mansión con esto..." onChange={(e)=>setAlertMsg(e.target.value)}/>
              </div>
              <button className="btn" onClick={sendAlert}>Lanzar Alerta al Overlay</button>
            </div>
          )}

          {activeTab === 'soundboard' && (
            <div>
              <h2>🔊 Soundboard Interactivo</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                <strong>Función:</strong> Reproduce efectos de sonido molestos o graciosos directamente en el escritorio para que el micrófono o la transmisión los capten.
              </p>
              <div className="grid-container">
                <div className="feature-card" onClick={() => playSound('Screamer')}>
                  <div className="feature-icon">😱</div>
                  <div className="feature-title">Screamer Fuerte</div>
                </div>
                <div className="feature-card" onClick={() => playSound('Puerta')}>
                  <div className="feature-icon">🚪</div>
                  <div className="feature-title">Tocan la Puerta</div>
                </div>
                <div className="feature-card" onClick={() => playSound('FBI')}>
                  <div className="feature-icon">🚨</div>
                  <div className="feature-title">Alarma FBI</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chatbot' && (
            <div>
              <h2>🤖 Bot de Chat (Spam Controlado)</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                <strong>Función:</strong> Inyecta comandos o mensajes directamente en el chat en vivo simulando ser el sistema.
              </p>
              <div className="input-group">
                <label>Comando o Mensaje</label>
                <input type="text" className="input-field" placeholder="Ej: /timeout streamer 60" />
              </div>
              <button className="btn" onClick={sendChatMessage}>Ejecutar en el Chat</button>
            </div>
          )}

          {activeTab === 'config' && (
            <div>
              <h2>⚙️ Configuración de Parámetros</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                <strong>Función:</strong> Ajusta cómo reacciona el sistema ante envíos múltiples.
              </p>
              <div className="grid-container">
                <div className="feature-card">
                  <div className="input-group">
                    <label>Duración por activación (Segundos)</label>
                    <input type="number" className="input-field" defaultValue={10} min={1} max={60} />
                  </div>
                </div>
                <div className="feature-card">
                  <div className="input-group">
                    <label>Cola de Eventos Múltiples</label>
                    <select className="input-field">
                      <option>Ejecutar en orden (Espera en cola)</option>
                      <option>Sobrescribir actual</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'overlay' && (
            <div>
              <h2>🖥️ Configuración del Overlay (OBS)</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                <strong>Instrucciones:</strong> Copia esta URL y añádela como "Browser Source" o "Fuente de Navegador" en OBS Studio. 
              </p>
              <div className="input-group">
                <label>URL Fuente de Navegador</label>
                <input type="text" className="input-field" readOnly value="http://localhost:5173/#/overlay" />
              </div>
              <a href="/#/overlay" target="_blank" className="btn" style={{textDecoration: 'none', display: 'inline-block'}}>Abrir Overlay en nueva pestaña</a>
            </div>
          )}

          {activeTab === 'upgrade' && (
            <div>
              <h2>💎 Comparativa de Versiones</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Aumenta tus capacidades de trolleo adquiriendo la versión Ultimate.
              </p>
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div className="feature-card" style={{ flex: 1, border: version === 'Free' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)' }}>
                  <h3>🆓 Versión Free</h3>
                  <ul style={{ padding: '1rem 0 1rem 1.5rem', color: 'var(--text-secondary)' }}>
                    <li>Máximo 3 configuraciones simultáneas (Mapeos)</li>
                    <li>Filtros básicos de prueba</li>
                    <li>Soporte Estándar</li>
                  </ul>
                  <button className="btn btn-secondary" style={{ width: '100%', marginTop: '1rem' }} onClick={() => setVersion('Free')}>Usar Versión Free</button>
                </div>
                <div className="feature-card" style={{ flex: 1, border: version === 'Ultimate' ? '2px solid #fbbf24' : '1px solid var(--border-color)', background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.05), transparent)' }}>
                  <h3 style={{ color: '#fbbf24' }}>👑 Versión Ultimate</h3>
                  <ul style={{ padding: '1rem 0 1rem 1.5rem', color: 'var(--text-secondary)' }}>
                    <li>Configuraciones de Mapeos Ilimitados</li>
                    <li>Catálogo completo: Más de 9 efectos (PS1, GameBoy, Drunk, Flashbang, etc.)</li>
                    <li>Soporte Prioritario</li>
                  </ul>
                  <button className="btn" style={{ width: '100%', marginTop: '1rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)' }} onClick={() => setVersion('Ultimate')}>Suscribirse a Ultimate</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
