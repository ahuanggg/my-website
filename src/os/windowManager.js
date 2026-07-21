// Pure window-manager state. No React, no side effects — StrictMode double-invokes
// reducers, so anything time- or random-based must arrive via action payloads.

export const ACTIONS = {
    OPEN: 'OPEN',
    CLOSE: 'CLOSE',
    FOCUS: 'FOCUS',
    MINIMIZE: 'MINIMIZE',
    MAXIMIZE: 'MAXIMIZE',
    RESTORE_AND_FOCUS: 'RESTORE_AND_FOCUS',
    MOVE: 'MOVE',
    RESIZE: 'RESIZE',
};

export const initialState = {
    windows: [], // [{ id, appId, title, icon, x, y, w, h, z, state: 'normal'|'minimized'|'maximized', prev }]
    focusedId: null,
    zCounter: 1,
    nextId: 1,
};

// id of the highest-z non-minimized window, excluding exceptId (null if none)
export const topmost = (windows, exceptId) => {
    let best = null;
    for (const w of windows) {
        if (w.id === exceptId || w.state === 'minimized') continue;
        if (!best || w.z > best.z) best = w;
    }
    return best ? best.id : null;
};

// Cascade spawn so stacked windows don't perfectly overlap, clamped to the desktop
export const spawnRect = (state, defaultSize, bounds) => {
    const offset = 24 * (state.windows.length % 8);
    const w = Math.min(defaultSize.w, bounds ? bounds.w : defaultSize.w);
    const h = Math.min(defaultSize.h, bounds ? bounds.h : defaultSize.h);
    let x = 48 + offset;
    let y = 32 + offset;
    if (bounds) {
        x = Math.max(0, Math.min(x, bounds.w - w));
        y = Math.max(0, Math.min(y, bounds.h - h));
    }
    return { x, y, w, h };
};

export function reducer(state, action) {
    switch (action.type) {
        case ACTIONS.OPEN: {
            const { appId, title, icon, defaultSize, bounds, singleton } = action;
            if (singleton) {
                const existing = state.windows.find((w) => w.appId === appId);
                if (existing) return reducer(state, { type: ACTIONS.RESTORE_AND_FOCUS, id: existing.id });
            }
            const spawn = spawnRect(state, defaultSize, bounds);
            const z = state.zCounter + 1;
            const id = `${appId}-${state.nextId}`;
            const win = { id, appId, title, icon, ...spawn, z, state: 'normal', prev: null };
            return {
                ...state,
                windows: [...state.windows, win],
                focusedId: id,
                zCounter: z,
                nextId: state.nextId + 1,
            };
        }
        case ACTIONS.CLOSE: {
            const windows = state.windows.filter((w) => w.id !== action.id);
            const focusedId = state.focusedId === action.id ? topmost(windows) : state.focusedId;
            return { ...state, windows, focusedId };
        }
        case ACTIONS.FOCUS:
        case ACTIONS.RESTORE_AND_FOCUS: {
            if (!state.windows.some((w) => w.id === action.id)) return state;
            const z = state.zCounter + 1;
            return {
                ...state,
                focusedId: action.id,
                zCounter: z,
                windows: state.windows.map((w) =>
                    w.id === action.id ? { ...w, z, state: w.state === 'minimized' ? 'normal' : w.state } : w
                ),
            };
        }
        case ACTIONS.MINIMIZE: {
            const windows = state.windows.map((w) => (w.id === action.id ? { ...w, state: 'minimized' } : w));
            const focusedId = state.focusedId === action.id ? topmost(windows, action.id) : state.focusedId;
            return { ...state, windows, focusedId };
        }
        case ACTIONS.MAXIMIZE: {
            const z = state.zCounter + 1;
            return {
                ...state,
                focusedId: action.id,
                zCounter: z,
                windows: state.windows.map((w) => {
                    if (w.id !== action.id) return w;
                    if (w.state === 'maximized') {
                        return { ...w, z, state: 'normal', ...(w.prev || {}), prev: null };
                    }
                    return { ...w, z, state: 'maximized', prev: { x: w.x, y: w.y, w: w.w, h: w.h } };
                }),
            };
        }
        case ACTIONS.MOVE:
            return {
                ...state,
                windows: state.windows.map((w) => (w.id === action.id ? { ...w, x: action.x, y: action.y } : w)),
            };
        case ACTIONS.RESIZE:
            return {
                ...state,
                windows: state.windows.map((w) =>
                    w.id === action.id ? { ...w, x: action.x, y: action.y, w: action.w, h: action.h } : w
                ),
            };
        default:
            return state;
    }
}
