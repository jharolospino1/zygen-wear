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
    
