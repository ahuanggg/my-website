import React, { useEffect, useRef, useState } from 'react';
import { useWindowManager, ACTIONS } from './WindowManagerContext';
import { APPS, DESKTOP_ICONS } from './apps/registry';
import DesktopIcon from './DesktopIcon';
import Window from './Window';
import Taskbar from './Taskbar';

const Desktop = () => {
    const { state, dispatch, openApp, boundsRef } = useWindowManager();
    const desktopRef = useRef(null);
    const [selectedIcon, setSelectedIcon] = useState(null);

    // Keep drag/resize bounds in sync with the desktop area (excludes taskbar)
    useEffect(() => {
        const el = desktopRef.current;
        if (!el) return;
        const update = () => {
            boundsRef.current = { w: el.clientWidth, h: el.clientHeight };
        };
        update();
        if (typeof ResizeObserver !== 'undefined') {
            const ro = new ResizeObserver(update);
            ro.observe(el);
            return () => ro.disconnect();
        }
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, [boundsRef]);

    // Escape closes the focused window — but never while the user is typing in
    // a field (terminal, forms) and never when an app already handled it (snake)
    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key !== 'Escape' || e.defaultPrevented) return;
            const t = e.target;
            if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
            if (state.focusedId) dispatch({ type: ACTIONS.CLOSE, id: state.focusedId });
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [state.focusedId, dispatch]);

    const clearSelection = (e) => {
        if (e.target === desktopRef.current || e.target.classList.contains('desktop-icons')) {
            setSelectedIcon(null);
        }
    };

    return (
        <div className='os-root'>
            <div className='desktop' ref={desktopRef} onPointerDown={clearSelection}>
                <div className='desktop-icons'>
                    {DESKTOP_ICONS.map((appId) => (
                        <DesktopIcon
                            key={appId}
                            appId={appId}
                            icon={APPS[appId].icon}
                            label={APPS[appId].title}
                            selected={selectedIcon === appId}
                            onSelect={setSelectedIcon}
                            onOpen={openApp}
                        />
                    ))}
                </div>
                {state.windows.map((win) => (
                    <Window key={win.id} win={win} />
                ))}
            </div>
            <Taskbar />
        </div>
    );
};

export default Desktop;
