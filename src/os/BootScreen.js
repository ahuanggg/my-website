import React, { useEffect, useState } from 'react';

const BOOT_MS = 2200;

const prefersReducedMotion = () =>
    typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// XP-style splash shown once per browser session, above whichever shell
// (desktop or phone) is rendering underneath.
const BootScreen = () => {
    const [visible, setVisible] = useState(() => {
        try {
            return !sessionStorage.getItem('osBooted');
        } catch (e) {
            return true;
        }
    });

    useEffect(() => {
        if (!visible) return;
        const duration = prefersReducedMotion() ? 300 : BOOT_MS;
        const timer = setTimeout(() => {
            try {
                sessionStorage.setItem('osBooted', '1');
            } catch (e) {
                // storage unavailable — boot again next load, no harm
            }
            setVisible(false);
        }, duration);
        return () => clearTimeout(timer);
    }, [visible]);

    if (!visible) return null;

    return (
        <div className='boot-screen' aria-hidden='true'>
            <div className='boot-logo'>
                Andy<span className='boot-logo-accent'>OS</span>
            </div>
            <div className='boot-tagline'>professional snack hunter edition</div>
            <div className='boot-progress'>
                <div className='boot-progress-blocks'>
                    <span />
                    <span />
                    <span />
                </div>
            </div>
        </div>
    );
};

export default BootScreen;
