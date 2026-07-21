import { reducer, initialState, ACTIONS } from './windowManager';

const open = (state, appId, opts = {}) =>
    reducer(state, {
        type: ACTIONS.OPEN,
        appId,
        title: appId,
        icon: '📄',
        defaultSize: { w: 400, h: 300 },
        bounds: { w: 1000, h: 700 },
        singleton: false,
        ...opts,
    });

test('OPEN adds a focused window with the highest z', () => {
    let state = open(initialState, 'about');
    state = open(state, 'projects');
    expect(state.windows).toHaveLength(2);
    const [first, second] = state.windows;
    expect(second.z).toBeGreaterThan(first.z);
    expect(state.focusedId).toBe(second.id);
});

test('OPEN of a singleton app focuses the existing instance instead of adding', () => {
    let state = open(initialState, 'about', { singleton: true });
    state = open(state, 'projects');
    state = open(state, 'about', { singleton: true });
    expect(state.windows).toHaveLength(2);
    expect(state.focusedId).toBe(state.windows[0].id);
    expect(state.windows[0].z).toBeGreaterThan(state.windows[1].z);
});

test('FOCUS raises z above all others and restores a minimized window', () => {
    let state = open(initialState, 'a');
    state = open(state, 'b');
    const aId = state.windows[0].id;
    state = reducer(state, { type: ACTIONS.MINIMIZE, id: aId });
    expect(state.windows[0].state).toBe('minimized');
    state = reducer(state, { type: ACTIONS.RESTORE_AND_FOCUS, id: aId });
    expect(state.windows[0].state).toBe('normal');
    expect(state.focusedId).toBe(aId);
    expect(state.windows[0].z).toBeGreaterThan(state.windows[1].z);
});

test('MINIMIZE of the focused window falls focus through to next-highest z', () => {
    let state = open(initialState, 'a');
    state = open(state, 'b');
    const [a, b] = state.windows;
    state = reducer(state, { type: ACTIONS.MINIMIZE, id: b.id });
    expect(state.focusedId).toBe(a.id);
});

test('MAXIMIZE stores prev rect and toggles back to the exact saved rect', () => {
    let state = open(initialState, 'a');
    const id = state.windows[0].id;
    const before = state.windows[0];
    state = reducer(state, { type: ACTIONS.MAXIMIZE, id });
    expect(state.windows[0].state).toBe('maximized');
    expect(state.windows[0].prev).toEqual({ x: before.x, y: before.y, w: before.w, h: before.h });
    state = reducer(state, { type: ACTIONS.MAXIMIZE, id });
    expect(state.windows[0].state).toBe('normal');
    expect(state.windows[0].prev).toBeNull();
    expect(state.windows[0].x).toBe(before.x);
    expect(state.windows[0].w).toBe(before.w);
});

test('CLOSE removes the window and refocuses the topmost remaining', () => {
    let state = open(initialState, 'a');
    state = open(state, 'b');
    const [a, b] = state.windows;
    state = reducer(state, { type: ACTIONS.CLOSE, id: b.id });
    expect(state.windows).toHaveLength(1);
    expect(state.focusedId).toBe(a.id);
    state = reducer(state, { type: ACTIONS.CLOSE, id: a.id });
    expect(state.windows).toHaveLength(0);
    expect(state.focusedId).toBeNull();
});

test('MOVE and RESIZE update geometry', () => {
    let state = open(initialState, 'a');
    const id = state.windows[0].id;
    state = reducer(state, { type: ACTIONS.MOVE, id, x: 111, y: 222 });
    expect(state.windows[0]).toMatchObject({ x: 111, y: 222 });
    state = reducer(state, { type: ACTIONS.RESIZE, id, x: 10, y: 20, w: 555, h: 444 });
    expect(state.windows[0]).toMatchObject({ x: 10, y: 20, w: 555, h: 444 });
});
