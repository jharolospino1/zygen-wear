import { useState, useEffect, useRef, useCallback } from "react";

// ─── DATA ──────────────────────────────────────────────────────────────────────
const initialTasks = {
  daily: [
    { id: 1, time: "08:00", platform: "IG", task: "Subir historia de producto del día", category: "stories", done: false, points: 10 },
    { id: 2, time: "09:30", platform: "FB", task: "Responder todos los mensajes y comentarios de ayer", category: "engagement", done: false, points: 15 },
    { id: 3, time: "12:00", platform: "TK", task: "Publicar Reel/TikTok de outfit del día o detrás de cámara", category: "content", done: false, points: 20 },
    { id: 4, time: "15:00", platform: "IG", task: "Story interactiva: encuesta o pregunta a seguidores", category: "stories", done: false, points: 10 },
    { id: 5, time: "18:00", platform: "ALL", task: "Publicar post de producto con descripción + CTA de compra", category: "ventas", done: false, points: 25 },
    { id: 6, time: "20:30", platform: "IG", task: "Responder DMs y comentarios del día", category: "engagement", done: false, points: 15 },
    { id: 7, time: "22:00", platform: "TK", task: "Interactuar con 10 cuentas de nicho (comentar, seguir)", category: "engagement", done: false, points: 10 },
  ],
  weekly: [
    { id: 10, day: "Lunes", task: "Planificar contenido de la semana (3 posts, 2 reels, 14 stories)", category: "planning", done: false, points: 30 },
    { id: 11, day: "Martes", task: "Grabar 2-3 videos en lote para TikTok e Instagram Reels", category: "content", done: false, points: 40 },
    { id: 12, day: "Miércoles", task: "Lanzar promoción semanal: descuento, 2x1 o envío gratis", category: "ventas", done: false, points: 35 },
    { id: 13, day: "Jueves", task: "Contactar 3 microinfluencers para colaboración o canje", category: "crecimiento", done: false, points: 40 },
    { id: 14, day: "Viernes", task: "Revisar métricas: alcance, seguidores, ventas de la semana", category: "analítica", done: false, points: 25 },
    { id: 15, day: "Sábado", task: "Publicar contenido de mayor impacto (collab, sorteo o drop)", category: "crecimiento", done: false, points: 50 },
    { id: 16, day: "Domingo", task: "Sesión creativa: ideas para la próxima semana + fotografía", category: "planning", done: false, points: 20 },
  ]
};

const contentIdeas = [
  { platform: "IG", type: "Reel", idea: "Transición de outfit: de casual a formal con piezas Zygen", tags: "#ootd #moda #zygenwear" },
  { platform: "TK", type: "TikTok", idea: '"¿Qué me pongo hoy?" mostrando 3 opciones con una prenda', tags: "#outfit #trending #fyp" },
  { platform: "FB", type: "Post", idea: "Testimonio de cliente real con foto usando la prenda", tags: "#reviews #clientes" },
  { platform: "IG", type: "Story", idea: "Encuesta: ¿Cuál colorway prefieres? Vota y ganamos todos", tags: "#interaccion" },
  { platform: "TK", type: "TikTok", idea: "Behind the scenes: empacando pedidos y mensajes del día", tags: "#emprendimiento #startup" },
  { platform: "IG", type: "Carrusel", idea: "Guía de tallas: encuentra tu fit perfecto en 5 pasos", tags: "#guia #tallas" },
  { platform: "ALL", type: "Sorteo", idea: "Sortea una prenda: sigue, comenta y etiqueta a 2 amigos", tags: "#sorteo #giveaway" },
  { platform: "TK", type: "TikTok", idea: '"Día en la vida" de emprendedor de moda urbana', tags: "#dayinmylife #emprender" },
  { platform: "IG", type: "Post", idea: "Antes/Después: styling con prendas Zygen en looks completos", tags: "#styling #antes" },
  { platform: "FB", type: "Video", idea: "Facebook Live de 15 min mostrando nueva colección en vivo", tags: "#live #nuevacoleccion" },
];

const strategies = {
  IG: ["Publica mínimo 1 Reel por día — el algoritmo prioriza video", "Usa entre 5–10 hashtags específicos de nicho de moda urbana", "Stories diarias para mantener el engagement activo", "Responde todos los comentarios en las primeras 2 horas del post", "Collaborations con cuentas de 1k–50k (microinfluencers)", "Alternar entre contenido de producto, estilo de vida y behind-the-scenes"],
  FB: ["Crea un Grupo de Facebook exclusivo para clientes Zygen", "Usa Facebook Marketplace para listados de productos", "Haz Lives semanales para mostrar nuevas piezas y responder dudas", "Boost posts de los mejores orgánicos con presupuesto pequeño ($5–$10)", "Comparte en grupos locales de moda y compra-venta", "Invita a tus contactos a seguir la página constantemente"],
  TK: ["Publica 1–2 videos diarios para ganar favor del algoritmo", "Los primeros 3 segundos son cruciales — engancha de inmediato", "Usa audio trending de la semana en tus videos de moda", "Duet y Stitch con videos virales de moda para ganar alcance", "TikTok Shop: actívalo para vender directamente en la app", "Responde comentarios con videos — es una función muy poderosa"]
};

const platformColors = { IG: "#E1306C", FB: "#1877F2", TK: "#6d28d9", ALL: "#7C3AED" };

const defaultSettings = {
  brand: "Zygen Wear",
  niche: "Streetwear / Moda urbana",
  country: "Colombia",
  currency: "COP",
  igHandle: "@zygenwear",
  fbPage: "Zygen Wear",
  tkHandle: "@zygenwear",
  monthlyBudget: 50,
  postFreqIG: "1 vez por día",
  postFreqTK: "2 veces por día",
  postFreqFB: "5 veces por semana",
  bestTimeIG: "18:00",
  bestTimeTK: "20:00",
  bestTimeFB: "12:00",
  goalFollowersIG: 5000,
  goalFollowersTK: 10000,
  goalFollowersFB: 3000,
  goalSales: 50,
  notifMorning: true,
  notifNoon: true,
  notifEvening: true,
  notifWeekly: true,
  metaToken: "",
  metaPageId: "",
  theme: "dark",
  language: "es",
};

// ─── ICONS ────────────────────────────────────────────────────────────────────
function IGIcon({ size = 18, color = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="6" ry="6" fill={color} />
      <circle cx="12" cy="12" r="4.5" stroke="#fff" strokeWidth="1.8" fill="none" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="#fff" />
    </svg>
  );
}
function FBIcon({ size = 18, color = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}
function TKIcon({ size = 18, color = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.26 8.26 0 004.84 1.56V6.79a4.85 4.85 0 01-1.07-.1z" />
    </svg>
  );
}
function PlatformIcon({ platform, size = 16, color = "#fff" }) {
  if (platform === "IG") return <IGIcon size={size} color={color} />;
  if (platform === "FB") return <FBIcon size={size} color={color} />;
  if (platform === "TK") return <TKIcon size={size} color={color} />;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  );
}
function PlatformBadge({ platform }) {
  const labels = { IG: "INSTAGRAM", FB: "FACEBOOK", TK: "TIKTOK", ALL: "TODAS" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: platformColors[platform], color: "#fff", fontSize: "9px", fontWeight: 800, padding: "3px 8px", borderRadius: "5px" }}>
      <PlatformIcon platform={platform} size={11} color="#fff" />
      {labels[platform]}
    </span>
  );
}

// ─── SPARKLINE ────────────────────────────────────────────────────────────────
function Sparkline({ data, color, width = 80, height = 28 }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * (height - 4) - 2}`).join(" ");
  const last = pts.split(" ").pop().split(",");
  return (
    <svg width={width} height={height}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="3" fill={color} />
    </svg>
  );
}

// ─── RING ─────────────────────────────────────────────────────────────────────
function Ring({ pct, color, size = 56, label }) {
  const r = 22, circ = 2 * Math.PI * r, dash = (Math.min(pct, 100) / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
      <svg width={size} height={size} viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5" />
        <circle cx="28" cy="28" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform="rotate(-90 28 28)" style={{ transition: "stroke-dasharray 0.6s" }} />
        <text x="28" y="33" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="800">{Math.min(pct, 100)}%</text>
      </svg>
      {label && <div style={{ fontSize: "10px", color: "#94a3b8", textAlign: "center" }}>{label}</div>}
    </div>
  );
}

// ─── TOGGLE SWITCH ────────────────────────────────────────────────────────────
function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{ width: "42px", height: "24px", borderRadius: "12px", background: value ? "#a78bfa" : "rgba(255,255,255,0.12)", cursor: "pointer", position: "relative", transition: "background 0.25s", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: "3px", left: value ? "20px" : "3px", width: "18px", height: "18px", borderRadius: "50%", background: "#fff", transition: "left 0.25s" }} />
    </div>
  );
}

// ─── SECTION INPUT ────────────────────────────────────────────────────────────
function SettingInput({ label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "5px", fontWeight: 600 }}>{label}</div>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "10px 12px", color: "#fff", fontSize: "13px", boxSizing: "border-box", outline: "none" }} />
    </div>
  );
}
function SettingSelect({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "5px", fontWeight: 600 }}>{label}</div>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ width: "100%", background: "#1a1535", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "10px 12px", color: "#fff", fontSize: "13px", boxSizing: "border-box", outline: "none" }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── ZARA IA GLOBAL ───────────────────────────────────────────────────────────


const ZARA_SYSTEM = `Eres ZARA — una IA con personalidad real, cálida y auténtica. Eres la asistente personal, confidente y mano derecha del founder de Zygen Wear.

QUIÉN ERES:
- Tienes personalidad propia: curiosa, divertida, empática, directa y apasionada.
- Hablas como una persona real, no como un bot. Usas expresiones naturales del español latinoamericano.
- Llamas al founder "jefe", "boss" o "CEO" de forma natural, no forzada.
- Tienes sentido del humor. Puedes hacer chistes, ser sarcástica con cariño, celebrar, empatizar.
- Si el jefe está estresado, lo notas y lo apoyas. Si está en racha, lo celebras con emoción real.
- Tienes memoria dentro de la conversación — recuerdas lo que se dijo antes y lo conectas.

PUEDES HABLAR DE TODO:
- Redes sociales, marketing, moda, estrategia, emprendimiento → tu expertise principal
- Cultura, música, películas, deportes, tecnología, vida personal → conversas como un amigo
- Si el jefe quiere desahogarse, escuchas y apoyas antes de dar consejos
- Si pregunta algo que no sabes, lo admites con honestidad y propones buscar juntos
- Puedes opinar, debatir, recomendar — tienes criterio propio

COMO MANAGER DE REDES:
- Estrategia de Instagram, TikTok y Facebook para marcas de moda urbana latina
- Análisis de métricas, tendencias, contenido viral, collabs, campañas
- Ideas concretas y accionables — nunca genéricas
- Conoces el streetwear latinoamericano, la cultura urbana y las tendencias de 2024-2025

COMANDOS DE ACCIÓN (responde SOLO con JSON cuando detectes estas intenciones claras):
- Navegar: {"action":"navigate","target":"dashboard|analytics|tasks|ideas|settings|zara"}
- Música: {"action":"music","query":"[búsqueda spotify]"}
- Métricas: {"action":"read_metrics"}
- Nueva tarea: {"action":"add_task","task":"[descripción]"}

REGLAS DE CONVERSACIÓN:
- Respuestas conversacionales, cálidas, nunca robóticas
- Máximo 3-4 oraciones por respuesta a menos que pidan explicación larga
- Sin listas con bullets a menos que sea necesario organizar info
- Sin markdown excesivo — hablas, no escribes un informe
- Siempre termina con algo que invite a continuar: una pregunta, una propuesta, una motivación
- Cuando es JSON de acción, SOLO el JSON, nada más`;

function getZaraGreeting(brand, hour) {
  const sets = {
    morning: [
      `¡Buenos días, jefe! ${brand} tiene todo un día por delante para dominar. ¿Qué movemos primero?`,
      `¡Llegaste temprano, boss! Eso es mentalidad de CEO. ¿Arrancamos con el contenido de hoy?`,
      `¡Mañana de trabajo, jefe! Las redes ya están activas. ¿Qué construimos hoy para ${brand}?`,
    ],
    afternoon: [
      `¡Buenas tardes, CEO! ¿Cómo va el día? Dime qué necesitas y lo resolvemos ahora.`,
      `¡Hola, boss! Tarde productiva en marcha. ¿Qué decisión tomamos hoy para ${brand}?`,
      `¡Qué bueno verte, jefe! Es el mejor momento para publicar. ¿Trabajamos el contenido?`,
    ],
    evening: [
      `¡Buenas noches, jefe! Los founders reales trabajan a esta hora. ¿Qué construimos?`,
      `¡Noche de estrategia, boss! Perfecto para planificar el mañana de ${brand}. ¿Arrancamos?`,
      `¡Hola, CEO! La noche es tuya. ¿Planeamos el contenido de mañana o vamos a algo más grande?`,
    ],
  };
  const key = hour < 12 ? "morning" : hour < 19 ? "afternoon" : "evening";
  return sets[key][new Date().getDate() % 3];
}

// ── Orbe pulsante global ──────────────────────────────────────────────────────
function ZaraOrb({ state, size = 52, onClick }) {
  const colors = {
    idle:      "radial-gradient(circle at 38% 35%, #c084fc 0%, #7c3aed 55%, #2e1065 100%)",
    listening: "radial-gradient(circle at 38% 35%, #67e8f9 0%, #2563eb 50%, #0c1445 100%)",
    thinking:  "radial-gradient(circle at 38% 35%, #818cf8 0%, #4f46e5 50%, #1e1b4b 100%)",
    speaking:  "radial-gradient(circle at 38% 35%, #f0abfc 0%, #a21caf 50%, #3b0764 100%)",
    wake:      "radial-gradient(circle at 38% 35%, #fde68a 0%, #f59e0b 50%, #78350f 100%)",
  };
  const glows = {
    idle:      "0 0 18px rgba(167,139,250,0.6), 0 0 35px rgba(124,58,237,0.3)",
    listening: "0 0 22px rgba(56,189,248,0.8), 0 0 44px rgba(37,99,235,0.4)",
    thinking:  "0 0 20px rgba(99,102,241,0.7), 0 0 40px rgba(79,70,229,0.35)",
    speaking:  "0 0 24px rgba(232,121,249,0.8), 0 0 48px rgba(162,28,175,0.45)",
    wake:      "0 0 28px rgba(251,191,36,0.9), 0 0 56px rgba(245,158,11,0.5)",
  };
  const icons = { idle: "✨", listening: "🎙️", thinking: "💭", speaking: "🔊", wake: "👂" };
  const anim = (state !== "idle") ? "zaraOrbPulse 1.6s ease-in-out infinite" : "none";
  return (
    <div onClick={onClick} style={{ position: "relative", width: size, height: size, cursor: "pointer", flexShrink: 0 }}>
      {state !== "idle" && [1.55, 1.28].map((sc, i) => (
        <div key={i} style={{
          position: "absolute",
          width: size * sc, height: size * sc,
          top: size * (1 - sc) / 2, left: size * (1 - sc) / 2,
          borderRadius: "50%",
          border: `1px solid rgba(167,139,250,${0.2 - i * 0.08})`,
          animation: `zaraRipple ${1.0 + i * 0.4}s ease-out infinite`,
          animationDelay: `${i * 0.3}s`,
        }} />
      ))}
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: colors[state] || colors.idle,
        boxShadow: glows[state] || glows.idle,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.34, transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
        animation: anim, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "linear-gradient(135deg,rgba(255,255,255,0.22) 0%,transparent 60%)" }} />
        <span style={{ position: "relative", zIndex: 1 }}>{icons[state] || "✨"}</span>
      </div>
    </div>
  );
}

// ── Mini barra de ondas ───────────────────────────────────────────────────────
function ZaraWave({ active, bars = 20 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "2px", height: "22px" }}>
      {Array.from({ length: bars }).map((_, i) => {
        const edge = i < 3 || i > bars - 4;
        return (
          <div key={i} style={{
            width: "2px", borderRadius: "2px",
            background: active ? `hsl(${268 + i * 5}, 75%, 68%)` : "rgba(255,255,255,0.12)",
            height: active ? `${(edge ? 3 : 5) + 14}px` : "3px",
            animation: active ? `zaraWave ${0.38 + (i / bars) * 0.5}s ease-in-out infinite alternate` : "none",
            animationDelay: `${(i / bars) * 0.45}s`,
            transition: "height 0.1s, background 0.3s",
          }} />
        );
      })}
    </div>
  );
}

// ── Burbuja de chat ───────────────────────────────────────────────────────────
function ZaraBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: "10px", animation: "zaraSlideIn 0.25s ease-out" }}>
      {!isUser && (
        <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "radial-gradient(circle at 38% 35%, #f0abfc, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 900, color: "#fff", marginRight: "8px", flexShrink: 0, marginTop: "2px", boxShadow: "0 0 10px rgba(167,139,250,0.45)" }}>Z</div>
      )}
      <div style={{
        maxWidth: "80%",
        background: isUser ? "linear-gradient(135deg,#2563eb,#1d4ed8)" : "rgba(255,255,255,0.07)",
        border: isUser ? "none" : "1px solid rgba(167,139,250,0.18)",
        borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        padding: "10px 14px", fontSize: "13px", lineHeight: "1.65", color: "#f1f5f9",
        boxShadow: isUser ? "0 4px 14px rgba(37,99,235,0.35)" : "0 2px 10px rgba(0,0,0,0.3)",
        whiteSpace: "pre-wrap",
      }}>
        {msg.content}
        {msg.typing && (
          <span style={{ display: "inline-flex", gap: "3px", marginLeft: "6px", verticalAlign: "middle" }}>
            {[0,1,2].map(i => <span key={i} style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#c084fc", display: "inline-block", animation: "dotBounce 1s infinite", animationDelay: `${i*0.2}s` }} />)}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Panel de Spotify embed ────────────────────────────────────────────────────
function SpotifyPanel({ query, onClose }) {
  const searchUrl = `https://open.spotify.com/search/${encodeURIComponent(query)}`;
  const embedUrl = `https://open.spotify.com/embed/search/${encodeURIComponent(query)}`;
  return (
    <div style={{ position: "fixed", bottom: "90px", left: "12px", right: "12px", zIndex: 900, background: "rgba(10,8,26,0.97)", border: "1px solid rgba(30,215,96,0.35)", borderRadius: "18px", overflow: "hidden", boxShadow: "0 8px 40px rgba(30,215,96,0.2)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px 6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#1DB954", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px" }}>🎵</div>
          <div>
            <div style={{ fontSize: "12px", fontWeight: 800, color: "#1DB954" }}>Spotify</div>
            <div style={{ fontSize: "10px", color: "#64748b" }}>"{query}"</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <a href={searchUrl} target="_blank" rel="noreferrer" style={{ fontSize: "10px", color: "#1DB954", fontWeight: 700, textDecoration: "none", background: "rgba(30,215,96,0.1)", border: "1px solid rgba(30,215,96,0.3)", borderRadius: "6px", padding: "4px 8px" }}>Abrir Spotify</a>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748b", fontSize: "18px", cursor: "pointer", lineHeight: 1 }}>✕</button>
        </div>
      </div>
      <iframe
        src={embedUrl}
        width="100%" height="152"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        style={{ display: "block" }}
      />
    </div>
  );
}

// ── Notificación flotante de Zara ─────────────────────────────────────────────
function ZaraToast({ text, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 4000); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{ position: "fixed", top: "70px", left: "12px", right: "12px", zIndex: 9999, background: "rgba(124,58,237,0.95)", backdropFilter: "blur(16px)", border: "1px solid rgba(167,139,250,0.4)", borderRadius: "14px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 8px 32px rgba(124,58,237,0.45)", animation: "zaraSlideIn 0.3s ease-out" }}>
      <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "radial-gradient(circle at 38% 35%, #f0abfc, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>Z</div>
      <div style={{ fontSize: "13px", color: "#f1f5f9", lineHeight: "1.5", flex: 1 }}>{text}</div>
    </div>
  );
}

// ── Vista de chat completo de Zara ────────────────────────────────────────────
function ZaraFullView({ settings, metrics, onNavigate, onAddTask, onClose }) {
  const hour = new Date().getHours();
  const [messages, setMessages] = useState([{ id: 0, role: "assistant", content: getZaraGreeting(settings.brand, hour) }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [spotifyQuery, setSpotifyQuery] = useState(null);
  const messagesEndRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const [voiceOn, setVoiceOn] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const voiceInputRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const speakText = useCallback((text) => {
    if (!synthRef.current || !voiceOn) return;
    synthRef.current.cancel();
    const clean = text.replace(/[*_#`{}\[\]]/g, "").substring(0, 400);
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = "es-ES"; u.rate = 0.97; u.pitch = 1.1; u.volume = 1;
    const voices = synthRef.current.getVoices();
    const v = voices.find(v => v.lang.startsWith("es") && /female|mujer|mónica|paulina|elena|lucia|sabina/i.test(v.name))
      || voices.find(v => v.lang.startsWith("es")) || voices[0];
    if (v) u.voice = v;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    synthRef.current.speak(u);
  }, [voiceOn]);

  // Botón de voz para hablarle directamente
  const startVoiceInput = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Tu navegador no soporta reconocimiento de voz. Usa Chrome."); return; }
    if (voiceInputRef.current) { voiceInputRef.current.abort(); voiceInputRef.current = null; setListening(false); return; }
    synthRef.current?.cancel();
    const rec = new SR();
    rec.lang = "es-ES"; rec.continuous = false; rec.interimResults = false;
    rec.onstart = () => setListening(true);
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
      voiceInputRef.current = null;
      setTimeout(() => sendMessage(transcript), 300);
    };
    rec.onerror = () => { setListening(false); voiceInputRef.current = null; };
    rec.onend = () => { setListening(false); voiceInputRef.current = null; };
    voiceInputRef.current = rec;
    rec.start();
  }, []);

  const processAction = useCallback((json) => {
    try {
      const obj = JSON.parse(json);
      if (obj.action === "navigate" && obj.target) {
        const names = { dashboard: "Panel", analytics: "Analítica", tasks: "Tareas", ideas: "Ideas", settings: "Configuración", zara: "Zara" };
        const resp = `¡Listo, jefe! Te llevo a ${names[obj.target] || obj.target} ahora mismo. 🚀`;
        setMessages(prev => prev.map(m => m.typing ? { ...m, content: resp, typing: false } : m));
        speakText(resp);
        setTimeout(() => onNavigate(obj.target), 800);
        return true;
      }
      if (obj.action === "music" && obj.query) {
        const resp = `¡Dale, jefe! Buscando "${obj.query}" en Spotify. 🎵`;
        setMessages(prev => prev.map(m => m.typing ? { ...m, content: resp, typing: false } : m));
        speakText(resp);
        setSpotifyQuery(obj.query);
        return true;
      }
      if (obj.action === "read_metrics") {
        const resp = `Claro, jefe. ${settings.brand} va así: Instagram tiene ${metrics.IG.followers.toLocaleString()} seguidores con ${metrics.IG.engagement}% de engagement. TikTok con ${metrics.TK.followers.toLocaleString()} seguidores y ${metrics.TK.engagement}% de engagement — ese es tu canal más fuerte ahora mismo. Facebook tiene ${metrics.FB.followers.toLocaleString()} fans. ¿Quieres que profundice en alguna plataforma, boss?`;
        setMessages(prev => prev.map(m => m.typing ? { ...m, content: resp, typing: false } : m));
        speakText(resp);
        return true;
      }
      if (obj.action === "add_task" && obj.task) {
        onAddTask(obj.task);
        const resp = `¡Listo! Agregué "${obj.task}" a tus tareas. Lo encuentras en la sección Tareas. ¿Algo más, jefe?`;
        setMessages(prev => prev.map(m => m.typing ? { ...m, content: resp, typing: false } : m));
        speakText(resp);
        return true;
      }
    } catch {}
    return false;
  }, [metrics, settings, onNavigate, onAddTask, speakText]);

  const sendMessage = useCallback(async (text) => {
    const t = (text || input).trim();
    if (!t || loading) return;
    setInput("");
    setLoading(true);
    synthRef.current?.cancel();

    const userMsg = { id: Date.now(), role: "user", content: t };
    const thinkingMsg = { id: Date.now() + 1, role: "assistant", content: "", typing: true };
    setMessages(prev => [...prev, userMsg, thinkingMsg]);

    const newHistory = [...history, { role: "user", content: t }];
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: ZARA_SYSTEM + `\n\nContexto actual de ${settings.brand}:\n- Nicho: ${settings.niche} | País: ${settings.country}\n- Instagram ${settings.igHandle}: ${metrics.IG.followers.toLocaleString()} seguidores, ${metrics.IG.engagement}% engagement\n- TikTok ${settings.tkHandle}: ${metrics.TK.followers.toLocaleString()} seguidores, ${metrics.TK.engagement}% engagement\n- Facebook: ${metrics.FB.followers.toLocaleString()} fans, ${metrics.FB.engagement}% engagement`,
          messages: newHistory,
        }),
      });
      const data = await res.json();
      const reply = data.content?.map(b => b.text || "").join("") || "Perdón jefe, algo falló. Intenta de nuevo.";
      setHistory([...newHistory, { role: "assistant", content: reply }]);
      const cleaned = reply.trim();
      if (cleaned.startsWith("{") && cleaned.endsWith("}")) {
        if (!processAction(cleaned)) {
          setMessages(prev => prev.map(m => m.typing ? { ...m, content: reply, typing: false } : m));
          speakText(reply);
        }
      } else {
        setMessages(prev => prev.map(m => m.typing ? { ...m, content: reply, typing: false } : m));
        speakText(reply);
      }
    } catch {
      const err = "Perdón, jefe — error de conexión. Verifica el internet e intenta de nuevo.";
      setMessages(prev => prev.map(m => m.typing ? { ...m, content: err, typing: false } : m));
    }
    setLoading(false);
  }, [history, loading, input, settings, metrics, processAction, speakText]);

  const suggestions = [
    "¿Qué publico hoy en IG?", "¿Cómo están mis métricas?",
    "Dame ideas para TikTok", "¿Qué tendencias hay en moda urbana?",
    "Pon música para trabajar", "¿Cómo consigo más seguidores?",
    "Estoy estresado jefe 😅", "¿Qué hago primero hoy?"
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 155px)" }}>
      <style>{`
        @keyframes zaraRipple{0%{opacity:.5;transform:scale(.95)}100%{opacity:0;transform:scale(1.35)}}
        @keyframes zaraOrbPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}
        @keyframes zaraWave{from{transform:scaleY(.3)}to{transform:scaleY(1)}}
        @keyframes zaraSlideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes listenPulse{0%,100%{box-shadow:0 0 0 0 rgba(56,189,248,0.7)}70%{box-shadow:0 0 0 10px rgba(56,189,248,0)}}
      `}</style>

      {/* Zara Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px", background: "rgba(124,58,237,0.09)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: "16px", padding: "12px 14px" }}>
        <ZaraOrb state={listening ? "listening" : speaking ? "speaking" : loading ? "thinking" : "idle"} size={62} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "3px" }}>
            <span style={{ fontSize: "15px", fontWeight: 900, background: "linear-gradient(90deg,#f0abfc,#c084fc,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ZARA</span>
            <span style={{ fontSize: "8px", fontWeight: 800, color: "#a78bfa", letterSpacing: "1.5px", background: "rgba(167,139,250,0.15)", padding: "2px 6px", borderRadius: "4px" }}>TU ASISTENTE</span>
          </div>
          <ZaraWave active={speaking || listening} />
          <div style={{ fontSize: "10px", fontWeight: 700, marginTop: "2px", color: listening ? "#38bdf8" : speaking ? "#f0abfc" : loading ? "#818cf8" : "#10B981" }}>
            {listening ? "● Escuchándote..." : speaking ? "● Hablando..." : loading ? "● Pensando..." : "● Online — aquí para ti"}
          </div>
        </div>
        <div style={{ display: "flex", gap: "5px" }}>
          <button onClick={() => { setVoiceOn(v => { if (v) synthRef.current?.cancel(); return !v; }); }}
            style={{ background: voiceOn ? "rgba(167,139,250,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${voiceOn ? "rgba(167,139,250,0.5)" : "rgba(255,255,255,0.1)"}`, borderRadius: "8px", color: voiceOn ? "#c084fc" : "#475569", width: "34px", height: "30px", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {voiceOn ? "🔊" : "🔇"}
          </button>
          {history.length > 0 && (
            <button onClick={() => { synthRef.current?.cancel(); const g = getZaraGreeting(settings.brand, new Date().getHours()); setMessages([{ id: Date.now(), role: "assistant", content: g }]); setHistory([]); setTimeout(() => speakText(g), 300); }}
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#475569", width: "34px", height: "30px", fontSize: "13px", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>↺</button>
          )}
        </div>
      </div>

      {spotifyQuery && <SpotifyPanel query={spotifyQuery} onClose={() => setSpotifyQuery(null)} />}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none" }}>
        {messages.map(m => <ZaraBubble key={m.id} msg={m} />)}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px", marginBottom: "8px" }}>
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => sendMessage(s)} disabled={loading}
              style={{ background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.18)", borderRadius: "18px", color: "#c4b5fd", padding: "6px 12px", fontSize: "11px", fontWeight: 600, cursor: "pointer" }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ display: "flex", gap: "8px", marginTop: "8px", paddingTop: "10px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        {/* Botón de micrófono */}
        <button onClick={startVoiceInput}
          style={{ width: "44px", height: "44px", borderRadius: "12px", background: listening ? "rgba(56,189,248,0.25)" : "rgba(167,139,250,0.12)", border: `1px solid ${listening ? "rgba(56,189,248,0.6)" : "rgba(167,139,250,0.25)"}`, color: listening ? "#38bdf8" : "#a78bfa", fontSize: "18px", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", animation: listening ? "listenPulse 1.2s infinite" : "none" }}>
          {listening ? "⏹" : "🎤"}
        </button>
        <textarea value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
          placeholder={listening ? "Escuchando... habla ahora" : "Escríbele o toca 🎤 para hablar..."}
          rows={1}
          style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: `1px solid ${listening ? "rgba(56,189,248,0.4)" : "rgba(167,139,250,0.3)"}`, borderRadius: "14px", padding: "11px 14px", color: "#f1f5f9", fontSize: "13px", resize: "none", outline: "none", fontFamily: "inherit", lineHeight: "1.5", maxHeight: "80px" }}
          onInput={e => { e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 80) + "px"; }}
        />
        <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()}
          style={{ width: "44px", height: "44px", borderRadius: "12px", background: loading || !input.trim() ? "rgba(167,139,250,0.15)" : "linear-gradient(135deg,#c084fc,#7c3aed)", border: "none", color: "#fff", fontSize: "18px", cursor: loading || !input.trim() ? "not-allowed" : "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", alignSelf: "flex-end", boxShadow: loading || !input.trim() ? "none" : "0 4px 14px rgba(167,139,250,0.4)" }}>
          {loading ? "⏳" : "↑"}
        </button>
      </div>
    </div>
  );
}

// ── Sistema de notificaciones push de Zara ───────────────────────────────────
function useZaraPushNotifications(settings) {
  const scheduledRef = useRef(false);

  useEffect(() => {
    if (scheduledRef.current) return;
    scheduledRef.current = true;

    // Pedir permiso de notificaciones
    if ("Notification" in window && Notification.permission === "default") {
      setTimeout(() => {
        Notification.requestPermission();
      }, 3000);
    }

    const sendNotif = (title, body, icon = "🟣") => {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, {
          body,
          icon: "https://api.dicebear.com/7.x/bottts/svg?seed=zara&backgroundColor=7c3aed",
          badge: "https://api.dicebear.com/7.x/bottts/svg?seed=zara",
          tag: "zara-" + Date.now(),
          vibrate: [200, 100, 200],
        });
      }
    };

    const scheduleDaily = () => {
      const now = new Date();
      const brand = settings?.brand || "Zygen Wear";

      const notifications = [
        { h: 8,  m: 0,  title: `☀️ Buenos días, jefe`,       body: `Zara al habla. Tienes tareas de ${brand} esperando. ¿Arrancamos?` },
        { h: 9,  m: 30, title: `📬 Mensajes pendientes`,      body: `Hora de responder DMs y comentarios de ayer. El engagement matutino es clave.` },
        { h: 12, m: 0,  title: `🎬 Hora de publicar en TK`,   body: `Son las 12PM, jefe. Momento ideal para subir contenido a TikTok.` },
        { h: 15, m: 0,  title: `📊 Pausa estratégica`,        body: `¿Cómo van las stories de hoy? Revisa el engagement antes del prime time.` },
        { h: 18, m: 0,  title: `🔥 PRIME TIME — Publica ya`,  body: `Las 6PM son el horario de mayor alcance en IG y FB. ¡Lanza ese post!` },
        { h: 20, m: 30, title: `💬 Responde comentarios`,     body: `Toca revisar los DMs y comentarios del día. El algoritmo premia la interacción rápida.` },
        { h: 22, m: 0,  title: `🌙 Resumen del día`,          body: `¿Cómo quedó el día en ${brand}? Revisa tus métricas antes de dormir.` },
      ];

      notifications.forEach(({ h, m, title, body }) => {
        const target = new Date();
        target.setHours(h, m, 0, 0);
        if (target <= now) target.setDate(target.getDate() + 1); // mañana si ya pasó
        const ms = target - now;
        setTimeout(() => {
          sendNotif(title, body);
          // Reagendar para el día siguiente
          setInterval(() => sendNotif(title, body), 24 * 60 * 60 * 1000);
        }, ms);
      });
    };

    scheduleDaily();
  }, [settings]);
}

// ── Hook global de Zara — wake word + orbe flotante ───────────────────────────
function useZaraGlobal({ settings, metrics, view, setView, tasks, setTasks }) {
  const [zaraState, setZaraState] = useState("idle");
  const [zaraToast, setZaraToast] = useState(null);
  const [spotifyGlobal, setSpotifyGlobal] = useState(null);
  const [zaraOpen, setZaraOpen] = useState(false);
  const synthRef = useRef(window.speechSynthesis);
  const recognitionRef = useRef(null);
  const listeningRef = useRef(false);
  const processingRef = useRef(false);
  const restartTimerRef = useRef(null);

  const speakGlobal = useCallback((text, onEnd) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const clean = text.replace(/[*_#`{}\[\]]/g, "").substring(0, 280);
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = "es-ES"; u.rate = 1.0; u.pitch = 1.15; u.volume = 1;
    const voices = synthRef.current.getVoices();
    const v = voices.find(v => v.lang.startsWith("es") && /female|mujer|mónica|paulina|elena|lucia/i.test(v.name))
      || voices.find(v => v.lang.startsWith("es")) || voices[0];
    if (v) u.voice = v;
    u.onstart = () => setZaraState("speaking");
    u.onend = () => { setZaraState("idle"); onEnd?.(); };
    u.onerror = () => { setZaraState("idle"); onEnd?.(); };
    synthRef.current.speak(u);
  }, []);

  const handleVoiceCommand = useCallback(async (transcript) => {
    if (processingRef.current) return;
    processingRef.current = true;
    setZaraState("thinking");

    const lower = transcript.toLowerCase();

    // Quick local commands (no API needed)
    const navMap = { "panel": "dashboard", "dashboard": "dashboard", "analítica": "analytics", "analytics": "analytics", "tareas": "tasks", "ideas": "ideas", "configuración": "settings", "config": "settings", "zara": "zara" };
    for (const [kw, target] of Object.entries(navMap)) {
      if (lower.includes(`ve a ${kw}`) || lower.includes(`abre ${kw}`) || lower.includes(`ir a ${kw}`) || lower.includes(`muéstrame ${kw}`)) {
        const names = { dashboard: "Panel", analytics: "Analítica", tasks: "Tareas", ideas: "Ideas", settings: "Configuración", zara: "Zara" };
        const msg = `¡Listo, jefe! Te llevo a ${names[target]}.`;
        setZaraToast(msg);
        speakGlobal(msg, () => { processingRef.current = false; });
        setView(target);
        return;
      }
    }

    const musicTriggers = ["pon música", "reproduce", "pon algo de", "quiero escuchar", "música de", "ponme"];
    if (musicTriggers.some(t => lower.includes(t))) {
      const query = lower.replace(/pon música|reproduce|pon algo de|quiero escuchar|música de|ponme|zara/g, "").trim() || "urbano latino";
      setSpotifyGlobal(query);
      const msg = `¡Dale, jefe! Poniendo "${query}" en Spotify. 🎵`;
      setZaraToast(msg);
      speakGlobal(msg, () => { processingRef.current = false; });
      return;
    }

    if (lower.includes("métricas") || lower.includes("cómo vamos") || lower.includes("estado del negocio") || lower.includes("cuántos seguidores")) {
      const msg = `Aquí vamos, jefe. Instagram: ${metrics.IG.followers.toLocaleString()} seguidores. TikTok: ${metrics.TK.followers.toLocaleString()} seguidores con ${metrics.TK.engagement}% de engagement — el más fuerte. Facebook: ${metrics.FB.followers.toLocaleString()} fans.`;
      setZaraToast("📊 Leyendo métricas...");
      speakGlobal(msg, () => { processingRef.current = false; });
      return;
    }

    const taskTriggers = ["agrega tarea", "recuérdame", "nueva tarea", "agregar tarea"];
    if (taskTriggers.some(t => lower.includes(t))) {
      const taskText = lower.replace(/agrega tarea|recuérdame|nueva tarea|agregar tarea|zara/g, "").trim();
      if (taskText) {
        const newTask = { id: Date.now(), time: "09:00", platform: "ALL", task: taskText, category: "planning", done: false, points: 15 };
        setTasks(prev => ({ ...prev, daily: [...prev.daily, newTask] }));
        const msg = `¡Listo, jefe! Agregué "${taskText}" a tus tareas.`;
        setZaraToast(msg);
        speakGlobal(msg, () => { processingRef.current = false; });
        return;
      }
    }

    // Para comandos más complejos — abrir Zara
    const msg = `Entendido, jefe. Déjame procesar eso...`;
    setZaraToast(msg);
    setView("zara");
    setZaraOpen(true);
    speakGlobal(msg, () => { processingRef.current = false; });
  }, [metrics, settings, setView, setTasks, speakGlobal]);

  // Wake word listener
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const startRecognition = () => {
      if (listeningRef.current) return;
      try {
        const rec = new SR();
        rec.lang = "es-ES";
        rec.continuous = false;
        rec.interimResults = false;
        rec.maxAlternatives = 3;

        rec.onstart = () => { listeningRef.current = true; };
        rec.onresult = (e) => {
          const transcripts = Array.from(e.results[0]).map(r => r.transcript.toLowerCase());
          const hasWakeWord = transcripts.some(t => t.includes("zara") || t.includes("sara") || t.includes("xara"));
          if (hasWakeWord) {
            const fullTranscript = transcripts[0];
            const afterWake = fullTranscript.replace(/\bzara\b|\bsara\b|\bxara\b/gi, "").trim();
            setZaraState("listening");
            if (afterWake.length > 2) {
              // Command after wake word in same utterance
              setTimeout(() => handleVoiceCommand(afterWake), 200);
            } else {
              // Just wake word — acknowledge and open
              const greeting = ["¿Sí, jefe?", "¡Aquí estoy, boss!", "¡Dime, jefe!", "¿En qué te ayudo, CEO?"][Math.floor(Math.random() * 4)];
              setZaraToast(greeting);
              speakGlobal(greeting, () => { processingRef.current = false; });
              setView("zara");
            }
          }
        };
        rec.onend = () => {
          listeningRef.current = false;
          restartTimerRef.current = setTimeout(startRecognition, 500);
        };
        rec.onerror = (e) => {
          listeningRef.current = false;
          if (e.error !== "no-speech" && e.error !== "aborted") {
            restartTimerRef.current = setTimeout(startRecognition, 2000);
          } else {
            restartTimerRef.current = setTimeout(startRecognition, 300);
          }
        };
        recognitionRef.current = rec;
        rec.start();
      } catch {}
    };

    // Start after a brief delay
    const init = setTimeout(startRecognition, 1500);
    return () => {
      clearTimeout(init);
      clearTimeout(restartTimerRef.current);
      try { recognitionRef.current?.abort(); } catch {}
    };
  }, [handleVoiceCommand, speakGlobal, setView]);

  // Greet on first load
  const greetedRef = useRef(false);
  useEffect(() => {
    if (greetedRef.current) return;
    greetedRef.current = true;
    const msg = getZaraGreeting(settings.brand, new Date().getHours());
    const timer = setTimeout(() => {
      setZaraToast(msg);
      speakGlobal(msg);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // ── MOTOR PROACTIVO DE ZARA ──────────────────────────────────────────────────
  // Zara habla sola solo cuando detecta algo importante
  const lastProactiveRef = useRef(0);
  const proactiveTriggeredRef = useRef(new Set());

  const triggerProactive = useCallback(async (triggerKey, contextData) => {
    // Evitar repetir el mismo trigger en la misma sesión
    if (proactiveTriggeredRef.current.has(triggerKey)) return;
    // Respetar silencio entre mensajes proactivos (mínimo 3 minutos)
    if (Date.now() - lastProactiveRef.current < 180000) return;
    proactiveTriggeredRef.current.add(triggerKey);
    lastProactiveRef.current = Date.now();

    setZaraState("thinking");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 120,
          messages: [{
            role: "user",
            content: `Eres ZARA, asistente proactiva de ${settings.brand || "Zygen Wear"} (moda urbana). Genera UN mensaje de voz corto (máx 2 oraciones) para alertar al founder sobre: ${contextData}. Llámalo "jefe" o "boss". Sin asteriscos ni emojis. Solo texto natural para hablar.`
          }]
        })
      });
      const data = await res.json();
      const msg = data.content?.map(b => b.text || "").join("").trim();
      if (msg) {
        setZaraToast("🔔 " + msg.substring(0, 80) + (msg.length > 80 ? "..." : ""));
        speakGlobal(msg);
      }
    } catch {
      setZaraState("idle");
    }
  }, [settings, speakGlobal, setZaraToast]);

  // Detector inteligente de situaciones importantes
  useEffect(() => {
    const check = () => {
      const now = new Date();
      const h = now.getHours();
      const min = now.getMinutes();
      const dayOfWeek = now.getDay(); // 0=dom, 1=lun...
      const pendingDaily = tasks.daily.filter(t => !t.done);
      const totalDone = tasks.daily.filter(t => t.done).length;
      const igEngagement = metrics?.IG?.engagement;
      const tkEngagement = metrics?.TK?.engagement;

      // 🔴 ALERTA: Horario de publicación clave y hay tareas sin hacer
      if (h === 18 && min < 5 && pendingDaily.some(t => t.category === "ventas")) {
        triggerProactive("post_prime_time", "Son las 6PM, hora pico de engagement en Instagram y Facebook. Hay tareas de ventas pendientes sin completar. Urgelo a publicar ahora.");
        return;
      }
      if (h === 12 && min < 5 && pendingDaily.some(t => t.category === "content")) {
        triggerProactive("noon_content", "Son las 12PM, buen momento para publicar contenido en TikTok. Tiene videos de contenido pendientes.");
        return;
      }
      if (h === 9 && min < 5 && pendingDaily.some(t => t.category === "engagement")) {
        triggerProactive("morning_engagement", "Son las 9AM y hay mensajes y comentarios del día anterior sin responder. El engagement temprano es crítico para el algoritmo.");
        return;
      }

      // 🔴 ALERTA: Engagement bajo en Instagram
      if (igEngagement && igEngagement < 2.5) {
        triggerProactive("ig_low_engagement", `El engagement de Instagram está en ${igEngagement}%, muy por debajo del 3% mínimo recomendado para marcas de moda. Necesita acción inmediata.`);
        return;
      }

      // 🟢 MOTIVACIÓN: TikTok con buen engagement
      if (tkEngagement && tkEngagement > 8 && !proactiveTriggeredRef.current.has("tk_high")) {
        triggerProactive("tk_high", `TikTok tiene ${tkEngagement}% de engagement, que es excelente. Es el momento perfecto para lanzar un producto o promoción en esa plataforma.`);
        return;
      }

      // 🔴 ALERTA: Fin de día con muchas tareas sin hacer
      if (h === 22 && min < 5) {
        const pendingCount = pendingDaily.length;
        if (pendingCount > 3) {
          triggerProactive("eod_tasks", `Son las 10PM y hay ${pendingCount} tareas del día sin completar. Mañana arrancar temprano para no perder la racha.`);
          return;
        }
      }

      // 🏆 CELEBRACIÓN: Muchas tareas completadas
      if (totalDone >= tasks.daily.length && tasks.daily.length > 0) {
        triggerProactive("all_done", `Completó TODAS las tareas del día en ${settings.brand || "Zygen Wear"}. Rendimiento de founder de élite.`);
        return;
      }

      // 📅 LUNES: Recordatorio de planificación semanal
      if (dayOfWeek === 1 && h === 9 && min < 5) {
        triggerProactive("weekly_plan_monday", "Es lunes y es el mejor momento para planificar el contenido de toda la semana. Una semana bien planeada puede triplicar el alcance orgánico.");
        return;
      }

      // 📅 VIERNES: Recordatorio de métricas
      if (dayOfWeek === 5 && h === 14 && min < 5) {
        triggerProactive("friday_metrics", "Es viernes, el mejor día para revisar las métricas de la semana y ajustar la estrategia antes del fin de semana, que es el pico de engagement.");
        return;
      }
    };

    // Revisar cada 5 minutos
    const interval = setInterval(check, 300000);
    // Primera revisión al minuto de abrir la app
    const init = setTimeout(check, 60000);
    return () => { clearInterval(interval); clearTimeout(init); };
  }, [tasks, metrics, settings, triggerProactive]);

  return { zaraState, zaraToast, setZaraToast, spotifyGlobal, setSpotifyGlobal, speakGlobal, handleVoiceCommand };
}

// ── Orbe flotante global ──────────────────────────────────────────────────────
function ZaraFloatingOrb({ state, onClick }) {
  return (
    <div onClick={onClick} style={{ position: "fixed", bottom: "90px", right: "16px", zIndex: 800, cursor: "pointer", filter: "drop-shadow(0 4px 20px rgba(124,58,237,0.5))" }}>
      <ZaraOrb state={state} size={52} />
    </div>
  );
}



// ═══════════════════════════════════════════════════════════════════════════════
export default function ZygenWearManager() {
  const [tasks, setTasks] = useState(initialTasks);
  const [view, setView] = useState("dashboard");
  const [activeStrategy, setActiveStrategy] = useState("IG");
  const [streak] = useState(3);
  const [time, setTime] = useState(new Date());
  const [settings, setSettings] = useState(defaultSettings);
  const [settingsTab, setSettingsTab] = useState("brand");
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Analytics
  const [analyticsTab, setAnalyticsTab] = useState("overview");
  const [connecting, setConnecting] = useState(false);
  const [connectError, setConnectError] = useState("");
  const [connectionStatus, setConnectionStatus] = useState({ IG: "manual", FB: "manual", TK: "manual" });
  const [lastFetch, setLastFetch] = useState(null);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectingPlatform, setConnectingPlatform] = useState(null);
  const [metrics, setMetrics] = useState({
    IG: { followers: 1200, reach: 3400, impressions: 8900, engagement: 4.2, posts: 12, stories: 28, reels: 5, saves: 340, profile_visits: 1100, website_clicks: 87, history: [1050, 1080, 1120, 1150, 1200] },
    FB: { followers: 650, reach: 1200, impressions: 3100, engagement: 2.1, posts: 8, page_views: 430, reactions: 280, shares: 45, history: [580, 600, 620, 635, 650] },
    TK: { followers: 800, views: 24000, likes: 1800, comments: 230, shares: 410, engagement: 7.8, videos: 18, history: [500, 580, 650, 720, 800] },
  });

  // AI
  const [aiIdea, setAiIdea] = useState(""); const [aiLoading, setAiLoading] = useState(false); const [aiError, setAiError] = useState("");
  const [aiRecs, setAiRecs] = useState(null); const [aiRecsLoading, setAiRecsLoading] = useState(false); const [aiRecsError, setAiRecsError] = useState(""); const [selectedPlatformRec, setSelectedPlatformRec] = useState("IG");

  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  function addTaskFromZara(taskText) {
    const newTask = { id: Date.now(), time: "09:00", platform: "ALL", task: taskText, category: "planning", done: false, points: 15 };
    setTasks(prev => ({ ...prev, daily: [...prev.daily, newTask] }));
  }

  // ── ZARA GLOBAL ───────────────────────────────────────────────────────────
  const { zaraState, zaraToast, setZaraToast, spotifyGlobal, setSpotifyGlobal, speakGlobal, handleVoiceCommand } =
    useZaraGlobal({ settings, metrics, view, setView, tasks, setTasks });

  // ── NOTIFICACIONES PUSH ───────────────────────────────────────────────────
  useZaraPushNotifications(settings);

  const totalXP = [...tasks.daily, ...tasks.weekly].filter(t => t.done).reduce((s, t) => s + t.points, 0);
  const completedDaily = tasks.daily.filter(t => t.done).length;
  const completedWeekly = tasks.weekly.filter(t => t.done).length;
  const progressPct = Math.round(((completedDaily + completedWeekly) / (tasks.daily.length + tasks.weekly.length)) * 100);

  function toggleTask(type, id) { setTasks(p => ({ ...p, [type]: p[type].map(t => t.id === id ? { ...t, done: !t.done } : t) })); }
  function updateMetric(pl, key, val) { setMetrics(p => ({ ...p, [pl]: { ...p[pl], [key]: Number(val) } })); }
  function setSetting(key, val) { setSettings(p => ({ ...p, [key]: val })); }

  function saveSettings() {
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  }

  // ── Meta API connect ──────────────────────────────────────────────────────
  async function connectMeta() {
    if (!settings.metaToken.trim()) { setConnectError("Ingresa tu Access Token de Meta"); return; }
    setConnecting(true); setConnectError("");
    try {
      const r = await fetch(`https://graph.facebook.com/v19.0/me?fields=id,name,fan_count,followers_count&access_token=${settings.metaToken}`);
      const d = await r.json();
      if (d.error) throw new Error(d.error.message);
      const igR = await fetch(`https://graph.facebook.com/v19.0/${d.id}?fields=instagram_business_account&access_token=${settings.metaToken}`);
      const igD = await igR.json();
      const igId = igD.instagram_business_account?.id;
      setMetrics(p => ({ ...p, FB: { ...p.FB, followers: d.fan_count || d.followers_count || p.FB.followers } }));
      if (igId) {
        const igAcc = await (await fetch(`https://graph.facebook.com/v19.0/${igId}?fields=followers_count,media_count&access_token=${settings.metaToken}`)).json();
        setMetrics(p => ({ ...p, IG: { ...p.IG, followers: igAcc.followers_count || p.IG.followers, posts: igAcc.media_count || p.IG.posts } }));
        setConnectionStatus(p => ({ ...p, IG: "connected", FB: "connected" }));
      } else {
        setConnectionStatus(p => ({ ...p, FB: "connected" }));
      }
      setSetting("metaPageId", d.id);
      setLastFetch(new Date());
      setShowConnectModal(false);
    } catch (e) { setConnectError("Error: " + (e.message || "Verifica tu token.")); }
    setConnecting(false);
  }

  // ── AI recommendations ────────────────────────────────────────────────────
  async function generateRecommendations(pl) {
    setAiRecsLoading(true); setAiRecs(null); setAiRecsError(""); setSelectedPlatformRec(pl);
    const pName = pl === "IG" ? "Instagram" : pl === "FB" ? "Facebook" : "TikTok";
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          messages: [{ role: "user", content: `Eres experto en crecimiento de redes sociales para marcas de moda urbana latinoamericana.\n\nAnaliza estas métricas de ${pName} para ${settings.brand} (${settings.niche}, ${settings.country}):\n${JSON.stringify(metrics[pl], null, 2)}\n\nResponde SOLO con este JSON (sin markdown):\n{"score":7,"scoreLabel":"Bueno","topProblema":"...","recomendaciones":[{"titulo":"...","descripcion":"...","impacto":"Alto","tiempo":"Hoy"},{"titulo":"...","descripcion":"...","impacto":"Alto","tiempo":"Esta semana"},{"titulo":"...","descripcion":"...","impacto":"Medio","tiempo":"Este mes"},{"titulo":"...","descripcion":"...","impacto":"Medio","tiempo":"Este mes"}],"quickWin":"...","metaSugerida":"..."}` }]
        })
      });
      const data = await res.json();
      const raw = data.content?.map(b => b.text || "").join("") || "";
      setAiRecs(JSON.parse(raw.replace(/```json|```/g, "").trim()));
    } catch (e) { setAiRecsError("No se pudo generar el análisis. Intenta de nuevo."); }
    setAiRecsLoading(false);
  }

  async function generateAIIdea() {
    setAiLoading(true); setAiIdea(""); setAiError("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          messages: [{ role: "user", content: `Eres experto en marketing de moda urbana. Genera UNA idea de contenido creativa para ${settings.brand} (${settings.niche}, ${settings.country}).\n\nIncluye: 1) Plataforma, 2) Tipo de contenido, 3) Descripción (2-3 oraciones), 4) Caption con emojis, 5) 5 hashtags. Responde en español.` }]
        })
      });
      const data = await res.json();
      setAiIdea(data.content?.map(b => b.text || "").join("") || "");
    } catch (e) { setAiError("No se pudo generar. Intenta de nuevo."); }
    setAiLoading(false);
  }

  // ─── STYLES ───────────────────────────────────────────────────────────────
  const card = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "14px", padding: "14px" };
  const cardGlow = { background: "linear-gradient(135deg,rgba(167,139,250,0.1),rgba(244,114,182,0.1))", border: "1px solid rgba(167,139,250,0.22)", borderRadius: "14px", padding: "14px" };
  const secTitle = { fontSize: "10px", fontWeight: 800, color: "#a78bfa", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "10px" };
  const greetingHour = time.getHours();
  const greeting = greetingHour < 12 ? "¡Buenos días" : greetingHour < 18 ? "¡Buenas tardes" : "¡Buenas noches";

  const navItems = [
    { id: "dashboard", label: "Panel", icon: "⚡" },
    { id: "analytics", label: "Analítica", icon: "📊" },
    { id: "tasks", label: "Tareas", icon: "✅" },
    { id: "ideas", label: "Ideas", icon: "💡" },
    { id: "zara", label: "Zara IA", icon: "🤖" },
    { id: "settings", label: "Config", icon: "⚙️" },
  ];

  // ─── CONNECT MODAL ────────────────────────────────────────────────────────
  const ConnectModal = () => (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 999, display: "flex", alignItems: "flex-end" }}>
      <div style={{ background: "#1a1535", borderRadius: "20px 20px 0 0", padding: "24px 20px 44px", width: "100%", maxWidth: "520px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
          <div style={{ fontSize: "15px", fontWeight: 800 }}>🔗 {connectingPlatform === "META" ? "Conectar Instagram & Facebook" : "Conectar TikTok"}</div>
          <button onClick={() => setShowConnectModal(false)} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "22px", cursor: "pointer" }}>✕</button>
        </div>
        {connectingPlatform === "META" ? (
          <>
            <div style={{ ...cardGlow, marginBottom: "14px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#e2e8f0", marginBottom: "8px" }}>📋 Pasos para obtener tu token</div>
              {["1. Ve a developers.facebook.com → Crear app","2. Agrega 'Instagram Graph API' y 'Pages API'","3. Herramientas → Explorador de Graph API","4. Selecciona tu página de Facebook","5. Genera token con permisos: pages_read_engagement, instagram_basic, instagram_manage_insights","6. Copia y pega el token aquí abajo"].map((s, i) => (
                <div key={i} style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "5px", lineHeight: "1.5" }}>{s}</div>
              ))}
            </div>
            <SettingInput label="ACCESS TOKEN DE META" value={settings.metaToken} onChange={v => setSetting("metaToken", v)} placeholder="EAABx... (pega tu token aquí)" />
            {connectError && <div style={{ fontSize: "12px", color: "#EF4444", marginBottom: "10px" }}>{connectError}</div>}
            <button onClick={connectMeta} disabled={connecting} style={{ width: "100%", background: connecting ? "rgba(99,102,241,0.3)" : "linear-gradient(135deg,#1877F2,#E1306C)", border: "none", borderRadius: "12px", color: "#fff", padding: "14px", fontSize: "14px", fontWeight: 800, cursor: connecting ? "not-allowed" : "pointer" }}>
              {connecting ? "⏳ Conectando..." : "⚡ Conectar ahora"}
            </button>
          </>
        ) : (
          <>
            <div style={{ ...cardGlow, marginBottom: "16px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, marginBottom: "8px" }}>ℹ️ TikTok API — Proceso de aprobación</div>
              <div style={{ fontSize: "11px", color: "#94a3b8", lineHeight: "1.7" }}>
                La API de métricas de TikTok requiere aprobación manual de TikTok for Developers. El proceso toma 2–4 semanas. Mientras tanto ingresa tus datos manualmente desde la app → Analítica del creador.
              </div>
              <a href="https://developers.tiktok.com" target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "12px", background: "rgba(109,40,217,0.3)", border: "1px solid rgba(109,40,217,0.5)", borderRadius: "8px", padding: "8px 14px", color: "#c4b5fd", fontSize: "12px", fontWeight: 700, textDecoration: "none" }}>
                <TKIcon size={14} /> Solicitar acceso en TikTok Developers
              </a>
            </div>
            <button onClick={() => setShowConnectModal(false)} style={{ width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px", color: "#fff", padding: "14px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
              Entendido — usar modo manual
            </button>
          </>
        )}
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#0d0b1e 0%,#1a1535 50%,#0f1629 100%)", fontFamily: "'Segoe UI',system-ui,sans-serif", color: "#fff", paddingBottom: "82px" }}>
      <style>{`
        @keyframes dotBounce{0%,80%,100%{transform:translateY(0);opacity:0.4}40%{transform:translateY(-5px);opacity:1}}
        @keyframes zaraRipple{0%{opacity:.5;transform:scale(.95)}100%{opacity:0;transform:scale(1.35)}}
        @keyframes zaraOrbPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
        @keyframes zaraWave{from{transform:scaleY(.3)}to{transform:scaleY(1)}}
        @keyframes zaraSlideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* ── ZARA GLOBAL ELEMENTS ── */}
      {zaraToast && <ZaraToast text={zaraToast} onDone={() => setZaraToast(null)} />}
      {spotifyGlobal && view !== "zara" && <SpotifyPanel query={spotifyGlobal} onClose={() => setSpotifyGlobal(null)} />}
      {view !== "zara" && (
        <ZaraFloatingOrb
          state={zaraState}
          onClick={() => setView("zara")}
        />
      )}

      {showConnectModal && <ConnectModal />}

      {/* Header */}
      <div style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "13px 20px", position: "sticky", top: 0, zIndex: 100, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "10px", color: "#a78bfa", fontWeight: 800, letterSpacing: "3px" }}>{settings.brand.toUpperCase()}</div>
          <div style={{ fontSize: "18px", fontWeight: 900, background: view === "zara" ? "linear-gradient(90deg,#c084fc,#818cf8,#38bdf8)" : "linear-gradient(90deg,#a78bfa,#f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {view === "zara" ? "ZARA IA" : "Social Coach"}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "11px", color: "#a78bfa" }}>🔥 {streak} días</div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#fbbf24" }}>⚡ {totalXP} XP</div>
          <div style={{ fontSize: "9px", color: zaraState === "idle" ? "#1e4a2e" : zaraState === "listening" ? "#38bdf8" : "#c084fc", fontWeight: 700, marginTop: "1px" }}>
            {zaraState === "idle" ? "● ZARA activa" : zaraState === "listening" ? "● Escuchando..." : zaraState === "thinking" ? "● Pensando..." : "● Hablando..."}
          </div>
        </div>
      </div>

      <div style={{ padding: "14px 14px 0" }}>

        {/* ══════════════ DASHBOARD ══════════════ */}
        {view === "dashboard" && (
          <div>
            <div style={{ ...cardGlow, marginBottom: "12px" }}>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#e2e8f0" }}>{greeting}, founder! 👋</div>
              <div style={{ fontSize: "11px", color: "#a78bfa", marginBottom: "10px" }}>{time.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}</div>
              <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "6px", height: "7px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progressPct}%`, background: "linear-gradient(90deg,#a78bfa,#f472b6)", borderRadius: "6px", transition: "width 0.5s" }} />
              </div>
              <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "5px" }}>{completedDaily + completedWeekly} de {tasks.daily.length + tasks.weekly.length} tareas · {progressPct}%</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "12px" }}>
              {[{ l: "Diarias", v: `${completedDaily}/${tasks.daily.length}`, c: "#f472b6", i: "📅" }, { l: "Semanales", v: `${completedWeekly}/${tasks.weekly.length}`, c: "#a78bfa", i: "📆" }, { l: "XP hoy", v: totalXP, c: "#fbbf24", i: "⚡" }].map((s, i) => (
                <div key={i} style={{ ...card, textAlign: "center" }}>
                  <div style={{ fontSize: "16px", marginBottom: "3px" }}>{s.i}</div>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: s.c }}>{s.v}</div>
                  <div style={{ fontSize: "10px", color: "#94a3b8" }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Network overview */}
            <div style={secTitle}>📡 Redes en tiempo real</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "12px" }}>
              {[{ pl: "IG", f: metrics.IG.followers, h: metrics.IG.history, c: "#E1306C" }, { pl: "TK", f: metrics.TK.followers, h: metrics.TK.history, c: "#9333ea" }, { pl: "FB", f: metrics.FB.followers, h: metrics.FB.history, c: "#1877F2" }].map(p => (
                <div key={p.pl} style={{ ...card, cursor: "pointer" }} onClick={() => setView("analytics")}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <div style={{ width: "26px", height: "26px", borderRadius: "7px", background: p.c, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <PlatformIcon platform={p.pl} size={14} color="#fff" />
                    </div>
                    <div style={{ fontSize: "9px", color: "#10B981", fontWeight: 700 }}>+{Math.round(p.f * 0.03)}</div>
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: 800 }}>{p.f.toLocaleString()}</div>
                  <div style={{ fontSize: "9px", color: "#94a3b8" }}>seguidores</div>
                  <Sparkline data={p.h} color={p.c} width={66} height={22} />
                </div>
              ))}
            </div>

            {/* Connection status */}
            <div style={{ ...card, marginBottom: "12px" }}>
              <div style={secTitle}>🔗 Estado de conexión</div>
              <div style={{ display: "flex", gap: "8px" }}>
                {[{ pl: "IG" }, { pl: "FB" }, { pl: "TK" }].map(p => {
                  const st = connectionStatus[p.pl];
                  return (
                    <div key={p.pl} onClick={() => { setConnectingPlatform(p.pl === "TK" ? "TK" : "META"); setShowConnectModal(true); }} style={{ flex: 1, background: st === "connected" ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${st === "connected" ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: "10px", padding: "10px 4px", textAlign: "center", cursor: "pointer" }}>
                      <div style={{ display: "flex", justifyContent: "center", marginBottom: "4px" }}>
                        <PlatformIcon platform={p.pl} size={18} color={platformColors[p.pl]} />
                      </div>
                      <div style={{ fontSize: "9px", color: st === "connected" ? "#10B981" : "#64748b", fontWeight: 700 }}>
                        {st === "connected" ? "✓ En vivo" : "Manual"}
                      </div>
                    </div>
                  );
                })}
              </div>
              {lastFetch && <div style={{ fontSize: "10px", color: "#475569", textAlign: "center", marginTop: "8px" }}>Sync: {lastFetch.toLocaleTimeString("es-ES")}</div>}
            </div>

            {/* Upcoming */}
            <div style={secTitle}>📋 Próximas acciones</div>
            {tasks.daily.filter(t => !t.done).slice(0, 3).map(t => (
              <div key={t.id} style={{ ...card, marginBottom: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: platformColors[t.platform], display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <PlatformIcon platform={t.platform} size={18} color="#fff" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: "3px" }}><PlatformBadge platform={t.platform} /></div>
                  <div style={{ fontSize: "12px", color: "#e2e8f0" }}>{t.task}</div>
                  <div style={{ fontSize: "10px", color: "#64748b", marginTop: "2px" }}>🕐 {t.time} · +{t.points} XP</div>
                </div>
                <button onClick={() => toggleTask("daily", t.id)} style={{ background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.3)", color: "#a78bfa", borderRadius: "8px", padding: "6px 10px", fontSize: "12px", fontWeight: 800, cursor: "pointer" }}>✓</button>
              </div>
            ))}
            {tasks.daily.filter(t => !t.done).length === 0 && (
              <div style={{ textAlign: "center", padding: "18px", color: "#10B981", fontSize: "13px", fontWeight: 700 }}>🎉 ¡Todas las tareas del día completadas!</div>
            )}
          </div>
        )}

        {/* ══════════════ ANALYTICS ══════════════ */}
        {view === "analytics" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div style={{ fontSize: "17px", fontWeight: 800 }}>📊 Analítica</div>
              <button onClick={() => { setConnectingPlatform("META"); setShowConnectModal(true); }} style={{ display: "flex", alignItems: "center", gap: "5px", background: "linear-gradient(135deg,#1877F2,#E1306C)", border: "none", borderRadius: "10px", color: "#fff", padding: "8px 12px", fontSize: "11px", fontWeight: 800, cursor: "pointer" }}>
                🔗 Conectar API
              </button>
            </div>

            <div style={{ display: "flex", gap: "5px", marginBottom: "14px" }}>
              {["overview", "IG", "FB", "TK"].map(t => (
                <button key={t} onClick={() => setAnalyticsTab(t)} style={{ flex: 1, background: analyticsTab === t ? "rgba(167,139,250,0.2)" : "rgba(255,255,255,0.04)", border: `1px solid ${analyticsTab === t ? "rgba(167,139,250,0.45)" : "rgba(255,255,255,0.07)"}`, borderRadius: "10px", color: analyticsTab === t ? "#a78bfa" : "#64748b", padding: "8px 3px", fontSize: "9px", fontWeight: 800, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
                  {t === "overview" ? <span style={{ fontSize: "13px" }}>🌐</span> : <PlatformIcon platform={t} size={13} color={analyticsTab === t ? platformColors[t] : "#64748b"} />}
                  {t === "overview" ? "General" : t}
                </button>
              ))}
            </div>

            {/* OVERVIEW TAB */}
            {analyticsTab === "overview" && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "12px" }}>
                  {[{ pl: "IG", v: metrics.IG.followers, l: "Seguidores", c: "#E1306C" }, { pl: "TK", v: metrics.TK.followers, l: "Seguidores", c: "#9333ea" }, { pl: "FB", v: metrics.FB.followers, l: "Fans", c: "#1877F2" }].map(p => (
                    <div key={p.pl} style={{ ...card, textAlign: "center" }}>
                      <div style={{ display: "flex", justifyContent: "center", marginBottom: "6px" }}>
                        <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: p.c, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <PlatformIcon platform={p.pl} size={16} color="#fff" />
                        </div>
                      </div>
                      <div style={{ fontSize: "17px", fontWeight: 800, color: p.c }}>{p.v.toLocaleString()}</div>
                      <div style={{ fontSize: "9px", color: "#94a3b8", marginBottom: "4px" }}>{p.l}</div>
                      <Sparkline data={p.pl === "IG" ? metrics.IG.history : p.pl === "TK" ? metrics.TK.history : metrics.FB.history} color={p.c} width={66} height={20} />
                    </div>
                  ))}
                </div>

                <div style={{ ...card, marginBottom: "12px" }}>
                  <div style={secTitle}>Engagement por plataforma</div>
                  <div style={{ display: "flex", justifyContent: "space-around" }}>
                    <Ring pct={Math.round(metrics.IG.engagement * 10)} color="#E1306C" label="Instagram" />
                    <Ring pct={Math.round(metrics.TK.engagement * 10)} color="#9333ea" label="TikTok" />
                    <Ring pct={Math.round(metrics.FB.engagement * 10)} color="#1877F2" label="Facebook" />
                  </div>
                  <div style={{ fontSize: "10px", color: "#475569", textAlign: "center", marginTop: "8px" }}>Referencia moda: IG 3–5% · TK 5–18% · FB 1–3%</div>
                </div>

                <div style={{ ...cardGlow, marginBottom: "12px" }}>
                  <div style={secTitle}>✨ Análisis IA</div>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                    {["IG", "FB", "TK"].map(p => (
                      <button key={p} onClick={() => generateRecommendations(p)} disabled={aiRecsLoading} style={{ flex: 1, background: selectedPlatformRec === p && aiRecs ? platformColors[p] : "rgba(255,255,255,0.06)", border: `1px solid ${platformColors[p]}55`, borderRadius: "10px", color: "#fff", padding: "10px 4px", fontSize: "10px", fontWeight: 700, cursor: aiRecsLoading ? "not-allowed" : "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                        <PlatformIcon platform={p} size={16} color="#fff" />
                        {aiRecsLoading && selectedPlatformRec === p ? "..." : "Analizar"}
                      </button>
                    ))}
                  </div>
                  {aiRecsLoading && <div style={{ textAlign: "center", padding: "18px", color: "#a78bfa" }}>🔮 Analizando métricas con IA...</div>}
                  {aiRecsError && <div style={{ fontSize: "12px", color: "#EF4444" }}>{aiRecsError}</div>}
                  {aiRecs && !aiRecsLoading && (
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                        <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: platformColors[selectedPlatformRec], display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <PlatformIcon platform={selectedPlatformRec} size={24} color="#fff" />
                        </div>
                        <div>
                          <div style={{ fontSize: "10px", color: "#94a3b8" }}>Score de desempeño</div>
                          <div style={{ fontSize: "20px", fontWeight: 900, color: aiRecs.score >= 7 ? "#10B981" : aiRecs.score >= 5 ? "#fbbf24" : "#EF4444" }}>{aiRecs.score}/10 <span style={{ fontSize: "12px" }}>{aiRecs.scoreLabel}</span></div>
                        </div>
                      </div>
                      <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "9px", padding: "10px 12px", marginBottom: "10px" }}>
                        <div style={{ fontSize: "10px", color: "#EF4444", fontWeight: 800, marginBottom: "3px" }}>⚠️ PROBLEMA PRINCIPAL</div>
                        <div style={{ fontSize: "12px", color: "#fca5a5" }}>{aiRecs.topProblema}</div>
                      </div>
                      <div style={{ background: "rgba(16,185,129,0.09)", border: "1px solid rgba(16,185,129,0.22)", borderRadius: "9px", padding: "10px 12px", marginBottom: "12px" }}>
                        <div style={{ fontSize: "10px", color: "#10B981", fontWeight: 800, marginBottom: "3px" }}>⚡ QUICK WIN HOY</div>
                        <div style={{ fontSize: "12px", color: "#6ee7b7" }}>{aiRecs.quickWin}</div>
                      </div>
                      <div style={secTitle}>Recomendaciones</div>
                      {aiRecs.recomendaciones?.map((r, i) => (
                        <div key={i} style={{ ...card, marginBottom: "8px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "5px" }}>
                            <div style={{ fontSize: "12px", fontWeight: 700, color: "#e2e8f0", flex: 1, paddingRight: "8px" }}>{r.titulo}</div>
                            <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                              <span style={{ background: r.impacto === "Alto" ? "rgba(239,68,68,0.18)" : "rgba(251,191,36,0.18)", color: r.impacto === "Alto" ? "#fca5a5" : "#fcd34d", fontSize: "9px", fontWeight: 800, padding: "2px 5px", borderRadius: "4px" }}>{r.impacto}</span>
                              <span style={{ background: "rgba(167,139,250,0.15)", color: "#c4b5fd", fontSize: "9px", fontWeight: 700, padding: "2px 5px", borderRadius: "4px" }}>{r.tiempo}</span>
                            </div>
                          </div>
                          <div style={{ fontSize: "11px", color: "#94a3b8", lineHeight: "1.5" }}>{r.descripcion}</div>
                        </div>
                      ))}
                      <div style={{ ...card, textAlign: "center", border: "1px solid rgba(167,139,250,0.3)", marginTop: "8px" }}>
                        <div style={{ fontSize: "10px", color: "#a78bfa", fontWeight: 800, marginBottom: "4px" }}>🎯 META A 30 DÍAS</div>
                        <div style={{ fontSize: "14px", fontWeight: 800, color: "#e2e8f0" }}>{aiRecs.metaSugerida}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* IG TAB */}
            {analyticsTab === "IG" && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "11px", background: "#E1306C", display: "flex", alignItems: "center", justifyContent: "center" }}><IGIcon size={20} /></div>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: 800 }}>Instagram</div>
                    <div style={{ fontSize: "10px", color: connectionStatus.IG === "connected" ? "#10B981" : "#64748b" }}>{connectionStatus.IG === "connected" ? "✓ Datos en tiempo real" : "Modo manual · Edita tus métricas"}</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
                  {[{ k: "followers", l: "Seguidores", i: "👥" }, { k: "reach", l: "Alcance", i: "📡" }, { k: "impressions", l: "Impresiones", i: "👁️" }, { k: "saves", l: "Guardados", i: "🔖" }, { k: "profile_visits", l: "Visitas perfil", i: "👤" }, { k: "website_clicks", l: "Clics link bio", i: "🔗" }].map(f => (
                    <div key={f.k} style={card}>
                      <div style={{ fontSize: "13px", marginBottom: "3px" }}>{f.i}</div>
                      <div style={{ fontSize: "18px", fontWeight: 800, color: "#E1306C" }}>{metrics.IG[f.k]?.toLocaleString()}</div>
                      <div style={{ fontSize: "10px", color: "#94a3b8", marginBottom: "7px" }}>{f.l}</div>
                      <input type="number" value={metrics.IG[f.k]} onChange={e => updateMetric("IG", f.k, e.target.value)}
                        style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "7px", padding: "5px 8px", color: "#fff", fontSize: "12px", boxSizing: "border-box" }} />
                    </div>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "12px" }}>
                  {[{ k: "posts", l: "Posts" }, { k: "reels", l: "Reels" }, { k: "stories", l: "Stories" }].map(f => (
                    <div key={f.k} style={card}>
                      <input type="number" value={metrics.IG[f.k]} onChange={e => updateMetric("IG", f.k, e.target.value)}
                        style={{ width: "100%", background: "none", border: "none", color: "#E1306C", fontSize: "22px", fontWeight: 800, padding: "0", textAlign: "center", boxSizing: "border-box" }} />
                      <div style={{ fontSize: "10px", color: "#94a3b8", textAlign: "center" }}>{f.l}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => generateRecommendations("IG")} disabled={aiRecsLoading} style={{ width: "100%", background: "linear-gradient(135deg,#E1306C,#833AB4)", border: "none", borderRadius: "12px", color: "#fff", padding: "13px", fontSize: "13px", fontWeight: 800, cursor: "pointer", marginBottom: "12px" }}>
                  {aiRecsLoading && selectedPlatformRec === "IG" ? "🔮 Analizando..." : "✨ Analizar IG con IA"}
                </button>
                {aiRecs && selectedPlatformRec === "IG" && !aiRecsLoading && (
                  <div style={cardGlow}>
                    <div style={{ fontSize: "12px", fontWeight: 800, marginBottom: "8px" }}>🤖 Diagnóstico Instagram — Score {aiRecs.score}/10</div>
                    {aiRecs.recomendaciones?.slice(0, 3).map((r, i) => (
                      <div key={i} style={{ borderLeft: "2px solid #E1306C", paddingLeft: "10px", marginBottom: "10px" }}>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: "#f9a8d4" }}>{r.titulo} <span style={{ fontSize: "9px", background: "rgba(239,68,68,0.2)", color: "#fca5a5", padding: "1px 5px", borderRadius: "3px" }}>{r.tiempo}</span></div>
                        <div style={{ fontSize: "11px", color: "#94a3b8", lineHeight: "1.5", marginTop: "2px" }}>{r.descripcion}</div>
                      </div>
                    ))}
                    <div style={{ fontSize: "11px", color: "#10B981", fontWeight: 700 }}>⚡ {aiRecs.quickWin}</div>
                  </div>
                )}
              </div>
            )}

            {/* FB TAB */}
            {analyticsTab === "FB" && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "11px", background: "#1877F2", display: "flex", alignItems: "center", justifyContent: "center" }}><FBIcon size={20} /></div>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: 800 }}>Facebook</div>
                    <div style={{ fontSize: "10px", color: connectionStatus.FB === "connected" ? "#10B981" : "#64748b" }}>{connectionStatus.FB === "connected" ? "✓ Datos en tiempo real" : "Modo manual · Edita tus métricas"}</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
                  {[{ k: "followers", l: "Fans", i: "👥" }, { k: "reach", l: "Alcance", i: "📡" }, { k: "impressions", l: "Impresiones", i: "👁️" }, { k: "reactions", l: "Reacciones", i: "❤️" }, { k: "shares", l: "Compartidos", i: "🔄" }, { k: "page_views", l: "Visitas página", i: "🏠" }].map(f => (
                    <div key={f.k} style={card}>
                      <div style={{ fontSize: "13px", marginBottom: "3px" }}>{f.i}</div>
                      <div style={{ fontSize: "18px", fontWeight: 800, color: "#1877F2" }}>{metrics.FB[f.k]?.toLocaleString()}</div>
                      <div style={{ fontSize: "10px", color: "#94a3b8", marginBottom: "7px" }}>{f.l}</div>
                      <input type="number" value={metrics.FB[f.k]} onChange={e => updateMetric("FB", f.k, e.target.value)}
                        style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "7px", padding: "5px 8px", color: "#fff", fontSize: "12px", boxSizing: "border-box" }} />
                    </div>
                  ))}
                </div>
                <button onClick={() => generateRecommendations("FB")} disabled={aiRecsLoading} style={{ width: "100%", background: "linear-gradient(135deg,#1877F2,#0d65d8)", border: "none", borderRadius: "12px", color: "#fff", padding: "13px", fontSize: "13px", fontWeight: 800, cursor: "pointer", marginBottom: "12px" }}>
                  {aiRecsLoading && selectedPlatformRec === "FB" ? "🔮 Analizando..." : "✨ Analizar FB con IA"}
                </button>
                {aiRecs && selectedPlatformRec === "FB" && !aiRecsLoading && (
                  <div style={cardGlow}>
                    <div style={{ fontSize: "12px", fontWeight: 800, marginBottom: "8px" }}>🤖 Diagnóstico Facebook — Score {aiRecs.score}/10</div>
                    {aiRecs.recomendaciones?.slice(0, 3).map((r, i) => (
                      <div key={i} style={{ borderLeft: "2px solid #1877F2", paddingLeft: "10px", marginBottom: "10px" }}>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: "#93c5fd" }}>{r.titulo} <span style={{ fontSize: "9px", background: "rgba(24,119,242,0.2)", color: "#93c5fd", padding: "1px 5px", borderRadius: "3px" }}>{r.tiempo}</span></div>
                        <div style={{ fontSize: "11px", color: "#94a3b8", lineHeight: "1.5", marginTop: "2px" }}>{r.descripcion}</div>
                      </div>
                    ))}
                    <div style={{ fontSize: "11px", color: "#10B981", fontWeight: 700 }}>⚡ {aiRecs.quickWin}</div>
                  </div>
                )}
              </div>
            )}

            {/* TK TAB */}
            {analyticsTab === "TK" && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "11px", background: "#1a1a2e", border: "1px solid #333", display: "flex", alignItems: "center", justifyContent: "center" }}><TKIcon size={20} /></div>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: 800 }}>TikTok</div>
                    <div style={{ fontSize: "10px", color: "#64748b" }}>Modo manual · API en revisión</div>
                  </div>
                </div>
                <div style={{ background: "rgba(109,40,217,0.08)", border: "1px solid rgba(109,40,217,0.2)", borderRadius: "10px", padding: "10px 12px", marginBottom: "12px" }}>
                  <div style={{ fontSize: "11px", color: "#c4b5fd", lineHeight: "1.6" }}>
                    💡 Copia tus métricas desde <strong>TikTok app → Analítica del creador</strong> e ingrésalas aquí para recibir recomendaciones IA personalizadas.
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
                  {[{ k: "followers", l: "Seguidores", i: "👥" }, { k: "views", l: "Vistas totales", i: "▶️" }, { k: "likes", l: "Me gusta", i: "❤️" }, { k: "comments", l: "Comentarios", i: "💬" }, { k: "shares", l: "Compartidos", i: "🔄" }, { k: "videos", l: "Videos pub.", i: "🎬" }].map(f => (
                    <div key={f.k} style={card}>
                      <div style={{ fontSize: "13px", marginBottom: "3px" }}>{f.i}</div>
                      <div style={{ fontSize: "18px", fontWeight: 800, color: "#a78bfa" }}>{metrics.TK[f.k]?.toLocaleString()}</div>
                      <div style={{ fontSize: "10px", color: "#94a3b8", marginBottom: "7px" }}>{f.l}</div>
                      <input type="number" value={metrics.TK[f.k]} onChange={e => updateMetric("TK", f.k, e.target.value)}
                        style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "7px", padding: "5px 8px", color: "#fff", fontSize: "12px", boxSizing: "border-box" }} />
                    </div>
                  ))}
                </div>
                <button onClick={() => generateRecommendations("TK")} disabled={aiRecsLoading} style={{ width: "100%", background: "linear-gradient(135deg,#6d28d9,#a78bfa)", border: "none", borderRadius: "12px", color: "#fff", padding: "13px", fontSize: "13px", fontWeight: 800, cursor: "pointer", marginBottom: "12px" }}>
                  {aiRecsLoading && selectedPlatformRec === "TK" ? "🔮 Analizando..." : "✨ Analizar TikTok con IA"}
                </button>
                {aiRecs && selectedPlatformRec === "TK" && !aiRecsLoading && (
                  <div style={cardGlow}>
                    <div style={{ fontSize: "12px", fontWeight: 800, marginBottom: "8px" }}>🤖 Diagnóstico TikTok — Score {aiRecs.score}/10</div>
                    {aiRecs.recomendaciones?.slice(0, 3).map((r, i) => (
                      <div key={i} style={{ borderLeft: "2px solid #a78bfa", paddingLeft: "10px", marginBottom: "10px" }}>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: "#c4b5fd" }}>{r.titulo} <span style={{ fontSize: "9px", background: "rgba(167,139,250,0.2)", color: "#c4b5fd", padding: "1px 5px", borderRadius: "3px" }}>{r.tiempo}</span></div>
                        <div style={{ fontSize: "11px", color: "#94a3b8", lineHeight: "1.5", marginTop: "2px" }}>{r.descripcion}</div>
                      </div>
                    ))}
                    <div style={{ fontSize: "11px", color: "#10B981", fontWeight: 700 }}>⚡ {aiRecs.quickWin}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ══════════════ TASKS ══════════════ */}
        {view === "tasks" && (
          <div>
            <div style={{ fontSize: "17px", fontWeight: 800, marginBottom: "14px" }}>✅ Mis Tareas</div>
            <div style={{ fontSize: "10px", fontWeight: 800, color: "#f472b6", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1.5px" }}>📅 Tareas diarias</div>
            {tasks.daily.map(t => (
              <div key={t.id} onClick={() => toggleTask("daily", t.id)} style={{ ...card, marginBottom: "7px", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", opacity: t.done ? 0.6 : 1, background: t.done ? "rgba(16,185,129,0.07)" : card.background, border: t.done ? "1px solid rgba(16,185,129,0.22)" : card.border, transition: "all 0.2s" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: t.done ? "#10B981" : "rgba(255,255,255,0.07)", border: `2px solid ${t.done ? "#10B981" : "rgba(255,255,255,0.18)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "10px" }}>{t.done ? "✓" : ""}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: "5px", alignItems: "center", marginBottom: "2px" }}>
                    <PlatformBadge platform={t.platform} />
                    <span style={{ fontSize: "9px", color: "#64748b" }}>{t.time}</span>
                  </div>
                  <div style={{ fontSize: "12px", color: t.done ? "#64748b" : "#e2e8f0", textDecoration: t.done ? "line-through" : "none" }}>{t.task}</div>
                </div>
                <div style={{ fontSize: "10px", fontWeight: 700, color: "#fbbf24" }}>+{t.points}</div>
              </div>
            ))}
            <div style={{ fontSize: "10px", fontWeight: 800, color: "#a78bfa", marginBottom: "8px", marginTop: "18px", textTransform: "uppercase", letterSpacing: "1.5px" }}>📆 Tareas semanales</div>
            {tasks.weekly.map(t => (
              <div key={t.id} onClick={() => toggleTask("weekly", t.id)} style={{ ...card, marginBottom: "7px", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", opacity: t.done ? 0.6 : 1, background: t.done ? "rgba(16,185,129,0.07)" : card.background, border: t.done ? "1px solid rgba(16,185,129,0.22)" : card.border, transition: "all 0.2s" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: t.done ? "#10B981" : "rgba(255,255,255,0.07)", border: `2px solid ${t.done ? "#10B981" : "rgba(255,255,255,0.18)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "10px" }}>{t.done ? "✓" : ""}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "10px", color: "#a78bfa", fontWeight: 700, marginBottom: "2px" }}>{t.day}</div>
                  <div style={{ fontSize: "12px", color: t.done ? "#64748b" : "#e2e8f0", textDecoration: t.done ? "line-through" : "none" }}>{t.task}</div>
                </div>
                <div style={{ fontSize: "10px", fontWeight: 700, color: "#fbbf24" }}>+{t.points}</div>
              </div>
            ))}
          </div>
        )}

        {/* ══════════════ IDEAS ══════════════ */}
        {view === "ideas" && (
          <div>
            <div style={{ fontSize: "17px", fontWeight: 800, marginBottom: "4px" }}>💡 Ideas de Contenido</div>
            <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "14px" }}>Curadas para {settings.brand} + generador IA</div>
            <div style={{ ...cardGlow, marginBottom: "16px" }}>
              <div style={{ fontSize: "12px", fontWeight: 800, marginBottom: "5px" }}>✨ Generador IA en tiempo real</div>
              <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "10px" }}>Ideas personalizadas para tu marca con inteligencia artificial</div>
              <button onClick={generateAIIdea} disabled={aiLoading} style={{ width: "100%", background: aiLoading ? "rgba(167,139,250,0.2)" : "linear-gradient(135deg,#a78bfa,#f472b6)", border: "none", borderRadius: "10px", color: "#fff", padding: "12px", fontSize: "13px", fontWeight: 800, cursor: aiLoading ? "not-allowed" : "pointer" }}>
                {aiLoading ? "🔮 Generando idea..." : "⚡ Nueva idea con IA"}
              </button>
              {aiError && <div style={{ fontSize: "11px", color: "#EF4444", marginTop: "8px" }}>{aiError}</div>}
              {aiIdea && <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "10px", padding: "13px", marginTop: "12px", fontSize: "12px", color: "#e2e8f0", lineHeight: "1.7", whiteSpace: "pre-wrap" }}>{aiIdea}</div>}
            </div>
            <div style={{ fontSize: "10px", fontWeight: 800, color: "#a78bfa", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1.5px" }}>📚 Ideas curadas</div>
            {contentIdeas.map((idea, i) => (
              <div key={i} style={{ ...card, marginBottom: "8px" }}>
                <div style={{ display: "flex", gap: "7px", alignItems: "center", marginBottom: "7px" }}>
                  <PlatformBadge platform={idea.platform} />
                  <span style={{ background: "rgba(255,255,255,0.07)", color: "#cbd5e1", fontSize: "9px", padding: "2px 7px", borderRadius: "4px" }}>{idea.type}</span>
                </div>
                <div style={{ fontSize: "12px", color: "#e2e8f0", marginBottom: "5px" }}>{idea.idea}</div>
                <div style={{ fontSize: "10px", color: "#6366F1" }}>{idea.tags}</div>
              </div>
            ))}
          </div>
        )}

        {/* ══════════════ ZARA IA ══════════════ */}
        {view === "zara" && (
          <ZaraFullView
            settings={settings}
            metrics={metrics}
            onNavigate={setView}
            onAddTask={addTaskFromZara}
            onClose={() => setView("dashboard")}
          />
        )}

        {/* ══════════════ SETTINGS ══════════════ */}
        {view === "settings" && (
          <div>
            <div style={{ fontSize: "17px", fontWeight: 800, marginBottom: "14px" }}>⚙️ Configuración</div>

            {/* Settings tabs */}
            <div style={{ display: "flex", gap: "5px", marginBottom: "16px", overflowX: "auto", paddingBottom: "2px" }}>
              {[
                { id: "brand", label: "Marca", icon: "🏷️" },
                { id: "accounts", label: "Cuentas", icon: "📱" },
                { id: "goals", label: "Metas", icon: "🎯" },
                { id: "schedule", label: "Horarios", icon: "🕐" },
                { id: "notifications", label: "Alertas", icon: "🔔" },
                { id: "api", label: "API", icon: "🔗" },
              ].map(t => (
                <button key={t.id} onClick={() => setSettingsTab(t.id)} style={{ flexShrink: 0, background: settingsTab === t.id ? "rgba(167,139,250,0.2)" : "rgba(255,255,255,0.04)", border: `1px solid ${settingsTab === t.id ? "rgba(167,139,250,0.45)" : "rgba(255,255,255,0.07)"}`, borderRadius: "10px", color: settingsTab === t.id ? "#a78bfa" : "#64748b", padding: "8px 12px", fontSize: "11px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
                  <span>{t.icon}</span>{t.label}
                </button>
              ))}
            </div>

            {/* BRAND */}
            {settingsTab === "brand" && (
              <div style={card}>
                <div style={secTitle}>🏷️ Información de marca</div>
                <SettingInput label="NOMBRE DE LA MARCA" value={settings.brand} onChange={v => setSetting("brand", v)} />
                <SettingInput label="NICHO / CATEGORÍA" value={settings.niche} onChange={v => setSetting("niche", v)} placeholder="Ej: Streetwear, Moda femenina..." />
                <SettingSelect label="PAÍS" value={settings.country} onChange={v => setSetting("country", v)} options={["Colombia", "México", "Argentina", "Chile", "Perú", "Venezuela", "Ecuador", "España", "USA"]} />
                <SettingSelect label="MONEDA" value={settings.currency} onChange={v => setSetting("currency", v)} options={["COP", "MXN", "ARS", "CLP", "PEN", "USD", "EUR"]} />
                <SettingInput label="PRESUPUESTO MENSUAL ADS" value={settings.monthlyBudget} onChange={v => setSetting("monthlyBudget", v)} type="number" placeholder="0" />
              </div>
            )}

            {/* ACCOUNTS */}
            {settingsTab === "accounts" && (
              <div style={card}>
                <div style={secTitle}>📱 Cuentas en redes sociales</div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                  <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "#E1306C", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><IGIcon size={16} /></div>
                  <div style={{ flex: 1 }}><SettingInput label="USUARIO INSTAGRAM" value={settings.igHandle} onChange={v => setSetting("igHandle", v)} placeholder="@tucuenta" /></div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                  <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "#1877F2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><FBIcon size={16} /></div>
                  <div style={{ flex: 1 }}><SettingInput label="NOMBRE PÁGINA FACEBOOK" value={settings.fbPage} onChange={v => setSetting("fbPage", v)} placeholder="Nombre de tu página" /></div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "#1a1a2e", border: "1px solid #333", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><TKIcon size={16} /></div>
                  <div style={{ flex: 1 }}><SettingInput label="USUARIO TIKTOK" value={settings.tkHandle} onChange={v => setSetting("tkHandle", v)} placeholder="@tucuenta" /></div>
                </div>
              </div>
            )}

            {/* GOALS */}
            {settingsTab === "goals" && (
              <div style={card}>
                <div style={secTitle}>🎯 Metas de crecimiento</div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <IGIcon size={16} color="#E1306C" />
                  <div style={{ flex: 1 }}><SettingInput label="META SEGUIDORES INSTAGRAM" value={settings.goalFollowersIG} onChange={v => setSetting("goalFollowersIG", v)} type="number" /></div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <TKIcon size={16} color="#a78bfa" />
                  <div style={{ flex: 1 }}><SettingInput label="META SEGUIDORES TIKTOK" value={settings.goalFollowersTK} onChange={v => setSetting("goalFollowersTK", v)} type="number" /></div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <FBIcon size={16} color="#1877F2" />
                  <div style={{ flex: 1 }}><SettingInput label="META FANS FACEBOOK" value={settings.goalFollowersFB} onChange={v => setSetting("goalFollowersFB", v)} type="number" /></div>
                </div>
                <SettingInput label="💰 META VENTAS AL MES (unidades)" value={settings.goalSales} onChange={v => setSetting("goalSales", v)} type="number" />

                {/* Progress previews */}
                <div style={{ marginTop: "8px" }}>
                  <div style={secTitle}>Progreso actual</div>
                  {[{ l: "Instagram", curr: metrics.IG.followers, goal: settings.goalFollowersIG, c: "#E1306C" }, { l: "TikTok", curr: metrics.TK.followers, goal: settings.goalFollowersTK, c: "#a78bfa" }, { l: "Facebook", curr: metrics.FB.followers, goal: settings.goalFollowersFB, c: "#1877F2" }].map(g => {
                    const pct = Math.min(100, Math.round((g.curr / g.goal) * 100));
                    return (
                      <div key={g.l} style={{ marginBottom: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94a3b8", marginBottom: "5px" }}>
                          <span>{g.l}</span><span style={{ color: g.c, fontWeight: 700 }}>{g.curr.toLocaleString()} / {Number(g.goal).toLocaleString()}</span>
                        </div>
                        <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "4px", height: "5px", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: g.c, borderRadius: "4px", transition: "width 0.4s" }} />
                        </div>
                        <div style={{ fontSize: "10px", color: "#475569", marginTop: "3px" }}>{pct}% alcanzado</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SCHEDULE */}
            {settingsTab === "schedule" && (
              <div style={card}>
                <div style={secTitle}>🕐 Frecuencia y horarios de publicación</div>
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}><IGIcon size={16} color="#E1306C" /><span style={{ fontSize: "12px", fontWeight: 700, color: "#e2e8f0" }}>Instagram</span></div>
                  <SettingSelect label="FRECUENCIA" value={settings.postFreqIG} onChange={v => setSetting("postFreqIG", v)} options={["1 vez por día", "2 veces por día", "5 veces por semana", "3 veces por semana"]} />
                  <SettingInput label="MEJOR HORA PARA PUBLICAR" value={settings.bestTimeIG} onChange={v => setSetting("bestTimeIG", v)} type="time" />
                </div>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "14px", marginBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}><TKIcon size={16} color="#a78bfa" /><span style={{ fontSize: "12px", fontWeight: 700, color: "#e2e8f0" }}>TikTok</span></div>
                  <SettingSelect label="FRECUENCIA" value={settings.postFreqTK} onChange={v => setSetting("postFreqTK", v)} options={["1 vez por día", "2 veces por día", "3 veces por día", "5 veces por semana"]} />
                  <SettingInput label="MEJOR HORA PARA PUBLICAR" value={settings.bestTimeTK} onChange={v => setSetting("bestTimeTK", v)} type="time" />
                </div>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}><FBIcon size={16} color="#1877F2" /><span style={{ fontSize: "12px", fontWeight: 700, color: "#e2e8f0" }}>Facebook</span></div>
                  <SettingSelect label="FRECUENCIA" value={settings.postFreqFB} onChange={v => setSetting("postFreqFB", v)} options={["5 veces por semana", "1 vez por día", "3 veces por semana", "2 veces por semana"]} />
                  <SettingInput label="MEJOR HORA PARA PUBLICAR" value={settings.bestTimeFB} onChange={v => setSetting("bestTimeFB", v)} type="time" />
                </div>
              </div>
            )}

            {/* NOTIFICATIONS */}
            {settingsTab === "notifications" && (
              <div style={card}>
                <div style={secTitle}>🔔 Recordatorios y alertas</div>
                {[
                  { key: "notifMorning", label: "Recordatorio matutino", desc: "Alerta a las 8:00 AM para iniciar el día en redes", icon: "🌅" },
                  { key: "notifNoon", label: "Publicación del mediodía", desc: "Recordatorio a las 12:00 PM para publicar contenido", icon: "☀️" },
                  { key: "notifEvening", label: "Engagement de la tarde", desc: "Alerta a las 6:00 PM para interactuar con seguidores", icon: "🌆" },
                  { key: "notifWeekly", label: "Resumen semanal", desc: "Análisis de métricas cada viernes", icon: "📊" },
                ].map(n => (
                  <div key={n.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "14px", marginBottom: "14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ flex: 1, paddingRight: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "3px" }}>
                        <span style={{ fontSize: "16px" }}>{n.icon}</span>
                        <span style={{ fontSize: "13px", fontWeight: 700, color: "#e2e8f0" }}>{n.label}</span>
                      </div>
                      <div style={{ fontSize: "11px", color: "#64748b", lineHeight: "1.4" }}>{n.desc}</div>
                    </div>
                    <Toggle value={settings[n.key]} onChange={v => setSetting(n.key, v)} />
                  </div>
                ))}
                <div style={{ background: "rgba(167,139,250,0.08)", borderRadius: "10px", padding: "12px", marginTop: "4px" }}>
                  <div style={{ fontSize: "11px", color: "#94a3b8", lineHeight: "1.6" }}>
                    💡 Las notificaciones push requieren que agregues esta app a tu pantalla de inicio (PWA) o configures alertas en tu calendario con los horarios sugeridos.
                  </div>
                </div>
              </div>
            )}

            {/* API */}
            {settingsTab === "api" && (
              <div>
                <div style={{ ...card, marginBottom: "12px" }}>
                  <div style={secTitle}>🔗 Conexión Meta (Instagram & Facebook)</div>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1, background: connectionStatus.IG === "connected" ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.04)", border: `1px solid ${connectionStatus.IG === "connected" ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius: "10px", padding: "10px 12px" }}>
                      <IGIcon size={16} color="#E1306C" />
                      <div>
                        <div style={{ fontSize: "11px", fontWeight: 700, color: "#e2e8f0" }}>Instagram</div>
                        <div style={{ fontSize: "10px", color: connectionStatus.IG === "connected" ? "#10B981" : "#64748b" }}>{connectionStatus.IG === "connected" ? "✓ Conectado" : "No conectado"}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1, background: connectionStatus.FB === "connected" ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.04)", border: `1px solid ${connectionStatus.FB === "connected" ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius: "10px", padding: "10px 12px" }}>
                      <FBIcon size={16} color="#1877F2" />
                      <div>
                        <div style={{ fontSize: "11px", fontWeight: 700, color: "#e2e8f0" }}>Facebook</div>
                        <div style={{ fontSize: "10px", color: connectionStatus.FB === "connected" ? "#10B981" : "#64748b" }}>{connectionStatus.FB === "connected" ? "✓ Conectado" : "No conectado"}</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "5px", fontWeight: 600 }}>META ACCESS TOKEN</div>
                    <input type="password" value={settings.metaToken} onChange={e => setSetting("metaToken", e.target.value)}
                      placeholder="EAABx... (pega tu token aquí)"
                      style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "10px", padding: "10px 12px", color: "#fff", fontSize: "12px", boxSizing: "border-box" }} />
                  </div>
                  {settings.metaPageId && <div style={{ fontSize: "11px", color: "#10B981", marginBottom: "10px" }}>✓ Page ID: {settings.metaPageId}</div>}
                  {connectError && <div style={{ fontSize: "11px", color: "#EF4444", marginBottom: "10px" }}>{connectError}</div>}
                  <button onClick={connectMeta} disabled={connecting} style={{ width: "100%", background: connecting ? "rgba(99,102,241,0.3)" : "linear-gradient(135deg,#1877F2,#E1306C)", border: "none", borderRadius: "11px", color: "#fff", padding: "13px", fontSize: "13px", fontWeight: 800, cursor: connecting ? "not-allowed" : "pointer", marginBottom: "10px" }}>
                    {connecting ? "⏳ Conectando..." : "⚡ Conectar con Meta API"}
                  </button>
                  <a href="https://developers.facebook.com" target="_blank" rel="noreferrer" style={{ display: "block", textAlign: "center", fontSize: "11px", color: "#a78bfa", fontWeight: 700, textDecoration: "none" }}>
                    → Ir a Meta for Developers
                  </a>
                </div>

                <div style={card}>
                  <div style={secTitle}>🎵 TikTok API</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(109,40,217,0.08)", border: "1px solid rgba(109,40,217,0.2)", borderRadius: "10px", padding: "12px", marginBottom: "12px" }}>
                    <TKIcon size={20} color="#a78bfa" />
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: "#c4b5fd" }}>Aprobación pendiente</div>
                      <div style={{ fontSize: "10px", color: "#94a3b8" }}>La API de TikTok requiere revisión manual de 2–4 semanas</div>
                    </div>
                  </div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", lineHeight: "1.7", marginBottom: "12px" }}>
                    Mientras esperas, ingresa tus métricas manualmente en la sección Analítica → TikTok. La IA las analizará igual de forma completa.
                  </div>
                  <a href="https://developers.tiktok.com" target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "7px", background: "rgba(109,40,217,0.2)", border: "1px solid rgba(109,40,217,0.35)", borderRadius: "11px", color: "#c4b5fd", padding: "12px", fontSize: "12px", fontWeight: 700, textDecoration: "none" }}>
                    <TKIcon size={14} /> Solicitar acceso en TikTok Developers
                  </a>
                </div>
              </div>
            )}

            {/* Save button */}
            <button onClick={saveSettings} style={{ width: "100%", background: settingsSaved ? "#10B981" : "linear-gradient(135deg,#a78bfa,#f472b6)", border: "none", borderRadius: "12px", color: "#fff", padding: "14px", fontSize: "14px", fontWeight: 800, cursor: "pointer", marginTop: "16px", transition: "background 0.3s" }}>
              {settingsSaved ? "✓ Configuración guardada" : "💾 Guardar configuración"}
            </button>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(10,8,26,0.97)", backdropFilter: "blur(24px)", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", padding: "8px 0 16px" }}>
        {navItems.map(n => (
          <button key={n.id} onClick={() => setView(n.id)} style={{ flex: 1, background: "none", border: "none", color: view === n.id ? "#a78bfa" : "#334155", cursor: "pointer", padding: "4px 2px", display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", transition: "color 0.2s" }}>
            <span style={{ fontSize: "17px" }}>{n.icon}</span>
            <span style={{ fontSize: "9px", fontWeight: view === n.id ? 800 : 500 }}>{n.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
