import React, { useState } from 'react';
import SnakeGame from './games/SnakeGame';
import Minesweeper from './games/Minesweeper';
import { DIFFICULTIES } from './games/minesweeperLogic';
import './games/games.css';

const GAMES = [
    { id: 'snake', icon: '🐍', title: 'Snake', description: "Eat the apples, don't hit the walls or yourself." },
    { id: 'minesweeper', icon: '💣', title: 'Minesweeper', description: 'Clear the board without detonating a mine.' },
];

const formatClock = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
};

const GamesApp = () => {
    const [view, setView] = useState('menu'); // 'menu' | 'snake' | 'minesweeper'
    const [lastSnakeScore, setLastSnakeScore] = useState(null);
    const [lastMineResult, setLastMineResult] = useState(null);

    const exitSnake = (score) => {
        if (typeof score === 'number') setLastSnakeScore(score);
        setView('menu');
    };

    const exitMinesweeper = (result) => {
        if (result && result.status !== 'ready') setLastMineResult(result);
        setView('menu');
    };

    if (view === 'snake') return <SnakeGame onExit={exitSnake} />;
    if (view === 'minesweeper') return <Minesweeper onExit={exitMinesweeper} />;

    return (
        <div className='xp-app games-app'>
            <div className='games-launcher'>
                <div className='games-launcher-title'>Games</div>
                <div className='games-list'>
                    {GAMES.map((game) => (
                        <button type='button' key={game.id} className='games-list-item' onClick={() => setView(game.id)}>
                            <span className='games-list-icon' aria-hidden='true'>
                                {game.icon}
                            </span>
                            <span className='games-list-text'>
                                <span className='games-list-name'>{game.title}</span>
                                <span className='games-list-desc'>{game.description}</span>
                                {game.id === 'snake' && lastSnakeScore !== null && <span className='games-list-score'>last score: {lastSnakeScore}</span>}
                                {game.id === 'minesweeper' && lastMineResult && (
                                    <span className='games-list-score'>
                                        last game: {lastMineResult.status === 'won' ? 'won' : 'lost'} in {formatClock(lastMineResult.seconds)} (
                                        {DIFFICULTIES[lastMineResult.difficultyId].label})
                                    </span>
                                )}
                            </span>
                        </button>
                    ))}
                </div>
                <div className='xp-muted'>pick a game to launch it — you can always come back here with the ◀ Games button.</div>
            </div>
        </div>
    );
};

export default GamesApp;
