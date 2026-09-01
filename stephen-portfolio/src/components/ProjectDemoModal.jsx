import React, { useRef, useEffect, useState } from 'react';
import './ProjectDemos.css';
import MonicaAiDemo from './MonicaAiDemo';
import {
  FaTimes, FaPaperPlane, FaSync, FaCompass, FaCheckCircle,
  FaUtensils, FaFilePdf, FaChartLine, FaExclamationTriangle,
  FaPalette, FaTachometerAlt, FaSlidersH, FaUserCheck,
  FaSkullCrossbones, FaDatabase
} from 'react-icons/fa';

const ProjectDemoModal = ({ project, onClose }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (project) {
      if (dialogRef.current) {
        dialogRef.current.showModal();
      }
    }
  }, [project]);

  const handleClose = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    onClose();
  };

  // Backdrop light-dismiss fallback
  const handleBackdropClick = (event) => {
    if (event.target !== dialogRef.current) return;
    const rect = dialogRef.current.getBoundingClientRect();
    const isInside = (
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width
    );
    if (!isInside) {
      handleClose();
    }
  };

  if (!project) return null;

  return (
    <dialog
      ref={dialogRef}
      className="demo-dialog"
      onClick={handleBackdropClick}
      onClose={handleClose}
    >
      <div className="dialog-container">
        <div className="demo-header">
          <h3>
            {project.name}
            <span className="demo-header-tagline">| {project.tagline}</span>
          </h3>
          <button className="close-btn" onClick={handleClose} aria-label="Close dialog">
            <FaTimes />
          </button>
        </div>
        <div className="demo-body">
          {renderDemo(project.demoType)}
        </div>
      </div>
    </dialog>
  );
};

// ============================================================
// Simulator Router
// ============================================================
const renderDemo = (demoType) => {
  switch (demoType) {
    case 'interview-simulation':
      return <MonicaAiDemo />;
    case 'zork-hud':
      return <ZorkV2Demo />;
    case 'chef-assistant':
      return <FridgeJamDemo />;
    case 'financial-ledger':
      return <FinTrackerDemo />;
    case 'portfolio-dashboard':
      return <PortfolioDemo />;
    default:
      return <p>No demo simulator configured.</p>;
  }
};

// ============================================================
// 2. Zork v2 — DePauw Campus Text Adventure Terminal
// ============================================================
const ZorkV2Demo = () => {
  const THEMES = [
    { name: 'Amber', color: '#ffb300' },
    { name: 'Sage', color: '#6c9a57' },
    { name: 'Cyan', color: '#0899e7' },
    { name: 'Rose', color: '#e83e8c' },
    { name: 'Violet', color: '#c084fc' },
  ];

  const INITIAL_QUESTS = [
    { name: 'Ring the Bell Tower', status: 'ACTIVE' },
    { name: 'Recover Library Key', status: 'LOCKED' },
    { name: 'Feed the Campus Cat', status: 'OPEN' },
    { name: 'Beat the Lab Timer', status: 'LOCKED' },
  ];

  const [accent, setAccent] = useState('#ffb300');
  const [sessionId] = useState(() => Math.random().toString(16).slice(2, 6).toUpperCase());
  const callsign = 'TIGER-7';

  const [consoleLogs, setConsoleLogs] = useState([
    "SYS  DePauw Text Adventure v2 — session booted.",
    "LOC  Bowman Park. Morning fog clings to the quad; the bell tower looms east.",
    "TIP  Type \"help\" for commands, or tap a quick action below."
  ]);
  const [inputVal, setInputVal] = useState('');
  const [location, setLocation] = useState('Bowman Park');

  const [hunger, setHunger] = useState(18);
  const [stamina, setStamina] = useState(92);
  const [score, setScore] = useState(0);

  const [inventory, setInventory] = useState([
    { name: 'Campus Map', status: 'HELD' },
    { name: 'Meal Swipe', status: 'x2' },
  ]);
  const [quests, setQuests] = useState(INITIAL_QUESTS);
  const totalQuests = 8;
  const questsDone = quests.filter(q => q.status === 'DONE').length;

  // Timed lock-pick challenge
  const [challengeActive, setChallengeActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(12);
  const [typedChallenge, setTypedChallenge] = useState('');
  const challengeTarget = 'UNLOCK ROY O WEST';

  // Leaderboard overlay
  const [boardOpen, setBoardOpen] = useState(false);
  const [boardTab, setBoardTab] = useState('global');

  const rank = score >= 280 ? 'Honor Scholar'
    : score >= 180 ? 'Senior'
    : score >= 100 ? 'Junior'
    : score >= 40 ? 'Sophomore'
    : 'Freshman';

  const pushLog = (...lines) => setConsoleLogs(prev => [...prev, ...lines]);

  // Countdown driver for the timed challenge. All state changes happen inside
  // the timer callback (not the effect body) so we don't trigger cascading renders.
  useEffect(() => {
    if (!challengeActive) return undefined;
    const t = setTimeout(() => {
      if (timeLeft <= 1) {
        setChallengeActive(false);
        setStamina(p => Math.max(0, p - 15));
        pushLog("CHAL ⏱ Time's up — the gate re-locks. (-15 stamina)");
      } else {
        setTimeLeft(v => v - 1);
      }
    }, 1000);
    return () => clearTimeout(t);
  }, [challengeActive, timeLeft]);

  const moveCost = () => {
    setHunger(p => Math.min(100, p + 6));
    setStamina(p => Math.max(0, p - 5));
  };

  const handleCommand = (e) => {
    e.preventDefault();
    const raw = inputVal.trim();
    if (!raw) return;
    const cmd = raw.toLowerCase();
    setInputVal('');
    const echo = "> " + raw.toUpperCase();

    if (cmd === 'help' || cmd === 'examine help') {
      pushLog(echo, "CMD  look · go <dir> · take <item> · open <container> · eat <item> · inventory · quests · map · leaderboard");
    } else if (cmd === 'look') {
      pushLog(echo, `LOC  ${location}. Ivy-draped brick, a notice board, paths branch north toward Roy O. West Library.`);
    } else if (cmd === 'map') {
      pushLog(echo, `MAP  15 locations charted · here: ${location} · COORDS 39.6407°N, 86.8620°W`);
    } else if (cmd === 'inventory' || cmd === 'inv') {
      pushLog(echo, "BAG  " + inventory.map(i => i.name).join(', '));
    } else if (cmd === 'quests') {
      const active = quests.filter(q => q.status === 'ACTIVE').map(q => q.name).join(', ') || 'none';
      pushLog(echo, `LOG  ${questsDone}/${totalQuests} complete — active: ${active}`);
    } else if (cmd === 'leaderboard' || cmd === 'scores') {
      setBoardOpen(true);
      pushLog(echo, "NET  Fetching global + DePauw boards…");
    } else if (cmd.includes('north')) {
      moveCost();
      pushLog(echo, "⚠  Roy O. West is locked after hours — a timed lock-pick challenge begins!");
      setTimeLeft(12);
      setTypedChallenge('');
      setChallengeActive(true);
    } else if (cmd.startsWith('go ') || cmd === 'south' || cmd === 'east' || cmd === 'west') {
      moveCost();
      setLocation('Julian Science Center');
      pushLog(echo, "LOC  You cross the quad and reach Julian Science Center. A cold lab hums nearby.");
    } else if (cmd.startsWith('take')) {
      const item = (raw.split(' ').slice(1).join(' ') || 'ID Card').replace(/\b\w/g, c => c.toUpperCase());
      setInventory(prev => prev.some(i => i.name.toLowerCase() === item.toLowerCase()) ? prev : [...prev, { name: item, status: 'HELD' }]);
      setScore(s => s + 10);
      pushLog(echo, `GET  You pocket the ${item}. (+10 score)`);
    } else if (cmd.startsWith('open')) {
      const target = raw.split(' ').slice(1).join(' ') || 'locker';
      setInventory(prev => prev.some(i => i.name === 'Rusty Key') ? prev : [...prev, { name: 'Rusty Key', status: 'HELD' }]);
      setScore(s => s + 5);
      pushLog(echo, `OPN  The ${target} creaks open — a Rusty Key rests inside. (+5 score)`);
    } else if (cmd.startsWith('eat') || cmd.startsWith('use')) {
      setHunger(p => Math.max(0, p - 25));
      setStamina(p => Math.min(100, p + 10));
      pushLog(echo, "EAT  You refuel. Hunger drops, stamina recovers.");
    } else {
      setHunger(p => Math.min(100, p + 2));
      pushLog(echo, "ERR  The parser doesn't understand that. Try \"help\".");
    }
  };

  const handleChallengeSubmit = (e) => {
    e.preventDefault();
    if (typedChallenge.trim().toUpperCase() === challengeTarget) {
      const gained = 25 + timeLeft * 2;
      setChallengeActive(false);
      setScore(s => s + gained);
      setStamina(p => Math.max(0, p - 5));
      setLocation('Roy O. West Library');
      setQuests(prev => prev.map(q => q.name === 'Recover Library Key' ? { ...q, status: 'DONE' } : q));
      pushLog(`CHAL ✓ Lock sprung with ${timeLeft}s to spare! (+${gained} score)`, "LOC  You slip into Roy O. West Library. Quest complete.");
    } else {
      setStamina(p => Math.max(0, p - 8));
      setTypedChallenge('');
      pushLog("CHAL ✗ Wrong sequence — the tumblers reset. (-8 stamina)");
    }
  };

  const boardBase = boardTab === 'global'
    ? [{ tag: 'NOVA-1', score: 420 }, { tag: 'BYTE-9', score: 355 }, { tag: 'ECHO-4', score: 290 }, { tag: 'PIXL-8', score: 140 }]
    : [{ tag: 'TIGER-3', score: 310 }, { tag: 'HALL-5', score: 150 }, { tag: 'QUAD-2', score: 70 }];
  const board = [...boardBase, { tag: `${callsign} (you)`, score, you: true }]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const quickCmds = ['look', 'go north', 'take id-card', 'open locker', 'eat sandwich', 'quests', 'leaderboard'];

  return (
    <div className="zork-cockpit">
      {/* 1. Left icon + theme strip */}
      <div className="zork-sidebar-strip">
        <div className="zork-sidebar-icon active" title="ADVENTURER" style={{ color: accent, background: `color-mix(in srgb, ${accent} 10%, transparent)` }}><FaUserCheck /></div>
        <div className="zork-sidebar-icon" title="QUEST LOG"><FaCheckCircle /></div>
        <div className="zork-sidebar-icon" title="INVENTORY"><FaSlidersH /></div>
        <div className="zork-sidebar-icon" title="CAMPUS MAP"><FaCompass /></div>
        <div className="zork-sidebar-icon" title="LEADERBOARD" onClick={() => setBoardOpen(true)}><FaChartLine /></div>

        <div style={{ flex: 1 }}></div>

        {/* Five visual themes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', marginBottom: '8px' }} title="Visual themes">
          {THEMES.map(t => (
            <button
              key={t.name}
              onClick={() => setAccent(t.color)}
              aria-label={`${t.name} theme`}
              style={{
                width: '14px', height: '14px', borderRadius: '50%', cursor: 'pointer', padding: 0,
                background: t.color,
                border: accent === t.color ? '2px solid #fff' : '1px solid rgba(255,255,255,0.2)',
                boxShadow: accent === t.color ? `0 0 8px ${t.color}` : 'none'
              }}
            />
          ))}
        </div>

        <div
          className="zork-sidebar-icon"
          title="REBOOT SESSION"
          onClick={() => {
            setConsoleLogs(["SYS  Rebooting… a fresh isolated session spins up.", "LOC  Bowman Park. The fog rolls back in."]);
            setHunger(18); setStamina(92); setScore(0);
            setLocation('Bowman Park');
            setChallengeActive(false); setBoardOpen(false);
            setInventory([{ name: 'Campus Map', status: 'HELD' }, { name: 'Meal Swipe', status: 'x2' }]);
            setQuests(INITIAL_QUESTS);
          }}
          style={{ color: '#ff5e5e' }}
        >
          <FaSkullCrossbones />
        </div>
      </div>

      {/* 2. Center terminal */}
      <div className="zork-screen-panel">
        <div className="zork-panel-title" style={{ color: accent }}>
          <span>DEPAUW_TEXT_ADVENTURE</span>
          <span style={{ fontSize: '0.62rem', color: '#8c8c8c' }}>SESSION #{sessionId} · ISOLATED</span>
        </div>

        <div className="zork-screen-scroller">
          {consoleLogs.map((log, idx) => (
            <div key={idx} style={{ marginBottom: '6px', color: log.startsWith('>') ? accent : (log.includes('⚠') || log.includes('✗') || log.startsWith('ERR')) ? '#ff5e5e' : (log.includes('✓') ? '#6c9a57' : '#cbd5e1') }}>
              {log}
            </div>
          ))}
        </div>

        {challengeActive ? (
          <form onSubmit={handleChallengeSubmit} style={{ marginBottom: '16px', background: 'rgba(255, 94, 94, 0.05)', border: '1px solid #ff5e5e', borderRadius: '8px', padding: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ff5e5e', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '6px' }}>
              <span>⏱ TIMED CHALLENGE</span>
              <span>{timeLeft}s</span>
            </div>
            <p style={{ margin: '0 0 6px', fontSize: '0.65rem', color: '#c0d1e5' }}>Type the unlock sequence before the timer expires — faster clears earn more points:</p>
            <div style={{ color: '#fff', fontSize: '0.8rem', padding: '6px', background: '#000', marginBottom: '8px', border: '1px dashed #ff5e5e', textAlign: 'center', letterSpacing: '1px' }}>
              {challengeTarget}
            </div>
            <input
              type="text"
              value={typedChallenge}
              onChange={(e) => setTypedChallenge(e.target.value)}
              placeholder="Type here and press Enter…"
              style={{ background: '#02040b', width: '100%', boxSizing: 'border-box', border: '1px solid #ff5e5e', padding: '8px', fontSize: '0.8rem', color: '#fff', fontFamily: 'inherit' }}
              autoFocus
            />
          </form>
        ) : boardOpen ? (
          <div style={{ marginBottom: '16px', background: '#02040b', border: `1px solid ${accent}`, borderRadius: '8px', padding: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ color: accent, fontWeight: 'bold', fontSize: '0.8rem' }}>🏆 LEADERBOARD</span>
              <button onClick={() => setBoardOpen(false)} style={{ background: 'none', border: 'none', color: '#8c8c8c', cursor: 'pointer', fontSize: '0.7rem', fontFamily: 'inherit' }}>CLOSE ✕</button>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              {['global', 'depauw'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setBoardTab(tab)}
                  style={{
                    flex: 1, padding: '6px', fontFamily: 'inherit', fontSize: '0.65rem', fontWeight: 'bold',
                    textTransform: 'uppercase', cursor: 'pointer', borderRadius: '4px',
                    border: `1px solid ${boardTab === tab ? accent : '#1a2c42'}`,
                    background: boardTab === tab ? `color-mix(in srgb, ${accent} 15%, transparent)` : 'transparent',
                    color: boardTab === tab ? accent : '#8c8c8c'
                  }}
                >
                  {tab === 'global' ? 'Global' : 'DePauw Only'}
                </button>
              ))}
            </div>
            {board.map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', borderRadius: '4px', marginBottom: '4px', fontSize: '0.72rem', background: row.you ? `color-mix(in srgb, ${accent} 12%, transparent)` : '#010309', border: row.you ? `1px solid ${accent}` : '1px solid #111a2e', color: row.you ? accent : '#cbd5e1' }}>
                <span>#{i + 1} &nbsp; {row.tag}</span>
                <span style={{ fontWeight: 'bold' }}>{row.score}</span>
              </div>
            ))}
            <p style={{ margin: '8px 0 0', fontSize: '0.58rem', color: '#6b7280' }}>best-score dedup · server-validated</p>
          </div>
        ) : (
          <form className={`zork-hud-prompt ${inputVal ? 'focused' : ''}`} onSubmit={handleCommand}>
            <span style={{ color: accent }}>&gt;</span>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="TYPE A COMMAND…"
              className="zork-hud-input"
            />
          </form>
        )}

        {/* Quick command chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
          {quickCmds.map((btnCmd) => (
            <button
              key={btnCmd}
              onClick={() => setInputVal(btnCmd)}
              style={{
                background: `color-mix(in srgb, ${accent} 6%, transparent)`,
                border: `1px solid color-mix(in srgb, ${accent} 30%, #2c3e50)`,
                color: accent,
                fontSize: '0.65rem',
                fontFamily: 'inherit',
                borderRadius: '4px',
                padding: '6px 10px',
                cursor: 'pointer',
                textTransform: 'uppercase'
              }}
            >
              {btnCmd}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Right HUD */}
      <div className="zork-hud-panel">
        {/* Player identity */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
          <div className="zork-gauge-box" style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px' }}>SCORE</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: accent }}>{score}</div>
          </div>
          <div className="zork-gauge-box" style={{ flex: 1.4, textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px' }}>RANK</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: accent, marginTop: '4px' }}>{rank}</div>
          </div>
        </div>
        <div style={{ fontSize: '0.62rem', color: '#8c8c8c', textAlign: 'center', marginTop: '-6px' }}>
          CALLSIGN <strong style={{ color: '#cbd5e1' }}>{callsign}</strong> · {location}
        </div>

        {/* Gauges */}
        <div className="zork-gauge-box">
          <div className="zork-gauge-label"><span>HUNGER</span><span>{hunger}%</span></div>
          <div className="zork-gauge-bar-bg">
            <div className="zork-gauge-bar-fill" style={{ width: `${hunger}%`, background: hunger > 65 ? '#ff5e5e' : accent, boxShadow: `0 0 8px ${hunger > 65 ? 'rgba(255,94,94,0.6)' : 'rgba(255,179,0,0.4)'}` }}></div>
          </div>
        </div>
        <div className="zork-gauge-box">
          <div className="zork-gauge-label"><span>STAMINA</span><span>{stamina}%</span></div>
          <div className="zork-gauge-bar-bg">
            <div className="zork-gauge-bar-fill" style={{ width: `${stamina}%`, background: stamina < 30 ? '#ff5e5e' : accent }}></div>
          </div>
        </div>
        <div className="zork-gauge-box">
          <div className="zork-gauge-label"><span>QUEST PROGRESS</span><span>{questsDone}/{totalQuests}</span></div>
          <div className="zork-gauge-bar-bg">
            <div className="zork-gauge-bar-fill" style={{ width: `${(questsDone / totalQuests) * 100}%`, background: accent }}></div>
          </div>
        </div>

        {/* Inventory */}
        <div className="zork-panel-title" style={{ marginTop: '4px', color: accent }}>INVENTORY</div>
        {inventory.map((item, i) => (
          <div key={i} className="zork-manifest-item">
            <span>{item.name}</span>
            <span style={{ color: '#6c9a57' }}>{item.status}</span>
          </div>
        ))}

        {/* Quests */}
        <div className="zork-panel-title" style={{ marginTop: '4px', color: accent }}>QUEST_LOG</div>
        <div style={{ fontSize: '0.7rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {quests.map((q, i) => (
            <div key={i}>
              {q.status === 'DONE' ? '✓' : '•'} {q.name}
              <span style={{ float: 'right', color: q.status === 'DONE' ? '#6c9a57' : q.status === 'LOCKED' ? '#ff5e5e' : '#ffb300' }}>{q.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// 3. FridgeJam - Cozy Ingredients Leftovers Scanner
// ============================================================
const FridgeJamDemo = () => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [personality, setPersonality] = useState('Fitness Coach');
  const [recipeState, setRecipeState] = useState('idle'); // idle, scanning, generating, generated
  const [gameScore, setGameScore] = useState(0);
  
  // Interactive falling items inside Leftovers Jar mini game
  const [fallingEmoji, setFallingEmoji] = useState('🍅');
  const [fallingLeft, setFallingLeft] = useState(50);

  const ingredientsList = [
    '🥚 Eggs', '🥛 Milk', '🧀 Cheese', '🍗 Chicken', 
    '🍅 Tomato', '🥬 Spinach', '🧈 Butter', '🥦 Broccoli', '🍄 Mushrooms'
  ];

  const emojis = ['🍅', '🥚', '🧀', '🥦', '🍄', '🍗'];

  const toggleIngredient = (ing) => {
    if (selectedIngredients.includes(ing)) {
      setSelectedIngredients(prev => prev.filter(x => x !== ing));
    } else {
      setSelectedIngredients(prev => [...prev, ing]);
    }
  };

  const calculateMacros = () => {
    let protein = 0;
    let carbs = 0;
    let fat = 0;

    selectedIngredients.forEach(ing => {
      if (ing.includes('Eggs')) { protein += 12; fat += 10; carbs += 1; }
      else if (ing.includes('Milk')) { protein += 8; fat += 6; carbs += 12; }
      else if (ing.includes('Cheese')) { protein += 14; fat += 18; carbs += 2; }
      else if (ing.includes('Chicken')) { protein += 30; fat += 8; carbs += 0; }
      else if (ing.includes('Tomato')) { protein += 1; fat += 0; carbs += 5; }
      else if (ing.includes('Spinach')) { protein += 2; fat += 0; carbs += 2; }
      else if (ing.includes('Butter')) { protein += 0; fat += 12; carbs += 0; }
      else if (ing.includes('Broccoli')) { protein += 3; fat += 0; carbs += 6; }
      else if (ing.includes('Mushrooms')) { protein += 2; fat += 0; carbs += 3; }
    });

    const calories = (protein * 4) + (carbs * 4) + (fat * 9);
    return { protein, carbs, fat, calories };
  };

  const handleGenerate = () => {
    if (selectedIngredients.length === 0) return;
    setRecipeState('scanning');
    
    // Scanner runs for 2s, then mini game / recipe generating runs for 4s
    setTimeout(() => {
      setRecipeState('generating');
    }, 2000);

    setTimeout(() => {
      setRecipeState('generated');
    }, 6000);
  };

  // Mini-game click interaction
  const handleEmojiClick = () => {
    setGameScore(s => s + 15);
    const randEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    const randLeft = Math.floor(Math.random() * 80) + 10;
    setFallingEmoji(randEmoji);
    setFallingLeft(randLeft);
  };

  const macros = calculateMacros();

  return (
    <div className="chef-cozy-container">
      {/* 1. Left Panel: Cozy wooden fridge */}
      <div className="cozy-wooden-fridge">
        <h4 style={{ margin: '0 0 8px', color: '#5c4d3c', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaUtensils /> Fridge Leftovers
        </h4>
        <p style={{ margin: '0 0 16px', fontSize: '0.75rem', color: '#776b5d' }}>Select remnants inside your cupboard to trigger the multimodal scanner:</p>
        
        <div style={{ flex: 1, position: 'relative' }}>
          <div className="cozy-ingredient-selector">
            {ingredientsList.map((ing, idx) => (
              <span
                key={idx}
                className={`cozy-chip ${selectedIngredients.includes(ing) ? 'selected' : ''}`}
                onClick={() => toggleIngredient(ing)}
              >
                {ing}
              </span>
            ))}
          </div>

          {recipeState === 'scanning' && (
            <div className="cozy-scan-overlay">
              <div className="cozy-scan-beam"></div>
              <strong style={{ color: '#6c9a57', fontSize: '0.8rem', background: 'rgba(255,255,255,0.9)', padding: '6px 12px', border: '1.5px solid #6c9a57', borderRadius: '8px' }}>
                📸 SCANNING INGREDIENTS...
              </strong>
            </div>
          )}
        </div>

        <div style={{ marginTop: '20px', borderTop: '2px solid #f2ede4', paddingTop: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#5c4d3c', marginBottom: '6px' }}>AI Chef Personality:</label>
          <select 
            value={personality} 
            onChange={(e) => setPersonality(e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ebd8c2', borderRadius: '8px', fontSize: '0.75rem', color: '#555', background: '#fff' }}
          >
            <option>Fitness Coach (Aggressive macros focus)</option>
            <option>Cozy Grandmother (Warm recipes)</option>
            <option>Michelin Star Chef (High-end culinary)</option>
          </select>
        </div>

        <button
          onClick={handleGenerate}
          disabled={selectedIngredients.length === 0 || recipeState !== 'idle'}
          style={{
            marginTop: '16px',
            width: '100%',
            background: selectedIngredients.length === 0 ? '#d3c5b5' : '#6c9a57',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            padding: '12px',
            fontWeight: 'bold',
            fontSize: '0.85rem',
            cursor: selectedIngredients.length === 0 ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
            boxShadow: '0 4px 10px rgba(108, 154, 87, 0.15)'
          }}
        >
          {recipeState === 'idle' ? 'Scan leftovers & Cook' : (recipeState === 'scanning' ? 'Scanning Image...' : 'AI Chef Thinking...')}
        </button>
      </div>

      {/* 2. Right Panel: Output and Game */}
      <div className="chef-recipe-sheet">
        {recipeState === 'idle' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: '#776b5d' }}>
            <FaUtensils style={{ fontSize: '3rem', color: '#ebd8c2', marginBottom: '16px' }} />
            <h4 style={{ margin: '0 0 6px', fontWeight: '800' }}>Ready to Jam!</h4>
            <p style={{ margin: 0, fontSize: '0.8rem', textAlign: 'center', maxWidth: '360px', lineHeight: '1.4' }}>
              Select ingredients from Stephen's mock fridge left side, boot the scanner, and see macro trajectories generate live!
            </p>
          </div>
        )}

        {recipeState === 'scanning' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: '#776b5d' }}>
            <FaSync className="spin" style={{ fontSize: '2.5rem', color: '#6c9a57', marginBottom: '16px' }} />
            <p style={{ margin: 0, fontSize: '0.8rem' }}>Processing image frames through Gemini-2.5-Flash model API...</p>
          </div>
        )}

        {recipeState === 'generating' && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <h4 style={{ margin: '0 0 4px', color: '#5c4d3c', fontWeight: '800' }}>🍳 Gemini AI is compiling recipes...</h4>
            <p style={{ margin: '0 0 12px', fontSize: '0.72rem', color: '#776b5d' }}>Tap the dropping leftovers in the **Leftovers Jar** to increase score!</p>
            
            <div className="jar-mini-game">
              <span className="jar-mini-score">GAME SCORE: {gameScore} PTS</span>
              <div 
                className="jar-falling-item" 
                style={{ left: `${fallingLeft}%` }}
                onClick={handleEmojiClick}
              >
                {fallingEmoji}
              </div>
            </div>
            
            <div style={{ marginTop: '12px', fontSize: '0.75rem', fontWeight: 'bold', color: '#6c9a57', textAlign: 'center' }}>
              🏆 Tap emoji items to score +15 points!
            </div>
          </div>
        )}

        {recipeState === 'generated' && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ borderBottom: '2px solid #f2ede4', paddingBottom: '12px', marginBottom: '16px' }}>
              <h4 style={{ margin: 0, color: '#6c9a57', fontSize: '1.3rem', fontWeight: '800' }}>🍳 Leftover Chef's Frittata ({personality.split(' ')[0]})</h4>
              <span style={{ fontSize: '0.72rem', color: '#888' }}>Gemini-2.5-Flash Multimodal leftovers analysis result</span>
            </div>

            <div className="macro-box">
              <div>
                <div className="macro-item-val">{macros.calories}</div>
                <div className="macro-item-lbl">Calories</div>
              </div>
              <div>
                <div className="macro-item-val">{macros.protein}g</div>
                <div className="macro-item-lbl">Protein</div>
              </div>
              <div>
                <div className="macro-item-val">{macros.carbs}g</div>
                <div className="macro-item-lbl">Carbs</div>
              </div>
              <div>
                <div className="macro-item-val">{macros.fat}g</div>
                <div className="macro-item-lbl">Fats</div>
              </div>
            </div>

            <div style={{ flex: 1, fontSize: '0.8rem', color: '#4a4947', lineHeight: '1.6' }}>
              <strong style={{ color: '#5c4d3c' }}>Custom Culinary Recommendation:</strong>
              <p style={{ margin: '4px 0 12px' }}>
                Based on your remaining ingredients (<strong>{selectedIngredients.join(', ')}</strong>), we suggest a skillet-baked frittata. Baked items require minimal preparation and maximize remaining nutrition indices.
              </p>
              <strong style={{ color: '#5c4d3c' }}>Directions:</strong>
              <ol style={{ margin: '6px 0', paddingLeft: '16px' }}>
                <li>Whisk the eggs with a splash of milk and pour over sautéed leftovers.</li>
                <li>Fold in spinach, mushrooms, and top with cheese.</li>
                <li>Bake at 350°F for 14 minutes until gold brown. Export cooks-sheet.</li>
              </ol>
            </div>

            <button 
              onClick={() => alert("Downloading PDF Cookbook template...")}
              style={{
                marginTop: '16px',
                background: '#fdfaf6',
                border: '1.5px solid #ecdac6',
                borderRadius: '8px',
                padding: '10px',
                fontWeight: 'bold',
                color: '#5c4d3c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              <FaFilePdf /> Export Print-Ready Cookbook PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// 4. FinTracker - Personal Finance Dashboard Simulation
// ============================================================
const FinTrackerDemo = () => {
  const [view, setView] = useState('overview');
  const [synced, setSynced] = useState(false);
  const [style, setStyle] = useState('Balanced');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([
    { role: 'AI', text: 'You are within budget this month. Dining is the clearest opportunity: it is 18% above your usual pace.' }
  ]);

  const categories = [
    { name: 'Housing', value: 1380, percent: 82 },
    { name: 'Dining', value: 426, percent: 51 },
    { name: 'Groceries', value: 312, percent: 38 },
    { name: 'Transport', value: 184, percent: 22 },
  ];

  const subscriptions = [
    { name: 'Spotify', cadence: 'Monthly', monthly: 11.99, next: 'Aug 24' },
    { name: 'Adobe', cadence: 'Monthly', monthly: 22.99, next: 'Aug 28' },
    { name: 'Cloud Storage', cadence: 'Annual', monthly: 8.33, next: 'Sep 03' },
  ];

  const submitQuestion = (event) => {
    event.preventDefault();
    if (!message.trim()) return;
    const question = message.trim();
    setMessage('');
    setChat((items) => [
      ...items,
      { role: 'You', text: question },
      { role: 'AI', text: `${style} plan: cap dining at $85 per week and redirect the difference toward your emergency-fund goal. Based on this month's transactions, that would free about $164.` }
    ]);
  };

  return (
    <div className="fintracker-dark-view">
      <aside className="fintracker-sidebar">
        <div className="fintracker-brand"><FaChartLine /> FINTRACKER</div>
        {[
          ['overview', 'Overview'],
          ['subscriptions', 'Subscriptions'],
          ['advisor', 'AI Advisor'],
        ].map(([id, label]) => (
          <button
            key={id}
            className={view === id ? 'active' : ''}
            onClick={() => setView(id)}
          >
            {label}
          </button>
        ))}
        <div className="fintracker-sync-status">
          <FaDatabase /> SQLite // WAL<br />
          <span>{synced ? '30 days synced' : 'Demo data loaded'}</span>
        </div>
      </aside>

      <div className="fintracker-glass-card">
        <header className="fintracker-demo-header">
          <div>
            <span className="fintracker-eyebrow">PERSONAL FINANCE // LIVE SNAPSHOT</span>
            <h4>{view === 'overview' ? 'Cash-flow overview' : view === 'subscriptions' ? 'Recurring charges' : 'Context-aware advisor'}</h4>
          </div>
          <button onClick={() => setSynced(true)}>
            <FaSync className={synced ? 'fintracker-spin' : ''} /> {synced ? 'Synced' : 'Sync Plaid / CSV'}
          </button>
        </header>

        {view === 'overview' && (
          <div className="fintracker-overview">
            <div className="fintracker-metrics">
              <div><span>NET CASH FLOW</span><strong>+$1,284</strong><small>+12.4% vs last month</small></div>
              <div><span>MONTHLY SPEND</span><strong>$2,846</strong><small>68% of budget</small></div>
              <div><span>SAVINGS GOAL</span><strong>74%</strong><small>$5,920 of $8,000</small></div>
            </div>
            <div className="fintracker-category-card">
              <div className="fintracker-card-title">SPEND BY CATEGORY</div>
              {categories.map((category) => (
                <div className="fintracker-category-row" key={category.name}>
                  <span>{category.name}</span>
                  <div><i style={{ width: `${category.percent}%` }} /></div>
                  <strong>${category.value.toLocaleString()}</strong>
                </div>
              ))}
            </div>
            <div className="fintracker-insight">
              <FaExclamationTriangle /> Dining is trending $64 above your usual pace. Your subscriptions total $519.72 annually.
            </div>
          </div>
        )}

        {view === 'subscriptions' && (
          <div className="fintracker-subscriptions">
            <div className="fintracker-subscription-summary">
              <span>3 detected subscriptions</span><strong>$43.31 / month</strong><small>$519.72 normalized annual cost</small>
            </div>
            {subscriptions.map((item) => (
              <div className="fintracker-subscription-row" key={item.name}>
                <div><strong>{item.name}</strong><span>{item.cadence} · next {item.next}</span></div>
                <b>${item.monthly.toFixed(2)}<small>/mo</small></b>
                <button onClick={() => setView('advisor')}>Cancellation help</button>
              </div>
            ))}
          </div>
        )}

        {view === 'advisor' && (
          <div className="fintracker-advisor">
            <div className="fintracker-style-picker">
              <span>ADVICE STYLE</span>
              {['Creative', 'Balanced', 'Strict'].map((name) => (
                <button key={name} className={style === name ? 'active' : ''} onClick={() => setStyle(name)}>{name}</button>
              ))}
            </div>
            <div className="fintracker-chat">
              {chat.map((item, index) => (
                <div className={item.role === 'AI' ? 'ai' : 'user'} key={`${item.role}-${index}`}>
                  <strong>{item.role}</strong>{item.text}
                </div>
              ))}
            </div>
            <form onSubmit={submitQuestion} className="fintracker-chat-form">
              <input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask about your spending, budget, or subscriptions…" />
              <button aria-label="Send question"><FaPaperPlane /></button>
            </form>
            <small className="fintracker-model-note">Gemini / Claude · grounded in current metrics, categories, and recent transactions</small>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// 5. Portfolio Website - Theme swapper & PageSpeed Simulator
// ============================================================
const PortfolioDemo = () => {
  const [activeAccent, setActiveAccent] = useState('Sage');
  const [auditState, setAuditState] = useState('idle');
  const [lcp, setLcp] = useState(0);
  const [inp, setInp] = useState(0);
  const [seo, setSeo] = useState(0);
  const [a11y, setA11y] = useState(0);

  const colors = {
    Sage: '#6c9a57',
    Cyber: '#0899e7',
    Crimson: '#e83e8c'
  };

  const handleAudit = () => {
    setAuditState('running');
    setLcp(10);
    setInp(20);
    setSeo(15);
    setA11y(25);
    
    let timer = setInterval(() => {
      setLcp(prev => {
        if (prev >= 99) {
          clearInterval(timer);
          setAuditState('audited');
          return 99;
        }
        return prev + 5;
      });
      setInp(prev => Math.min(98, prev + 6));
      setSeo(prev => Math.min(100, prev + 5));
      setA11y(prev => Math.min(100, prev + 4));
    }, 120);
  };

  return (
    <div className="portfolio-grid" style={{ padding: '24px', boxSizing: 'border-box' }}>
      <div className="swatch-card" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
        <FaPalette style={{ fontSize: '2.5rem', color: colors[activeAccent], transition: 'color 0.3s' }} />
        <h4 style={{ margin: '12px 0 6px', fontSize: '0.95rem', fontWeight: '800' }}>Portfolio Brand Swapper</h4>
        <p style={{ margin: 0, fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center', lineHeight: '1.4' }}>
          Swap global CSS theme variables. Watch anchors and indicators align instantly:
        </p>
        <div className="swatch-group">
          {Object.keys(colors).map((themeName) => (
            <button
              key={themeName}
              className={`swatch-btn ${activeAccent === themeName ? 'active' : ''}`}
              style={{ backgroundColor: colors[themeName], border: 'none' }}
              onClick={() => {
                setActiveAccent(themeName);
                document.documentElement.style.setProperty('--portfolio-accent', colors[themeName]);
                const heroName = document.querySelector('.hero h1:nth-child(3)');
                if (heroName) heroName.style.color = colors[themeName];
              }}
            />
          ))}
        </div>
        <div style={{ marginTop: '20px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
          THEME: <strong style={{ color: colors[activeAccent] }}>{activeAccent.toUpperCase()} ACTIVE</strong>
        </div>
      </div>

      <div className="lighthouse-card" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
          <h4 style={{ margin: 0, color: '#c9ec9e', fontSize: '0.9rem', fontWeight: '800' }}>Lighthouse PageSpeed Dials</h4>
          <button 
            onClick={handleAudit} 
            disabled={auditState === 'running'}
            style={{
              background: colors[activeAccent],
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '0.72rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {auditState === 'running' ? 'AUDITING...' : 'RUN METRICS'}
          </button>
        </div>
        
        {auditState === 'idle' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'rgba(255,255,255,0.3)', padding: '20px 0' }}>
            <FaTachometerAlt style={{ fontSize: '2.5rem', marginBottom: '10px' }} />
            <p style={{ margin: 0, fontSize: '0.72rem', textAlign: 'center' }}>Test performance, SEO, accessibility, and loading structures natively.</p>
          </div>
        )}

        {(auditState === 'running' || auditState === 'audited') && (
          <div className="lighthouse-dial-container">
            <div className="lighthouse-dial">
              <div className="dial-circle excellent" style={{ '--percentage': lcp }}>
                {lcp}
              </div>
              <span className="dial-label" style={{ fontSize: '0.6rem' }}>Performance</span>
            </div>
            <div className="lighthouse-dial">
              <div className="dial-circle excellent" style={{ '--percentage': a11y }}>
                {a11y}
              </div>
              <span className="dial-label" style={{ fontSize: '0.6rem' }}>Accessibility</span>
            </div>
            <div className="lighthouse-dial">
              <div className="dial-circle excellent" style={{ '--percentage': inp }}>
                {inp}
              </div>
              <span className="dial-label" style={{ fontSize: '0.6rem' }}>Best Practices</span>
            </div>
            <div className="lighthouse-dial">
              <div className="dial-circle excellent" style={{ '--percentage': seo }}>
                {seo}
              </div>
              <span className="dial-label" style={{ fontSize: '0.6rem' }}>SEO</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDemoModal;
