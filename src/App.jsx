import { useState, useEffect, useRef } from "react";

const RESUME = {
  name: "Skyler Pan",
  title: "Concept Artist",
  email: "Secal72art@gmail.com",
  phone: "6465780322",
  summary:
    "Illustration student with a concentration in Concept Design, passionate about character design and narrative-driven visual storytelling for games. Experienced in concept art production for live-service mobile titles at Garena, with strengths in style adaptation, iterative visual development, and cross-team collaboration.",
  experience: [
    {
      company: "Garena",
      role: "Concept Artist",
      period: "Jul 2025 — Sep 2025",
      tag: "On-site · Internship",
      bullets: [
        "Contributed concept designs for Free Fire and Arena of Valor — developing visual directions for characters and props through iterative sketches, reference studies, and paintovers",
        "Participated in IP collaboration projects (Detective Conan, Jujutsu Kaisen), adapting iconic character designs into in-game art styles while preserving the original IP identity",
        "Collaborated with senior artists to evaluate and integrate AI-assisted tools (Midjourney, ComfyUI, A1111) into the early ideation phase",
      ],
    },
    {
      company: "Sky: Children of the Light",
      role: "Official Illustrator",
      period: "Jun 2025",
      tag: "6th Anniversary & TGC Exhibition",
      bullets: [
        "Created official event illustration for thatgamecompany's 6th anniversary celebration",
        "Artwork published across anniversary online channels, blending fantasy atmosphere with emotional narrative",
      ],
    },
    {
      company: "Xing Art",
      role: "Test Illustrator",
      period: "Aug 2021 — Feb 2022",
      tag: "AIGC Platform",
      bullets: [
        "Served as core test illustrator during the product prototype phase, evaluating AI sketch generation and style simulation",
        "Helped bridge AIGC tools with traditional illustration workflows to improve artist efficiency",
        "Project secured $300K in early-stage venture funding from Miracle Plus",
      ],
    },
    {
      company: "SCAD",
      role: "Character & Visual Lead",
      period: "Jun 2020 — Jul 2021",
      tag: "In-Class Projects",
      bullets: [
        "Led the character design team on multiple game world-building course projects",
        "Responsible for character concepts and key visual integration across team deliverables",
      ],
    },
  ],
  education: {
    school: "Savannah College of Art and Design",
    abbr: "SCAD",
    degree: "B.F.A. Illustration · Concentration in Concept Design",
    period: "2023 — 2026",
  },
  awards: [
    {
      title: "Beyond the Dot",
      sub: "SCAD Illustration Competition · 2024",
      detail: "1st Place ×1 · 2nd Place ×2",
      note: "First student in SCAD history to have three works simultaneously shortlisted and awarded",
    },
    {
      title: "SCAD Merit Scholarship",
      sub: "8 Semesters · Top 3% GPA",
      detail: "",
      note: "",
    },
  ],
  skills: [
    "Procreate",
    "Photoshop",
    "Clip Studio Paint",
    "Watercolor",
    "Character Design",
    "Visual Storytelling",
    "Narrative Illustration",
    "Composition",
    "Color Theory",
  ],
};

/* ── tiny intersection observer hook ── */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ── LetterGlitch background (react-bits style) ── */
function LetterGlitch({ glitchColors = ["#292929", "#1a1a2e", "#2a1a1a"], glitchSpeed = 40, smooth = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    let raf;
    let W, H, cols, rows;
    const CHAR_SIZE = 16;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>{}[]|/\\~^+=:;";
    let grid = [];

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = c.offsetWidth;
      H = c.offsetHeight;
      c.width = W * dpr;
      c.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(W / (CHAR_SIZE * 0.62)) + 1;
      rows = Math.ceil(H / (CHAR_SIZE * 1.15)) + 1;
      initGrid();
    }

    function randomChar() {
      return chars[Math.floor(Math.random() * chars.length)];
    }

    function initGrid() {
      grid = [];
      for (let r = 0; r < rows; r++) {
        const row = [];
        for (let cl = 0; cl < cols; cl++) {
          row.push({
            char: randomChar(),
            opacity: Math.random() * 0.1 + 0.015,
            targetOpacity: Math.random() * 0.1 + 0.015,
            glitchTimer: Math.floor(Math.random() * 200),
          });
        }
        grid.push(row);
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // center vignette
      const vGrad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.6);
      vGrad.addColorStop(0, "rgba(230,180,120,0.025)");
      vGrad.addColorStop(1, "transparent");
      ctx.fillStyle = vGrad;
      ctx.fillRect(0, 0, W, H);

      ctx.font = `${CHAR_SIZE}px "DM Mono", "Courier New", monospace`;
      ctx.textBaseline = "top";

      for (let r = 0; r < rows; r++) {
        for (let cl = 0; cl < cols; cl++) {
          const cell = grid[r]?.[cl];
          if (!cell) continue;

          cell.glitchTimer--;
          if (cell.glitchTimer <= 0) {
            cell.char = randomChar();
            cell.targetOpacity = Math.random() * 0.12 + 0.015;
            cell.glitchTimer = Math.floor(Math.random() * 160) + glitchSpeed;
          }

          if (smooth) {
            cell.opacity += (cell.targetOpacity - cell.opacity) * 0.06;
          } else {
            cell.opacity = cell.targetOpacity;
          }

          let alpha = cell.opacity;
          // occasional dim-out (extinguish) — sparse interval
          if (Math.random() < 0.0008) {
            alpha = 0;
            cell.targetOpacity = 0.005;
            cell.glitchTimer = Math.floor(Math.random() * 120) + 60;
          }

          // glitch color tint (subtle)
          let color = `rgba(180,170,155,${alpha})`;
          if (Math.random() < 0.006) {
            const gc = glitchColors[Math.floor(Math.random() * glitchColors.length)];
            const rr = parseInt(gc.slice(1, 3), 16);
            const gg = parseInt(gc.slice(3, 5), 16);
            const bb = parseInt(gc.slice(5, 7), 16);
            color = `rgba(${rr},${gg},${bb},${Math.min(alpha * 2, 0.2)})`;
          }

          ctx.fillStyle = color;
          ctx.fillText(cell.char, cl * CHAR_SIZE * 0.62, r * CHAR_SIZE * 1.15);
        }
      }

      raf = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [glitchColors, glitchSpeed, smooth]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

/* ── section wrapper with reveal ── */
function Section({ children, delay = 0 }) {
  const [ref, visible] = useReveal(0.1);
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.8s cubic-bezier(.16,1,.3,1) ${delay}s, transform 0.8s cubic-bezier(.16,1,.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ── label chip ── */
function Chip({ children }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        fontSize: 11,
        fontFamily: "'DM Mono', monospace",
        letterSpacing: "0.04em",
        color: "#e6b478",
        border: "1px solid rgba(230,180,120,0.25)",
        borderRadius: 4,
        background: "rgba(230,180,120,0.06)",
      }}
    >
      {children}
    </span>
  );
}

/* ── experience card ── */
function ExpCard({ item, index }) {
  const [ref, visible] = useReveal(0.12);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? hovered ? "translateY(-2px)" : "translateY(0)"
          : "translateY(30px)",
        transition: `all 0.7s cubic-bezier(.16,1,.3,1) ${index * 0.12}s`,
        padding: "28px 32px",
        borderRadius: 12,
        background: hovered ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.015)",
        border: hovered ? "1px solid rgba(230,180,120,0.2)" : "1px solid rgba(255,255,255,0.06)",
        marginBottom: 20,
        cursor: "default",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -60, right: -60, width: 160, height: 160,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(230,180,120,0.07) 0%, transparent 70%)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.5s",
          pointerEvents: "none",
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
        <div>
          <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em", marginBottom: 6 }}>
            {item.period}
          </div>
          <div style={{ fontSize: 22, fontFamily: "'Playfair Display', serif", color: "#fff", fontWeight: 600, marginBottom: 4 }}>
            {item.company}
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginBottom: 10 }}>
            {item.role}
          </div>
        </div>
        <Chip>{item.tag}</Chip>
      </div>
      <div style={{ marginTop: 8 }}>
        {item.bullets.map((b, i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 13, lineHeight: 1.65, color: "rgba(255,255,255,0.55)", fontFamily: "'DM Sans', sans-serif" }}>
            <span style={{ color: "rgba(230,180,120,0.5)", marginTop: 2, flexShrink: 0 }}>◆</span>
            <span>{b}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── skill pill ── */
function SkillPill({ name, index }) {
  const [hovered, setHovered] = useState(false);
  const [ref, visible] = useReveal(0.1);
  return (
    <span
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-block",
        padding: "8px 18px",
        fontSize: 13,
        fontFamily: "'DM Sans', sans-serif",
        color: hovered ? "#1a1a1a" : "rgba(255,255,255,0.7)",
        background: hovered ? "linear-gradient(135deg, #e6b478, #d4956a)" : "rgba(255,255,255,0.04)",
        border: hovered ? "1px solid transparent" : "1px solid rgba(255,255,255,0.08)",
        borderRadius: 100,
        cursor: "default",
        transition: `all 0.35s cubic-bezier(.16,1,.3,1) ${index * 0.04}s`,
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.85)",
      }}
    >
      {name}
    </span>
  );
}

/* ── award card ── */
function AwardCard({ award, index }) {
  const [ref, visible] = useReveal(0.1);
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-20px)",
        transition: `all 0.7s cubic-bezier(.16,1,.3,1) ${index * 0.15}s`,
        padding: "24px 28px",
        borderRadius: 12,
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        flex: 1,
        minWidth: 260,
      }}
    >
      <div style={{ fontSize: 18, fontFamily: "'Playfair Display', serif", color: "#e6b478", fontWeight: 600, marginBottom: 4 }}>
        {award.title}
      </div>
      <div style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: "rgba(255,255,255,0.35)", marginBottom: 10 }}>
        {award.sub}
      </div>
      {award.detail && (
        <div style={{ fontSize: 15, color: "rgba(255,255,255,0.75)", fontFamily: "'DM Sans', sans-serif", marginBottom: 6 }}>
          {award.detail}
        </div>
      )}
      {award.note && (
        <div style={{ fontSize: 12, color: "rgba(230,180,120,0.6)", fontStyle: "italic", lineHeight: 1.5 }}>
          {award.note}
        </div>
      )}
    </div>
  );
}

/* ── Character monsters data ── */
const MONSTER_TYPES = [
  { body: "ᗡ( ˙-˙ )ᗡ", size: 14, hp: 1, speed: 1.5, points: 1 },
  { body: "╰(°▽°)╯", size: 13, hp: 1, speed: 2.0, points: 1 },
  { body: "( ˃̣̣̥᷄⌓˂̣̣̥᷅ )", size: 12, hp: 1, speed: 1.3, points: 1 },
  { body: "ʕ •ᴥ•ʔ", size: 14, hp: 1, speed: 1.7, points: 1 },
  { body: "(╯°□°)╯", size: 13, hp: 1, speed: 2.2, points: 1 },
  { body: "( ⓛ ω ⓛ )", size: 12, hp: 1, speed: 1.4, points: 1 },
  { body: "٩(ˊᗜˋ*)و", size: 13, hp: 1, speed: 1.6, points: 1 },
  { body: "ψ(｀∇´)ψ", size: 14, hp: 1, speed: 1.8, points: 1 },
];

/* ── Monster Game Layer ── */
function MonsterGame({ score, setScore, gameOver, onMonsterEscaped, paused, clearAllRef, gameStopped }) {
  const canvasRef = useRef(null);
  const cursorRef = useRef(null);
  const mouse = useRef({ x: -100, y: -100 });
  const cursorPos = useRef({ x: -100, y: -100 });
  const monsters = useRef([]);
  const clickParticles = useRef([]);
  const deathParticles = useRef([]);
  const lastSpawn = useRef(0);
  const scoreRef = useRef(0);
  const wasStoppedRef = useRef(false);

  const nearTarget = useRef(false);
  const svgRef = useRef(null);

  // expose clearAll to parent
  useEffect(() => {
    if (clearAllRef) {
      clearAllRef.current = () => {
        // explode all current monsters
        for (const m of monsters.current) {
          const chars = [...m.type.body];
          chars.forEach((ch, ci) => {
            const angle = (Math.PI * 2 * ci) / chars.length + Math.random() * 0.8;
            deathParticles.current.push({
              x: m.x + (ci - chars.length / 2) * 6,
              y: m.y,
              vx: Math.cos(angle) * (2 + Math.random() * 3),
              vy: Math.sin(angle) * (2 + Math.random() * 3) - 2,
              life: 1,
              decay: 0.012 + Math.random() * 0.008,
              char: ch,
              size: m.type.size,
            });
          });
        }
        monsters.current = [];
      };
    }
  }, [clearAllRef]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    let raf;
    let W, H;

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      c.width = W * 2;
      c.height = H * 2;
      c.style.width = W + "px";
      c.style.height = H + "px";
      ctx.setTransform(2, 0, 0, 2, 0, 0);
    }
    resize();

    const onMove = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; };

    const onClick = (e) => {
      const cx = e.clientX, cy = e.clientY;
      // click burst
      for (let i = 0; i < 4; i++) {
        const a = (Math.PI * 2 * i) / 4 + (Math.random() - 0.5) * 0.5;
        clickParticles.current.push({
          x: cx, y: cy,
          vx: Math.cos(a) * (0.8 + Math.random()),
          vy: Math.sin(a) * (0.8 + Math.random()),
          life: 1, decay: 0.03, size: 1.5 + Math.random() * 1.5,
        });
      }

      // hit test monsters
      const hitRadius = 28;
      for (let i = monsters.current.length - 1; i >= 0; i--) {
        const m = monsters.current[i];
        const dx = cx - m.x, dy = cy - m.y;
        if (Math.sqrt(dx * dx + dy * dy) < hitRadius + m.hitR) {
          // death explosion — scatter the characters
          const chars = [...m.type.body];
          chars.forEach((ch, ci) => {
            const angle = (Math.PI * 2 * ci) / chars.length + Math.random() * 0.5;
            deathParticles.current.push({
              x: m.x + (ci - chars.length / 2) * 6,
              y: m.y,
              vx: Math.cos(angle) * (1.5 + Math.random() * 2),
              vy: Math.sin(angle) * (1.5 + Math.random() * 2) - 1.5,
              life: 1,
              decay: 0.015 + Math.random() * 0.01,
              char: ch,
              size: m.type.size,
            });
          });
          monsters.current.splice(i, 1);
          setScore((s) => s + m.type.points);
          break;
        }
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("click", onClick);
    window.addEventListener("resize", resize);

    function spawnMonster() {
      const type = MONSTER_TYPES[Math.floor(Math.random() * MONSTER_TYPES.length)];
      const x = 40 + Math.random() * (W - 80);
      monsters.current.push({
        x,
        y: -30,
        vx: (Math.random() - 0.5) * 0.4,
        vy: type.speed * (0.3 + Math.random() * 0.3),
        type,
        hitR: type.body.length * 3,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.02 + Math.random() * 0.02,
      });
    }

    function frame() {
      const now = Date.now();

      // spawn — accelerate after 20 kills
      const spawnInterval = scoreRef.current >= 20 ? Math.max(150, 500 - (scoreRef.current - 20) * 15) : 500;
      if (!gameOver && !paused && now - lastSpawn.current > spawnInterval) {
        spawnMonster();
        lastSpawn.current = now;
      }

      // smooth cursor
      cursorPos.current.x += (mouse.current.x - cursorPos.current.x) * 0.18;
      cursorPos.current.y += (mouse.current.y - cursorPos.current.y) * 0.18;

      // check proximity to any monster + mark hovered monsters
      let isNear = false;
      const detectRadius = 50;
      for (const m of monsters.current) {
        const dx = cursorPos.current.x - m.x;
        const dy = cursorPos.current.y - m.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < detectRadius + m.hitR) {
          isNear = true;
          m.hovered = true;
        } else {
          m.hovered = false;
        }
      }
      nearTarget.current = isNear;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorPos.current.x}px, ${cursorPos.current.y}px)`;
      }
      if (svgRef.current) {
        const s = nearTarget.current ? 0.65 : 1;
        const glow = nearTarget.current ? "drop-shadow(0 0 8px rgba(230,180,120,0.4))" : "none";
        svgRef.current.style.transform = `scale(${s})`;
        svgRef.current.style.filter = glow;
      }

      // draw
      ctx.clearRect(0, 0, W, H);

      // monsters — glow when hovered
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      monsters.current = monsters.current.filter((m) => {
        m.x += m.vx + Math.sin(m.wobblePhase) * 0.3;
        m.y += m.vy;
        m.wobblePhase += m.wobbleSpeed;
        if (m.y > H + 40) {
          onMonsterEscaped();
          return false;
        }

        // smooth hover brightness
        m.brightness = m.brightness || 0;
        m.brightness += ((m.hovered ? 1 : 0) - m.brightness) * 0.15;

        const alpha = 0.45 + m.brightness * 0.5;
        ctx.font = `${m.type.size}px "DM Mono", monospace`;
        ctx.fillStyle = `rgba(230,180,120,${alpha})`;
        if (m.brightness > 0.3) {
          ctx.shadowColor = "rgba(230,180,120,0.4)";
          ctx.shadowBlur = 12 * m.brightness;
        } else {
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
        }
        ctx.fillText(m.type.body, m.x, m.y);
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        return true;
      });

      // death particles (scattered characters)
      deathParticles.current = deathParticles.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06;
        p.vx *= 0.98;
        p.life -= p.decay;
        if (p.life <= 0) return false;
        ctx.font = `${p.size}px "DM Mono", monospace`;
        ctx.fillStyle = `rgba(230,180,120,${p.life * 0.7})`;
        ctx.textAlign = "center";
        ctx.fillText(p.char, p.x, p.y);
        return true;
      });

      // click particles
      clickParticles.current = clickParticles.current.filter((t) => {
        t.x += t.vx; t.y += t.vy;
        t.vx *= 0.96; t.vy *= 0.96;
        t.life -= t.decay;
        if (t.life <= 0) return false;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.size * t.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230,180,120,${t.life * 0.5})`;
        ctx.fill();
        return true;
      });

      raf = requestAnimationFrame(frame);
    }
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("resize", resize);
    };
  }, [gameOver, paused, setScore, onMonsterEscaped, gameStopped]);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 99998 }}
      />
      {/* symmetric mech reticle cursor */}
      <div ref={cursorRef} style={{
        position: "fixed", top: 0, left: 0,
        pointerEvents: "none", zIndex: 99999, willChange: "transform",
      }}>
        <svg ref={svgRef} width="90" height="90" viewBox="-45 -45 90 90" style={{ marginLeft: -45, marginTop: -45, position: "absolute", overflow: "visible", transition: "transform 0.2s cubic-bezier(.16,1,.3,1), filter 0.2s ease" }}>

          {/* outer segmented ring — slow rotate */}
          <g style={{ animation: "reticleSpin 20s linear infinite" }}>
            <path d="M 0 -34 A 34 34 0 0 1 24 -24" fill="none" stroke="rgba(230,180,120,0.2)" strokeWidth="1" />
            <path d="M 24 24 A 34 34 0 0 1 0 34" fill="none" stroke="rgba(230,180,120,0.2)" strokeWidth="1" />
            <path d="M 0 34 A 34 34 0 0 1 -24 24" fill="none" stroke="rgba(230,180,120,0.2)" strokeWidth="1" />
            <path d="M -24 -24 A 34 34 0 0 1 0 -34" fill="none" stroke="rgba(230,180,120,0.2)" strokeWidth="1" />
          </g>

          {/* inner ring — counter-rotate, dashed */}
          <g style={{ animation: "reticleSpinReverse 15s linear infinite" }}>
            <circle cx="0" cy="0" r="22" fill="none" stroke="rgba(230,180,120,0.08)" strokeWidth="0.6" strokeDasharray="6 10 3 10" />
          </g>

          {/* ═══ CROSSHAIR ARMS ═══ */}
          {/* horizontal — wide and bold */}
          <line x1="-38" y1="0" x2="-9" y2="0" stroke="rgba(230,180,120,0.55)" strokeWidth="1.5" />
          <line x1="9" y1="0" x2="38" y2="0" stroke="rgba(230,180,120,0.55)" strokeWidth="1.5" />
          {/* horizontal thin extensions */}
          <line x1="-42" y1="0" x2="-40" y2="0" stroke="rgba(230,180,120,0.2)" strokeWidth="0.8" />
          <line x1="40" y1="0" x2="42" y2="0" stroke="rgba(230,180,120,0.2)" strokeWidth="0.8" />

          {/* vertical */}
          <line x1="0" y1="-28" x2="0" y2="-9" stroke="rgba(230,180,120,0.45)" strokeWidth="1.2" />
          <line x1="0" y1="9" x2="0" y2="28" stroke="rgba(230,180,120,0.45)" strokeWidth="1.2" />

          {/* ═══ CORNER BRACKETS ═══ */}
          <path d="M -14 -26 L -26 -26 L -26 -14" fill="none" stroke="rgba(230,180,120,0.3)" strokeWidth="1" />
          <path d="M 14 -26 L 26 -26 L 26 -14" fill="none" stroke="rgba(230,180,120,0.3)" strokeWidth="1" />
          <path d="M -14 26 L -26 26 L -26 14" fill="none" stroke="rgba(230,180,120,0.3)" strokeWidth="1" />
          <path d="M 14 26 L 26 26 L 26 14" fill="none" stroke="rgba(230,180,120,0.3)" strokeWidth="1" />

          {/* ═══ TICK MARKS along axes ═══ */}
          {/* horizontal ticks */}
          <line x1="-30" y1="-3" x2="-30" y2="3" stroke="rgba(230,180,120,0.15)" strokeWidth="0.5" />
          <line x1="-22" y1="-2" x2="-22" y2="2" stroke="rgba(230,180,120,0.1)" strokeWidth="0.5" />
          <line x1="-15" y1="-1.5" x2="-15" y2="1.5" stroke="rgba(230,180,120,0.08)" strokeWidth="0.5" />
          <line x1="15" y1="-1.5" x2="15" y2="1.5" stroke="rgba(230,180,120,0.08)" strokeWidth="0.5" />
          <line x1="22" y1="-2" x2="22" y2="2" stroke="rgba(230,180,120,0.1)" strokeWidth="0.5" />
          <line x1="30" y1="-3" x2="30" y2="3" stroke="rgba(230,180,120,0.15)" strokeWidth="0.5" />
          {/* vertical ticks */}
          <line x1="-3" y1="-20" x2="3" y2="-20" stroke="rgba(230,180,120,0.1)" strokeWidth="0.5" />
          <line x1="-2" y1="-14" x2="2" y2="-14" stroke="rgba(230,180,120,0.08)" strokeWidth="0.5" />
          <line x1="-2" y1="14" x2="2" y2="14" stroke="rgba(230,180,120,0.08)" strokeWidth="0.5" />
          <line x1="-3" y1="20" x2="3" y2="20" stroke="rgba(230,180,120,0.1)" strokeWidth="0.5" />

          {/* ═══ INNER DIAMOND — slow counter-rotate ═══ */}
          <g style={{ animation: "reticleSpinReverse 24s linear infinite" }}>
            <rect x="-7" y="-7" width="14" height="14" fill="none" stroke="rgba(230,180,120,0.1)" strokeWidth="0.5" transform="rotate(45)" />
          </g>

          {/* ═══ CENTER ═══ */}
          <circle cx="0" cy="0" r="3" fill="rgba(230,180,120,0.9)" />
          <circle cx="0" cy="0" r="3" fill="none" stroke="rgba(230,180,120,0.12)" strokeWidth="5" />
          <circle cx="0" cy="0" r="6" fill="none" stroke="rgba(230,180,120,0.08)" strokeWidth="0.5" strokeDasharray="2 4" style={{ animation: "cursorPulse 2.5s ease-in-out infinite" }} />
        </svg>
      </div>
    </>
  );
}

/* ── Score HUD ── */
function ScoreHUD({ score, hp, hpMode, toast1, setToast1, toast2, setToast2, toast3, setToast3, gameStopped, startGame }) {
  const [t1Vis, setT1Vis] = useState(false);
  const [t2Vis, setT2Vis] = useState(false);
  const [t3Vis, setT3Vis] = useState(false);
  const [countUp, setCountUp] = useState(0);

  useEffect(() => { if (toast1) setTimeout(() => setT1Vis(true), 100); }, [toast1]);
  useEffect(() => { if (toast2) setTimeout(() => setT2Vis(true), 100); }, [toast2]);
  useEffect(() => {
    if (toast3) {
      setTimeout(() => setT3Vis(true), 100);
      // animate count up
      setCountUp(0);
      let current = 0;
      const target = score;
      const step = Math.max(1, Math.floor(target / 30));
      const iv = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(iv); }
        setCountUp(current);
      }, 30);
      return () => clearInterval(iv);
    }
  }, [toast3, score]);

  useEffect(() => {
    if (gameStopped) {
      setT1Vis(false); setT2Vis(false); setT3Vis(false);
      setTimeout(() => { setToast1(false); setToast2(false); setToast3(false); }, 300);
    }
  }, [gameStopped, setToast1, setToast2, setToast3]);

  const dismiss = (setVis, setToast) => () => {
    setVis(false);
    setTimeout(() => setToast(false), 400);
  };

  const toastPos = (vis) => ({
    position: "fixed", top: 20, left: "50%", zIndex: 10001,
    transform: vis ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(-80px)",
    opacity: vis ? 1 : 0,
    transition: "all 0.5s cubic-bezier(.16,1,.3,1)",
    pointerEvents: vis ? "auto" : "none",
  });

  const cardStyle = (borderColor = "rgba(230,180,120,0.15)") => ({
    background: "rgba(14,14,14,0.35)", border: `1px solid ${borderColor}`,
    borderRadius: 12, padding: "14px 22px",
    display: "flex", alignItems: "center", gap: 14,
    backdropFilter: "blur(20px)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
    maxWidth: 420,
  });

  const closeBtn = (onDismiss, hoverColor = "rgba(230,180,120,0.7)") => (
    <button onClick={onDismiss} style={{
      background: "none", border: "none", color: "rgba(255,255,255,0.2)", fontSize: 16,
      cursor: "none", padding: "4px 8px", flexShrink: 0, transition: "color 0.2s",
    }}
      onMouseEnter={(e) => { e.target.style.color = hoverColor; }}
      onMouseLeave={(e) => { e.target.style.color = "rgba(255,255,255,0.2)"; }}
    >✕</button>
  );

  const pct = getPercentile(score);

  return (
    <>
      {/* score counter */}
      <div style={{
        position: "fixed", top: 20, right: 24, zIndex: 10000,
        fontFamily: "'DM Mono', monospace", fontSize: 13,
        color: "rgba(230,180,120,0.6)", letterSpacing: "0.08em",
        display: "flex", alignItems: "center", gap: 8,
        background: "rgba(0,0,0,0.4)", backdropFilter: "blur(10px)",
        padding: "8px 16px", borderRadius: 8,
        border: "1px solid rgba(230,180,120,0.15)",
        opacity: gameStopped ? 0 : 1,
        transform: gameStopped ? "translateY(-20px)" : "translateY(0)",
        transition: "all 0.5s cubic-bezier(.16,1,.3,1)",
        pointerEvents: gameStopped ? "none" : "auto",
      }}>
        <span style={{ fontSize: 16 }}>◆</span>
        <span style={{ fontWeight: 400 }}>KILLS</span>
        <span style={{ fontSize: 18, fontWeight: 600, color: "#e6b478", minWidth: 20, textAlign: "right" }}>{score}</span>
      </div>

      {/* HP bar */}
      {hpMode && (
        <div style={{
          position: "fixed", top: 20, left: 24, zIndex: 10000,
          fontFamily: "'DM Mono', monospace", fontSize: 12,
          color: "rgba(230,180,120,0.6)", letterSpacing: "0.08em",
          display: "flex", alignItems: "center", gap: 10,
          background: "rgba(0,0,0,0.4)", backdropFilter: "blur(10px)",
          padding: "8px 16px", borderRadius: 8,
          border: `1px solid ${hp <= 3 ? "rgba(224,85,85,0.25)" : "rgba(230,180,120,0.15)"}`,
          transition: "all 0.4s",
        }}>
          <span style={{ color: hp <= 3 ? "#e05555" : "#e6b478", transition: "color 0.3s" }}>HP</span>
          <div style={{ width: 100, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${(hp / 10) * 100}%`, borderRadius: 3,
              background: hp <= 3 ? "linear-gradient(90deg, #e05555, #c04040)" : "linear-gradient(90deg, #e6b478, #d4956a)",
              transition: "width 0.4s cubic-bezier(.16,1,.3,1), background 0.4s",
              boxShadow: hp <= 3 ? "0 0 8px rgba(224,85,85,0.4)" : "0 0 8px rgba(230,180,120,0.2)",
            }} />
          </div>
          <span style={{
            fontSize: 14, fontWeight: 600, minWidth: 20, textAlign: "right",
            color: hp <= 3 ? "#e05555" : "#e6b478", transition: "color 0.3s",
          }}>{hp}</span>
        </div>
      )}

      {/* Toast 1: 10 kills — transparent, no pause */}
      {toast1 && (
        <div style={toastPos(t1Vis)}>
          <div style={cardStyle()}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>🎯</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: "#e6b478", marginBottom: 2 }}>
                Hey, stop playing!
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>
                You're here to see my resume, remember? :)
              </div>
            </div>
            {closeBtn(dismiss(setT1Vis, setToast1))}
          </div>
        </div>
      )}

      {/* Toast 2: 20 kills — HP activated */}
      {toast2 && (
        <div style={toastPos(t2Vis)}>
          <div style={cardStyle("rgba(230,160,80,0.2)")}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>😤</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: "#e6a040", marginBottom: 2 }}>
                OK OK, you really love games huh
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>
                Fine — HP activated. Let's see how long you survive
              </div>
            </div>
            {closeBtn(dismiss(setT2Vis, setToast2), "rgba(230,160,80,0.7)")}
          </div>
        </div>
      )}

      {/* Modal: GAME OVER — cool results screen */}
      {toast3 && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 10002,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: t3Vis ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0)",
          backdropFilter: t3Vis ? "blur(8px)" : "blur(0px)",
          transition: "all 0.6s ease",
          pointerEvents: t3Vis ? "auto" : "none",
        }}>
          <div style={{
            background: "rgba(14,14,14,0.5)",
            border: "1px solid rgba(224,85,85,0.15)",
            borderRadius: 20,
            padding: "48px 44px 40px",
            maxWidth: 360,
            width: "90%",
            textAlign: "center",
            opacity: t3Vis ? 1 : 0,
            transform: t3Vis ? "translateY(0) scale(1)" : "translateY(30px) scale(0.9)",
            transition: "all 0.7s cubic-bezier(.16,1,.3,1) 0.15s",
            backdropFilter: "blur(24px)",
            boxShadow: "0 0 80px rgba(224,85,85,0.06), 0 24px 48px rgba(0,0,0,0.4)",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* decorative top line */}
            <div style={{
              position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
              width: 60, height: 2,
              background: "linear-gradient(90deg, transparent, #e05555, transparent)",
              borderRadius: 1,
            }} />

            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: 11,
              letterSpacing: "0.2em", color: "rgba(224,85,85,0.6)",
              textTransform: "uppercase", marginBottom: 20,
            }}>
              GAME OVER
            </div>

            {/* big kill count */}
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 72, fontWeight: 300,
              background: "linear-gradient(160deg, #ffffff 20%, #e05555 80%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              lineHeight: 1, marginBottom: 4,
            }}>
              {countUp}
            </div>
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: 11,
              letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase", marginBottom: 28,
            }}>
              MONSTERS SLAIN
            </div>

            {/* percentile bar */}
            <div style={{ marginBottom: 28 }}>
              <div style={{
                width: "100%", height: 4, borderRadius: 2,
                background: "rgba(255,255,255,0.06)", overflow: "hidden", marginBottom: 10,
              }}>
                <div style={{
                  height: "100%", width: t3Vis ? `${pct}%` : "0%",
                  borderRadius: 2,
                  background: "linear-gradient(90deg, #e05555, #e6b478)",
                  transition: "width 1.5s cubic-bezier(.16,1,.3,1) 0.5s",
                  boxShadow: "0 0 12px rgba(224,85,85,0.3)",
                }} />
              </div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                color: "rgba(255,255,255,0.5)",
              }}>
                You beat <span style={{ color: "#e6b478", fontWeight: 600 }}>{pct}%</span> of visitors
              </div>
            </div>

            {/* play again button */}
            <button
              onClick={() => {
                setT3Vis(false);
                setTimeout(() => {
                  setToast3(false);
                  startGame();
                }, 400);
              }}
              style={{
                background: "rgba(224,85,85,0.1)",
                border: "1px solid rgba(224,85,85,0.25)",
                color: "#e05555",
                padding: "12px 32px",
                borderRadius: 10,
                fontFamily: "'DM Mono', monospace",
                fontSize: 12,
                letterSpacing: "0.12em",
                cursor: "none",
                transition: "all 0.3s",
                marginBottom: 12,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(224,85,85,0.2)";
                e.currentTarget.style.borderColor = "rgba(224,85,85,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(224,85,85,0.1)";
                e.currentTarget.style.borderColor = "rgba(224,85,85,0.25)";
              }}
            >
              <span style={{ fontSize: 14 }}>▶</span> PLAY AGAIN
            </button>

            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 11,
              color: "rgba(255,255,255,0.2)", marginTop: 4,
            }}>
              or scroll down to read the resume
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ══════════════════ MAIN ══════════════════ */

function getPercentile(kills) {
  if (kills >= 100) return 99;
  if (kills >= 80) return 97;
  if (kills >= 60) return 93;
  if (kills >= 50) return 88;
  if (kills >= 40) return 80;
  if (kills >= 30) return 68;
  if (kills >= 25) return 55;
  if (kills >= 20) return 40;
  if (kills >= 15) return 25;
  if (kills >= 10) return 15;
  if (kills >= 5) return 5;
  return 1;
}

export default function SkylerResume() {
  const [scrollY, setScrollY] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState(0);
  const [hp, setHp] = useState(10);
  const [toast1, setToast1] = useState(false);
  const [toast2, setToast2] = useState(false);
  const [toast3, setToast3] = useState(false);
  const [gameStopped, setGameStopped] = useState(false);
  const [showStartBtn, setShowStartBtn] = useState(false);
  const clearAllRef = useRef(null);

  // Phase 0→1: 10 kills, gentle nudge toast
  useEffect(() => {
    if (score >= 10 && phase === 0) {
      setPhase(1);
      setToast1(true);
    }
  }, [score, phase]);

  // Phase 1→2: 20 kills, "ok ok" toast + HP bar appears
  useEffect(() => {
    if (score >= 20 && phase === 1) {
      setPhase(2);
      setToast2(true);
    }
  }, [score, phase]);

  // Phase 2→3: HP=0, explode all, show game over with percentile
  useEffect(() => {
    if (hp <= 0 && phase === 2) {
      setPhase(3);
      if (clearAllRef.current) clearAllRef.current();
      setTimeout(() => setToast3(true), 600);
    }
  }, [hp, phase]);

  // scroll into resume → stop game
  useEffect(() => {
    if (gameStopped) return;
    if (scrollY > window.innerHeight * 0.6) {
      setGameStopped(true);
      setShowStartBtn(true);
      setToast1(false);
      setToast2(false);
      setToast3(false);
      if (clearAllRef.current) clearAllRef.current();
    }
  }, [scrollY, gameStopped]);

  const gameOver = phase === 3 || gameStopped;
  const hpMode = phase >= 2 && !gameStopped;

  const onMonsterEscaped = () => {
    if (phase === 2 && !gameStopped) {
      setHp((h) => Math.max(0, h - 1));
    }
  };

  const startGame = () => {
    setScore(0);
    setPhase(0);
    setHp(10);
    setGameStopped(false);
    setShowStartBtn(false);
    setToast1(false);
    setToast2(false);
    setToast3(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    setLoaded(true);
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const heroParallax = Math.min(scrollY * 0.35, 200);
  const heroOpacity = Math.max(1 - scrollY / 600, 0);

  return (
    <div style={{ background: "#0e0e0e", minHeight: "100vh", color: "#fff", position: "relative", overflow: "hidden", cursor: "none" }}>
      <MonsterGame score={score} setScore={setScore} gameOver={gameOver} onMonsterEscaped={onMonsterEscaped} paused={false} clearAllRef={clearAllRef} gameStopped={gameStopped} />
      <ScoreHUD score={score} hp={hp} hpMode={hpMode} toast1={toast1} setToast1={setToast1} toast2={toast2} setToast2={setToast2} toast3={toast3} setToast3={setToast3} gameStopped={gameStopped} startGame={startGame} />

      {/* Start Game button — shown on scroll-stop or death */}
      {(showStartBtn || phase === 3) && (
        <button
          onClick={startGame}
          style={{
            position: "fixed",
            top: 20,
            left: 24,
            zIndex: 10000,
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.1em",
            color: "rgba(230,180,120,0.5)",
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(10px)",
            padding: "8px 16px",
            borderRadius: 8,
            border: "1px solid rgba(230,180,120,0.15)",
            cursor: "none",
            transition: "all 0.3s",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(230,180,120,0.4)";
            e.currentTarget.style.color = "#e6b478";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(230,180,120,0.15)";
            e.currentTarget.style.color = "rgba(230,180,120,0.5)";
          }}
        >
          <span style={{ fontSize: 14 }}>▶</span> START GAME
        </button>
      )}
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Playfair+Display:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@300;400&display=swap"
        rel="stylesheet"
      />

      <LetterGlitch glitchColors={["#3a2a1a", "#1a2a3a", "#2a1a2a"]} glitchSpeed={40} smooth />

      {/* ── Animated mesh gradient background ── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: "-15%", left: "-10%", width: "55vw", height: "55vw", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(230,180,100,0.1) 0%, rgba(200,140,60,0.04) 40%, transparent 70%)",
          filter: "blur(80px)", animation: "blobDrift1 18s ease-in-out infinite alternate",
        }} />
        <div style={{
          position: "absolute", bottom: "-20%", right: "-12%", width: "65vw", height: "65vw", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(180,100,50,0.08) 0%, rgba(140,70,30,0.03) 45%, transparent 70%)",
          filter: "blur(100px)", animation: "blobDrift2 22s ease-in-out infinite alternate",
        }} />
        <div style={{
          position: "absolute", top: "30%", right: "5%", width: "40vw", height: "40vw", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(120,80,180,0.06) 0%, rgba(90,50,140,0.02) 50%, transparent 70%)",
          filter: "blur(90px)", animation: "blobDrift3 25s ease-in-out infinite alternate",
        }} />
        <div style={{
          position: "absolute", top: "55%", left: "-5%", width: "35vw", height: "35vw", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(80,160,180,0.05) 0%, rgba(50,120,140,0.02) 50%, transparent 70%)",
          filter: "blur(85px)", animation: "blobDrift4 20s ease-in-out infinite alternate",
        }} />
        <div style={{
          position: "absolute", top: "5%", right: "15%", width: "30vw", height: "30vw", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,100,120,0.05) 0%, transparent 60%)",
          filter: "blur(70px)", animation: "blobDrift5 16s ease-in-out infinite alternate",
        }} />
        <div style={{
          position: "absolute", inset: 0, opacity: 0.35,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px", mixBlendMode: "overlay",
        }} />
      </div>

      {/* ══════════ HERO ══════════ */}
      <div
        style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center", textAlign: "center",
          padding: "60px 24px", position: "relative", zIndex: 1,
          transform: `translateY(${heroParallax}px)`, opacity: heroOpacity,
        }}
      >
        {/* decorative line */}
        <div style={{
          width: 1, height: loaded ? 80 : 0,
          background: "linear-gradient(to bottom, transparent, rgba(230,180,120,0.4))",
          marginBottom: 40, transition: "height 1.2s cubic-bezier(.16,1,.3,1) 0.3s",
        }} />

        <div style={{
          fontSize: 13, fontFamily: "'DM Mono', monospace", letterSpacing: "0.25em",
          color: "rgba(230,180,120,0.6)", textTransform: "uppercase", marginBottom: 24,
          opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(15px)",
          transition: "all 0.8s cubic-bezier(.16,1,.3,1) 0.5s",
        }}>
          Concept Artist · Character Designer
        </div>

        {/* ── Liquid silver metallic name with flicker ── */}
        <h1
          style={{
            fontSize: "clamp(52px, 11vw, 130px)",
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            letterSpacing: "0.15em",
            lineHeight: 1,
            margin: 0,
            textTransform: "uppercase",
            background: `linear-gradient(
              105deg,
              #6a6a6a 0%,
              #d0d0d0 12%,
              #ffffff 20%,
              #e8e8e8 28%,
              #7a7a7a 38%,
              #c8c8c8 45%,
              #ffffff 52%,
              #909090 60%,
              #dedede 68%,
              #ffffff 75%,
              #808080 85%,
              #d4d4d4 92%,
              #6a6a6a 100%
            )`,
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: loaded ? "liquidShimmer 8s ease-in-out infinite, softGlow 6s ease-in-out infinite" : "none",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(25px)",
            transition: "opacity 1s cubic-bezier(.16,1,.3,1) 0.7s, transform 1s cubic-bezier(.16,1,.3,1) 0.7s",
            filter: "drop-shadow(0 0 30px rgba(200,200,220,0.06))",
          }}
        >
          Skyler Pan
        </h1>

        <p style={{
          maxWidth: 520, fontSize: 15, lineHeight: 1.75,
          color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans', sans-serif",
          fontWeight: 300, marginTop: 32,
          opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(15px)",
          transition: "all 0.8s cubic-bezier(.16,1,.3,1) 1s",
        }}>
          {RESUME.summary}
        </p>

        <div style={{
          display: "flex", gap: 12, marginTop: 36, flexWrap: "wrap",
          justifyContent: "center", opacity: loaded ? 1 : 0, transition: "opacity 0.8s 1.2s",
        }}>
          <Chip>{RESUME.email}</Chip>
          <Chip>{RESUME.phone}</Chip>
        </div>

        {/* scroll indicator */}
        <div style={{
          position: "absolute", bottom: 40, display: "flex", flexDirection: "column",
          alignItems: "center", gap: 8, opacity: loaded ? 0.3 : 0, transition: "opacity 1s 1.5s",
          animation: "float 2.5s ease-in-out infinite",
        }}>
          <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)" }}>
            SCROLL
          </div>
          <div style={{ width: 1, height: 32, background: "linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)" }} />
        </div>
      </div>

      {/* ══════════ CONTENT ══════════ */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 760, margin: "0 auto", padding: "0 24px 100px" }}>

        {/* ── EXPERIENCE ── */}
        <Section>
          <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: "0.2em", color: "rgba(230,180,120,0.5)", textTransform: "uppercase", marginBottom: 32 }}>
            01 — Experience
          </div>
        </Section>
        {RESUME.experience.map((item, i) => (
          <ExpCard key={i} item={item} index={i} />
        ))}

        {/* ── EDUCATION ── */}
        <div style={{ marginTop: 80 }}>
          <Section>
            <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: "0.2em", color: "rgba(230,180,120,0.5)", textTransform: "uppercase", marginBottom: 32 }}>
              02 — Education
            </div>
          </Section>
          <Section delay={0.1}>
            <div style={{ padding: "28px 32px", borderRadius: 12, background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                <div>
                  <div style={{ fontSize: 22, fontFamily: "'Playfair Display', serif", color: "#fff", fontWeight: 600 }}>
                    {RESUME.education.abbr}
                  </div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>
                    {RESUME.education.school}
                  </div>
                </div>
                <Chip>{RESUME.education.period}</Chip>
              </div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif", marginTop: 14 }}>
                {RESUME.education.degree}
              </div>
            </div>
          </Section>
        </div>

        {/* ── AWARDS ── */}
        <div style={{ marginTop: 80 }}>
          <Section>
            <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: "0.2em", color: "rgba(230,180,120,0.5)", textTransform: "uppercase", marginBottom: 32 }}>
              03 — Awards
            </div>
          </Section>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {RESUME.awards.map((a, i) => (
              <AwardCard key={i} award={a} index={i} />
            ))}
          </div>
        </div>

        {/* ── SKILLS ── */}
        <div style={{ marginTop: 80 }}>
          <Section>
            <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: "0.2em", color: "rgba(230,180,120,0.5)", textTransform: "uppercase", marginBottom: 24 }}>
              04 — Skills
            </div>
          </Section>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {RESUME.skills.map((s, i) => (
              <SkillPill key={s} name={s} index={i} />
            ))}
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div style={{ marginTop: 120, paddingTop: 40, borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
          <div style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>
            Skyler Pan · 2025
          </div>
        </div>
      </div>

      {/* keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
        @keyframes liquidShimmer {
          0% { background-position: 100% 50%; }
          50% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        @keyframes softGlow {
          0%, 100% { filter: drop-shadow(0 0 25px rgba(200,200,220,0.05)); }
          50% { filter: drop-shadow(0 0 50px rgba(210,200,220,0.12)); }
        }
        @keyframes blobDrift1 {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(8vw, 6vh) scale(1.1); }
          66% { transform: translate(-3vw, 12vh) scale(0.95); }
          100% { transform: translate(5vw, -4vh) scale(1.05); }
        }
        @keyframes blobDrift2 {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-10vw, -8vh) scale(1.08); }
          66% { transform: translate(4vw, -14vh) scale(0.92); }
          100% { transform: translate(-6vw, 5vh) scale(1.12); }
        }
        @keyframes blobDrift3 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-12vw, 10vh) scale(1.15); }
          100% { transform: translate(6vw, -8vh) scale(0.9); }
        }
        @keyframes blobDrift4 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(10vw, -12vh) scale(1.1); }
          100% { transform: translate(-4vw, 8vh) scale(0.95); }
        }
        @keyframes blobDrift5 {
          0% { transform: translate(0, 0) scale(1) rotate(0deg); }
          50% { transform: translate(-8vw, 15vh) scale(1.2) rotate(30deg); }
          100% { transform: translate(5vw, -5vh) scale(0.85) rotate(-15deg); }
        }
        @keyframes cursorPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        @keyframes reticleSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes reticleSpinReverse {
          from { transform: rotate(45deg); }
          to { transform: rotate(-315deg); }
        }
        * { margin: 0; padding: 0; box-sizing: border-box; cursor: none !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(230,180,120,0.15); border-radius: 3px; }
        ::selection { background: rgba(230,180,120,0.3); color: #fff; }
      `}</style>
    </div>
  );
}
