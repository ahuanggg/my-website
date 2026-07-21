import React from 'react';
import { useWindowManager } from '../WindowManagerContext';
import { topmost } from '../windowManager';
import Wallpaper from '../Wallpaper';
import PhoneStatusBar from './PhoneStatusBar';
import PhoneHome from './PhoneHome';
import PhoneApp from './PhoneApp';
import './phone.css';

// Same window state as the desktop, reinterpreted: geometry is ignored and the
// highest-z non-minimized window renders fullscreen; otherwise the home grid.
const PhoneShell = () => {
    const { state } = useWindowManager();
    const activeId = topmost(state.windows);
    const active = state.windows.find((w) => w.id === activeId);

    return (
        <div className='os-root phone-root'>
            <div className='phone-wallpaper' aria-hidden='true'>
                <Wallpaper />
            </div>
            <PhoneStatusBar />
            {active ? <PhoneApp win={active} /> : <PhoneHome />}
        </div>
    );
};

export default PhoneShell;
