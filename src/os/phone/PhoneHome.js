import React from 'react';
import { APPS, DESKTOP_ICONS } from '../apps/registry';
import { useWindowManager } from '../WindowManagerContext';

const PhoneHome = () => {
    const { openApp } = useWindowManager();
    return (
        <div className='phone-home'>
            <div className='phone-grid'>
                {DESKTOP_ICONS.map((appId) => (
                    <button type='button' key={appId} className='phone-icon' onClick={() => openApp(appId)}>
                        <span className='phone-icon-glyph' aria-hidden='true'>
                            {APPS[appId].icon}
                        </span>
                        <span className='phone-icon-label'>{APPS[appId].title}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PhoneHome;
