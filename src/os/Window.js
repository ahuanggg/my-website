import React from 'react';
import { useWindowManager, ACTIONS } from './WindowManagerContext';
import { WindowContext } from './WindowContext';
import { useDragResize } from './useDragResize';
import { APPS } from './apps/registry';

const RESIZE_DIRS = [
    { name: 'n', h: 0, v: -1 },
    { name: 's', h: 0, v: 1 },
    { name: 'e', h: 1, v: 0 },
    { name: 'w', h: -1, v: 0 },
    { name: 'nw', h: -1, v: -1 },
    { name: 'ne', h: 1, v: -1 },
    { name: 'sw', h: -1, v: 1 },
    { name: 'se', h: 1, v: 1 },
];

const Window = ({ win }) => {
    const { state, dispatch, boundsRef } = useWindowManager();
    const app = APPS[win.appId];
    const focused = state.focusedId === win.id;
    const maximized = win.state === 'maximized';
    const minimized = win.state === 'minimized';

    const { nodeRef, dragHandleProps, resizeHandleProps } = useDragResize({
        id: win.id,
        rect: { x: win.x, y: win.y, w: win.w, h: win.h },
        minSize: app.minSize,
        boundsRef,
        dispatch,
        disabled: maximized,
    });

    const focusWindow = () => {
        if (!focused) dispatch({ type: ACTIONS.FOCUS, id: win.id });
    };

    const AppComponent = app.component;

    const style = maximized
        ? { left: 0, top: 0, width: '100%', height: '100%', zIndex: win.z }
        : { left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z };

    return (
        <section
            ref={nodeRef}
            role='dialog'
            aria-label={win.title}
            className={`window${focused ? ' window--focused' : ''}${minimized ? ' window--minimized' : ''}${maximized ? ' window--maximized' : ''}`}
            style={style}
            onPointerDownCapture={focusWindow}
        >
            <div
                className='win-titlebar'
                {...(maximized ? {} : dragHandleProps)}
                onDoubleClick={() => dispatch({ type: ACTIONS.MAXIMIZE, id: win.id })}
            >
                <span className='win-title-icon' aria-hidden='true'>
                    {win.icon}
                </span>
                <span className='win-title-text'>{win.title}</span>
                <div className='win-controls'>
                    <button
                        type='button'
                        className='win-btn'
                        aria-label='Minimize'
                        onClick={() => dispatch({ type: ACTIONS.MINIMIZE, id: win.id })}
                    >
                        <span className='win-glyph win-glyph-min' />
                    </button>
                    <button
                        type='button'
                        className='win-btn'
                        aria-label={maximized ? 'Restore' : 'Maximize'}
                        onClick={() => dispatch({ type: ACTIONS.MAXIMIZE, id: win.id })}
                    >
                        <span className={`win-glyph ${maximized ? 'win-glyph-restore' : 'win-glyph-max'}`} />
                    </button>
                    <button
                        type='button'
                        className='win-btn win-btn-close'
                        aria-label='Close'
                        onClick={() => dispatch({ type: ACTIONS.CLOSE, id: win.id })}
                    >
                        <span className='win-glyph win-glyph-close'>×</span>
                    </button>
                </div>
            </div>
            <div className='win-body'>
                <WindowContext.Provider value={win.id}>
                    <AppComponent />
                </WindowContext.Provider>
            </div>
            {!maximized &&
                RESIZE_DIRS.map((dir) => (
                    <div key={dir.name} className={`win-resize win-resize-${dir.name}`} {...resizeHandleProps(dir)} />
                ))}
        </section>
    );
};

export default Window;
