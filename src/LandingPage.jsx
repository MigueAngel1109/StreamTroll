import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const downloadUrl = "https://github.com/MigueAngel1109/StreamTroll/releases/download/StreamTroll/StreamTroll.Setup.1.0.1.exe";

  return (
    <div className="landing-wrapper">
      <div className="landing-container">
        <header className="landing-header">
          <Link to="/" className="landing-logo">
            <span>StreamTroll</span>
          </Link>
          <div className="landing-nav-actions">
            <Link to="/dashboard" className="btn-nav-demo">
              🎮 Abrir Web App
            </Link>
          </div>
        </header>

        <section className="landing-hero">
          <div className="landing-hero-content">
            <h1>Trollea tu Stream al Siguiente Nivel</h1>
            <p>
              La herramienta definitiva de escritorio para creadores de contenido. 
              Shaders en vivo, mapeo de regalos de TikTok, Text-to-Speech nativo y 
              mucho más sin caídas de FPS.
            </p>
            
            <div className="landing-cta-group">
              <a href={downloadUrl} className="landing-btn-primary">
                🚀 Descargar para Windows (Beta)
              </a>
              <Link to="/dashboard" className="landing-btn-secondary">
                🎮 Probar App Web
              </Link>
            </div>

            <p style={{ marginTop: '1.5rem', fontSize: '0.95rem', color: '#64748b', fontWeight: 'bold' }}>
              Compatible con Windows 10/11. Integración lista para OBS Studio.
            </p>
          </div>

          <div className="landing-mockup-box">
            <h2 style={{ color: '#4ade80', marginBottom: '1.5rem', fontSize: '1.8rem' }}>
              🟢 Conexión Nativa Activa
            </h2>
            <div className="landing-terminal">
              <span style={{ color: '#60a5fa' }}>&gt;</span> Escuchando eventos de TikTok...<br />
              <span style={{ color: '#60a5fa' }}>&gt;</span> Regalo detectado: <strong style={{ color: '#fbbf24' }}>León 🦁</strong><br />
              <span style={{ color: '#60a5fa' }}>&gt;</span> Lanzando Shader: <strong style={{ color: '#f87171' }}>Flashbang 💥</strong><br />
              <span style={{ color: '#60a5fa' }}>&gt;</span> Alerta TTS: <strong style={{ color: '#a78bfa' }}>Activada 🗣️</strong>
            </div>
          </div>
        </section>

        <section className="landing-features">
          <div className="landing-feature-card">
            <h3>✨ 9 Shaders Extremos</h3>
            <p>
              Desde terremotos virtuales hasta un flashbang que dejará la pantalla blanca. 
              Todo programado a bajo nivel gráfico para no quitarte FPS de tus juegos.
            </p>
          </div>

          <div className="landing-feature-card">
            <h3>🎁 Mapeo de Regalos Directo</h3>
            <p>
              Sin programas intermediarios. Ingresa tu usuario de TikTok y la app escuchará 
              automáticamente los regalos para disparar las animaciones en pantalla.
            </p>
          </div>

          <div className="landing-feature-card">
            <h3>🗣️ Alertas TTS</h3>
            <p>
              Deja que una voz robótica interrumpa tus partidas leyendo en voz alta los 
              mensajes de las alertas falsas o reales de tus donadores.
            </p>
          </div>
        </section>

        <footer className="landing-footer">
          <p>
            &copy; 2026 StreamTroll. Desarrollado por <strong style={{ color: '#fbbf24' }}>ZENIC S.A.S</strong>. Todos los derechos reservados.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default LandingPage;
