import React, { useState, useEffect, useRef } from 'react';
import { useWindowFocus } from '../os/WindowContext';

const COLS = 24;
const ROWS = 14;
const TICK_MS = 140;

const randomFood = (snake) => {
    while (true) {
        const food = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
        if (!snake.some((s) => s.x === food.x && s.y === food.y)) return food;
    }
};

const initialState = () => ({
    snake: [
        { x: 5, y: 7 },
        { x: 4, y: 7 },
        { x: 3, y: 7 },
    ],
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    food: { x: 14, y: 7 },
    score: 0,
    over: false,
});

const Snake = ({ onExit }) => {
    const gameRef = useRef(initialState());
    const [, setTick] = useState(0); // re-render trigger, game state lives in the ref
    const onExitRef = useRef(onExit);
    onExitRef.current = onExit;
    // pause + release the controls whenever this window isn't the focused one
    const focused = useWindowFocus();

    useEffect(() => {
        if (!focused) return;
        const step = () => {
            const g = gameRef.current;
            if (g.over) return;
            g.dir = g.nextDir;
            const head = { x: g.snake[0].x + g.dir.x, y: g.snake[0].y + g.dir.y };
            const hitWall = head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS;
            const hitSelf = g.snake.some((s) => s.x === head.x && s.y === head.y);
            if (hitWall || hitSelf) {
                g.over = true;
            } else {
                g.snake.unshift(head);
                if (head.x === g.food.x && head.y === g.food.y) {
                    g.score += 1;
                    g.food = randomFood(g.snake);
                } else {
                    g.snake.pop();
                }
            }
            setTick((t) => t + 1);
        };

        const setDirection = (x, y) => {
            const g = gameRef.current;
            if (g.dir.x === -x && g.dir.y === -y) return; // can't reverse into yourself
            g.nextDir = { x, y };
        };

        const handleKey = (e) => {
            const g = gameRef.current;
            // Escape is consumed here (quit game) so the shell doesn't also close the window
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Escape'].includes(e.key)) e.preventDefault();
            if (g.over) {
                if (e.key === 'r' || e.key === 'R') {
                    gameRef.current = initialState();
                    setTick((t) => t + 1);
                } else if (e.key === 'q' || e.key === 'Q' || e.key === 'Escape' || e.key === 'Enter') {
                    onExitRef.current(g.score);
                }
                return;
            }
            if (e.key === 'ArrowUp' || e.key === 'w') setDirection(0, -1);
            else if (e.key === 'ArrowDown' || e.key === 's') setDirection(0, 1);
            else if (e.key === 'ArrowLeft' || e.key === 'a') setDirection(-1, 0);
            else if (e.key === 'ArrowRight' || e.key === 'd') setDirection(1, 0);
            else if (e.key === 'q' || e.key === 'Q' || e.key === 'Escape') onExitRef.current(g.score);
        };

        // swipe controls for touch screens
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

        const interval = setInterval(step, TICK_MS);
        // capture phase so the game consumes Escape before the shell's close-on-Escape sees it
        window.addEventListener('keydown', handleKey, true);
        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchend', handleTouchEnd);
        return () => {
            clearInterval(interval);
            window.removeEventListener('keydown', handleKey, true);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [focused]);

    const g = gameRef.current;
    const rows = [];
    for (let y = 0; y < ROWS; y++) {
        let row = '';
        for (let x = 0; x < COLS; x++) {
            if (g.snake[0].x === x && g.snake[0].y === y) row += '@';
            else if (g.snake.some((s) => s.x === x && s.y === y)) row += 'o';
            else if (g.food.x === x && g.food.y === y) row += '*';
            else row += ' ';
        }
        rows.push(`│${row}│`);
    }
    const board = [`┌${'─'.repeat(COLS)}┐`, ...rows, `└${'─'.repeat(COLS)}┘`].join('\n');

    return (
        <div className='snake-game'>
            <pre className='snake-board'>{board}</pre>
            <div className='snake-status'>{g.over ? `GAME OVER! final score: ${g.score} — press 'r' to play again or 'q' to quit` : `score: ${g.score} — arrows/wasd (or swipe) to move, 'q' to quit`}</div>
        </div>
    );
};

export default Snake;
