import { createContext, useContext } from 'react';
import { WindowManagerStateContext } from './WindowManagerContext';

// Provided by each Window (and PhoneApp) so the app inside knows which window it lives in
export const WindowContext = createContext(null);

export const useWindowId = () => useContext(WindowContext);

// Is this app's window the focused one? Apps use this to gate global listeners
// (terminal keydown grab, snake controls) so background windows stay quiet.
// Outside a window or the provider (tests, future embeds), defaults to focused.
export const useWindowFocus = () => {
    const id = useContext(WindowContext);
    const ctx = useContext(WindowManagerStateContext);
    if (id === null || !ctx) return true;
    return ctx.state.focusedId === id;
};
