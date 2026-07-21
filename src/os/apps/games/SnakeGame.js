import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useWindowFocus } from '../../WindowContext';

// Logical grid the game simulates on — the canvas element is letterboxed
// to this aspect ratio via CSS (see .snake-canvas in games.css) and its
// bitmap resolution is set from the rendered size × devicePixelRatio so it
// stays crisp at any window size.
const COLS = 24;
const ROWS = 18;
const BASE_TICK_MS = 140;
const MIN_TICK_MS = 60;
// Largest frame delta the game loop will honour in one frame (see loop()).
const MAX_FRAME_MS = 250;
const HIGH_SCORE_KEY = 'andyos.snake.highscore';

const tickMsForScore = (score) => Math.max(MIN_TICK_MS, BASE_TICK_MS - Math.floor(score / 3) * 8);

const readHighScore = () => {
    try {
        const n = parseInt(window.localStorage.getItem(HIGH_SCORE_KEY), 10);
        return Number.isFinite(n) && n > 0 ? n : 0;
    } catch {
        return 0;
    }
};

const writeHighScore = (score) => {
    try {
        window.localStorage.setItem(HIGH_SCORE_KEY, String(score));
    } catch {
        /* private mode / storage disabled — high score just won't persist */
    }
};

const randomFood = (snake) => {
    // COLS*ROWS is far bigger than the snake ever gets in practice, so this
    // terminates quickly; matches the approach the ASCII Snake already uses.
    while (true) {
        const food = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
        if (!snake.some((s) => s.x === food.x && s.y === food.y)) return food;
    }
};

const initialState = () => ({
    snake: [
        { x: 6, y: 9 },
        { x: 5, y: 9 },
        { x: 4, y: 9 },
    ],
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    food: { x: 16, y: 9 },
    score: 0,
    status: 'playing', // playing | paused | over
});

// Manual roundRect — CanvasRenderingContext2D.roundRect isn't universally
// available across this project's target browsers, so draw it by hand.
const roundRect = (ctx, x, y, w, h, r) => {
    const radius = Math.max(0, Math.min(r, w / 2, h / 2));
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
};

const SnakeGame = ({ onExit }) => {
    const focused = useWindowFocus();
    const gameRef = useRef(null);
    if (!gameRef.current) gameRef.current = initialState();
    const highScoreRef = useRef(null);
    if (highScoreRef.current === null) highScoreRef.current = readHighScore();
    const [tick, setTick] = useState(0);
    const rerender = useCallback(() => setTick((t) => t + 1), []);
    const onExitRef = useRef(onExit);
    onExitRef.current = onExit;
    const canvasRef = useRef(null);
    const [coarsePointer] = useState(() => (typeof window.matchMedia === 'function' ? window.matchMedia('(pointer: coarse)').matches : false));

    const setDirection = useCallback((x, y) => {
        const g = gameRef.current;
        if (g.status !== 'playing') return;
        if (g.dir.x === -x && g.dir.y === -y) return; // no reversing into yourself
        g.nextDir = { x, y };
    }, []);

    const togglePause = useCallback(() => {
        const g = gameRef.current;
        if (g.status === 'playing') g.status = 'paused';
        else if (g.status === 'paused') g.status = 'playing';
        rerender();
    }, [rerender]);

    const restart = useCallback(() => {
        gameRef.current = initialState();
        rerender();
    }, [rerender]);

    const exitToLauncher = useCallback(() => {
        onExitRef.current(gameRef.current.score);
    }, []);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const g = gameRef.current;
        const w = canvas.width;
        const h = canvas.height;
        if (w === 0 || h === 0) return;
        const cellW = w / COLS;
        const cellH = h / ROWS;

        ctx.fillStyle = '#f4f6ec';
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = 'rgba(0,0,0,0.06)';
        ctx.lineWidth = 1;
        for (let x = 1; x < COLS; x++) {
            const px = Math.round(x * cellW) + 0.5;
            ctx.beginPath();
            ctx.moveTo(px, 0);
            ctx.lineTo(px, h);
            ctx.stroke();
        }
        for (let y = 1; y < ROWS; y++) {
            const py = Math.round(y * cellH) + 0.5;
            ctx.beginPath();
            ctx.moveTo(0, py);
            ctx.lineTo(w, py);
            ctx.stroke();
        }

        // food: red apple with a leaf and a specular highlight
        const fx = (g.food.x + 0.5) * cellW;
        const fy = (g.food.y + 0.5) * cellH;
        const fr = Math.min(cellW, cellH) * 0.36;
        ctx.fillStyle = '#d21f1f';
        ctx.beginPath();
        ctx.arc(fx, fy, fr, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#2e8425';
        ctx.fillRect(fx - Math.max(1, cellW * 0.03), fy - fr - cellH * 0.22, Math.max(2, cellW * 0.06), cellH * 0.22);
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.beginPath();
        ctx.arc(fx - fr * 0.35, fy - fr * 0.35, fr * 0.22, 0, Math.PI * 2);
        ctx.fill();

        // snake
        const pad = Math.min(cellW, cellH) * 0.09;
        g.snake.forEach((seg, i) => {
            const x = seg.x * cellW;
            const y = seg.y * cellH;
            const rw = cellW - pad * 2;
            const rh = cellH - pad * 2;
            const isHead = i === 0;
            ctx.fillStyle = isHead ? '#3f9e33' : '#57b846';
            roundRect(ctx, x + pad, y + pad, rw, rh, Math.min(rw, rh) * 0.32);
            ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,0.28)';
            roundRect(ctx, x + pad + rw * 0.14, y + pad + rh * 0.1, rw * 0.5, rh * 0.26, rh * 0.13);
            ctx.fill();
            if (isHead) {
                const cx = x + cellW / 2;
                const cy = y + cellH / 2;
                const fwd = Math.min(cellW, cellH) * 0.12;
                const spread = Math.min(cellW, cellH) * 0.17;
                const perpX = -g.dir.y;
                const perpY = g.dir.x;
                const er = Math.min(cellW, cellH) * 0.09;
                ctx.fillStyle = '#132313';
                [1, -1].forEach((side) => {
                    ctx.beginPath();
                    ctx.arc(cx + g.dir.x * fwd + perpX * spread * side, cy + g.dir.y * fwd + perpY * spread * side, er, 0, Math.PI * 2);
                    ctx.fill();
                });
            }
        });
    }, []);

    // Resize the canvas bitmap to match its rendered (CSS-letterboxed) size
    // times devicePixelRatio, so it's crisp on retina displays and always
    // fits the window without distortion.
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return undefined;
        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            const w = Math.max(1, Math.round(rect.width * dpr));
            const h = Math.max(1, Math.round(rect.height * dpr));
            if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w;
                canvas.height = h;
            }
            draw();
        };
        resize();
        let ro = null;
        if (typeof ResizeObserver !== 'undefined') {
            ro = new ResizeObserver(resize);
            ro.observe(canvas);
        } else {
            window.addEventListener('resize', resize);
        }
        return () => {
            if (ro) ro.disconnect();
            else window.removeEventListener('resize', resize);
        };
    }, [draw]);

    // Redraw whenever game state changes (each tick, pause toggle, restart...).
    useEffect(() => {
        draw();
    }, [tick, draw]);

    // Game loop (rAF + accumulator, so speed can ramp smoothly without
    // tearing down/rebuilding a timer) + keyboard/touch input. Gated on
    // window focus so a background window can't steal keys or keep ticking.
    useEffect(() => {
        if (!focused) return undefined;
        let rafId;
        let lastTime = null;
        let accumulator = 0;

        const step = () => {
            const g = gameRef.current;
            g.dir = g.nextDir;
            const head = { x: g.snake[0].x + g.dir.x, y: g.snake[0].y + g.dir.y };
            const hitWall = head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS;
            const hitSelf = g.snake.some((s) => s.x === head.x && s.y === head.y);
            if (hitWall || hitSelf) {
                g.status = 'over';
                if (g.score > highScoreRef.current) {
                    highScoreRef.current = g.score;
                    writeHighScore(g.score);
                }
                return;
            }
            g.snake.unshift(head);
            if (head.x === g.food.x && head.y === g.food.y) {
                g.score += 1;
                g.food = randomFood(g.snake);
            } else {
                g.snake.pop();
            }
        };

        const loop = (time) => {
            if (lastTime === null) lastTime = time;
            // Clamp the frame delta: rAF stops firing while the browser tab is
            // hidden, so on return `time - lastTime` can be minutes. Unclamped,
            // the accumulator below would drain hundreds of steps in one frame
            // and kill the snake instantly. Cap it at a couple of ticks.
            const dt = Math.min(time - lastTime, MAX_FRAME_MS);
            lastTime = time;
            const g = gameRef.current;
            if (g.status === 'playing') {
                accumulator += dt;
                const interval = tickMsForScore(g.score);
                let stepped = false;
                while (accumulator >= interval) {
                    step();
                    accumulator -= interval;
                    stepped = true;
                    if (gameRef.current.status !== 'playing') {
                        accumulator = 0;
                        break;
                    }
                }
                if (stepped) rerender();
            } else {
                accumulator = 0;
            }
            rafId = requestAnimationFrame(loop);
        };
        rafId = requestAnimationFrame(loop);

        const preventKeys = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D', ' ', 'p', 'P', 'r', 'R', 'Escape']);
        const handleKey = (e) => {
            if (preventKeys.has(e.key)) e.preventDefault();
            // Escape is consumed here so the shell doesn't also close the window
            if (e.key === 'Escape') {
                exitToLauncher();
                return;
            }
            if (e.key === 'r' || e.key === 'R') {
                restart();
                return;
            }
            if (e.key === ' ' || e.key === 'p' || e.key === 'P') {
                togglePause();
                return;
            }
            if (gameRef.current.status !== 'playing') return;
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') setDirection(0, -1);
            else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') setDirection(0, 1);
            else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') setDirection(-1, 0);
            else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') setDirection(1, 0);
        };

        let touchStart = null;
        const handleTouchStart = (e) => {
            touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        };
        const handleTouchEnd = (e) => {
            if (!touchStart) return;
            const dx = e.changedTouches[0].clientX - touchStart.x;
            const dy = e.changedTouches[0].clientY - touchStart.y;
            touchStart = null;
            if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
            if (Math.abs(dx) > Math.abs(dy)) setDirection(dx > 0 ? 1 : -1, 0);
            else setDirection(0, dy > 0 ? 1 : -1);
        };

        // capture phase so the game consumes Escape before the shell's
        // close-on-Escape handler (src/os/Desktop.js) sees it
        window.addEventListener('keydown', handleKey, true);
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('keydown', handleKey, true);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [focused, rerender, setDirection, togglePause, restart, exitToLauncher]);

    const g = gameRef.current;
    const highScore = Math.max(highScoreRef.current, g.score);

    return (
        <div className='xp-app snake-app'>
            <div className='snake-toolbar'>
                <button type='button' className='xp-btn' onClick={exitToLauncher}>
                    ◀ Games
                </button>
                <span className='xp-muted snake-hint'>arrows / WASD to move · P or Space to pause · R to restart</span>
            </div>

            <div className='snake-stage'>
                <canvas ref={canvasRef} className='snake-canvas games-bevel-in' role='img' aria-label={`Snake board, score ${g.score}`} />

                {g.status === 'paused' && (
                    <div className='snake-overlay'>
                        <div className='snake-overlay-box xp-raised'>
                            <div className='snake-overlay-title'>Paused</div>
                            <button type='button' className='xp-btn' onClick={togglePause}>
                                Resume
                            </button>
                        </div>
                    </div>
                )}

                {g.status === 'over' && (
                    <div className='snake-overlay'>
                        <div className='snake-overlay-box xp-raised'>
                            <div className='snake-overlay-title'>Game Over</div>
                            <div>Score: {g.score}</div>
                            <div>High Score: {highScore}</div>
                            <div className='snake-overlay-actions'>
                                <button type='button' className='xp-btn' onClick={restart}>
                                    Play Again
                                </button>
                                <button type='button' className='xp-btn' onClick={exitToLauncher}>
                                    Exit
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {coarsePointer && g.status === 'playing' && (
                    <div className='snake-dpad'>
                        <button type='button' className='snake-dpad-btn snake-dpad-up xp-raised' aria-label='Up' onClick={() => setDirection(0, -1)}>
                            ▲
                        </button>
                        <button type='button' className='snake-dpad-btn snake-dpad-left xp-raised' aria-label='Left' onClick={() => setDirection(-1, 0)}>
                            ◀
                        </button>
                        <button type='button' className='snake-dpad-btn snake-dpad-right xp-raised' aria-label='Right' onClick={() => setDirection(1, 0)}>
                            ▶
                        </button>
                        <button type='button' className='snake-dpad-btn snake-dpad-down xp-raised' aria-label='Down' onClick={() => setDirection(0, 1)}>
                            ▼
                        </button>
                    </div>
                )}
            </div>

            <div className='xp-statusbar'>
                <span>Score: {g.score}</span>
                <span>High Score: {highScore}</span>
                {g.status === 'paused' && <span className='xp-muted'>paused</span>}
            </div>
        </div>
    );
};

export default SnakeGame;
