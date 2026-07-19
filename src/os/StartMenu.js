import React, { useEffect, useRef, useState } from 'react';
import { APPS } from './apps/registry';
import { socials } from '../data/profile';

const StartMenu = ({ onOpenApp, onClose }) => {
    const menuRef = useRef(null);
    const [shutDown, setShutDown] = useState(false);

    // click-away closes the menu (the Start button toggles itself)
    useEffect(() => {
        const onPointerDown = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target) && !e.target.closest('.start-button')) {
                onClose();
            }
        };
        document.addEventListener('pointerdown', onPointerDown);
        return () => document.removeEventListener('pointerdown', onPointerDown);
    }, [onClose]);

    if (shutDown) {
        return (
            <div
                className='shutdown-screen'
                onClick={() => {
                    setShutDown(false);
                    onClose();
                }}
            >
                <p>It is now safe to turn off your computer.</p>
                <p className='shutdown-hint'>(just kidding — click anywhere to come back)</p>
            </div>
        );
    }

    return (
        <div className='start-menu' ref={menuRef} role='menu' aria-label='Start menu'>
            <div className='start-menu-banner'>
                <span>AndyOS</span>
            </div>
            <div className='start-menu-items'>
                {Object.entries(APPS).map(([appId, app]) => (
                    <button
                        type='button'
                        key={appId}
                        className='start-menu-item'
                        role='menuitem'
                        onClick={() => {
                            onOpenApp(appId);
                            onClose();
                        }}
                    >
                        <span className='start-menu-icon' aria-hidden='true'>
                            {app.icon}
                        </span>
                        {app.title}
                    </button>
                ))}
                <div className='start-menu-divider' />
                <button
                    type='button'
                    className='start-menu-item'
                    role='menuitem'
                    onClick={() => window.open(socials.github, '_blank', 'noopener')}
                >
                    <span className='start-menu-icon' aria-hidden='true'>
                        🐙
                    </span>
                    GitHub
                </button>
                <button
                    type='button'
                    className='start-menu-item'
                    role='menuitem'
                    onClick={() => window.open(socials.linkedin, '_blank', 'noopener')}
                >
                    <span className='start-menu-icon' aria-hidden='true'>
                        💼
                    </span>
                    LinkedIn
                </button>
                <div className='start-menu-divider' />
                <button type='button' className='start-menu-item' role='menuitem' onClick={() => setShutDown(true)}>
                    <span className='start-menu-icon' aria-hidden='true'>
                        ⏻
                    </span>
                    Shut Down...
                </button>
            </div>
        </div>
    );
};

export default StartMenu;
