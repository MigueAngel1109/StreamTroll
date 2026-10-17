import { useState } from 'react';
import { Link } from 'react-router-dom';

const channel = new BroadcastChannel('stream_troll_channel');

function Dashboard() {
  const [activeTab, setActiveTab] = useState('gift-triggers');
  const [version, setVersion] = useState('Free');
  const [alertUser, setAlertUser] = useState('');
  const [alertAmount, setAlertAmount] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [useTTS, setUseTTS] = useState(false);
  const [tiktokUser, setTiktokUser] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [mappingSlots, setMappingSlots] = useState([1, 2, 3]);

  const sendEffect = (effectName) => {
    channel.postMessage({ type: 'SHADER', effect: effectName, duration: 8000 });
  };

  const sendAlert = () => {
    channel.postMessage({
      type: 'ALERT',
      user: alertUser || 'Anónimo',
      amount: alertAmount || '$100.00',
      message: alertMsg || 'Trolleando el stream...',
      tts: useTTS
    });
  };

  const playSound = (soundName) => {
    alert(`(Simulación) Reproduciendo sonido: ${soundName}`);
  };

  const sendChatMessage = () => {
    alert('(Simulación) Comando enviado al chat del Streamer.');
  };

  const connectTikTok = () => {
    if (!tiktokUser) {
      alert('Ingresa un usuario válido de TikTok.');
      return;
    }
    setIsConnected(true);
    setTimeout(() => {
      alert(`¡Conexión nativa establecida con el directo de @${tiktokUser}! Escuchando eventos...`);
    }, 1000);
  };

  return (
    <div className="app-container">
      <div className="sidebar" style={{ overflowY: 'auto' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="logo-container">
            <div className="logo-icon">ST</div>
            <div className="logo-text">StreamTroll</div>
          </div>
        </Link>
        
        <div style={{ marginBottom: '1rem', background: 'rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '10px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Licencia actual:</span>
          <div style={{ fontWeight: 'bold', color: version === 'Ultimate' ? '#fbbf24' : '#a1a1aa' }}>
            {version === 'Ultimate' ? '👑 Ultimate' : '🆓 Free'}
          </div>
        </div>

        <div className="nav-links">
          <div className={`nav-item ${activeTab === 'conexion' ? 'active' : ''}`} onClick={() => setActiveTab('conexion')}>📡 Conexión (TikTok)</div>
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
          
          {activeTab === 'conexion' && (
            <div>
              <h2>📡 Conexión Nativa (TikTok Live)</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                <strong>Función:</strong> Enlaza la aplicación directamente con el servidor de TikTok sin usar software intermedio (TikFinity). Monitorea el chat y los regalos en tiempo real.
              </p>
              <div className="grid-container">
                <div className="feature-card" style={{ gridColumn: '1 / -1', border: isConnected ? '2px solid #10b981' : '1px solid var(--border-color)' }}>
                  <div className="input-group">
                    <label>Usuario de TikTok (Ej: @elrubiusOMG)</label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <input 
                        type="text" 
                        className="input-field" 
                        placeholder="@usuario" 
                        value={tiktokUser} 
                        onChange={(e) => setTiktokUser(e.target.value)} 
                        disabled={isConnected}
                      />
                      <button 
                        className="btn" 
                        style={{ background: isConnected ? '#ef4444' : 'linear-gradient(135deg, var(--accent-primary), var(--accent-hover))', minWidth: '150px' }}
                        onClick={() => {
                          if(isConnected) { setIsConnected(false); setTiktokUser(''); } 
                          else { connectTikTok(); }
                        }}
                      >
                        {isConnected ? 'Desconectar' : 'Conectar al Live'}
                      </button>
                    </div>
                  </div>
                  {isConnected && (
                    <div style={{ marginTop: '1rem', color: '#10b981', fontWeight: 'bold' }}>
                      🟢 Estado: Escuchando regalos del directo en tiempo real...
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gift-triggers' && (
            <div>
              <h2>🎁 Mapeo de Regalos (Gift Triggers)</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                <strong>Función:</strong> Detecta automáticamente cuando un espectador envía un regalo específico en TikTok Live y ejecuta un efecto visual en el OBS. Utiliza el botón "Simular" para probar tu configuración.
              </p>
              
              <div className="grid-container" style={{ marginBottom: '2rem' }}>
                {mappingSlots.map((slot) => (
                  <div key={slot} className="feature-card">
                    <h3 style={{ marginBottom: '1rem' }}>Mapeo #{slot}</h3>
                    <div className="input-group">
                      <label>Regalo de TikTok</label>
                      <select className="input-field" defaultValue={slot === 1 ? '🌹 Rosa' : slot === 2 ? '🐼 Panda' : '🦁 León'}>
                        <option>🌹 Rosa (1 Moneda)</option>
                        <option>🍦 Helado (1 Moneda)</option>
                        <option>💖 Corazón (10 Monedas)</option>
                        <option>🍩 Dona (30 Monedas)</option>
                        <option>🧢 Gorra y Bigote (99 Monedas)</option>
                        <option>🐼 Panda (199 Monedas)</option>
                        <option>🦁 León (29999 Monedas)</option>
                        <option>🌌 Universo (34999 Monedas)</option>
                      </select>
                    </div>
                    <div className="input-group">
                      <label>Efecto Visual a Lanzar</label>
                      <select className="input-field" id={`effect-select-${slot}`} defaultValue={slot === 1 ? 'drunk' : slot === 2 ? 'gameboy' : 'flashbang'}>
                        <option value="drunk">🥴 Drunk (Mareo)</option>
                        <option value="mirror">🪞 Mirror / Flip</option>
                        <option value="blur">👓 Blur (Miopía)</option>
                        <option value="glitch" disabled={version === 'Free'}>👾 Glitch Retro {version === 'Free' ? '(👑 Ultimate)' : ''}</option>
                        <option value="flashbang" disabled={version === 'Free'}>💥 Flashbang {version === 'Free' ? '(👑 Ultimate)' : ''}</option>
                        <option value="gameboy" disabled={version === 'Free'}>🟩 Game Boy {version === 'Free' ? '(👑 Ultimate)' : ''}</option>
                        <option value="invert" disabled={version === 'Free'}>☯️ Invert {version === 'Free' ? '(👑 Ultimate)' : ''}</option>
                        <option value="earthquake" disabled={version === 'Free'}>🌋 Earthquake {version === 'Free' ? '(👑 Ultimate)' : ''}</option>
                        <option value="vintage" disabled={version === 'Free'}>🎞️ Sepia Vintage {version === 'Free' ? '(👑 Ultimate)' : ''}</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button className="btn" style={{ flex: 1 }}>Guardar</button>
                      <button 
                        className="btn btn-secondary" 
                        style={{ flex: 1 }}
                        onClick={() => {
                          const effect = document.getElementById(`effect-select-${slot}`).value;
                          sendEffect(effect);
                        }}
                      >
                        Simular
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {version === 'Ultimate' && (
                <button 
                  className="btn" 
                  style={{ width: '100%', background: 'linear-gradient(135deg, #10b981, #059669)', marginBottom: '2rem' }}
                  onClick={() => setMappingSlots([...mappingSlots, mappingSlots.length + 1])}
                >
                  ➕ Añadir Nuevo Mapeo (Ilimitados)
                </button>
              )}
              {version === 'Free' && (
                <div style={{ padding: '1rem', background: 'rgba(236, 72, 153, 0.1)', border: '1px solid var(--accent-secondary)', borderRadius: '10px', textAlign: 'center', marginBottom: '2rem' }}>
                  <p><strong>Aviso:</strong> La versión Free permite máximo 3 configuraciones simultáneas. Actualiza a Ultimate para ilimitadas.</p>
                </div>
              )}
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
                  <button className="btn btn-secondary" style={{ marginTop: '1rem', width: '100%', opacity: version === 'Free' ? 0.5 : 1 }} disabled={version === 'Free'} onClick={() => sendEffect('glitch')}>{version === 'Free' ? '🔒 Requiere Ultimate' : 'Probar Glitch'}</button>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">💥</div>
                  <div className="feature-title">Flashbang (Cegador)</div>
                  <p className="feature-desc">Ilumina toda la pantalla de blanco puro, dejándola completamente cegada.</p>
                  <button className="btn btn-secondary" style={{ marginTop: '1rem', width: '100%', opacity: version === 'Free' ? 0.5 : 1 }} disabled={version === 'Free'} onClick={() => sendEffect('flashbang')}>{version === 'Free' ? '🔒 Requiere Ultimate' : 'Probar Flashbang'}</button>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🟩</div>
                  <div className="feature-title">Game Boy</div>
                  <p className="feature-desc">Tonalidad verde monocromática y alto contraste tipo consola clásica.</p>
                  <button className="btn btn-secondary" style={{ marginTop: '1rem', width: '100%', opacity: version === 'Free' ? 0.5 : 1 }} disabled={version === 'Free'} onClick={() => sendEffect('gameboy')}>{version === 'Free' ? '🔒 Requiere Ultimate' : 'Probar Game Boy'}</button>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">☯️</div>
                  <div className="feature-title">Invert (Colores)</div>
                  <p className="feature-desc">Invierte todos los colores de la pantalla como si fuera un negativo fotográfico.</p>
                  <button className="btn btn-secondary" style={{ marginTop: '1rem', width: '100%', opacity: version === 'Free' ? 0.5 : 1 }} disabled={version === 'Free'} onClick={() => sendEffect('invert')}>{version === 'Free' ? '🔒 Requiere Ultimate' : 'Probar Invert'}</button>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🌋</div>
                  <div className="feature-title">Earthquake (Temblor)</div>
                  <p className="feature-desc">Agita violentamente toda la pantalla simulando un fuerte terremoto.</p>
                  <button className="btn btn-secondary" style={{ marginTop: '1rem', width: '100%', opacity: version === 'Free' ? 0.5 : 1 }} disabled={version === 'Free'} onClick={() => sendEffect('earthquake')}>{version === 'Free' ? '🔒 Requiere Ultimate' : 'Probar Temblor'}</button>
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
                  <button className="btn btn-secondary" style={{ marginTop: '1rem', width: '100%', opacity: version === 'Free' ? 0.5 : 1 }} disabled={version === 'Free'} onClick={() => sendEffect('vintage')}>{version === 'Free' ? '🔒 Requiere Ultimate' : 'Probar Sepia'}</button>
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
              <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                <input type="checkbox" id="tts-check" checked={useTTS} onChange={(e) => setUseTTS(e.target.checked)} style={{ width: '18px', height: '18px' }} />
                <label htmlFor="tts-check" style={{ marginBottom: 0, color: 'var(--text-primary)', fontWeight: 'bold' }}>🗣️ Activar Voz Narradora (Text-to-Speech)</label>
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
