import React, { useEffect, useRef, useState } from 'react';
import { useWindowFocus } from '../../WindowContext';
import {
    DIFFICULTIES,
    FLAG,
    createBoard,
    placeMines,
    revealCell,
    chordReveal,
    cycleFlag,
    countFlags,
    isWin,
    revealAllMines,
    markWrongFlags,
    autoFlagRemaining,
} from './minesweeperLogic';

const BEST_TIMES_KEY = 'andyos.minesweeper.besttimes';
const LONG_PRESS_MS = 450;
const MOVE_CANCEL_PX = 10;

const readBestTimes = () => {
    try {
        const raw = window.localStorage.getItem(BEST_TIMES_KEY);
        const parsed = raw ? JSON.parse(raw) : {};
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
        return {};
    }
};

// Returns the (possibly updated) best-times map; swallows storage errors
// (private browsing etc.) — a best time just won't persist that session.
const saveBestTime = (difficultyId, seconds) => {
    try {
        const times = readBestTimes();
        if (!times[difficultyId] || seconds < times[difficultyId]) {
            times[difficultyId] = seconds;
            window.localStorage.setItem(BEST_TIMES_KEY, JSON.stringify(times));
        }
        return times;
    } catch {
        return readBestTimes();
    }
};

const freshGame = (difficultyId) => {
    const d = DIFFICULTIES[difficultyId];
    return {
        difficultyId,
        board: createBoard(d.cols, d.rows),
        phase: 'ready', // ready | playing | won | lost
        seconds: 0,
        pressing: false,
        explodedIndex: null,
    };
};

const formatLed = (n) => {
    const clamped = Math.max(-99, Math.min(999, Math.round(n)));
    const sign = clamped < 0 ? '-' : '';
    const digits = String(Math.abs(clamped)).padStart(clamped < 0 ? 2 : 3, '0');
    return sign + digits;
};

const formatClock = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
};

const cellClassName = (cell, index, explodedIndex) => {
    const classes = ['ms-cell'];
    if (!cell.revealed) {
        classes.push('ms-cell--hidden', 'xp-raised');
        if (cell.flag === FLAG.FLAG) classes.push('ms-cell--flag');
        else if (cell.flag === FLAG.QUESTION) classes.push('ms-cell--question');
    } else {
        classes.push('ms-cell--revealed');
        if (cell.mine) {
            classes.push('ms-cell--mine');
            if (index === explodedIndex) classes.push('ms-cell--exploded');
        } else if (cell.adjacent > 0) {
            classes.push(`ms-cell--num-${cell.adjacent}`);
        }
    }
    if (cell.wrongFlag) classes.push('ms-cell--wrong');
    return classes.join(' ');
};

const cellContent = (cell) => {
    if (cell.revealed) {
        if (cell.mine) return '💣';
        return cell.adjacent > 0 ? cell.adjacent : '';
    }
    if (cell.flag === FLAG.FLAG) return '🚩';
    if (cell.flag === FLAG.QUESTION) return '?';
    return '';
};

const cellLabel = (cell, col, row) => {
    const pos = `row ${row + 1} column ${col + 1}`;
    if (cell.revealed) {
        if (cell.mine) return `${pos}, mine`;
        return cell.adjacent > 0 ? `${pos}, ${cell.adjacent} adjacent mines` : `${pos}, empty`;
    }
    if (cell.flag === FLAG.FLAG) return `${pos}, flagged`;
    if (cell.flag === FLAG.QUESTION) return `${pos}, marked with a question mark`;
    return `${pos}, hidden`;
};

const Minesweeper = ({ onExit }) => {
    const focused = useWindowFocus();
    const gameRef = useRef(null);
    if (!gameRef.current) gameRef.current = freshGame('beginner');
    const [, setTickState] = useState(0);
    const rerender = () => setTickState((t) => t + 1);
    const [bestTimes, setBestTimes] = useState(() => readBestTimes());
    const onExitRef = useRef(onExit);
    onExitRef.current = onExit;
    const touchRef = useRef({ timer: null, longPressed: false, x: 0, y: 0 });

    const g = gameRef.current;
    const d = DIFFICULTIES[g.difficultyId];

    // Timer: ticks once per second while a game is in progress and this
    // window is focused. Losing focus pauses it without losing progress.
    useEffect(() => {
        if (g.phase !== 'playing' || !focused) return undefined;
        const id = setInterval(() => {
            gameRef.current.seconds = Math.min(999, gameRef.current.seconds + 1);
            rerender();
        }, 1000);
        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [g.phase, focused]);

    // Escape exits back to the launcher instead of letting it bubble up and
    // close the whole window — capture phase + preventDefault, same pattern
    // src/components/Snake.js uses.
    useEffect(() => {
        if (!focused) return undefined;
        const onKeyDown = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                exitToLauncher();
            }
        };
        window.addEventListener('keydown', onKeyDown, true);
        return () => window.removeEventListener('keydown', onKeyDown, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focused]);

    // Safety net: release the "pressed" smiley face even if the pointer/touch
    // was released outside the cell that started the press.
    useEffect(() => {
        const clearPress = () => {
            if (gameRef.current.pressing) {
                gameRef.current.pressing = false;
                rerender();
            }
        };
        window.addEventListener('mouseup', clearPress);
        window.addEventListener('touchend', clearPress);
        return () => {
            window.removeEventListener('mouseup', clearPress);
            window.removeEventListener('touchend', clearPress);
        };
    }, []);

    const exitToLauncher = () => {
        onExitRef.current({ status: gameRef.current.phase, seconds: gameRef.current.seconds, difficultyId: gameRef.current.difficultyId });
    };

    const setPressing = (value) => {
        if (gameRef.current.pressing === value) return;
        gameRef.current.pressing = value;
        rerender();
    };

    const applyResult = (nextBoard, hitMine, index, nextPhase) => {
        const game = gameRef.current;
        if (hitMine) {
            game.board = markWrongFlags(revealAllMines(nextBoard));
            game.phase = 'lost';
            game.explodedIndex = index;
            rerender();
            return;
        }
        if (isWin(nextBoard, d.mines)) {
            game.board = autoFlagRemaining(nextBoard);
            game.phase = 'won';
            setBestTimes(saveBestTime(game.difficultyId, game.seconds));
            rerender();
            return;
        }
        game.board = nextBoard;
        if (nextPhase) game.phase = nextPhase;
        rerender();
    };

    const revealAt = (index) => {
        const game = gameRef.current;
        if (!focused || game.phase === 'won' || game.phase === 'lost') return;
        const cell = game.board[index];
        if (cell.revealed) {
            if (cell.adjacent > 0) {
                const { board, hitMine } = chordReveal(game.board, d.cols, d.rows, index);
                if (board !== game.board) applyResult(board, hitMine, index);
            }
            return;
        }
        if (cell.flag !== FLAG.NONE) return;
        let base = game.board;
        let nextPhase;
        if (game.phase === 'ready') {
            base = placeMines(game.board, d.cols, d.rows, d.mines, index);
            nextPhase = 'playing';
        }
        const { board, hitMine } = revealCell(base, d.cols, d.rows, index);
        applyResult(board, hitMine, index, nextPhase);
    };

    const flagAt = (index) => {
        const game = gameRef.current;
        if (!focused || game.phase === 'won' || game.phase === 'lost') return;
        const next = cycleFlag(game.board, index);
        if (next === game.board) return;
        game.board = next;
        rerender();
    };

    const restart = (difficultyId = gameRef.current.difficultyId) => {
        gameRef.current = freshGame(difficultyId);
        rerender();
    };

    const onCellMouseDown = (e) => {
        if (e.button !== 0 || g.phase === 'won' || g.phase === 'lost') return;
        setPressing(true);
    };

    const onCellTouchStart = (index) => (e) => {
        const t = e.touches[0];
        touchRef.current.x = t.clientX;
        touchRef.current.y = t.clientY;
        touchRef.current.longPressed = false;
        setPressing(true);
        clearTimeout(touchRef.current.timer);
        touchRef.current.timer = setTimeout(() => {
            touchRef.current.longPressed = true;
            flagAt(index);
        }, LONG_PRESS_MS);
    };

    const onCellTouchMove = (e) => {
        const t = e.touches[0];
        if (Math.abs(t.clientX - touchRef.current.x) > MOVE_CANCEL_PX || Math.abs(t.clientY - touchRef.current.y) > MOVE_CANCEL_PX) {
            clearTimeout(touchRef.current.timer);
        }
    };

    const onCellTouchEnd = (index) => (e) => {
        clearTimeout(touchRef.current.timer);
        setPressing(false);
        if (touchRef.current.longPressed) {
            e.preventDefault(); // swallow the ghost click so it doesn't also reveal
            touchRef.current.longPressed = false;
        }
    };

    const smiley = g.phase === 'lost' ? '😵' : g.phase === 'won' ? '😎' : g.pressing ? '😮' : '🙂';
    const minesLeft = d.mines - countFlags(g.board);
    const bestForDifficulty = bestTimes[g.difficultyId];

    return (
        <div className='xp-app ms-app'>
            <div className='ms-toolbar'>
                <button type='button' className='xp-btn' onClick={exitToLauncher}>
                    ◀ Games
                </button>
                <div className='ms-diff-group'>
                    {Object.values(DIFFICULTIES).map((diff) => (
                        <button
                            type='button'
                            key={diff.id}
                            className={`xp-btn${diff.id === g.difficultyId ? ' xp-btn--active' : ''}`}
                            onClick={() => restart(diff.id)}
                        >
                            {diff.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className='ms-header'>
                <div className='ms-led games-bevel-in'>{formatLed(minesLeft)}</div>
                <button type='button' className='ms-smiley xp-raised' onClick={() => restart()} aria-label='New game'>
                    {smiley}
                </button>
                <div className='ms-led games-bevel-in'>{formatLed(g.seconds)}</div>
            </div>

            <div className='ms-board-scroll games-bevel-in'>
                <div
                    className={`ms-board${g.phase === 'won' || g.phase === 'lost' ? ' ms-board--over' : ''}`}
                    style={{ gridTemplateColumns: `repeat(${d.cols}, var(--ms-cell-size, 22px))` }}
                    onContextMenu={(e) => e.preventDefault()}
                >
                    {g.board.map((cell, i) => (
                        <button
                            key={i}
                            type='button'
                            className={cellClassName(cell, i, g.explodedIndex)}
                            aria-label={cellLabel(cell, i % d.cols, Math.floor(i / d.cols))}
                            onMouseDown={onCellMouseDown}
                            onMouseUp={() => setPressing(false)}
                            onMouseLeave={() => setPressing(false)}
                            onClick={() => revealAt(i)}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                flagAt(i);
                            }}
                            onTouchStart={onCellTouchStart(i)}
                            onTouchMove={onCellTouchMove}
                            onTouchEnd={onCellTouchEnd(i)}
                        >
                            {cellContent(cell)}
                        </button>
                    ))}
                </div>
            </div>

            <div className='xp-statusbar'>
                <span>
                    Best ({d.label}): {bestForDifficulty != null ? formatClock(bestForDifficulty) : '--:--'}
                </span>
                <span className='xp-muted'>
                    {g.phase === 'ready' && 'Left-click to start, right-click to flag'}
                    {g.phase === 'lost' && 'Boom! Click the face to try again'}
                    {g.phase === 'won' && "You cleared it! Click the face to play again"}
                </span>
            </div>
        </div>
    );
};

export default Minesweeper;
