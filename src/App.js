import React from 'react';
import './App.css';
import './os/os.css';
import './os/apps/app-chrome.css';
import { WindowManagerProvider } from './os/WindowManagerContext';
import { useOSMode } from './os/useOSMode';
import BootScreen from './os/BootScreen';
import Desktop from './os/Desktop';
import PhoneShell from './os/phone/PhoneShell';

const Shell = () => {
    const mode = useOSMode();
    return mode === 'phone' ? <PhoneShell /> : <Desktop />;
};

function App() {
    return (
        <div className='App'>
            <WindowManagerProvider>
                <BootScreen />
                <Shell />
            </WindowManagerProvider>
        </div>
    );
}

export default App;
