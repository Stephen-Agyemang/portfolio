// ============================================================
// MoNiCa.Ai — interactive demo
//
// Two acts, because the project has two stories:
//   1. LIVE ROUND      — the real-time voice pipeline + delivery coaching
//   2. TECHNICAL ROUND — the validation gate + the execution-backed judge
//
// Everything shown here mirrors the real system: the stage names are the real
// engines, the latency chips are the three metrics the agent actually
// correlates per turn (EOU + LLM TTFT + TTS TTFB), and the hidden-test panel
// leaks exactly what the real one leaks — two integers, no indices.
//
// Self-contained: all classes are `mon-` prefixed, styles in MonicaAiDemo.css.
// ============================================================

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  FaMicrophone, FaVideo, FaPlay, FaCheck, FaTimes,
  FaLock, FaBolt, FaShieldAlt, FaChevronRight,
} from 'react-icons/fa';
import './MonicaAiDemo.css';

/* ---------------------------------------------------------------- constants */

const PIPELINE = [
  { id: 'vad',  label: 'VAD',  engine: 'Silero',            note: 'endpoint detected locally' },
  { id: 'stt',  label: 'STT',  engine: 'Deepgram nova-3',   note: 'streaming, interim + final' },
  { id: 'llm',  label: 'LLM',  engine: 'function tools',    note: 'persona + strictness prompt' },
  { id: 'tts',  label: 'TTS',  engine: 'ElevenLabs turbo',  note: 'streamed back over WebRTC' },
  { id: 'face', label: 'AVATAR', engine: 'Tavus',            note: 'lip-synced replica, rendered over WebRTC' },
];

// Drop a portrait at public/monica-avatar.webp and the stage stands in for the
// interviewer; without it the demo falls back to the wireframe head. The real
// face is a Tavus replica — this image only represents it, which is why the
// badge reads "avatar preview" rather than naming Tavus.
const AVATAR_SRC = '/monica-avatar.webp';

// The candidate's answer, streamed word by word the way an interim transcript
// actually arrives. Fillers are the real lexicon from useTranscription.js.
const CANDIDATE_ANSWER =
  "Um, so WebRTC runs over UDP with its own congestion control, so it can drop " +
  "a late frame instead of head-of-line blocking behind it, which is basically " +
  "what you want for live media. WebSockets sit on TCP, so, like, one lost " +
  "packet stalls everything after it.";

const WORDS = CANDIDATE_ANSWER.split(' ');

const FILLER_WORDS = ['um', 'uh', 'like', 'you know', 'basically', 'literally', 'actually', 'right', 'okay'];

const MONICA_REPLY =
  "Good — you went straight to head-of-line blocking, which is the real answer. " +
  "Push it one step further for me: if UDP can drop frames, what stops the audio " +
  "from just falling apart on a bad connection?";

// The transcript streams at 78 ms/word so the demo stays watchable — roughly ten
// times faster than anyone talks. Pace therefore has to be measured against a
// simulated speech clock, or the panel reports a confident 770 WPM.
const SPEECH_CLOCK = WORDS.reduce((acc, w, i) => {
  const prev = i === 0 ? 0 : acc[i - 1];
  acc.push(prev + 385 + 105 * Math.sin(i / 2.6) + (w.length > 7 ? 80 : 0));
  return acc;
}, []);

const ROLL = 10; // words in the rolling window, same as the real coach

const rollingWpm = (i) => {
  const from = Math.max(0, i - ROLL + 1);
  const span = SPEECH_CLOCK[i] - (from === 0 ? 0 : SPEECH_CLOCK[from - 1]);
  return Math.round(((i - from + 1) / span) * 60000);
};

// The one thing this demo must not fake: these are the shape of a real
// instrumented turn, summing to the voice-to-voice figure the agent logs.
const LATENCY = { eou: 0.91, ttft: 0.58, ttfb: 1.02 };

const PROBLEM = {
  title: 'Two Sum',
  statement:
    'Given an array of integers and a target, return the indices of the two numbers that add up to the target.',
  signature: 'twoSum(nums: int[], target: int) -> int[]',
  visible: [
    { id: 1, input: 'nums = [2, 7, 11, 15], target = 9', expected: '[0, 1]', explanation: 'nums[0] + nums[1] == 9' },
    { id: 2, input: 'nums = [3, 2, 4], target = 6',      expected: '[1, 2]' },
  ],
  hiddenTotal: 5,
  constraints: [
    '2 <= nums.length <= 10000',
    'exactly one valid answer exists',
    'you may not use the same element twice',
  ],
};

const STUBS = {
  python: `def twoSum(nums, target):
    seen = {}
    for i in range(len(nums) - 1):
        need = target - nums[i]
        if need in seen:
            return [seen[need], i]
        seen[nums[i]] = i
    return []`,
  javascript: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length - 1; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}`,
  java: `int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length - 1; i++) {
        int need = target - nums[i];
        if (seen.containsKey(need)) return new int[]{seen.get(need), i};
        seen.put(nums[i], i);
    }
    return new int[]{};
}`,
  cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size() - 1; i++) {
        int need = target - nums[i];
        if (seen.count(need)) return {seen[need], i};
        seen[nums[i]] = i;
    }
    return {};
}`,
};

const LANGUAGES = [
  { id: 'python',     label: 'Python' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'java',       label: 'Java' },
  { id: 'cpp',        label: 'C++' },
];

// The seeded bug: the loop stops one index early, so any pair whose second
// element is the last item is never found. Edit it away and the tests pass.
const BUG = /(len\(nums\)|nums\.length|nums\.size\(\))\s*-\s*1/;

const GATE_STEPS = [
  { id: 'draft',   label: 'Monica drafts the problem',                     detail: 'statement · typed signature · 7 cases · reference solution' },
  { id: 'parse',   label: 'Contract parsed',                               detail: 'closed type set · comparison mode declared' },
  { id: 'run',     label: 'Her reference solution runs against her cases', detail: 'same harness the candidate will use · gVisor' },
  { id: 'verdict', label: '7 / 7 passed — problem is self-consistent',     detail: 'published to the candidate' },
];

/* ------------------------------------------------------------------ helpers */

const countFillers = (text) => {
  const found = {};
  FILLER_WORDS.forEach((w) => {
    const m = text.toLowerCase().match(new RegExp(`\\b${w}\\b`, 'g'));
    if (m) found[w] = m.length;
  });
  return found;
};

const sum = (o) => Object.values(o).reduce((a, b) => a + b, 0);

/* =================================================================== ACT ONE */

function LiveRound() {
  const [phase, setPhase] = useState('idle'); // idle | listening | thinking | speaking | done
  const [interim, setInterim] = useState('');
  const [entries, setEntries] = useState([
    {
      speaker: 'monica',
      text:
        "Let's start technical. Walk me through why you would reach for WebRTC " +
        "over WebSockets for bi-directional media — what does it actually buy you?",
      final: true,
    },
  ]);
  const [wpm, setWpm] = useState(0);
  const [fillers, setFillers] = useState({});
  const [coach, setCoach] = useState(null);
  const [stage, setStage] = useState(-1);
  const [latency, setLatency] = useState(null);
  const [expression, setExpression] = useState('calibrating');
  const [hasPortrait, setHasPortrait] = useState(true);

  const feed = useRef(null);
  const timers = useRef([]);
  const after = useCallback((ms, fn) => { timers.current.push(setTimeout(fn, ms)); }, []);

  // Keep the newest line in view as the utterance streams and the reply lands.
  useEffect(() => {
    if (feed.current) feed.current.scrollTop = feed.current.scrollHeight;
  }, [entries, interim, phase]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const start = () => {
    if (phase === 'listening' || phase === 'thinking' || phase === 'speaking') return;
    timers.current.forEach(clearTimeout);
    timers.current = [];

    // A re-run starts from the same opening question, not a stale transcript.
    setEntries((e) => e.slice(0, 1));
    setInterim('');
    setWpm(0);
    setFillers({});
    setCoach(null);
    setLatency(null);
    setExpression('calibrating');
    setPhase('listening');
    setStage(0);

    // Interim transcript: cumulative for the utterance, exactly like the real
    // data-channel messages — each one supersedes the last.
    WORDS.forEach((_, i) => {
      after(90 + i * 78, () => {
        setInterim(WORDS.slice(0, i + 1).join(' '));
        if (i === 1) setStage(1);
        setWpm(rollingWpm(i));
        if (i === 12) setExpression('focused');
      });
    });

    const speakMs = 90 + WORDS.length * 78;

    // Finalize the utterance, count fillers, fire the coach nudge.
    after(speakMs + 260, () => {
      const found = countFillers(CANDIDATE_ANSWER);
      setFillers(found);
      setInterim('');
      setEntries((e) => [...e, { speaker: 'candidate', text: CANDIDATE_ANSWER, final: true }]);
      setPhase('thinking');
      setStage(2);
      const [top] = Object.entries(found).sort(([, a], [, b]) => b - a);
      if (top) setCoach(`"${top[0]}" appeared ${top[1]}× in that answer — try to pause instead.`);
      setExpression('composed');
    });

    after(speakMs + 1100, () => setStage(3));

    after(speakMs + 1500, () => {
      setPhase('speaking');
      setStage(4);
      setLatency(LATENCY);
      setEntries((e) => [...e, { speaker: 'monica', text: MONICA_REPLY, final: true }]);
    });

    after(speakMs + 4200, () => { setPhase('done'); setStage(-1); setCoach(null); });
  };

  const v2v = latency ? Math.round((latency.eou + latency.ttft + latency.ttfb) * 1000) : null;
  const fillerTotal = sum(fillers);

  return (
    <div className="mon-grid">
      {/* -------------------------------------------------- stage / video */}
      <div className="mon-stage">
        <div className={`mon-avatar-screen ${hasPortrait ? 'has-portrait' : ''}`}>
          {hasPortrait ? (
            <>
              <img
                className={`mon-portrait ${phase === 'speaking' ? 'is-speaking' : ''}`}
                src={AVATAR_SRC}
                alt="Monica, the AI interviewer"
                onError={() => setHasPortrait(false)}
              />
              <div className="mon-scrim" />
              <span className="mon-avatar-badge">avatar preview</span>
            </>
          ) : (
            <div className={`mon-avatar ${phase === 'speaking' ? 'is-speaking' : ''}`}>
              <div className="mon-avatar-head">
                <div className="mon-avatar-eyes"><i /><i /></div>
                <div className="mon-avatar-mouth" />
              </div>
            </div>
          )}

          <div className="mon-presence">
            {phase === 'speaking' ? 'monica is speaking' :
             phase === 'thinking' ? 'monica is thinking' :
             phase === 'listening' ? 'listening' : 'monica · room connected'}
          </div>

          <div className="mon-pip">
            <div className="mon-pip-box" />
            <FaVideo className="mon-pip-icon" />
            <div className="mon-pip-tag">
              <span className="mon-dot" /> you · {wpm || '—'} WPM
            </div>
            <div className="mon-pip-expr" title="MediaPipe blendshapes → FACS action units, classified in the browser. Never uploaded.">
              <FaLock /> {expression}
            </div>
          </div>
        </div>

        <div className={`mon-wave ${phase === 'listening' || phase === 'speaking' ? 'is-live' : ''}`}>
          {Array.from({ length: 9 }).map((_, i) => <span key={i} style={{ animationDelay: `${i * 70}ms` }} />)}
        </div>

        {/* The real pipeline, in the real order, with the real engines. */}
        <div className="mon-pipeline">
          {PIPELINE.map((p, i) => (
            <div key={p.id} className={`mon-pipe-stage ${stage === i ? 'is-active' : ''} ${stage > i ? 'is-done' : ''}`} title={p.note}>
              <span className="mon-pipe-label">{p.label}</span>
              <span className="mon-pipe-engine">{p.engine}</span>
            </div>
          ))}
        </div>

        <div className="mon-latency">
          {v2v ? (
            <>
              <strong>voice-to-voice {v2v} ms</strong>
              <span>eou {Math.round(latency.eou * 1000)} · ttft {Math.round(latency.ttft * 1000)} · tts_ttfb {Math.round(latency.ttfb * 1000)}</span>
            </>
          ) : (
            <span className="mon-muted">
              per-turn latency is correlated by speech id and reported as p50 / p95 — never the minimum
            </span>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------ transcript */}
      <div className="mon-panel">
        <h4 className="mon-panel-title">Live transcript &amp; delivery coaching</h4>

        <div className="mon-transcript" ref={feed}>
          {entries.map((e, i) => (
            <div key={i} className={`mon-line mon-line--${e.speaker}`}>
              <span className="mon-speaker">{e.speaker === 'monica' ? 'monica.ai' : 'you'}</span>
              <p>{e.text}</p>
            </div>
          ))}
          {interim && (
            <div className="mon-line mon-line--candidate is-interim">
              <span className="mon-speaker">you <em>· interim</em></span>
              <p>{interim}<span className="mon-caret" /></p>
            </div>
          )}
          {phase === 'thinking' && (
            <div className="mon-typing"><i /><i /><i /></div>
          )}
        </div>

        {coach && (
          <div className="mon-coach">
            <FaBolt /> {coach}
            <button onClick={() => setCoach(null)} aria-label="Dismiss">×</button>
          </div>
        )}

        <div className="mon-stats">
          <div className="mon-stat">
            <span className="mon-stat-val">{wpm || '—'}</span>
            <span className="mon-stat-lbl">WPM · rolling</span>
          </div>
          <div className="mon-stat">
            <span className="mon-stat-val" style={{ color: fillerTotal > 2 ? '#ff7a7a' : undefined }}>{fillerTotal}</span>
            <span className="mon-stat-lbl">filler words</span>
          </div>
          <div className="mon-stat">
            <span className="mon-stat-val mon-stat-val--sm">{expression}</span>
            <span className="mon-stat-lbl">expression · on-device</span>
          </div>
        </div>

        <p className="mon-footnote">
          Transcript, pace and filler coaching are all derived from the agent's Deepgram
          stream over the data channel — not the browser speech API — so nothing here
          varies by which browser you happen to own.
        </p>

        <div className="mon-controls">
          <button className={`mon-btn ${phase === 'listening' ? 'is-recording' : ''}`}
                  onClick={start}
                  disabled={phase === 'thinking' || phase === 'speaking'}>
            <FaMicrophone />
            {phase === 'idle' ? 'Answer the question' :
             phase === 'listening' ? 'Listening…' :
             phase === 'done' ? 'Run it again' : 'Monica has the floor'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =================================================================== ACT TWO */

function TechnicalRound() {
  const [gate, setGate] = useState(-1);          // -1 idle, 0..3 steps, 4 published
  const [constraints, setConstraints] = useState(false);
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(STUBS.python);
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(null);  // 'run' | 'submit'
  const [open, setOpen] = useState(null);

  const timers = useRef([]);
  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const runGate = () => {
    setGate(0);
    GATE_STEPS.forEach((_, i) => {
      timers.current.push(setTimeout(() => setGate(i), 700 * i));
    });
    timers.current.push(setTimeout(() => setGate(4), 700 * GATE_STEPS.length));
  };

  const pickLanguage = (id) => {
    setLanguage(id);
    // The real client only offers languages the agent sent a stub for — a
    // language the harness can't run would be an editor whose Submit can only fail.
    setCode(STUBS[id]);
    setResult(null);
  };

  const execute = (kind) => {
    setRunning(kind);
    setResult(null);
    timers.current.push(setTimeout(() => {
      const buggy = BUG.test(code);
      const cases = PROBLEM.visible.map((c, i) => ({
        ...c,
        // The seeded bug only misses a pair ending on the last index.
        pass: buggy ? i === 0 : true,
        actual: buggy && i > 0 ? '[]' : c.expected,
        stdout: i === 0 ? '' : (buggy ? 'loop ended at i=1\n' : ''),
        ms: 12 + i * 5,
      }));
      setResult({
        kind,
        cases,
        hiddenPassed: kind === 'submit' ? (buggy ? 2 : PROBLEM.hiddenTotal) : 0,
        hiddenTotal: kind === 'submit' ? PROBLEM.hiddenTotal : 0,
        slowestMs: 21,
        grade: kind === 'submit'
          ? Math.round(((cases.filter(c => c.pass).length + (buggy ? 2 : PROBLEM.hiddenTotal)) /
              (cases.length + PROBLEM.hiddenTotal)) * 100)
          : null,
      });
      setOpen(cases.findIndex(c => !c.pass));
      setRunning(null);
    }, kind === 'submit' ? 1400 : 900));
  };

  if (gate < 4) {
    return (
      <div className="mon-gate-wrap">
        <h4 className="mon-panel-title">The validation gate</h4>
        <p className="mon-gate-lede">
          Monica holds the reference solution and every hidden case. Before you see a
          problem, hers runs against her own tests through the same harness yours will
          use. All pass → it publishes. Any fail → she is told privately what
          contradicted what and fixes it invisibly.
          <strong> You never see a problem she hasn't solved.</strong>
        </p>

        <ol className="mon-gate-steps">
          {GATE_STEPS.map((s, i) => (
            <li key={s.id} className={`${gate === i ? 'is-active' : ''} ${gate > i ? 'is-done' : ''}`}>
              <span className="mon-gate-mark">{gate > i ? <FaCheck /> : i + 1}</span>
              <span>
                <strong>{s.label}</strong>
                <em>{s.detail}</em>
              </span>
            </li>
          ))}
        </ol>

        <button className="mon-btn" onClick={runGate} disabled={gate >= 0}>
          <FaShieldAlt /> {gate < 0 ? 'Run the gate' : 'Verifying…'}
        </button>
      </div>
    );
  }

  return (
    <div className="mon-grid">
      {/* ---------------------------------------------------- problem panel */}
      <div className="mon-panel">
        <h4 className="mon-panel-title">
          {PROBLEM.title}
          <span className="mon-chip mon-chip--pass"><FaCheck /> verified 7/7</span>
        </h4>

        <p className="mon-problem">{PROBLEM.statement}</p>
        <code className="mon-sig">{PROBLEM.signature}</code>

        <div className="mon-example">
          <span className="mon-example-lbl">Example</span>
          <div><b>Input</b> {PROBLEM.visible[0].input}</div>
          <div><b>Output</b> {PROBLEM.visible[0].expected}</div>
          <div className="mon-muted">{PROBLEM.visible[0].explanation}</div>
        </div>

        {constraints ? (
          <ul className="mon-constraints">
            {PROBLEM.constraints.map((c) => <li key={c}>{c}</li>)}
          </ul>
        ) : (
          <button className="mon-btn mon-btn--ghost" onClick={() => setConstraints(true)}>
            <FaChevronRight /> Ask Monica for the constraints
          </button>
        )}
        <p className="mon-footnote">
          Above intensity 2 the constraints and the second example are withheld until
          you ask. Asking is the interview skill being trained — and the hidden cases
          are exactly what the unasked questions would have covered.
        </p>
      </div>

      {/* ----------------------------------------------------- editor + run */}
      <div className="mon-panel">
        <div className="mon-lang">
          {LANGUAGES.map((l) => (
            <button key={l.id}
                    className={language === l.id ? 'is-active' : ''}
                    onClick={() => pickLanguage(l.id)}>{l.label}</button>
          ))}
        </div>

        <textarea className="mon-editor" spellCheck={false} value={code}
                  aria-label="Solution editor"
                  onChange={(e) => { setCode(e.target.value); setResult(null); }} />
        <p className="mon-hint">
          This stub has a real off-by-one — the loop stops one index early. Fix it and
          Submit again; the verdict below is computed from the code in the box.
        </p>

        <div className="mon-run-row">
          <button className="mon-btn mon-btn--ghost" onClick={() => execute('run')} disabled={!!running}>
            <FaPlay /> {running === 'run' ? 'Running…' : 'Run'}
          </button>
          <button className="mon-btn" onClick={() => execute('submit')} disabled={!!running}>
            <FaCheck /> {running === 'submit' ? 'Submitting…' : 'Submit'}
          </button>
          <span className="mon-run-note">Run = examples only · Submit = everything</span>
        </div>

        {result && (
          <div className="mon-results">
            <div className="mon-result-head">
              <span className={`mon-chip ${result.cases.every(c => c.pass) ? 'mon-chip--pass' : 'mon-chip--fail'}`}>
                Examples {result.cases.filter(c => c.pass).length}/{result.cases.length}
              </span>
              {result.hiddenTotal > 0 && (
                <span className={`mon-chip ${result.hiddenPassed === result.hiddenTotal ? 'mon-chip--pass' : 'mon-chip--fail'}`}>
                  Hidden {result.hiddenPassed}/{result.hiddenTotal}
                </span>
              )}
              <span className="mon-chip mon-chip--muted">Slowest {result.slowestMs} ms</span>
              {result.grade !== null && <span className="mon-chip mon-chip--grade">{result.grade}%</span>}
              {result.kind === 'run' && <span className="mon-run-note">examples only</span>}
            </div>

            {result.cases.map((c, i) => (
              <div key={c.id} className="mon-case">
                <button onClick={() => setOpen(open === i ? null : i)}>
                  <span className={c.pass ? 'mon-ok' : 'mon-bad'}>{c.pass ? <FaCheck /> : <FaTimes />}</span>
                  Case {c.id}
                  <em>{c.ms} ms</em>
                </button>
                {open === i && (
                  <div className="mon-case-body">
                    <div><b>Input</b><code>{c.input}</code></div>
                    <div><b>Expected</b><code>{c.expected}</code></div>
                    <div><b>Got</b><code className={c.pass ? '' : 'mon-bad'}>{c.actual}</code></div>
                    {c.stdout && <div><b>Your output</b><code>{c.stdout}</code></div>}
                  </div>
                )}
              </div>
            ))}

            {result.hiddenTotal > 0 && (
              <p className="mon-hidden">
                {result.hiddenPassed === result.hiddenTotal
                  ? `All ${result.hiddenTotal} hidden tests passed.`
                  : `${result.hiddenPassed} of ${result.hiddenTotal} hidden tests passed.`}{' '}
                Their inputs stay hidden — and so do their indices, because an index plus
                a pass/fail bit lets you bisect the hidden set across a few submissions.
              </p>
            )}
          </div>
        )}

        <p className="mon-footnote mon-footnote--sandbox">
          <FaShieldAlt /> Executed in a throwaway gVisor container · no network ·
          read-only root · dropped capabilities · memory, CPU and PID capped
        </p>
      </div>
    </div>
  );
}

/* ==================================================================== SHELL */

const MonicaAiDemo = () => {
  const [act, setAct] = useState('live');

  return (
    <div className="mon-demo">
      <div className="mon-tabs" role="tablist">
        <button role="tab" aria-selected={act === 'live'}
                className={act === 'live' ? 'is-active' : ''}
                onClick={() => setAct('live')}>
          Live round
          <em>voice pipeline &amp; coaching</em>
        </button>
        <button role="tab" aria-selected={act === 'tech'}
                className={act === 'tech' ? 'is-active' : ''}
                onClick={() => setAct('tech')}>
          Technical round
          <em>verified problems &amp; real execution</em>
        </button>
      </div>

      {act === 'live' ? <LiveRound /> : <TechnicalRound />}
    </div>
  );
};

export default MonicaAiDemo;
