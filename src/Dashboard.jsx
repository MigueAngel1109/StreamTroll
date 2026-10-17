import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const channel = new BroadcastChannel('stream_troll_channel');

const DEFAULT_MAPPINGS = [
  {
    id: 'map-1',
    type: 'gift',
    giftName: '🌹 Rosa',
    customGiftName: '',
    minCoins: 1,
    effect: 'drunk',
    duration: 6,
    tts: false,
    enabled: true
  },
  {
    id: 'map-2',
    type: 'gift',
    giftName: '🐼 Panda',
    customGiftName: '',
    minCoins: 199,
    effect: 'gameboy',
    duration: 8,
    tts: true,
    enabled: true
  },
  {
    id: 'map-3',
    type: 'gift',
    giftName: '🦁 León',
    customGiftName: '',
    minCoins: 29999,
    effect: 'flashbang',
    duration: 8,
    tts: true,
    enabled: true
  },
  {
    id: 'map-4',
    type: 'coins',
    giftName: '',
    customGiftName: '',
    minCoins: 500,
    effect: 'earthquake',
    duration: 7,
    tts: true,
    enabled: true
  }
];

const PRESET_GIFTS = [
  '🌹 Rosa (1 Moneda)',
  '🍦 Helado (1 Moneda)',
  '💖 Corazón (10 Monedas)',
  '🍩 Dona (30 Monedas)',
  '🧢 Gorra y Bigote (99 Monedas)',
  '🐼 Panda (199 Monedas)',
  '👑 Corona (500 Monedas)',
  '🦢 Cisne (699 Monedas)',
  '🎆 Fuegos Artificiales (1088 Monedas)',
  '🚀 Cohete Espacial (2000 Monedas)',
  '🏎️ Auto Deportivo (7000 Monedas)',
  '🦁 León (29999 Monedas)',
  '🌌 Universo (34999 Monedas)',
  '✍️ Otro / Personalizado (Escribir nombre)'
];

const AVAILABLE_EFFECTS = [
  { id: 'drunk', name: '🥴 Drunk (Mareo)', free: true },
  { id: 'mirror', name: '🪞 Mirror / Flip', free: true },
  { id: 'blur', name: '👓 Blur (Miopía)', free: true },
  { id: 'glitch', name: '👾 Glitch Retro', free: false },
  { id: 'flashbang', name: '💥 Flashbang (Cegador)', free: false },
  { id: 'gameboy', name: '🟩 Game Boy', free: false },
  { id: 'invert', name: '☯️ Invert (Colores)', free: false },
  { id: 'earthquake', name: '🌋 Earthquake (Temblor)', free: false },
  { id: 'vintage', name: '🎞️ Sepia Vintage', free: false },
];

function Dashboard() {
  const [activeTab, setActiveTab] = useState('gift-triggers');
  const [version, setVersion] = useState('Ultimate');
  const [tiktokUser, setTiktokUser] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  // Mappings state
  const [mappings, setMappings] = useState(() => {
    try {
      const saved = localStorage.getItem('stream_troll_mappings');
      return saved ? JSON.parse(saved) : DEFAULT_MAPPINGS;
    } catch {
      return DEFAULT_MAPPINGS;
    }
  });

  // Activity Feed
  const [activityFeed, setActivityFeed] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  // Simulator State
  const [simGift, setSimGift] = useState('🌹 Rosa');
  const [simCustomGift, setSimCustomGift] = useState('');
  const [simCoins, setSimCoins] = useState(1);
  const [simUser, setSimUser] = useState('TrollGamer99');

  // Fake Alert State
  const [alertUser, setAlertUser] = useState('');
  const [alertAmount, setAlertAmount] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [useTTS, setUseTTS] = useState(false);

  // Check if running inside Electron
  const isElectron = typeof window !== 'undefined' && (window.process?.type || window.require);
  const ipcRendererRef = useRef(null);

  useEffect(() => {
    if (isElectron && window.require) {
      try {
        const { ipcRenderer } = window.require('electron');
        ipcRendererRef.current = ipcRenderer;

        // Listen for live TikTok gifts from Electron main process
        const handleTiktokGift = (event, giftData) => {
          handleIncomingGift({
            user: giftData.user,
            giftName: giftData.giftName,
            diamondCount: giftData.diamondCount,
            repeatCount: giftData.repeatCount
          });
        };

        const handleTiktokStatus = (event, status) => {
          setIsConnected(status.connected);
          setConnectionStatus(status.message);
        };

        ipcRenderer.on('tiktok:gift', handleTiktokGift);
        ipcRenderer.on('tiktok:status', handleTiktokStatus);

        return () => {
          ipcRenderer.removeListener('tiktok:gift', handleTiktokGift);
          ipcRenderer.removeListener('tiktok:status', handleTiktokStatus);
        };
      } catch (err) {
        console.warn('IPC setup error:', err);
      }
    }
  }, [mappings]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const saveMappings = (updated) => {
    const dataToSave = updated || mappings;
    setMappings([...dataToSave]);
    localStorage.setItem('stream_troll_mappings', JSON.stringify(dataToSave));
    showToast('💾 ¡Mapeos guardados correctamente!');
  };

  const resetMappings = () => {
    if (confirm('¿Restaurar los mapeos predeterminados? Se perderán las personalizaciones actuales.')) {
      setMappings(DEFAULT_MAPPINGS);
      localStorage.setItem('stream_troll_mappings', JSON.stringify(DEFAULT_MAPPINGS));
      showToast('🔄 Mapeos restaurados');
    }
  };

  const addMapping = () => {
    const newMap = {
      id: `map-${Date.now()}`,
      type: 'gift',
      giftName: '🌹 Rosa (1 Moneda)',
      customGiftName: '',
      minCoins: 10,
      effect: 'drunk',
      duration: 6,
      tts: false,
      enabled: true
    };
    const updated = [...mappings, newMap];
    saveMappings(updated);
  };

  const updateMapping = (id, field, value) => {
    const updated = mappings.map((m) => (m.id === id ? { ...m, [field]: value } : m));
    setMappings(updated);
  };

  const deleteMapping = (id) => {
    const updated = mappings.filter((m) => m.id !== id);
    saveMappings(updated);
  };

  const sendEffect = (effectName, durationSec = 8) => {
    channel.postMessage({
      type: 'SHADER',
      effect: effectName,
      duration: durationSec * 1000
    });
  };

  // TRIGGER ENGINE: Maps gifts or coins to triggers
  const handleIncomingGift = (giftEvent) => {
    const { user, giftName, diamondCount, repeatCount = 1 } = giftEvent;
    const totalCoins = (diamondCount || 0) * repeatCount;
    const cleanGiftName = giftName.toLowerCase().trim();

    let matched = false;

    mappings.forEach((m) => {
      if (!m.enabled) return;

      let isMatch = false;

      if (m.type === 'gift') {
        let targetName = m.giftName;
        if (targetName.includes('Otro') || targetName.includes('Personalizado')) {
          targetName = m.customGiftName;
        } else {
          // Extract base name e.g. "🌹 Rosa (1 Moneda)" -> "rosa"
          targetName = targetName.replace(/^[^\w\s]+/, '').split('(')[0].trim().toLowerCase();
        }

        if (targetName && (cleanGiftName.includes(targetName) || targetName.includes(cleanGiftName))) {
          isMatch = true;
        }
      } else if (m.type === 'coins') {
        if (totalCoins >= Number(m.minCoins)) {
          isMatch = true;
        }
      }

      if (isMatch) {
        matched = true;
        // Trigger Shader
        sendEffect(m.effect, m.duration);

        // Optional TTS Alert
        if (m.tts) {
          channel.postMessage({
            type: 'ALERT',
            user: user || 'Espectador',
            amount: `${totalCoins} 🪙`,
            message: `¡Envió ${giftName}! Shader ${m.effect.toUpperCase()} activado`,
            tts: true
          });
        }

        // Add to activity feed
        setActivityFeed((prev) => [
          {
            id: Date.now() + Math.random(),
            time: new Date().toLocaleTimeString(),
            user,
            giftName,
            coins: totalCoins,
            effect: m.effect,
            duration: m.duration,
            rule: m.type === 'gift' ? `Regalo: ${m.giftName}` : `>= ${m.minCoins} Monedas`
          },
          ...prev.slice(0, 14)
        ]);
      }
    });

    if (!matched) {
      setActivityFeed((prev) => [
        {
          id: Date.now() + Math.random(),
          time: new Date().toLocaleTimeString(),
          user,
          giftName,
          coins: totalCoins,
          unmatched: true
        },
        ...prev.slice(0, 14)
      ]);
    }
  };

  // Connect to TikTok Live
  const connectTikTok = async () => {
    if (!tiktokUser.trim()) {
      alert('Ingresa un usuario válido de TikTok (ej: @streamer)');
      return;
    }

    setIsConnecting(true);

    if (ipcRendererRef.current) {
      try {
        const res = await ipcRendererRef.current.invoke('tiktok:connect', tiktokUser);
        setIsConnecting(false);
        if (res.success) {
          setIsConnected(true);
          setConnectionStatus(`🟢 Conectado en vivo al directo de @${res.username}`);
          showToast(`¡Conexión nativa con @${res.username} activa!`);
        } else {
          setIsConnected(false);
          setConnectionStatus(`🔴 Error: ${res.error}`);
          alert(`Error de conexión: ${res.error}`);
        }
      } catch (err) {
        setIsConnecting(false);
        alert(`Error al invocar conexión en Electron: ${err.message}`);
      }
    } else {
      // Browser / Web mode (Vercel)
      setTimeout(() => {
        setIsConnecting(false);
        setIsConnected(true);
        setConnectionStatus(`🟢 Modo Web / Simulación Activo para @${tiktokUser}`);
        showToast('¡Modo simulación web activo! Usa el panel de prueba.');
      }, 800);
    }
  };

  const disconnectTikTok = async () => {
    if (ipcRendererRef.current) {
      await ipcRendererRef.current.invoke('tiktok:disconnect');
    }
    setIsConnected(false);
    setConnectionStatus('🔴 Desconectado');
    showToast('Desconectado de TikTok Live');
  };

  // Sound effects generator via Web Audio API
  const playSoundEffect = (type) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'fbi') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.8);
      } else if (type === 'screamer') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
        osc.frequency.setValueAtTime(300, audioCtx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.6);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      }
      showToast(`🔊 Reproduciendo: ${type.toUpperCase()}`);
    } catch {
      alert(`Reproduciendo sonido: ${type}`);
    }
  };

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toastMessage && <div className="toast-success">{toastMessage}</div>}

      {/* Sidebar */}
      <div className="sidebar" style={{ overflowY: 'auto' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="logo-container">
            <div className="logo-icon">ST</div>
            <div className="logo-text">StreamTroll</div>
          </div>
        </Link>

        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '10px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Licencia actual:</span>
          <div style={{ fontWeight: 'bold', color: version === 'Ultimate' ? '#fbbf24' : '#a1a1aa' }}>
            {version === 'Ultimate' ? '👑 Ultimate (Ilimitado)' : '🆓 Free'}
          </div>
        </div>

        <div className="nav-links">
          <div className={`nav-item ${activeTab === 'gift-triggers' ? 'active' : ''}`} onClick={() => setActiveTab('gift-triggers')}>
            🎁 Mapeo de Regalos
          </div>
          <div className={`nav-item ${activeTab === 'conexion' ? 'active' : ''}`} onClick={() => setActiveTab('conexion')}>
            📡 Conexión (TikTok Live)
          </div>
          <div className={`nav-item ${activeTab === 'shaders' ? 'active' : ''}`} onClick={() => setActiveTab('shaders')}>
            ✨ Shaders y Efectos
          </div>
          <div className={`nav-item ${activeTab === 'alertas' ? 'active' : ''}`} onClick={() => setActiveTab('alertas')}>
            💸 Alertas Fake & TTS
          </div>
          <div className={`nav-item ${activeTab === 'soundboard' ? 'active' : ''}`} onClick={() => setActiveTab('soundboard')}>
            🔊 Soundboard
          </div>
          <div className={`nav-item ${activeTab === 'overlay' ? 'active' : ''}`} onClick={() => setActiveTab('overlay')}>
            🖥️ Overlay (OBS Studio)
          </div>
          <div className={`nav-item ${activeTab === 'upgrade' ? 'active' : ''}`} onClick={() => setActiveTab('upgrade')}>
            💎 Suscripción
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1>Panel de Control Principal</h1>
            <p>Automatiza triggers de regalos, shaders de troleo y alertas para tu directo.</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className={`badge ${isConnected ? 'badge-success' : 'badge-warning'}`}>
              {isConnected ? '🟢 LIVE CONECTADO' : '⚪ EN ESPERA'}
            </span>
          </div>
        </div>

        <div className="glass-panel">
          {/* TAB 1: GIFT TRIGGERS */}
          {activeTab === 'gift-triggers' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2>🎁 Mapeo Universal de Regalos (Gift Triggers)</h2>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Asocia <strong>cualquier regalo de TikTok</strong> o un <strong>umbral de monedas</strong> a un shader visual que se activará en tu OBS automáticamente.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  <button className="btn btn-secondary" onClick={resetMappings}>
                    🔄 Restaurar
                  </button>
                  <button className="btn btn-success" onClick={() => saveMappings()}>
                    💾 Guardar Mapeos
                  </button>
                </div>
              </div>

              {/* TESTER / SIMULATOR BANNER */}
              <div style={{ background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '14px', padding: '1.25rem', marginBottom: '2rem' }}>
                <h4 style={{ color: '#c084fc', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  ⚡ Probador de Triggers en Tiempo Real
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  Simula la llegada de cualquier regalo para comprobar que tus reglas de mapeo lo reconozcan y disparen el efecto:
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.8rem', alignItems: 'flex-end' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Regalo</label>
                    <select className="input-field" value={simGift} onChange={(e) => setSimGift(e.target.value)}>
                      {PRESET_GIFTS.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  {simGift.includes('Otro') && (
                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Nombre del Regalo</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Ej: Halcón, Cisne, etc."
                        value={simCustomGift}
                        onChange={(e) => setSimCustomGift(e.target.value)}
                      />
                    </div>
                  )}

                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Monedas equivalentes</label>
                    <input
                      type="number"
                      className="input-field"
                      min={1}
                      value={simCoins}
                      onChange={(e) => setSimCoins(Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Usuario donador</label>
                    <input
                      type="text"
                      className="input-field"
                      value={simUser}
                      onChange={(e) => setSimUser(e.target.value)}
                    />
                  </div>

                  <button
                    className="btn"
                    style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', height: '42px' }}
                    onClick={() => {
                      const finalGiftName = simGift.includes('Otro') ? (simCustomGift || 'Regalo Especial') : simGift.split('(')[0].trim();
                      handleIncomingGift({
                        user: simUser,
                        giftName: finalGiftName,
                        diamondCount: simCoins,
                        repeatCount: 1
                      });
                      showToast(`Simulando regalo: ${finalGiftName} (${simCoins} 🪙)`);
                    }}
                  >
                    🚀 Disparar Prueba
                  </button>
                </div>
              </div>

              {/* LIST OF ACTIVE MAPPINGS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {mappings.map((map, index) => (
                  <div
                    key={map.id}
                    className="feature-card"
                    style={{
                      padding: '1.25rem',
                      borderLeft: map.enabled ? '4px solid #10b981' : '4px solid #6b7280',
                      opacity: map.enabled ? 1 : 0.6
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#fbbf24' }}>
                          Regla #{index + 1}
                        </span>
                        <span className={`badge ${map.enabled ? 'badge-success' : 'badge-warning'}`}>
                          {map.enabled ? 'ACTIVA' : 'PAUSADA'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <label className="switch" title="Activar/Desactivar regla">
                          <input
                            type="checkbox"
                            checked={map.enabled}
                            onChange={(e) => updateMapping(map.id, 'enabled', e.target.checked)}
                          />
                          <span className="slider"></span>
                        </label>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                          onClick={() => {
                            sendEffect(map.effect, map.duration);
                            showToast(`Simulando efecto: ${map.effect}`);
                          }}
                        >
                          👁️ Probar
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                          onClick={() => deleteMapping(map.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      {/* Trigger Type */}
                      <div className="input-group" style={{ marginBottom: 0 }}>
                        <label>Tipo de Condición</label>
                        <select
                          className="input-field"
                          value={map.type}
                          onChange={(e) => updateMapping(map.id, 'type', e.target.value)}
                        >
                          <option value="gift">🎁 Por Regalo Específico</option>
                          <option value="coins">🪙 Por Mínimo de Monedas</option>
                        </select>
                      </div>

                      {/* Gift Selector or Coin Threshold */}
                      {map.type === 'gift' ? (
                        <div className="input-group" style={{ marginBottom: 0 }}>
                          <label>Regalo de TikTok</label>
                          <select
                            className="input-field"
                            value={map.giftName}
                            onChange={(e) => updateMapping(map.id, 'giftName', e.target.value)}
                          >
                            {PRESET_GIFTS.map((g) => (
                              <option key={g} value={g}>{g}</option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <div className="input-group" style={{ marginBottom: 0 }}>
                          <label>Monedas Mínimas Requeridas</label>
                          <input
                            type="number"
                            className="input-field"
                            min={1}
                            value={map.minCoins}
                            onChange={(e) => updateMapping(map.id, 'minCoins', Number(e.target.value))}
                          />
                        </div>
                      )}

                      {/* Custom Gift Name Input if selected */}
                      {map.type === 'gift' && map.giftName.includes('Otro') && (
                        <div className="input-group" style={{ marginBottom: 0 }}>
                          <label>Nombre Exacto del Regalo</label>
                          <input
                            type="text"
                            className="input-field"
                            placeholder="Ej: Cisne, León, Galaxia..."
                            value={map.customGiftName || ''}
                            onChange={(e) => updateMapping(map.id, 'customGiftName', e.target.value)}
                          />
                        </div>
                      )}

                      {/* Effect Selector */}
                      <div className="input-group" style={{ marginBottom: 0 }}>
                        <label>Efecto Visual (Shader)</label>
                        <select
                          className="input-field"
                          value={map.effect}
                          onChange={(e) => updateMapping(map.id, 'effect', e.target.value)}
                        >
                          {AVAILABLE_EFFECTS.map((eff) => (
                            <option key={eff.id} value={eff.id}>
                              {eff.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Duration */}
                      <div className="input-group" style={{ marginBottom: 0 }}>
                        <label>Duración (Segundos)</label>
                        <select
                          className="input-field"
                          value={map.duration}
                          onChange={(e) => updateMapping(map.id, 'duration', Number(e.target.value))}
                        >
                          <option value={3}>3 segundos</option>
                          <option value={5}>5 segundos</option>
                          <option value={8}>8 segundos</option>
                          <option value={10}>10 segundos</option>
                          <option value={15}>15 segundos</option>
                        </select>
                      </div>

                      {/* TTS Checkbox */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
                        <input
                          type="checkbox"
                          id={`tts-${map.id}`}
                          checked={map.tts}
                          onChange={(e) => updateMapping(map.id, 'tts', e.target.checked)}
                          style={{ width: '18px', height: '18px' }}
                        />
                        <label htmlFor={`tts-${map.id}`} style={{ margin: 0, fontSize: '0.9rem', cursor: 'pointer' }}>
                          🗣️ Voz TTS
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ADD NEW RULE BUTTON */}
              <button
                className="btn btn-secondary"
                style={{ width: '100%', padding: '1rem', borderStyle: 'dashed', marginBottom: '2.5rem' }}
                onClick={addMapping}
              >
                ➕ Añadir Nueva Regla de Mapeo
              </button>

              {/* LIVE ACTIVITY FEED */}
              <div>
                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  📡 Registro de Regalos Detectados en Vivo
                </h3>
                {activityFeed.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.9rem' }}>
                    Aún no se han recibido regalos. Usa el probador arriba o conecta tu directo de TikTok.
                  </p>
                ) : (
                  <div className="live-feed-box">
                    {activityFeed.map((item) => (
                      <div key={item.id} className="live-feed-item">
                        <div>
                          <strong style={{ color: '#60a5fa' }}>{item.time}</strong> — 
                          <span style={{ color: '#fbbf24', marginLeft: '0.4rem' }}>{item.user}</span> envió{' '}
                          <strong>{item.giftName}</strong> ({item.coins} 🪙)
                        </div>
                        <div>
                          {item.unmatched ? (
                            <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Sin regla asignada</span>
                          ) : (
                            <span className="badge badge-success">
                              Shader: {item.effect} ({item.duration}s)
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: TIKTOK CONNECTION */}
          {activeTab === 'conexion' && (
            <div>
              <h2>📡 Conexión Nativa (TikTok Live)</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Monitorea tu transmisión en directo para recibir los regalos de los espectadores sin programas intermediarios.
              </p>

              <div className="feature-card" style={{ border: isConnected ? '2px solid #10b981' : '1px solid var(--border-color)', marginBottom: '2rem' }}>
                <div className="input-group">
                  <label>Nombre de Usuario de TikTok (sin necesidad de contraseña)</label>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="@tu_usuario_de_tiktok"
                      value={tiktokUser}
                      onChange={(e) => setTiktokUser(e.target.value)}
                      disabled={isConnected || isConnecting}
                      style={{ flex: 1, minWidth: '240px' }}
                    />
                    <button
                      className="btn"
                      style={{
                        background: isConnected ? '#ef4444' : 'linear-gradient(135deg, var(--accent-primary), var(--accent-hover))',
                        minWidth: '160px'
                      }}
                      onClick={isConnected ? disconnectTikTok : connectTikTok}
                      disabled={isConnecting}
                    >
                      {isConnecting ? 'Conectando...' : isConnected ? 'Desconectar' : 'Conectar al Live'}
                    </button>
                  </div>
                </div>

                {connectionStatus && (
                  <div style={{ marginTop: '0.8rem', color: isConnected ? '#10b981' : '#f87171', fontWeight: 'bold' }}>
                    {connectionStatus}
                  </div>
                )}

                {!isElectron && (
                  <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6', borderRadius: '10px' }}>
                    <p style={{ fontSize: '0.9rem', color: '#93c5fd' }}>
                      💡 <strong>Estás en la versión Web:</strong> El navegador web permite probar y mapear todos los regalos usando el Simulador. Para escuchar eventos WebSocket de TikTok directamente en segundo plano durante tus partidas, utiliza la <strong>App de Escritorio para Windows</strong>.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SHADERS */}
          {activeTab === 'shaders' && (
            <div>
              <h2>✨ Catálogo Completo de Shaders Visuales</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Efectos temporales acelerados por hardware para alterar la transmisión de OBS. Haz clic en "Probar" para verlos en tu Overlay.
              </p>
              <div className="grid-container">
                {AVAILABLE_EFFECTS.map((eff) => (
                  <div key={eff.id} className="feature-card">
                    <div className="feature-title">{eff.name}</div>
                    <button
                      className="btn btn-secondary"
                      style={{ marginTop: '1rem', width: '100%' }}
                      onClick={() => {
                        sendEffect(eff.id, 6);
                        showToast(`Enviando efecto: ${eff.id}`);
                      }}
                    >
                      Probar en Overlay
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ALERTAS & TTS */}
          {activeTab === 'alertas' && (
            <div>
              <h2>💸 Alertas Falsas y Voz TTS</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Lanza notificaciones con diseño de donación o activa el narrador de voz en el directo.
              </p>
              <div className="grid-container">
                <div className="input-group">
                  <label>Nombre del Donador</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Ej: ElonMusk"
                    value={alertUser}
                    onChange={(e) => setAlertUser(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label>Monto</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Ej: $5,000 USD"
                    value={alertAmount}
                    onChange={(e) => setAlertAmount(e.target.value)}
                  />
                </div>
              </div>
              <div className="input-group">
                <label>Mensaje que leerá el TTS</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ej: Te dono esto para que compres mejores manos en el juego..."
                  value={alertMsg}
                  onChange={(e) => setAlertMsg(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2rem' }}>
                <input
                  type="checkbox"
                  id="tts-main"
                  checked={useTTS}
                  onChange={(e) => setUseTTS(e.target.checked)}
                  style={{ width: '18px', height: '18px' }}
                />
                <label htmlFor="tts-main" style={{ margin: 0, fontWeight: 'bold', cursor: 'pointer' }}>
                  🗣️ Activar Voz Narradora (Text-to-Speech)
                </label>
              </div>
              <button
                className="btn"
                onClick={() => {
                  channel.postMessage({
                    type: 'ALERT',
                    user: alertUser || 'Donador Misterioso',
                    amount: alertAmount || '$100.00',
                    message: alertMsg || 'Trolleando tu directo con StreamTroll...',
                    tts: useTTS
                  });
                  showToast('¡Alerta enviada al Overlay!');
                }}
              >
                🚀 Lanzar Alerta al Overlay
              </button>
            </div>
          )}

          {/* TAB 5: SOUNDBOARD */}
          {activeTab === 'soundboard' && (
            <div>
              <h2>🔊 Soundboard Instantáneo</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Reproduce efectos de audio molestos o cómicos directamente desde el navegador o la aplicación:
              </p>
              <div className="grid-container">
                <div className="feature-card" onClick={() => playSoundEffect('screamer')}>
                  <div className="feature-icon">😱</div>
                  <div className="feature-title">Screamer Agudo</div>
                  <button className="btn btn-secondary" style={{ marginTop: '0.5rem' }}>Reproducir</button>
                </div>
                <div className="feature-card" onClick={() => playSoundEffect('fbi')}>
                  <div className="feature-icon">🚨</div>
                  <div className="feature-title">Sirena FBI / Alarma</div>
                  <button className="btn btn-secondary" style={{ marginTop: '0.5rem' }}>Reproducir</button>
                </div>
                <div className="feature-card" onClick={() => playSoundEffect('knock')}>
                  <div className="feature-icon">🚪</div>
                  <div className="feature-title">Golpe / Tocar Puerta</div>
                  <button className="btn btn-secondary" style={{ marginTop: '0.5rem' }}>Reproducir</button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: OVERLAY SETUP */}
          {activeTab === 'overlay' && (
            <div>
              <h2>🖥️ Configuración del Overlay para OBS Studio</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Agrega esta URL como <strong>"Browser Source" (Fuente de Navegador)</strong> en OBS Studio:
              </p>

              <div className="feature-card" style={{ marginBottom: '2rem' }}>
                <div className="input-group">
                  <label>URL para OBS (Servidor Local Nativo en Windows):</label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                      type="text"
                      className="input-field"
                      readOnly
                      value="http://127.0.0.1:18923/#/overlay"
                    />
                    <button
                      className="btn"
                      onClick={() => {
                        navigator.clipboard.writeText('http://127.0.0.1:18923/#/overlay');
                        showToast('📋 ¡URL copiada al portapapeles!');
                      }}
                    >
                      Copiar
                    </button>
                  </div>
                </div>

                <div className="input-group">
                  <label>URL alternativa (Modo Web o Desarrollo Vite):</label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                      type="text"
                      className="input-field"
                      readOnly
                      value="http://localhost:5173/#/overlay"
                    />
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        navigator.clipboard.writeText('http://localhost:5173/#/overlay');
                        showToast('📋 ¡URL copiada al portapapeles!');
                      }}
                    >
                      Copiar
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <a
                    href="#/overlay"
                    target="_blank"
                    rel="noreferrer"
                    className="btn"
                    style={{ textDecoration: 'none' }}
                  >
                    Abrir Overlay en Pestaña Nueva
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: UPGRADE */}
          {activeTab === 'upgrade' && (
            <div>
              <h2>💎 Licencia y Planes</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Tu cuenta actualmente cuenta con acceso ilimitado.
              </p>
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div className="feature-card" style={{ flex: 1, border: '2px solid #fbbf24', background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.05), transparent)' }}>
                  <h3 style={{ color: '#fbbf24' }}>👑 Versión Ultimate Activa</h3>
                  <ul style={{ padding: '1rem 0 1rem 1.5rem', color: 'var(--text-secondary)' }}>
                    <li>Mapeos ilimitados por regalo y por monedas</li>
                    <li>Catálogo completo de 9 Shaders</li>
                    <li>Alertas TTS y audio en tiempo real</li>
                    <li>Conexión nativa con TikTok Live</li>
                  </ul>
                  <button className="btn btn-success" style={{ width: '100%', marginTop: '1rem' }}>
                    Licencia Activa
                  </button>
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
