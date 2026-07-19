import React, { useState } from 'react';
import Snake from '../../components/Snake';

const GamesApp = () => {
    const [playing, setPlaying] = useState(false);
    const [lastScore, setLastScore] = useState(null);

    const handleExit = (score) => {
        setLastScore(score);
        setPlaying(false);
    };

    return (
        <div className='xp-app games-app'>
            {playing ? (
                <Snake onExit={handleExit} />
            ) : (
                <div className='games-menu'>
                    <div style={{ fontSize: 40 }} aria-hidden='true'>
                        🐍
                    </div>
                    {lastScore !== null && <div className='games-score'>final score: {lastScore}</div>}
                    <button type='button' className='xp-btn' onClick={() => setPlaying(true)}>
                        {lastScore !== null ? 'Play again' : 'Play Snake'}
                    </button>
                    <div className='xp-muted' style={{ maxWidth: 260, textAlign: 'center' }}>
                        arrows / wasd to move, swipe on touch screens — eat the *, don't hit the walls
                    </div>
                </div>
            )}
        </div>
    );
};

export default GamesApp;
