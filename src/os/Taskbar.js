import React, { useState } from 'react';
import { useWindowManager, ACTIONS } from './WindowManagerContext';
import StartMenu from './StartMenu';
import Clock from './Clock';

const Taskbar = () => {
    const { state, dispatch, openApp } = useWindowManager();
    const [startOpen, setStartOpen] = useState(false);

    const handleTaskClick = (win) => {
        if (state.focusedId === win.id && win.state !== 'minimized') {
            dispatch({ type: ACTIONS.MINIMIZE, id: win.id });
        } else {
            dispatch({ type: ACTIONS.RESTORE_AND_FOCUS, id: win.id });
        }
    };

    return (
        <div className='taskbar' role='toolbar' aria-label='Taskbar'>
            <button
                type='button'
                className={`start-button${startOpen ? ' start-button--open' : ''}`}
                aria-haspopup='menu'
                aria-expanded={startOpen}
                onClick={() => setStartOpen((open) => !open)}
            >
                <span className='start-button-logo' aria-hidden='true'>
                    🍂
                </span>
                start
            </button>
            <div className='taskbar-buttons'>
                {state.windows.map((win) => (
                    <button
                        type='button'
                        key={win.id}
                        className={`taskbar-button${
                            state.focusedId === win.id && win.state !== 'minimized' ? ' taskbar-button--active' : ''
                        }`}
                        onClick={() => handleTaskClick(win)}
                    >
                        <span aria-hidden='true'>{win.icon}</span>
                        <span className='taskbar-button-label'>{win.title}</span>
                    </button>
                ))}
            </div>
            <div className='taskbar-tray'>
                <Clock />
            </div>
            {startOpen && <StartMenu onOpenApp={openApp} onClose={() => setStartOpen(false)} />}
        </div>
    );
};

export default Taskbar;
