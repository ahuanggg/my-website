import React, { createContext, useContext, useReducer, useCallback, useMemo, useRef } from 'react';
import { reducer, initialState, ACTIONS } from './windowManager';
import { APPS } from './apps/registry';

const WindowManagerContext = createContext(null);
// exported for consumers (useWindowFocus) that must tolerate a missing provider
export const WindowManagerStateContext = WindowManagerContext;

export const WindowManagerProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    // Desktop measures itself into this ref so OPEN can clamp spawn positions
    const boundsRef = useRef({ w: 1024, h: 700 });

    const openApp = useCallback((appId) => {
        const app = APPS[appId];
        if (!app) return;
        dispatch({
            type: ACTIONS.OPEN,
            appId,
            title: app.title,
            icon: app.icon,
            singleton: app.singleton,
            defaultSize: app.defaultSize,
            bounds: boundsRef.current,
        });
    }, []);

    const value = useMemo(() => ({ state, dispatch, openApp, boundsRef }), [state, openApp]);
    return <WindowManagerContext.Provider value={value}>{children}</WindowManagerContext.Provider>;
};

export const useWindowManager = () => {
    const ctx = useContext(WindowManagerContext);
    if (!ctx) throw new Error('useWindowManager must be used inside WindowManagerProvider');
    return ctx;
};

export { ACTIONS };
