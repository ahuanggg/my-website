import React from 'react';
import { useWindowManager, ACTIONS } from '../WindowManagerContext';
import { WindowContext } from '../WindowContext';
import { APPS } from '../apps/registry';

// One app fullscreen. Home minimizes (state survives), Close really closes.
const PhoneApp = ({ win }) => {
    const { dispatch } = useWindowManager();
    const AppComponent = APPS[win.appId].component;

    const goHome = () => dispatch({ type: ACTIONS.MINIMIZE, id: win.id });

    return (
        <>
            <div className='phone-app-title'>
                <span aria-hidden='true'>{win.icon}</span> {win.title}
            </div>
            <div className='phone-app-body'>
                <WindowContext.Provider value={win.id}>
                    <AppComponent />
                </WindowContext.Provider>
            </div>
            <div className='phone-navbar'>
                <button type='button' className='phone-nav-btn' aria-label='Back' onClick={goHome}>
                    ◀
                </button>
                <button type='button' className='phone-nav-btn phone-nav-home' aria-label='Home' onClick={goHome}>
                    ⬤
                </button>
                <button
                    type='button'
                    className='phone-nav-btn'
                    aria-label='Close app'
                    onClick={() => dispatch({ type: ACTIONS.CLOSE, id: win.id })}
                >
                    ✕
                </button>
            </div>
        </>
    );
};

export default PhoneApp;
