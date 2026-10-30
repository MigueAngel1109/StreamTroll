import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';

const channel = new BroadcastChannel('stream_troll_channel');

const TRANSLATIONS = {
  es: {
    dashboard: 'Dashboard',
    mappings: 'Mappings',
    tips: 'Tips & Donations',
    contests: 'Contests & Raffles',
    chatbot: 'Chatbot',
    giftGraphics: 'Gift Graphics',
    timer: 'Extensible Timer',
    shaders: 'Shaders y Efectos',
    soundboard: 'Soundboard',
    overlay: 'Overlay (OBS Studio)',
    upgrade: 'Suscripción',
    connectTiktok: 'Connect',
    disconnected: 'Disconnected',
    connected: 'Connected',
    screenSelection: 'Screen Selection',
    screenSelectionSub: 'Select which screen will be captured and processed by the effects',
    refresh: 'Refresh',
    graphicsEngine: 'Graphics Engine',
    alignmentGrid: 'Alignment Grid',
    giftsReceived: 'Gifts Received',
    actionsExecuted: 'Actions Executed',
    queueLength: 'Queue Length',
    newTipsTitle: 'Tips & Donations',
    newTipsSub: 'Receive money from fans outside TikTok',
    activate: 'Activate',
    guideWarning: 'To show effects to viewers: Follow all steps in Streamer Guide',
    streamerGuide: 'Streamer Guide',
    loginTrollMe: 'Iniciar sesión en Stream Troll',
    logout: 'Logout',
    support: 'Support',
    trollMeModalTitle: 'Iniciar sesión en Stream Troll',
    trollMeModalSub: 'Gestiona tus shaders, licencias y sincronización en la nube',
    tiktokModalTitle: 'Iniciar sesión en TikTok',
    tiktokModalSub: 'Conecta tu cuenta de TikTok para recibir eventos de tus directos',
    openOfficialTiktok: 'Abrir ventana oficial de TikTok Login',
    quickLiveConnect: 'Conectar Live de TikTok (@usuario)',
    orUseOptions: 'O inicia sesión con tu método preferido:'
  },
  en: {
    dashboard: 'Dashboard',
    mappings: 'Mappings',
    tips: 'Tips & Donations',
    contests: 'Contests & Raffles',
    chatbot: 'Chatbot',
    giftGraphics: 'Gift Graphics',
    timer: 'Extensible Timer',
    shaders: 'Shaders & Effects',
    soundboard: 'Soundboard',
    overlay: 'Overlay (OBS Studio)',
    upgrade: 'Subscription',
    connectTiktok: 'Connect',
    disconnected: 'Disconnected',
    connected: 'Connected',
    screenSelection: 'Screen Selection',
    screenSelectionSub: 'Select which screen will be captured and processed by the effects',
    refresh: 'Refresh',
    graphicsEngine: 'Graphics Engine',
    alignmentGrid: 'Alignment Grid',
    giftsReceived: 'Gifts Received',
    actionsExecuted: 'Actions Executed',
    queueLength: 'Queue Length',
    newTipsTitle: 'Tips & Donations',
    newTipsSub: 'Receive money from fans outside TikTok',
    activate: 'Activate',
    guideWarning: 'To show effects to viewers: Follow all steps in Streamer Guide',
    streamerGuide: 'Streamer Guide',
    loginTrollMe: 'Log in to Stream Troll',
    logout: 'Logout',
    support: 'Support',
    trollMeModalTitle: 'Log in to Stream Troll',
    trollMeModalSub: 'Manage your shaders, licenses, and cloud sync',
    tiktokModalTitle: 'Log in to TikTok',
    tiktokModalSub: 'Connect your TikTok account to receive live stream events',
    openOfficialTiktok: 'Open Official TikTok Login Window',
    quickLiveConnect: 'Connect TikTok Live (@username)',
    orUseOptions: 'Or log in with your preferred method:'
  },
  pt: {
    dashboard: 'Dashboard',
    mappings: 'Mappings',
    tips: 'Tips & Donations',
    contests: 'Contests & Raffles',
    chatbot: 'Chatbot',
    giftGraphics: 'Gift Graphics',
    timer: 'Extensible Timer',
    shaders: 'Shaders e Efeitos',
    soundboard: 'Soundboard',
    overlay: 'Overlay (OBS Studio)',
    upgrade: 'Assinatura',
    connectTiktok: 'Connect',
    disconnected: 'Disconnected',
    connected: 'Connected',
    screenSelection: 'Screen Selection',
    screenSelectionSub: 'Selecione qual tela será capturada e processada pelos efeitos',
    refresh: 'Atualizar',
    graphicsEngine: 'Graphics Engine',
    alignmentGrid: 'Alignment Grid',
    giftsReceived: 'Gifts Received',
    actionsExecuted: 'Actions Executed',
    queueLength: 'Queue Length',
    newTipsTitle: 'Tips & Donations',
    newTipsSub: 'Receba dinheiro dos fãs fora do TikTok',
    activate: 'Ativar',
    guideWarning: 'Para mostrar efeitos aos espectadores: Siga todas as etapas no Guia do Streamer',
    streamerGuide: 'Guia do Streamer',
    loginTrollMe: 'Iniciar sessão no Stream Troll',
    logout: 'Sair',
    support: 'Suporte',
    trollMeModalTitle: 'Iniciar sessão no Stream Troll',
    trollMeModalSub: 'Gerencie seus shaders, licenças e sincronização em nuvem',
    tiktokModalTitle: 'Iniciar sessão no TikTok',
    tiktokModalSub: 'Conecte sua conta do TikTok para receber eventos das suas lives',
    openOfficialTiktok: 'Abrir janela oficial de login do TikTok',
    quickLiveConnect: 'Conectar Live do TikTok (@usuario)',
    orUseOptions: 'Ou faça login com seu método preferido:'
  }
};

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

// TikTok Gifts Catalog Matching Image 1
const TIKTOK_GIFTS_CATALOG = [
  { id: 'awesome', name: "You're awesome", coins: 1, icon: '🐱' },
  { id: 'rose', name: 'Rose', coins: 1, icon: '🌹' },
  { id: 'gg', name: 'GG', coins: 1, icon: '🎮' },
  { id: 'ice-cream', name: 'Ice Cream Cone', coins: 1, icon: '🍦' },
  { id: 'love-so-much', name: 'Love you so much', coins: 1, icon: '🥰' },
  { id: 'tiktok', name: 'TikTok', coins: 1, icon: '🎵' },
  { id: 'heart-me', name: 'Heart Me', coins: 1, icon: '💖' },
  { id: 'community-fest', name: 'Community Fest', coins: 1, icon: '🎪' },
  { id: 'thumbs-up', name: 'Thumbs Up', coins: 1, icon: '👍' },
  { id: 'heart', name: 'Heart', coins: 1, icon: '❤️' },
  { id: 'lightning-bolt', name: 'Lightning Bolt', coins: 1, icon: '⚡' },
  { id: 'cake-slice', name: 'Cake Slice', coins: 1, icon: '🍰' },
  { id: 'love-you', name: 'Love you', coins: 1, icon: '💝' },
  { id: 'its-corn', name: "It's corn", coins: 1, icon: '🌽' },
  { id: 'chili', name: 'Chili', coins: 1, icon: '🌶️' },
  { id: 'heart-puff', name: 'Heart Puff', coins: 1, icon: '☁️' },
  { id: 'goat', name: 'GOAT', coins: 1, icon: '🐐' },
  { id: 'whipped-cream', name: 'Whipped Cream', coins: 1, icon: '🍨' },
  { id: 'im-new-here', name: "I'm New Here", coins: 1, icon: '🆕' },
  { id: 'iheart-you', name: 'iHeart You', coins: 1, icon: '💓' },
  { id: 'whats-up', name: "What's Up", coins: 1, icon: '🤙' },
  { id: 'wink-charm', name: 'Wink Charm', coins: 1, icon: '😉' },
  { id: 'go-popular', name: 'Go Popular', coins: 1, icon: '🚀' },
  { id: 'club-cheers', name: 'Club Cheers', coins: 1, icon: '🍻' },
  { id: 'pumpkin', name: 'Pumpkin', coins: 1, icon: '🎃' },
  { id: 'glow-stick', name: 'Glow Stick', coins: 1, icon: '🪄' },
  { id: 'maracas', name: 'Maracas', coins: 1, icon: '🪇' },
  { id: 'white-rose', name: 'White Rose', coins: 1, icon: '🤍' },
  { id: 'guardian-wings', name: 'Guardian Wings', coins: 1, icon: '🪽' },
  { id: 'music-album', name: 'Music Album', coins: 1, icon: '💿' },
  { id: 'team-bracelet', name: 'Team Bracelet', coins: 2, icon: '📿' },
  { id: 'finger-heart', name: 'Finger Heart', coins: 5, icon: '🫰' },
  { id: 'antipasto-salad', name: 'Antipasto Salad', coins: 5, icon: '🥗' },
  { id: 'cherry', name: 'Cherry', coins: 5, icon: '🍒' },
  { id: 'hi-friend', name: 'Hi Friend', coins: 5, icon: '🐱' },
  { id: 'pumpkin-pie', name: 'Pumpkin Pie', coins: 5, icon: '🥧' },
  { id: 'wave-firework', name: 'Wave Firework', coins: 5, icon: '🎆' },
  { id: 'cheer-you-up', name: 'Cheer You Up', coins: 9, icon: '🩰' },
  { id: 'club-power', name: 'Club Power', coins: 9, icon: '💪' },
  { id: 'super-popular', name: 'Super Popular', coins: 9, icon: '🌟' },
  { id: 'rosa', name: 'Rosa', coins: 10, icon: '🌹' },
  { id: 'bff-necklace', name: 'BFF Necklace', coins: 10, icon: '📿' },
  { id: 'journey-pass', name: 'Journey Pass', coins: 10, icon: '🎫' },
  { id: 'tiny-diny', name: 'Tiny Diny', coins: 10, icon: '🦖' },
  { id: 'hi-bear', name: 'Hi Bear', coins: 10, icon: '🧸' },
  { id: 'ewc', name: 'EWC', coins: 10, icon: '🏆' },
  { id: 'dolphin', name: 'Dolphin', coins: 10, icon: '🐬' },
  { id: 'banana', name: 'Banana', coins: 10, icon: '🍌' },
  { id: 'doughnut', name: 'Dona', coins: 30, icon: '🍩' },
  { id: 'cap-moustache', name: 'Gorra y Bigote', coins: 99, icon: '🧢' },
  { id: 'panda', name: 'Panda', coins: 199, icon: '🐼' },
  { id: 'crown', name: 'Corona', coins: 500, icon: '👑' },
  { id: 'swan', name: 'Cisne', coins: 699, icon: '🦢' },
  { id: 'fireworks', name: 'Fuegos Artificiales', coins: 1088, icon: '🎆' },
  { id: 'rocket', name: 'Cohete Espacial', coins: 2000, icon: '🚀' },
  { id: 'sports-car', name: 'Auto Deportivo', coins: 7000, icon: '🏎️' },
  { id: 'lion', name: 'León', coins: 29999, icon: '🦁' },
  { id: 'universe', name: 'Universo', coins: 34999, icon: '🌌' }
];

// TikTok Live Events Catalog
const TIKTOK_EVENTS_CATALOG = [
  { id: 'follow', name: 'Nuevo Seguidor (Follow)', icon: '👤', description: 'Se activa cuando un nuevo espectador te sigue' },
  { id: 'share', name: 'Compartir Directo (Share)', icon: '🔄', description: 'Se activa cuando alguien comparte tu transmisión' },
  { id: 'likes', name: 'Combo de Likes (100 Likes)', icon: '❤️', description: 'Se activa cada vez que se acumulan 100 likes en el directo' },
  { id: 'sub', name: 'Nueva Suscripción (Sub)', icon: '⭐', description: 'Se activa cuando alguien se suscribe o hace miembro' },
  { id: 'chat', name: 'Palabra Clave en Chat', icon: '💬', description: 'Se activa al escribir "!troll" u otra palabra en el chat' }
];

const DEFAULT_GIFT_MAPPINGS = [
  {
    id: 'map-1',
    type: 'gift',
    giftName: 'Rose',
    giftIcon: '🌹',
    minCoins: 1,
    effect: 'drunk',
    duration: 6,
    tts: false,
    enabled: true
  },
  {
    id: 'map-2',
    type: 'gift',
    giftName: 'Panda',
    giftIcon: '🐼',
    minCoins: 199,
    effect: 'gameboy',
    duration: 8,
    tts: true,
    enabled: true
  },
  {
    id: 'map-3',
    type: 'gift',
    giftName: 'León',
    giftIcon: '🦁',
    minCoins: 29999,
    effect: 'flashbang',
    duration: 8,
    tts: true,
    enabled: true
  }
];

const DEFAULT_EVENT_MAPPINGS = [
  {
    id: 'evt-1',
    eventType: 'follow',
    eventName: 'Nuevo Seguidor (Follow)',
    icon: '👤',
    effect: 'glitch',
    duration: 5,
    tts: true,
    enabled: true
  },
  {
    id: 'evt-2',
    eventType: 'share',
    eventName: 'Compartir Directo (Share)',
    icon: '🔄',
    effect: 'mirror',
    duration: 6,
    tts: true,
    enabled: true
  }
];

function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lang, setLang] = useState(() => localStorage.getItem('troll_me_lang') || 'es');
  const t = TRANSLATIONS[lang] || TRANSLATIONS.es;

  // Troll Me / Stream Troll User Auth State
  const [trollUser, setTrollUser] = useState(() => {
    try {
      const saved = localStorage.getItem('troll_me_user');
      return saved ? JSON.parse(saved) : {
        isLoggedIn: true,
        email: 'miguerodriguez1008@gmail.com',
        username: 'MigueRodriguez',
        plan: 'ULTIMATE',
        avatar: '😎'
      };
    } catch {
      return {
        isLoggedIn: true,
        email: 'miguerodriguez1008@gmail.com',
        username: 'MigueRodriguez',
        plan: 'ULTIMATE',
        avatar: '😎'
      };
    }
  });

  const [trollLoginEmail, setTrollLoginEmail] = useState('miguerodriguez1008@gmail.com');
  const [trollLoginPass, setTrollLoginPass] = useState('••••••••');
  const [showTrollMeLoginModal, setShowTrollMeLoginModal] = useState(false);
  const [showTikTokModal, setShowTikTokModal] = useState(false);
  const [showStreamerGuideModal, setShowStreamerGuideModal] = useState(false);

  // Mappings View State (Image 2: Regalos vs Eventos)
  const [mappingSubTab, setMappingSubTab] = useState('gifts'); // 'gifts' | 'events'
  
  const [giftMappings, setGiftMappings] = useState(() => {
    try {
      const saved = localStorage.getItem('stream_troll_mappings');
      return saved ? JSON.parse(saved) : DEFAULT_GIFT_MAPPINGS;
    } catch {
      return DEFAULT_GIFT_MAPPINGS;
    }
  });

  const [eventMappings, setEventMappings] = useState(() => {
    try {
      const saved = localStorage.getItem('stream_troll_event_mappings');
      return saved ? JSON.parse(saved) : DEFAULT_EVENT_MAPPINGS;
    } catch {
      return DEFAULT_EVENT_MAPPINGS;
    }
  });

  // Modals for Trigger Selection (Image 1)
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [configuringTrigger, setConfiguringTrigger] = useState(null); // { type: 'gift'|'event', item }

  // Gift catalog filters
  const [giftSearch, setGiftSearch] = useState('');
  const [giftCoinFilter, setGiftCoinFilter] = useState('all');
  const [giftSortBy, setGiftSortBy] = useState('low-to-high');

  // Trigger effect form configuration
  const [selectedEffect, setSelectedEffect] = useState('drunk');
  const [selectedDuration, setSelectedDuration] = useState(6);
  const [selectedTts, setSelectedTts] = useState(true);

  // TikTok Live Connection State
  const [tiktokUser, setTiktokUser] = useState('@streamer');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  // Dashboard Controls & Hardware State
  const [graphicsEngine, setGraphicsEngine] = useState(true);
  const [alignmentGrid, setAlignmentGrid] = useState(false);

  // Screen selection state
  const [screens, setScreens] = useState([
    {
      id: 'screen-1',
      name: 'Screen 1',
      resolution: '1080 x 1920',
      position: 'Position: (0, 0)',
      isPrimary: true
    }
  ]);
  const [selectedScreenId, setSelectedScreenId] = useState('screen-1');

  // Real-time Metrics counters
  const [giftsReceivedCount, setGiftsReceivedCount] = useState(0);
  const [actionsExecutedCount, setActionsExecutedCount] = useState(0);
  const [queueLength, setQueueLength] = useState(0);

  // Activity Feed
  const [activityFeed, setActivityFeed] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  // Fake Alert State
  const [alertUser, setAlertUser] = useState('');
  const [alertAmount, setAlertAmount] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [useTTS, setUseTTS] = useState(false);

  // Check if running inside Electron
  const isElectron = typeof window !== 'undefined' && (window.process?.type || window.require);
  const ipcRendererRef = useRef(null);

  // OBS WebSocket & Overlay Execution states
  const [obsPort, setObsPort] = useState(4455);
  const [obsPassword, setObsPassword] = useState('');
  const [obsConnected, setObsConnected] = useState(false);
  const [obsConnecting, setObsConnecting] = useState(false);
  const [obsSceneName, setObsSceneName] = useState('');
  const [obsStatusMsg, setObsStatusMsg] = useState('');
  const obsSocketRef = useRef(null);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  }, []);

  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('troll_me_lang', newLang);
  };

  // Sync Graphics Engine & Alignment Grid to Overlay
  useEffect(() => {
    channel.postMessage({
      type: 'ENGINE_CONFIG',
      graphicsEngine,
      alignmentGrid
    });
  }, [graphicsEngine, alignmentGrid]);

  // Filter and Sort Gifts for the Select Gift Modal (Image 1)
  const filteredGifts = useMemo(() => {
    let list = [...TIKTOK_GIFTS_CATALOG];

    if (giftSearch.trim()) {
      const q = giftSearch.toLowerCase().trim();
      list = list.filter((g) => g.name.toLowerCase().includes(q));
    }

    if (giftCoinFilter === '1') {
      list = list.filter((g) => g.coins === 1);
    } else if (giftCoinFilter === '2-10') {
      list = list.filter((g) => g.coins >= 2 && g.coins <= 10);
    } else if (giftCoinFilter === '11-100') {
      list = list.filter((g) => g.coins >= 11 && g.coins <= 100);
    } else if (giftCoinFilter === '101-1000') {
      list = list.filter((g) => g.coins >= 101 && g.coins <= 1000);
    } else if (giftCoinFilter === '1000+') {
      list = list.filter((g) => g.coins > 1000);
    }

    if (giftSortBy === 'low-to-high') {
      list.sort((a, b) => a.coins - b.coins);
    } else if (giftSortBy === 'high-to-low') {
      list.sort((a, b) => b.coins - a.coins);
    } else if (giftSortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [giftSearch, giftCoinFilter, giftSortBy]);

  // Detect screens from Electron or Browser
  const refreshScreens = useCallback(async () => {
    if (ipcRendererRef.current) {
      try {
        const detected = await ipcRendererRef.current.invoke('system:get-screens');
        if (Array.isArray(detected) && detected.length > 0) {
          setScreens(detected);
          showToast(`🖥️ ${detected.length} Pantalla(s) detectada(s)`);
          return;
        }
      } catch (err) {
        console.warn('Screen detection error:', err);
      }
    }

    const width = window.screen.width || 1920;
    const height = window.screen.height || 1080;
    setScreens([
      {
        id: 'screen-1',
        name: 'Screen 1',
        resolution: `${width} x ${height}`,
        position: 'Position: (0, 0)',
        isPrimary: true
      }
    ]);
    showToast('🔄 Pantalla actualizada');
  }, [showToast]);

  // Troll Me Auth Handlers
  const loginTrollMe = (e) => {
    if (e) e.preventDefault();
    const updated = {
      isLoggedIn: true,
      email: trollLoginEmail || 'miguerodriguez1008@gmail.com',
      username: (trollLoginEmail || 'Streamer').split('@')[0],
      plan: 'ULTIMATE',
      avatar: '😎'
    };
    setTrollUser(updated);
    localStorage.setItem('troll_me_user', JSON.stringify(updated));
    setShowTrollMeLoginModal(false);
    showToast(`👑 ¡Sesión iniciada con éxito como ${updated.email}!`);
  };

  const logoutTrollMe = () => {
    const updated = {
      isLoggedIn: false,
      email: '',
      username: '',
      plan: 'FREE',
      avatar: '👤'
    };
    setTrollUser(updated);
    localStorage.setItem('troll_me_user', JSON.stringify(updated));
    showToast('👋 Sesión cerrada en Stream Troll');
  };

  // TikTok Login Window
  const openOfficialTikTokLogin = async () => {
    if (ipcRendererRef.current) {
      try {
        await ipcRendererRef.current.invoke('tiktok:open-login');
        showToast('🚀 Ventana de inicio de sesión de TikTok abierta');
        return;
      } catch (err) {
        console.warn('Electron open-login error:', err);
      }
    }
    window.open('https://www.tiktok.com/login', 'TikTokLoginWindow', 'width=820,height=760,menubar=no,toolbar=no');
    showToast('🌐 Ventana de inicio de sesión de TikTok abierta');
  };

  // OBS Connection Helpers
  const sha256Base64 = async (str) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(hash)));
  };

  const connectObs = () => {
    if (obsSocketRef.current) {
      try { obsSocketRef.current.close(); } catch {}
    }

    setObsConnecting(true);
    setObsStatusMsg('Conectando con OBS en ws://127.0.0.1:' + obsPort + '...');

    try {
      const ws = new WebSocket(`ws://127.0.0.1:${obsPort}`);
      obsSocketRef.current = ws;

      ws.onopen = () => {
        setObsStatusMsg('Conexión establecida, identificando con OBS Studio...');
      };

      ws.onmessage = async (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.op === 0) {
            const { authentication } = msg.d;
            let authResponse = null;

            if (authentication) {
              if (!obsPassword) {
                setObsStatusMsg('⚠️ OBS requiere contraseña. Ingrésala abajo.');
                setObsConnecting(false);
                return;
              }
              const secret = await sha256Base64(obsPassword + authentication.salt);
              authResponse = await sha256Base64(secret + authentication.challenge);
            }

            ws.send(JSON.stringify({
              op: 1,
              d: {
                rpcVersion: 1,
                ...(authResponse ? { authentication: authResponse } : {})
              }
            }));
          } else if (msg.op === 2) {
            setObsConnected(true);
            setObsConnecting(false);
            setObsStatusMsg('🟢 ¡Conectado exitosamente con OBS Studio!');
            showToast('🟢 ¡Conectado con OBS Studio!');

            ws.send(JSON.stringify({
              op: 6,
              d: {
                requestType: 'GetCurrentProgramScene',
                requestId: 'get-current-scene'
              }
            }));
          } else if (msg.op === 7) {
            if (msg.d.requestId === 'get-current-scene' && msg.d.requestStatus?.result) {
              setObsSceneName(msg.d.responseData?.currentProgramSceneName || 'Escena Principal');
            } else if (msg.d.requestId === 'inject-overlay') {
              if (msg.d.requestStatus?.result) {
                showToast('🎉 ¡Fuente StreamTroll Overlay añadida en OBS!');
                setObsStatusMsg('✅ Fuente inyectada en la escena actual de OBS');
              } else {
                showToast('ℹ️ ' + (msg.d.requestStatus?.comment || 'Fuente procesada en OBS'));
              }
            }
          }
        } catch (err) {
          console.error('OBS message error:', err);
        }
      };

      ws.onerror = () => {
        setObsConnecting(false);
        setObsConnected(false);
        setObsStatusMsg('🔴 No se pudo conectar a OBS. Verifica que OBS esté abierto.');
      };

      ws.onclose = () => {
        setObsConnected(false);
        setObsConnecting(false);
      };
    } catch (err) {
      setObsConnecting(false);
      setObsStatusMsg('🔴 Error al conectar: ' + err.message);
    }
  };

  const disconnectObs = () => {
    if (obsSocketRef.current) {
      try { obsSocketRef.current.close(); } catch {}
      obsSocketRef.current = null;
    }
    setObsConnected(false);
    setObsStatusMsg('Desconectado de OBS');
    showToast('Desconectado de OBS');
  };

  const injectOverlayIntoObs = () => {
    if (!obsSocketRef.current || !obsConnected) {
      alert('Conecta primero con OBS Studio.');
      return;
    }

    const overlayUrl = isElectron 
      ? 'http://127.0.0.1:18923/#/overlay' 
      : `${window.location.origin}${window.location.pathname}#/overlay`;

    obsSocketRef.current.send(JSON.stringify({
      op: 6,
      d: {
        requestType: 'CreateInput',
        requestId: 'inject-overlay',
        requestData: {
          sceneName: obsSceneName || undefined,
          inputName: 'StreamTroll Overlay',
          inputKind: 'browser_source',
          inputSettings: {
            url: overlayUrl,
            width: 1920,
            height: 1080,
            fps: 60,
            restart_when_active: true,
            shutdown: false
          }
        }
      }
    }));
  };

  const downloadObsDragFile = () => {
    const overlayUrl = isElectron 
      ? 'http://127.0.0.1:18923/#/overlay' 
      : `${window.location.origin}${window.location.pathname}#/overlay`;

    const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>StreamTroll Overlay</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100vw; height: 100vh; overflow: hidden; background: transparent; }
    iframe { width: 100%; height: 100%; border: none; background: transparent; }
  </style>
</head>
<body>
  <iframe src="${overlayUrl}" allow="autoplay"></iframe>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'StreamTroll_OBS_Overlay.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('📥 ¡Archivo descargado! Arrástralo adentro de la ventana de OBS');
  };

  const openPopout = (chroma = false) => {
    const baseUrl = window.location.origin + window.location.pathname;
    const overlayUrl = `${baseUrl}#/overlay${chroma ? '?chroma=true' : ''}`;
    window.open(
      overlayUrl,
      'StreamTrollOverlayWindow',
      'width=1280,height=720,menubar=no,toolbar=no,location=no,status=no,resizable=yes'
    );
    showToast(chroma ? '🟩 Ventana Chroma abierta para captura' : '🪟 Ventana Pop-out abierta');
  };

  const sendEffect = useCallback((effectName, durationSec = 8) => {
    if (!graphicsEngine) {
      showToast('⚠️ Graphics Engine está apagado');
      return;
    }
    setQueueLength((q) => q + 1);
    channel.postMessage({
      type: 'SHADER',
      effect: effectName,
      duration: durationSec * 1000
    });
    setTimeout(() => {
      setQueueLength((q) => Math.max(0, q - 1));
    }, durationSec * 1000);
  }, [graphicsEngine, showToast]);

  // TRIGGER ENGINE: Maps gifts to triggers
  const handleIncomingGift = useCallback((giftEvent) => {
    const { user, giftName, diamondCount, repeatCount = 1 } = giftEvent;
    const totalCoins = (diamondCount || 0) * repeatCount;
    const cleanGiftName = (giftName || '').toLowerCase().trim();

    setGiftsReceivedCount((c) => c + 1);

    let matched = false;

    giftMappings.forEach((m) => {
      if (!m.enabled) return;

      let isMatch = false;
      const targetName = (m.giftName || '').toLowerCase().trim();

      if (cleanGiftName.includes(targetName) || targetName.includes(cleanGiftName)) {
        isMatch = true;
      } else if (m.type === 'coins' && totalCoins >= Number(m.minCoins)) {
        isMatch = true;
      }

      if (isMatch) {
        matched = true;
        setActionsExecutedCount((c) => c + 1);
        sendEffect(m.effect, m.duration);

        if (m.tts) {
          channel.postMessage({
            type: 'ALERT',
            user: user || 'Espectador',
            amount: `${totalCoins} 🪙`,
            message: `¡Envió ${giftName}! Shader ${m.effect.toUpperCase()} activado`,
            tts: true
          });
        }

        setActivityFeed((prev) => [
          {
            id: Date.now() + Math.random(),
            time: new Date().toLocaleTimeString(),
            user,
            giftName,
            coins: totalCoins,
            effect: m.effect,
            duration: m.duration,
            rule: `Regalo: ${m.giftName}`
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
  }, [giftMappings, sendEffect]);

  // TRIGGER ENGINE: Maps events (Follow, Share, Likes, etc.)
  const handleIncomingEvent = useCallback((eventData) => {
    const { eventType, user = 'Espectador' } = eventData;
    let matched = false;

    eventMappings.forEach((m) => {
      if (!m.enabled) return;

      if (m.eventType === eventType || m.eventName.toLowerCase().includes(eventType.toLowerCase())) {
        matched = true;
        setActionsExecutedCount((c) => c + 1);
        sendEffect(m.effect, m.duration);

        if (m.tts) {
          channel.postMessage({
            type: 'ALERT',
            user,
            amount: 'EVENTO',
            message: `¡${user}: ${m.eventName}! Shader ${m.effect.toUpperCase()} activado`,
            tts: true
          });
        }

        setActivityFeed((prev) => [
          {
            id: Date.now() + Math.random(),
            time: new Date().toLocaleTimeString(),
            user,
            giftName: m.eventName,
            coins: 0,
            effect: m.effect,
            duration: m.duration,
            rule: `Evento: ${m.eventName}`
          },
          ...prev.slice(0, 14)
        ]);
      }
    });

    if (matched) {
      showToast(`⚡ Evento ${eventType} activó un shader`);
    }
  }, [eventMappings, sendEffect, showToast]);

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
          setShowTikTokModal(false);
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
      setTimeout(() => {
        setIsConnecting(false);
        setIsConnected(true);
        setConnectionStatus(`🟢 Modo Web / Simulación Activo para @${tiktokUser}`);
        showToast('¡Modo simulación web activo! TikTok conectado.');
        setShowTikTokModal(false);
      }, 600);
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

  // Sound effects generator
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

  // Mappings management
  const saveGiftMappings = (updated) => {
    const data = updated || giftMappings;
    setGiftMappings([...data]);
    localStorage.setItem('stream_troll_mappings', JSON.stringify(data));
  };

  const saveEventMappings = (updated) => {
    const data = updated || eventMappings;
    setEventMappings([...data]);
    localStorage.setItem('stream_troll_event_mappings', JSON.stringify(data));
  };

  const deleteGiftMapping = (id) => {
    const updated = giftMappings.filter((m) => m.id !== id);
    saveGiftMappings(updated);
    showToast('🗑️ Mapeo de regalo eliminado');
  };

  const deleteEventMapping = (id) => {
    const updated = eventMappings.filter((m) => m.id !== id);
    saveEventMappings(updated);
    showToast('🗑️ Mapeo de evento eliminado');
  };

  const toggleGiftMapping = (id, enabled) => {
    const updated = giftMappings.map((m) => (m.id === id ? { ...m, enabled } : m));
    saveGiftMappings(updated);
  };

  const toggleEventMapping = (id, enabled) => {
    const updated = eventMappings.map((m) => (m.id === id ? { ...m, enabled } : m));
    saveEventMappings(updated);
  };

  const saveNewMapping = () => {
    if (!configuringTrigger) return;

    if (configuringTrigger.type === 'gift') {
      const gift = configuringTrigger.item;
      const newMapping = {
        id: `map-${Date.now()}`,
        type: 'gift',
        giftName: gift.name,
        giftIcon: gift.icon,
        minCoins: gift.coins,
        effect: selectedEffect,
        duration: selectedDuration,
        tts: selectedTts,
        enabled: true
      };
      saveGiftMappings([...giftMappings, newMapping]);
      showToast(`🎉 ¡Mapeo añadido: ${gift.name} ➔ ${selectedEffect}!`);
    } else if (configuringTrigger.type === 'event') {
      const evt = configuringTrigger.item;
      const newMapping = {
        id: `evt-${Date.now()}`,
        eventType: evt.id,
        eventName: evt.name,
        icon: evt.icon,
        effect: selectedEffect,
        duration: selectedDuration,
        tts: selectedTts,
        enabled: true
      };
      saveEventMappings([...eventMappings, newMapping]);
      showToast(`⚡ ¡Mapeo añadido: ${evt.name} ➔ ${selectedEffect}!`);
    }

    setConfiguringTrigger(null);
    setShowGiftModal(false);
    setShowEventModal(false);
  };

  // Electron IPC Listeners
  useEffect(() => {
    if (isElectron && window.require) {
      try {
        const { ipcRenderer } = window.require('electron');
        ipcRendererRef.current = ipcRenderer;

        const handleTiktokGift = (_event, giftData) => {
          handleIncomingGift({
            user: giftData.user,
            giftName: giftData.giftName,
            diamondCount: giftData.diamondCount,
            repeatCount: giftData.repeatCount
          });
        };

        const handleTiktokStatus = (_event, status) => {
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
  }, [handleIncomingGift, isElectron]);

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toastMessage && <div className="toast-success">{toastMessage}</div>}

      {/* =========================================================
          SIDEBAR NAVIGATION (STREAM TROLL STYLE)
          ========================================================= */}
      <div className="sidebar" style={{ overflowY: 'auto' }}>
        {/* Retro Pixel Logo */}
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <div className="troll-logo-retro">
            STREAM TROLL
          </div>
        </Link>

        {/* Flag Bar (Language Selector - Centered with Crisp Flag Badges) */}
        <div className="flags-bar">
          <button 
            className={`flag-btn ${lang === 'es' ? 'active' : ''}`} 
            onClick={() => changeLanguage('es')}
            title="Español (ES)"
          >
            <svg width="26" height="18" viewBox="0 0 750 500" style={{ borderRadius: '3px', display: 'block', boxShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
              <rect width="750" height="500" fill="#c60b1e"/>
              <rect width="750" height="250" y="125" fill="#ffc400"/>
              <circle cx="230" cy="250" r="45" fill="#c60b1e"/>
              <circle cx="230" cy="250" r="30" fill="#ffc400"/>
            </svg>
          </button>
          <button 
            className={`flag-btn ${lang === 'en' ? 'active' : ''}`} 
            onClick={() => changeLanguage('en')}
            title="English (US)"
          >
            <svg width="26" height="18" viewBox="0 0 24 16" style={{ borderRadius: '3px', display: 'block', boxShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
              <rect width="24" height="16" fill="#b22234"/>
              <rect y="1.23" width="24" height="1.23" fill="#fff"/>
              <rect y="3.69" width="24" height="1.23" fill="#fff"/>
              <rect y="6.15" width="24" height="1.23" fill="#fff"/>
              <rect y="8.61" width="24" height="1.23" fill="#fff"/>
              <rect y="11.07" width="24" height="1.23" fill="#fff"/>
              <rect y="13.53" width="24" height="1.23" fill="#fff"/>
              <rect width="10" height="8.6" fill="#3c3b6e"/>
              <g fill="#fff">
                <circle cx="2" cy="2" r="0.6"/>
                <circle cx="5" cy="2" r="0.6"/>
                <circle cx="8" cy="2" r="0.6"/>
                <circle cx="3.5" cy="4.3" r="0.6"/>
                <circle cx="6.5" cy="4.3" r="0.6"/>
                <circle cx="2" cy="6.6" r="0.6"/>
                <circle cx="5" cy="6.6" r="0.6"/>
                <circle cx="8" cy="6.6" r="0.6"/>
              </g>
            </svg>
          </button>
          <button 
            className={`flag-btn ${lang === 'pt' ? 'active' : ''}`} 
            onClick={() => changeLanguage('pt')}
            title="Português (BR)"
          >
            <svg width="26" height="18" viewBox="0 0 24 16" style={{ borderRadius: '3px', display: 'block', boxShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
              <rect width="24" height="16" fill="#009c3b"/>
              <polygon points="12,1.5 22,8 12,14.5 2,8" fill="#ffdf00"/>
              <circle cx="12" cy="8" r="3.6" fill="#002776"/>
              <path d="M8.5,8 A3.6,3.6 0 0,0 15.5,8" stroke="#fff" strokeWidth="0.6" fill="none"/>
            </svg>
          </button>
        </div>

        {/* User Profile Card (Stream Troll Account) */}
        <div className="user-profile-box">
          {trollUser.isLoggedIn ? (
            <>
              <div className="user-profile-row">
                <div className="user-avatar-img">
                  <span>{trollUser.avatar || '😎'}</span>
                </div>
                <div className="user-info-text">
                  <span className="user-email-truncate" title={trollUser.email}>
                    {trollUser.email}
                  </span>
                  <span className="plan-badge-ultimate">
                    {trollUser.plan || 'ULTIMATE'}
                  </span>
                </div>
              </div>
              <button className="btn-sidebar-logout" onClick={logoutTrollMe}>
                <span>↳</span> {t.logout}
              </button>
            </>
          ) : (
            <button className="btn-sidebar-login" onClick={() => setShowTrollMeLoginModal(true)}>
              <span>🔑</span> {t.loginTrollMe}
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="nav-links">
          {/* 1. Dashboard */}
          <div 
            className={`nav-item-pill ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="nav-item-left">
              <span>⊞</span>
              <span>{t.dashboard}</span>
            </div>
          </div>

          {/* 2. Mappings */}
          <div 
            className={`nav-item-pill ${activeTab === 'mappings' ? 'active' : ''}`}
            onClick={() => setActiveTab('mappings')}
          >
            <div className="nav-item-left">
              <span>⚡</span>
              <span>{t.mappings}</span>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <span className="nav-pill-badge badge-new">NEW</span>
              <span className="nav-pill-badge badge-money">$</span>
            </div>
          </div>

          {/* 3. Tips & Donations */}
          <div 
            className={`nav-item-pill ${activeTab === 'tips' ? 'active' : ''}`}
            onClick={() => setActiveTab('tips')}
          >
            <div className="nav-item-left">
              <span>🤍</span>
              <span>{t.tips}</span>
            </div>
            <span className="nav-pill-badge badge-money">$</span>
          </div>

          {/* 4. Contests & Raffles */}
          <div 
            className={`nav-item-pill ${activeTab === 'contests' ? 'active' : ''}`}
            onClick={() => setActiveTab('contests')}
          >
            <div className="nav-item-left">
              <span>🏆</span>
              <span>{t.contests}</span>
            </div>
            <span className="nav-pill-badge badge-soon">PRONTO</span>
          </div>

          {/* 5. Chatbot */}
          <div 
            className={`nav-item-pill ${activeTab === 'chatbot' ? 'active' : ''}`}
            onClick={() => setActiveTab('chatbot')}
          >
            <div className="nav-item-left">
              <span>🤖</span>
              <span>{t.chatbot}</span>
            </div>
          </div>

          {/* 6. Gift Graphics */}
          <div 
            className={`nav-item-pill ${activeTab === 'gift-graphics' ? 'active' : ''}`}
            onClick={() => setActiveTab('gift-graphics')}
          >
            <div className="nav-item-left">
              <span>🖼️</span>
              <span>{t.giftGraphics}</span>
            </div>
            <span className="badge-dot"></span>
          </div>

          {/* 7. Extensible Timer */}
          <div 
            className={`nav-item-pill ${activeTab === 'timer' ? 'active' : ''}`}
            onClick={() => setActiveTab('timer')}
          >
            <div className="nav-item-left">
              <span>⏱️</span>
              <span>{t.timer}</span>
            </div>
            <span className="nav-pill-badge badge-new">NEW</span>
          </div>

          {/* Utility Tools */}
          <div style={{ marginTop: '0.8rem', paddingTop: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div 
              className={`nav-item-pill ${activeTab === 'shaders' ? 'active' : ''}`}
              onClick={() => setActiveTab('shaders')}
            >
              <div className="nav-item-left">
                <span>✨</span>
                <span>{t.shaders}</span>
              </div>
            </div>
            <div 
              className={`nav-item-pill ${activeTab === 'overlay' ? 'active' : ''}`}
              onClick={() => setActiveTab('overlay')}
            >
              <div className="nav-item-left">
                <span>🖥️</span>
                <span>{t.overlay}</span>
              </div>
            </div>
            <div 
              className={`nav-item-pill ${activeTab === 'soundboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('soundboard')}
            >
              <div className="nav-item-left">
                <span>🔊</span>
                <span>{t.soundboard}</span>
              </div>
            </div>
            <div 
              className={`nav-item-pill ${activeTab === 'alertas' ? 'active' : ''}`}
              onClick={() => setActiveTab('alertas')}
            >
              <div className="nav-item-left">
                <span>💸</span>
                <span>Alertas & TTS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div>
            <div>BY: Logix_haze</div>
            <div style={{ fontSize: '0.7rem', color: '#475569' }}>v1.6.29</div>
          </div>
          <button 
            className="btn-discord-support"
            onClick={() => window.open('https://discord.gg', '_blank')}
          >
            <span>💬</span> {t.support}
          </button>
        </div>
      </div>

      {/* =========================================================
          MAIN CONTENT AREA
          ========================================================= */}
      <div className="main-content" style={{ overflowY: 'auto' }}>
        
        {/* =========================================================
            TOP ACTION ROW / BANNERS
            ========================================================= */}
        <div className="top-action-bar">
          {/* 1. Green Promo Card */}
          <div className="banner-tips-donations">
            <div className="banner-tips-content">
              <div className="banner-tips-icon">💰</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="nav-pill-badge" style={{ background: '#10b981', color: '#042f2e', fontWeight: 'bold' }}>NEW</span>
                  <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{t.newTipsTitle}</strong>
                </div>
                <div style={{ color: '#a7f3d0', fontSize: '0.8rem', marginTop: '2px' }}>
                  {t.newTipsSub}
                </div>
              </div>
            </div>
            <button className="btn-activate-tips" onClick={() => setActiveTab('tips')}>
              <span>🏷️</span> {t.activate}
            </button>
          </div>

          {/* 2. Red Alert Card */}
          <div className="banner-warning-guide" onClick={() => setShowStreamerGuideModal(true)}>
            <div className="banner-warning-icon">⚠️</div>
            <div className="banner-warning-text">
              To show effects to viewers: Follow all steps in{' '}
              <span className="banner-guide-link">{t.streamerGuide}</span>
            </div>
          </div>

          {/* 3. TikTok Connect Button */}
          <div className="tiktok-connect-box">
            <button 
              className={`btn-tiktok-connect ${isConnected ? 'connected' : ''}`}
              onClick={() => setShowTikTokModal(true)}
            >
              <span>{t.connectTiktok}</span>
              <span>→</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.5 6.27 6.27 0 0 0 1.87-4.49V8.69a8.16 8.16 0 0 0 4.9 1.62V6.86a4.85 4.85 0 0 1-1-.17z"/>
              </svg>
            </button>
            <div className="tiktok-status-subtext">
              <span className={isConnected ? "status-dot-connected" : "status-dot-disconnected"}></span>
              <span>{isConnected ? `${t.connected} @${tiktokUser.replace('@', '')}` : t.disconnected}</span>
            </div>
          </div>
        </div>

        {/* =========================================================
            TAB 1: MAIN DASHBOARD VIEW
            ========================================================= */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Screen Selection & Engine Section */}
            <div className="screen-selection-section">
              <div className="screen-section-header">
                <div className="screen-header-left">
                  <span style={{ fontSize: '1.5rem' }}>🖥️</span>
                  <div>
                    <div className="screen-header-title">{t.screenSelection}</div>
                    <div className="screen-header-sub">{t.screenSelectionSub}</div>
                  </div>
                </div>
                <button className="btn-screen-refresh" onClick={refreshScreens}>
                  <span>🔄</span> {t.refresh}
                </button>
              </div>

              {/* Screens Grid */}
              <div className="screens-grid">
                {screens.map((screen) => {
                  const isSelected = selectedScreenId === screen.id;
                  return (
                    <div 
                      key={screen.id}
                      className={isSelected ? "screen-card-active" : "screen-card-inactive"}
                      onClick={() => {
                        setSelectedScreenId(screen.id);
                        showToast(`🖥️ Pantalla seleccionada: ${screen.name}`);
                      }}
                    >
                      <div className="screen-icon-monitor">🖥️</div>
                      <div className="screen-card-name">{screen.name}</div>
                      <div className="screen-card-res">{screen.resolution}</div>
                      <div className="screen-card-pos">{screen.position}</div>
                    </div>
                  );
                })}
              </div>

              {/* Engine Switches */}
              <div className="engine-switches-row">
                <div className="engine-switch-item">
                  <div className="engine-switch-label">
                    <span>🎮</span>
                    <span>{t.graphicsEngine}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: graphicsEngine ? '#10b981' : '#64748b' }}>
                      {graphicsEngine ? 'ON' : 'OFF'}
                    </span>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={graphicsEngine} 
                        onChange={(e) => setGraphicsEngine(e.target.checked)} 
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>

                <div className="engine-switch-item">
                  <div className="engine-switch-label">
                    <span>🪟</span>
                    <span>{t.alignmentGrid}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: alignmentGrid ? '#10b981' : '#64748b' }}>
                      {alignmentGrid ? 'ON' : 'OFF'}
                    </span>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={alignmentGrid} 
                        onChange={(e) => setAlignmentGrid(e.target.checked)} 
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Metrics Cards Row */}
            <div className="metrics-row-grid">
              <div className="metric-card-box">
                <div className="metric-header">
                  <span style={{ color: '#ec4899', fontSize: '1.2rem' }}>🎁</span>
                  <span>{t.giftsReceived}</span>
                </div>
                <div className="metric-number-big">
                  {giftsReceivedCount}
                </div>
              </div>

              <div className="metric-card-box">
                <div className="metric-header">
                  <span style={{ color: '#fbbf24', fontSize: '1.2rem' }}>⚡</span>
                  <span>{t.actionsExecuted}</span>
                </div>
                <div className="metric-number-big">
                  {actionsExecutedCount}
                </div>
              </div>

              <div className="metric-card-box">
                <div className="metric-header">
                  <span style={{ color: '#38bdf8', fontSize: '1.2rem' }}>🕒</span>
                  <span>{t.queueLength}</span>
                </div>
                <div className="metric-number-big">
                  {queueLength}
                </div>
              </div>
            </div>

            {/* Quick Live Trigger Tester directly on Dashboard */}
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ fontWeight: 'bold', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>⚡</span> <span>Probador Rápido de Regalos y Eventos</span>
                </div>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  Simula regalos o eventos para ver cómo se activan tus mapeos en OBS
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                <button 
                  className="btn btn-secondary"
                  onClick={() => handleIncomingGift({ user: 'Fan_TikTok', giftName: 'Rose', diamondCount: 1, repeatCount: 1 })}
                >
                  🌹 Rose (1 🪙)
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => handleIncomingGift({ user: 'PandaBoss', giftName: 'Panda', diamondCount: 199, repeatCount: 1 })}
                >
                  🐼 Panda (199 🪙)
                </button>
                <button 
                  className="btn"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}
                  onClick={() => handleIncomingGift({ user: 'King_Lion', giftName: 'León', diamondCount: 29999, repeatCount: 1 })}
                >
                  🦁 León (29999 🪙)
                </button>
                <button 
                  className="btn"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
                  onClick={() => handleIncomingEvent({ eventType: 'follow', user: 'NuevoStreamerFan' })}
                >
                  👤 Simular Follow
                </button>
                <button 
                  className="btn"
                  style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}
                  onClick={() => handleIncomingEvent({ eventType: 'share', user: 'ComunidadGamer' })}
                >
                  🔄 Simular Share
                </button>
              </div>
            </div>

            {/* Quick Activity Stream */}
            {activityFeed.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <h4 style={{ color: '#94a3b8', marginBottom: '0.6rem', fontSize: '0.85rem' }}>
                  📡 ÚLTIMAS ACCIONES PROCESADAS
                </h4>
                <div className="live-feed-box">
                  {activityFeed.slice(0, 5).map((item) => (
                    <div key={item.id} className="live-feed-item">
                      <div>
                        <strong style={{ color: '#60a5fa' }}>{item.time}</strong> — 
                        <span style={{ color: '#fbbf24', marginLeft: '0.4rem' }}>{item.user}</span> envió{' '}
                        <strong>{item.giftName}</strong> {item.coins > 0 && `(${item.coins} 🪙)`}
                      </div>
                      <div>
                        {item.unmatched ? (
                          <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Sin regla</span>
                        ) : (
                          <span className="badge badge-success">
                            {item.effect} ({item.duration}s)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            TAB 2: MAPEOS DE ACCIONES (EXACT MATCH TO IMAGE 2)
            ========================================================= */}
        {activeTab === 'mappings' && (
          <div>
            {/* Header Title from Image 2 */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ color: '#fbbf24', fontSize: '1.5rem' }}>⚡</span>
                <h1 style={{ fontSize: '1.65rem', margin: 0, color: '#fff' }}>Mapeos de Acciones</h1>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
                Mapea regalos y eventos de TikTok Live a efectos visuales
              </p>
            </div>

            {/* Navigation Pills: Regalos vs Eventos (Image 2) */}
            <div className="mappings-nav-pills">
              <button 
                className={`mapping-tab-btn ${mappingSubTab === 'gifts' ? 'active' : ''}`}
                onClick={() => setMappingSubTab('gifts')}
              >
                <span style={{ fontSize: '1.2rem' }}>🎁</span>
                <span>Regalos</span>
                <span className="mapping-count-pill">{giftMappings.length}</span>
              </button>

              <button 
                className={`mapping-tab-btn ${mappingSubTab === 'events' ? 'active' : ''}`}
                onClick={() => setMappingSubTab('events')}
              >
                <span style={{ fontSize: '1.2rem' }}>⚡</span>
                <span>Eventos</span>
                <span className="mapping-count-pill">{eventMappings.length}</span>
              </button>
            </div>

            {/* Sub-header with text and + Add Mapping button */}
            <div className="mappings-sub-header">
              <div className="mappings-sub-text">
                {mappingSubTab === 'gifts' 
                  ? 'Configura qué efectos se activan cuando recibes regalos específicos'
                  : 'Configura qué efectos se activan con eventos de TikTok Live (Follow, Share, Likes, etc.)'}
              </div>
              <button 
                className="btn-add-mapping"
                onClick={() => {
                  if (mappingSubTab === 'gifts') {
                    setShowGiftModal(true);
                  } else {
                    setShowEventModal(true);
                  }
                }}
              >
                <span>+</span>
                <span>Add Mapping</span>
              </button>
            </div>

            {/* Content for Gifts Tab */}
            {mappingSubTab === 'gifts' && (
              <div>
                {giftMappings.length === 0 ? (
                  /* Empty State Matching Image 2 */
                  <div className="mappings-empty-card">
                    <svg className="mappings-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="6" y1="3" x2="6" y2="15"></line>
                      <circle cx="18" cy="6" r="3"></circle>
                      <circle cx="6" cy="18" r="3"></circle>
                      <path d="M18 9a9 9 0 0 1-9 9"></path>
                    </svg>
                    <div className="mappings-empty-title">No mappings yet</div>
                    <div className="mappings-empty-sub">Create your first gift-to-effect mapping</div>
                    <button 
                      className="btn-add-mapping" 
                      style={{ marginTop: '1.25rem' }}
                      onClick={() => setShowGiftModal(true)}
                    >
                      <span>+</span> <span>Add Mapping</span>
                    </button>
                  </div>
                ) : (
                  <div>
                    {giftMappings.map((m) => (
                      <div key={m.id} className="mapping-card-item">
                        <div className="mapping-item-trigger">
                          <div className="mapping-trigger-icon">
                            {m.giftIcon || '🎁'}
                          </div>
                          <div>
                            <div className="mapping-trigger-title">{m.giftName}</div>
                            <div className="mapping-trigger-meta">
                              <span>🪙</span> {m.minCoins} Moneda{m.minCoins > 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>

                        <div className="mapping-arrow-indicator">➔</div>

                        <div className="mapping-item-action">
                          <div className="mapping-effect-badge">
                            <span>✨</span> {m.effect.toUpperCase()} ({m.duration}s)
                          </div>
                          {m.tts && <div className="mapping-tts-badge">🗣️ TTS Activo</div>}
                        </div>

                        <div className="mapping-item-controls">
                          <label className="switch" title="Activar/Desactivar">
                            <input 
                              type="checkbox" 
                              checked={m.enabled} 
                              onChange={(e) => toggleGiftMapping(m.id, e.target.checked)} 
                            />
                            <span className="slider"></span>
                          </label>
                          <button 
                            className="btn btn-secondary"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                            onClick={() => {
                              sendEffect(m.effect, m.duration);
                              showToast(`👁️ Probando efecto: ${m.effect}`);
                            }}
                          >
                            👁️ Probar
                          </button>
                          <button 
                            className="btn btn-danger"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                            onClick={() => deleteGiftMapping(m.id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Content for Events Tab */}
            {mappingSubTab === 'events' && (
              <div>
                {eventMappings.length === 0 ? (
                  <div className="mappings-empty-card">
                    <svg className="mappings-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="6" y1="3" x2="6" y2="15"></line>
                      <circle cx="18" cy="6" r="3"></circle>
                      <circle cx="6" cy="18" r="3"></circle>
                      <path d="M18 9a9 9 0 0 1-9 9"></path>
                    </svg>
                    <div className="mappings-empty-title">No mappings yet</div>
                    <div className="mappings-empty-sub">Create your first event-to-effect mapping</div>
                    <button 
                      className="btn-add-mapping" 
                      style={{ marginTop: '1.25rem' }}
                      onClick={() => setShowEventModal(true)}
                    >
                      <span>+</span> <span>Add Mapping</span>
                    </button>
                  </div>
                ) : (
                  <div>
                    {eventMappings.map((m) => (
                      <div key={m.id} className="mapping-card-item">
                        <div className="mapping-item-trigger">
                          <div className="mapping-trigger-icon">
                            {m.icon || '⚡'}
                          </div>
                          <div>
                            <div className="mapping-trigger-title">{m.eventName}</div>
                            <div style={{ fontSize: '0.75rem', color: '#60a5fa' }}>Evento en directo</div>
                          </div>
                        </div>

                        <div className="mapping-arrow-indicator">➔</div>

                        <div className="mapping-item-action">
                          <div className="mapping-effect-badge">
                            <span>✨</span> {m.effect.toUpperCase()} ({m.duration}s)
                          </div>
                          {m.tts && <div className="mapping-tts-badge">🗣️ TTS Activo</div>}
                        </div>

                        <div className="mapping-item-controls">
                          <label className="switch" title="Activar/Desactivar">
                            <input 
                              type="checkbox" 
                              checked={m.enabled} 
                              onChange={(e) => toggleEventMapping(m.id, e.target.checked)} 
                            />
                            <span className="slider"></span>
                          </label>
                          <button 
                            className="btn btn-secondary"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                            onClick={() => {
                              sendEffect(m.effect, m.duration);
                              showToast(`👁️ Probando efecto: ${m.effect}`);
                            }}
                          >
                            👁️ Probar
                          </button>
                          <button 
                            className="btn btn-danger"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                            onClick={() => deleteEventMapping(m.id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            TAB 3: TIPS & DONATIONS
            ========================================================= */}
        {activeTab === 'tips' && (
          <div className="glass-panel">
            <h2>🤍 Tips & Donations (Donaciones Externas)</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Recibe dinero directo de tus fans y espectadores sin depender de las comisiones de monedas de TikTok.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div className="feature-card" style={{ border: '1px solid #10b981' }}>
                <h3 style={{ color: '#10b981', marginBottom: '0.5rem' }}>💳 Stripe & Tarjetas</h3>
                <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '1rem' }}>
                  Acepta Visa, Mastercard y Google Pay con comisiones reducidas.
                </p>
                <button className="btn btn-success" onClick={() => showToast('✅ Integración con Stripe activada')}>
                  Conectar Stripe
                </button>
              </div>
              <div className="feature-card" style={{ border: '1px solid #38bdf8' }}>
                <h3 style={{ color: '#38bdf8', marginBottom: '0.5rem' }}>🅿️ PayPal & Venmo</h3>
                <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '1rem' }}>
                  Permite a tu comunidad donar con un solo clic desde PayPal.
                </p>
                <button className="btn" style={{ background: '#0284c7' }} onClick={() => showToast('✅ Integración con PayPal activada')}>
                  Conectar PayPal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 4: CONTESTS & RAFFLES
            ========================================================= */}
        {activeTab === 'contests' && (
          <div className="glass-panel">
            <h2>🏆 Contests & Raffles (Sorteos y Torneos)</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Organiza rifas automáticas entre tus donadores de regalos o espectadores del chat de TikTok.
            </p>
            <div className="feature-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎁</div>
              <h3>Módulo de Sorteos Activo</h3>
              <p style={{ color: '#94a3b8', maxWidth: '500px', margin: '0.5rem auto 1.5rem' }}>
                Cada rosa o regalo recibido generará tickets virtuales en tiempo real para rifas de pases de batalla o premios.
              </p>
              <button className="btn btn-secondary" onClick={() => showToast('🎉 Nuevo sorteo creado para el directo')}>
                Crear Sorteo Rápido
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 5: CHATBOT
            ========================================================= */}
        {activeTab === 'chatbot' && (
          <div className="glass-panel">
            <h2>🤖 Chatbot Moderador y Comandos</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Configura respuestas automáticas y comandos de chat como <code>!regalos</code>, <code>!redes</code> o <code>!troll</code>.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="feature-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>Comando !discord</strong>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Publica el enlace de tu comunidad de Discord</div>
                </div>
                <span className="badge badge-success">ACTIVO</span>
              </div>
              <div className="feature-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>Agradecimiento Automático de Regalos</strong>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Envía un mensaje de gracias al chat al recibir rosas o leones</div>
                </div>
                <span className="badge badge-success">ACTIVO</span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 6: GIFT GRAPHICS
            ========================================================= */}
        {activeTab === 'gift-graphics' && (
          <div className="glass-panel">
            <h2>🖼️ Gift Graphics (Animaciones en Pantalla)</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Imágenes flotantes, stickers 3D y banners al recibir regalos específicos.
            </p>
            <div className="grid-container">
              <div className="feature-card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem' }}>🌹</div>
                <div style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>Lluvia de Rosas 3D</div>
                <button className="btn btn-secondary" style={{ marginTop: '0.8rem', width: '100%' }} onClick={() => sendEffect('drunk', 5)}>
                  Probar Animación
                </button>
              </div>
              <div className="feature-card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem' }}>🦁</div>
                <div style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>Rugido del León Épico</div>
                <button className="btn btn-secondary" style={{ marginTop: '0.8rem', width: '100%' }} onClick={() => sendEffect('flashbang', 6)}>
                  Probar Animación
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 7: EXTENSIBLE TIMER
            ========================================================= */}
        {activeTab === 'timer' && (
          <div className="glass-panel">
            <h2>⏱️ Extensible Timer (Subatón / Cronómetro)</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Aumenta automáticamente el tiempo de tu directo cada vez que tus espectadores envíen regalos.
            </p>
            <div className="feature-card" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', fontWeight: '900', color: '#38bdf8', marginBottom: '1rem', fontFamily: 'monospace' }}>
                02:45:18
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button className="btn btn-success" onClick={() => showToast('⏱️ Cronómetro iniciado')}>Iniciar</button>
                <button className="btn btn-secondary" onClick={() => showToast('⏱️ +5 minutos añadidos')}>+5 Minutos</button>
                <button className="btn btn-danger" onClick={() => showToast('⏱️ Cronómetro pausado')}>Pausar</button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            UTILITY TABS: SHADERS, OVERLAY, SOUNDBOARD, ALERTAS
            ========================================================= */}
        {activeTab === 'shaders' && (
          <div className="glass-panel">
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

        {activeTab === 'soundboard' && (
          <div className="glass-panel">
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

        {activeTab === 'overlay' && (
          <div className="glass-panel">
            <div style={{ marginBottom: '2rem' }}>
              <h2>🖥️ Opciones para Ejecutar el Overlay en OBS Studio</h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                Elige la forma más cómoda para ti de integrar y ejecutar los efectos y alertas de StreamTroll en OBS Studio o TikTok Live Studio:
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="feature-card" style={{ border: obsConnected ? '2px solid #10b981' : '1px solid rgba(139, 92, 246, 0.4)', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.06), transparent)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '1.8rem' }}>⚡</span>
                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Inyección Automática (1 Clic)</h3>
                  </div>
                  <span className={`badge ${obsConnected ? 'badge-success' : 'badge-warning'}`}>
                    {obsConnected ? 'OBS CONECTADO' : 'OBS DESCONECTADO'}
                  </span>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.2rem' }}>
                  Conecta con <strong>OBS Studio v28+</strong> usando su servidor WebSocket nativo para inyectar la fuente de navegador automáticamente en tu escena activa.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1rem' }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.8rem' }}>Puerto WebSocket</label>
                    <input
                      type="number"
                      className="input-field"
                      value={obsPort}
                      onChange={(e) => setObsPort(Number(e.target.value))}
                      disabled={obsConnected || obsConnecting}
                    />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.8rem' }}>Contraseña (si aplica)</label>
                    <input
                      type="password"
                      className="input-field"
                      placeholder="Opcional"
                      value={obsPassword}
                      onChange={(e) => setObsPassword(e.target.value)}
                      disabled={obsConnected || obsConnecting}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1rem' }}>
                  <button
                    className="btn"
                    style={{ flex: 1, background: obsConnected ? '#ef4444' : 'linear-gradient(135deg, var(--accent-primary), var(--accent-hover))' }}
                    onClick={obsConnected ? disconnectObs : connectObs}
                    disabled={obsConnecting}
                  >
                    {obsConnecting ? 'Conectando...' : obsConnected ? 'Desconectar OBS' : '🔌 Conectar con OBS'}
                  </button>
                </div>

                {obsConnected && (
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '10px', padding: '1rem', marginTop: '0.5rem' }}>
                    <div style={{ fontSize: '0.85rem', color: '#6ee7b7', marginBottom: '0.8rem' }}>
                      🎯 <strong>Escena Actual en OBS:</strong> <span style={{ color: '#fff' }}>"{obsSceneName || 'Escena Principal'}"</span>
                    </div>
                    <button
                      className="btn btn-success"
                      style={{ width: '100%', padding: '0.9rem', fontWeight: 'bold' }}
                      onClick={injectOverlayIntoObs}
                    >
                      ⚡ Inyectar / Crear Fuente en OBS Ahora
                    </button>
                  </div>
                )}

                {obsStatusMsg && (
                  <div style={{ fontSize: '0.8rem', marginTop: '0.8rem', color: obsConnected ? '#10b981' : '#f87171' }}>
                    {obsStatusMsg}
                  </div>
                )}
              </div>

              <div className="feature-card" style={{ border: '1px solid rgba(16, 185, 129, 0.4)', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), transparent)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.8rem' }}>📥</span>
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Archivo Arrastrable (Drag & Drop)</h3>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  Descarga un archivo de acceso directo y <strong>arrástralo con el ratón directamente dentro de la ventana de OBS Studio</strong>.
                </p>

                <button
                  className="btn btn-success"
                  style={{ width: '100%', padding: '1rem', marginBottom: '1rem' }}
                  onClick={downloadObsDragFile}
                >
                  📥 Descargar Archivo para Arrastrar (.html)
                </button>
              </div>

              <div className="feature-card" style={{ border: '1px solid rgba(236, 72, 153, 0.4)', background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.05), transparent)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.8rem' }}>🪟</span>
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Ventana Flotante (Pop-Out / Chroma)</h3>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  Ideal para <strong>TikTok Live Studio</strong> o con <strong>"Captura de Ventana"</strong>:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <button
                    className="btn"
                    style={{ width: '100%', background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}
                    onClick={() => openPopout(false)}
                  >
                    🪟 Abrir Ventana Pop-Out Transparente
                  </button>

                  <button
                    className="btn"
                    style={{ width: '100%', background: 'linear-gradient(135deg, #059669, #10b981)' }}
                    onClick={() => openPopout(true)}
                  >
                    🟩 Abrir con Fondo Verde (Modo Chroma Key)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alertas' && (
          <div className="glass-panel">
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
      </div>

      {/* =========================================================
          MODAL 1: SELECT GIFT (TRIGGER) - EXACT MATCH TO IMAGE 1
          ========================================================= */}
      {showGiftModal && (
        <div className="modal-overlay-backdrop" onClick={() => setShowGiftModal(false)}>
          <div className="gift-modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="gift-modal-header">
              <div className="gift-modal-title">
                <div className="gift-modal-title-bar"></div>
                <span>Select Gift (Trigger)</span>
              </div>
              <button className="modal-close-btn" onClick={() => setShowGiftModal(false)}>✕</button>
            </div>

            <div className="gift-search-section">
              <label className="gift-search-label">SEARCH BY NAME:</label>
              <input 
                type="text"
                className="gift-search-input"
                placeholder="Escribe el nombre del regalo..."
                value={giftSearch}
                onChange={(e) => setGiftSearch(e.target.value)}
                autoFocus
              />
            </div>

            <div className="gift-filters-row">
              <div>
                <label className="gift-search-label">FILTER BY COINS:</label>
                <select 
                  className="gift-select-dropdown"
                  value={giftCoinFilter}
                  onChange={(e) => setGiftCoinFilter(e.target.value)}
                >
                  <option value="all">Todos los precios</option>
                  <option value="1">1 Moneda</option>
                  <option value="2-10">2 a 10 Monedas</option>
                  <option value="11-100">11 a 100 Monedas</option>
                  <option value="101-1000">101 a 1,000 Monedas</option>
                  <option value="1000+">Más de 1,000 Monedas</option>
                </select>
              </div>

              <div>
                <label className="gift-search-label">SORT BY:</label>
                <select 
                  className="gift-select-dropdown"
                  value={giftSortBy}
                  onChange={(e) => setGiftSortBy(e.target.value)}
                >
                  <option value="low-to-high">Price: Low to High</option>
                  <option value="high-to-low">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>

            <div className="gift-catalog-grid">
              {filteredGifts.map((gift) => (
                <button 
                  key={gift.id}
                  className="gift-card-btn"
                  onClick={() => {
                    setConfiguringTrigger({ type: 'gift', item: gift });
                    setSelectedEffect('drunk');
                    setSelectedDuration(6);
                    setSelectedTts(true);
                  }}
                >
                  <div className="gift-card-sticker">{gift.icon}</div>
                  <div className="gift-card-name" title={gift.name}>{gift.name}</div>
                  <div className="gift-card-price">
                    <span>🪙</span>
                    <span>{gift.coins}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: SELECT EVENT (TRIGGER)
          ========================================================= */}
      {showEventModal && (
        <div className="modal-overlay-backdrop" onClick={() => setShowEventModal(false)}>
          <div className="modal-dialog-card" style={{ maxWidth: '560px' }} onClick={(e) => e.stopPropagation()}>
            <div className="gift-modal-header">
              <div className="gift-modal-title">
                <div className="gift-modal-title-bar" style={{ background: '#f59e0b' }}></div>
                <span>Select Event (Trigger)</span>
              </div>
              <button className="modal-close-btn" onClick={() => setShowEventModal(false)}>✕</button>
            </div>

            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Selecciona qué evento de tu transmisión en vivo disparará los efectos visuales:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {TIKTOK_EVENTS_CATALOG.map((evt) => (
                <div 
                  key={evt.id}
                  className="feature-card"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.9rem 1.2rem', cursor: 'pointer', transition: 'all 0.2s' }}
                  onClick={() => {
                    setConfiguringTrigger({ type: 'event', item: evt });
                    setSelectedEffect('glitch');
                    setSelectedDuration(6);
                    setSelectedTts(true);
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <span style={{ fontSize: '1.6rem' }}>{evt.icon}</span>
                    <div>
                      <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{evt.name}</strong>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{evt.description}</div>
                    </div>
                  </div>
                  <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>+ Elegir</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: CONFIGURE EFFECT FOR SELECTED TRIGGER
          ========================================================= */}
      {configuringTrigger && (
        <div className="modal-overlay-backdrop" onClick={() => setConfiguringTrigger(null)}>
          <div className="modal-dialog-card" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setConfiguringTrigger(null)}>✕</button>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.4rem' }}>
                {configuringTrigger.item.icon}
              </div>
              <h3 style={{ color: '#fff' }}>
                Asignar Efecto a: <span style={{ color: '#fbbf24' }}>{configuringTrigger.item.name}</span>
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.82rem' }}>
                {configuringTrigger.type === 'gift' 
                  ? `Valor: ${configuringTrigger.item.coins} Monedas de TikTok` 
                  : 'Evento de directo en vivo'}
              </p>
            </div>

            <div className="input-group">
              <label>Efecto Visual (Shader)</label>
              <select 
                className="input-field"
                value={selectedEffect}
                onChange={(e) => setSelectedEffect(e.target.value)}
              >
                {AVAILABLE_EFFECTS.map((eff) => (
                  <option key={eff.id} value={eff.id}>{eff.name}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Duración del Efecto</label>
              <select 
                className="input-field"
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(Number(e.target.value))}
              >
                <option value={3}>3 segundos</option>
                <option value={5}>5 segundos</option>
                <option value={6}>6 segundos</option>
                <option value={8}>8 segundos</option>
                <option value={10}>10 segundos</option>
                <option value={15}>15 segundos</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
              <input 
                type="checkbox" 
                id="cfg-tts"
                checked={selectedTts}
                onChange={(e) => setSelectedTts(e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
              <label htmlFor="cfg-tts" style={{ margin: 0, fontWeight: 'bold', cursor: 'pointer', color: '#e2e8f0' }}>
                🗣️ Activar Voz Narradora (TTS) al activarse
              </label>
            </div>

            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button 
                className="btn btn-secondary" 
                style={{ flex: 1 }}
                onClick={() => setConfiguringTrigger(null)}
              >
                Cancelar
              </button>
              <button 
                className="btn btn-success" 
                style={{ flex: 1.5, fontWeight: 'bold' }}
                onClick={saveNewMapping}
              >
                💾 Guardar Mapeo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: STREAM TROLL LOGIN
          ========================================================= */}
      {showTrollMeLoginModal && (
        <div className="modal-overlay-backdrop" onClick={() => setShowTrollMeLoginModal(false)}>
          <div className="modal-dialog-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowTrollMeLoginModal(false)}>✕</button>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div className="troll-logo-retro" style={{ fontSize: '1.75rem' }}>STREAM TROLL</div>
              <h3 style={{ color: '#fff', marginTop: '0.4rem' }}>{t.trollMeModalTitle}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
                {t.trollMeModalSub}
              </p>
            </div>

            <form onSubmit={loginTrollMe}>
              <div className="input-group">
                <label>Correo Electrónico</label>
                <input 
                  type="email" 
                  className="input-field" 
                  placeholder="ejemplo@streamer.com"
                  value={trollLoginEmail}
                  onChange={(e) => setTrollLoginEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Contraseña</label>
                <input 
                  type="password" 
                  className="input-field" 
                  placeholder="••••••••"
                  value={trollLoginPass}
                  onChange={(e) => setTrollLoginPass(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn" 
                style={{ width: '100%', padding: '0.85rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #06b6d4, #ec4899)', marginBottom: '1rem' }}
              >
                🚀 Iniciar Sesión en Stream Troll
              </button>

              <button 
                type="button" 
                className="btn btn-secondary" 
                style={{ width: '100%', padding: '0.75rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}
                onClick={() => {
                  setTrollLoginEmail('miguerodriguez1008@gmail.com');
                  loginTrollMe();
                }}
              >
                👑 Acceso Rápido Cuenta Demo (miguerodriguez1008 - ULTIMATE)
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '1rem 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>O CONTINUAR CON</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
            </div>

            <button className="social-login-btn" onClick={() => {
              setTrollLoginEmail('streamer_discord@trollme.gg');
              loginTrollMe();
            }}>
              <span>🎮</span> Continuar con Discord
            </button>

            <button className="social-login-btn" onClick={() => {
              setTrollLoginEmail('streamer_google@gmail.com');
              loginTrollMe();
            }}>
              <span>🌐</span> Continuar con Google
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: TIKTOK LOGIN & CONNECT
          ========================================================= */}
      {showTikTokModal && (
        <div className="modal-overlay-backdrop" onClick={() => setShowTikTokModal(false)}>
          <div className="modal-dialog-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowTikTokModal(false)}>✕</button>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                width: '56px',
                height: '56px',
                background: '#000',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem',
                border: '2px solid #06b6d4',
                boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)'
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.5 6.27 6.27 0 0 0 1.87-4.49V8.69a8.16 8.16 0 0 0 4.9 1.62V6.86a4.85 4.85 0 0 1-1-.17z"/>
                </svg>
              </div>
              <h3 style={{ color: '#fff', fontSize: '1.35rem' }}>{t.tiktokModalTitle}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
                {t.tiktokModalSub}
              </p>
            </div>

            <div style={{ background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: '#67e8f9', marginBottom: '0.75rem', fontWeight: 'bold' }}>
                🌐 Iniciar sesión oficial con TikTok.com
              </div>
              <button 
                className="btn" 
                style={{ width: '100%', background: 'linear-gradient(135deg, #06b6d4, #ec4899)', fontWeight: 'bold', padding: '0.85rem' }}
                onClick={openOfficialTikTokLogin}
              >
                🚀 {t.openOfficialTiktok}
              </button>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '6px' }}>
                Abre la ventana oficial segura para escanear código QR o ingresar con contraseña
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#e2e8f0', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>
                🎯 Conexión a Directo de TikTok en Vivo
              </label>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="@tu_usuario_de_tiktok" 
                  value={tiktokUser}
                  onChange={(e) => setTiktokUser(e.target.value)}
                  style={{ marginBottom: 0, flex: 1 }}
                />
                <button 
                  className="btn"
                  style={{ background: isConnected ? '#ef4444' : '#10b981', minWidth: '120px' }}
                  onClick={isConnected ? disconnectTikTok : connectTikTok}
                  disabled={isConnecting}
                >
                  {isConnecting ? 'Conectando...' : isConnected ? 'Desconectar' : 'Conectar'}
                </button>
              </div>
              {connectionStatus && (
                <div style={{ fontSize: '0.8rem', marginTop: '8px', color: isConnected ? '#10b981' : '#f87171' }}>
                  {connectionStatus}
                </div>
              )}
            </div>

            <div style={{ textAlign: 'center', marginBottom: '0.75rem', fontSize: '0.8rem', color: '#94a3b8' }}>
              {t.orUseOptions}
            </div>

            <button className="social-login-btn" onClick={openOfficialTikTokLogin}>
              <span>📱</span> Usar código QR (TikTok App)
            </button>
            <button className="social-login-btn" onClick={openOfficialTikTokLogin}>
              <span>👤</span> Usar teléfono, correo electrónico o usuario
            </button>
            <button className="social-login-btn" onClick={openOfficialTikTokLogin}>
              <span>🔵</span> Continuar con Facebook
            </button>
            <button className="social-login-btn" onClick={openOfficialTikTokLogin}>
              <span>🔴</span> Continuar con Google
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: STREAMER GUIDE
          ========================================================= */}
      {showStreamerGuideModal && (
        <div className="modal-overlay-backdrop" onClick={() => setShowStreamerGuideModal(false)}>
          <div className="modal-dialog-card" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowStreamerGuideModal(false)}>✕</button>

            <h2 style={{ color: '#fff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📖</span> {t.streamerGuide} (Guía Rápida)
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Sigue estos 4 pasos para mostrar los efectos y shaders a tus espectadores en tiempo real:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', borderLeft: '4px solid #38bdf8' }}>
                <strong style={{ color: '#38bdf8' }}>Paso 1: Iniciar Sesión en TikTok y Stream Troll</strong>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '4px' }}>
                  Haz clic en el botón <strong>"Connect → TikTok"</strong> arriba a la derecha e ingresa tu usuario de streamer para escuchar regalos.
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', borderLeft: '4px solid #10b981' }}>
                <strong style={{ color: '#10b981' }}>Paso 2: Seleccionar Pantalla de Juego</strong>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '4px' }}>
                  En el panel <strong>Screen Selection</strong>, verifica que tu monitor principal esté seleccionado y que el <strong>Graphics Engine</strong> esté en ON.
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', borderLeft: '4px solid #f59e0b' }}>
                <strong style={{ color: '#f59e0b' }}>Paso 3: Añadir Fuente a OBS Studio</strong>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '4px' }}>
                  Ve a la pestaña <strong>Overlay (OBS Studio)</strong> y pulsa <strong>"Inyección Automática (1 Clic)"</strong> o copia la URL <code>http://127.0.0.1:18923/#/overlay</code>.
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', borderLeft: '4px solid #ec4899' }}>
                <strong style={{ color: '#ec4899' }}>Paso 4: Mapear Regalos y Trollear</strong>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '4px' }}>
                  Personaliza en <strong>Mappings</strong> qué shader o sonido se activará cuando envíen Rosas, Pandas o Leones.
                </p>
              </div>
            </div>

            <button 
              className="btn btn-success" 
              style={{ width: '100%', marginTop: '1.5rem', padding: '0.85rem', fontWeight: 'bold' }}
              onClick={() => setShowStreamerGuideModal(false)}
            >
              ¡Entendido, vamos a transmitir! 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
