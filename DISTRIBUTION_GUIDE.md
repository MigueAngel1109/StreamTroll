# StreamTroll - Guía de Distribución y Producción

Este documento detalla los pasos críticos y consideraciones a tener en cuenta para empaquetar, distribuir y monetizar **StreamTroll** como una aplicación de escritorio nativa para Windows.

## 1. Empaquetado y Seguridad (Windows SmartScreen)

Para evitar que el instalador de la aplicación parezca inseguro o sospechoso:
- **Instalador Formal**: En lugar de distribuir el `.exe` suelto o en un archivo `.zip`, utilizaremos **Inno Setup** o **NSIS**. Esto nos permitirá generar un `Setup.exe` profesional que incluye desinstalador, y creación de accesos directos.
- **Falsos Positivos**: Subiremos cada nueva versión a **VirusTotal** para garantizar que los motores de los antivirus no marquen nuestro archivo erróneamente por heurística.
- **SmartScreen**: Ya que los certificados Code Signing (EV) son costosos, la página de descargas y los tutoriales de la app incluirán un breve GIF explicativo indicando al usuario cómo hacer clic en *"Más información" -> "Ejecutar de todas formas"*. La reputación en Windows subirá de manera orgánica.

## 2. Alojamiento del Instalador (CDN)

Los instaladores de aplicaciones de escritorio suelen pesar más de 100MB (especialmente si usamos frameworks como Electron o dependencias empaquetadas).
- **GitHub Releases (Recomendado):** Utilizaremos la infraestructura de GitHub creando un *Release* para adjuntar el `.exe`. Es gratuito y proporciona un ancho de banda altísimo para descargas sin costos.
- **Alternativa - Cloudflare R2:** Como plan secundario para escalar, utilizar almacenamiento S3-compatible que no cobra por descarga de datos (egress fee).
- *Nota: Evitaremos usar Google Drive o Dropbox por los límites de cuota y bloqueos automáticos por alto tráfico.*

## 3. Monetización y Licencias (Versión Ultimate)

Para gestionar las suscripciones y la versión de pago:
- **Merchant of Record (MoR):** Nos integraremos con plataformas como **Lemon Squeezy**, **Gumroad** o **Paddle**. Estas pasarelas son perfectas porque se encargan automáticamente de procesar pagos locales, emitir recibos y calcular impuestos internacionales (IVA).
- **Activación de Claves:** La aplicación tendrá un endpoint de validación. Al iniciar la aplicación, StreamTroll validará la licencia entregada por el MoR para verificar si la clave está activa y si no está siendo usada en demasiadas computadoras simultáneamente.

## 4. Requisitos Técnicos y Dependencias

Consideraciones técnicas obligatorias en las computadoras de los clientes:
- **Visual C++ Redistributable:** El instalador (Inno Setup) debe comprobar e instalar automáticamente en modo silencioso las librerías *Visual C++ Redistributable (2015-2022)*, ya que los procesos gráficos (Shaders/Overlay) y herramientas de captura suelen requerirlos.
- **Permisos de Administrador:** En caso de necesitar atajos de teclado globales (Hooks) o interactuar en capas de pantalla completa sobre juegos, el manifiesto del ejecutable se compilará con `RequireAdministrator`.
- **Requisitos Mínimos:** Se especificará claramente en la página web: 
  - Windows 10/11 (64 bits).
  - Tarjeta gráfica con soporte para aceleración de hardware básico.
  - Compatibilidad certificada con OBS Studio y TikTok Live Studio.
