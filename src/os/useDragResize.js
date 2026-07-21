import { useRef, useCallback } from 'react';
import { ACTIONS } from './windowManager';

const clamp = (v, min, max) => Math.max(min, Math.min(v, max));

// Hand-rolled window drag + resize on pointer events.
// During a gesture we write left/top/width/height straight to the DOM node
// (coalesced through requestAnimationFrame) and only dispatch a single
// MOVE/RESIZE when the pointer is released — React stays idle at 60fps.
export const useDragResize = ({ id, rect, minSize, boundsRef, dispatch, disabled }) => {
    const nodeRef = useRef(null);
    const gesture = useRef(null);

    const applyFrame = useCallback(() => {
        const g = gesture.current;
        if (!g || !nodeRef.current) return;
        g.rafId = null;
        const s = nodeRef.current.style;
        s.left = `${g.next.x}px`;
        s.top = `${g.next.y}px`;
        s.width = `${g.next.w}px`;
        s.height = `${g.next.h}px`;
    }, []);

    const schedule = useCallback(() => {
        const g = gesture.current;
        if (g && g.rafId == null) g.rafId = requestAnimationFrame(applyFrame);
    }, [applyFrame]);

    const begin = useCallback(
        (e, mode, dir) => {
            if (disabled || e.button !== 0) return;
            try {
                e.currentTarget.setPointerCapture(e.pointerId);
            } catch (err) {
                // capture can fail for exotic/synthetic pointers — drag still works
            }
            gesture.current = {
                mode,
                dir,
                pointerId: e.pointerId,
                startX: e.clientX,
                startY: e.clientY,
                start: { ...rect },
                next: { ...rect },
                rafId: null,
            };
            document.body.style.userSelect = 'none';
        },
        [disabled, rect]
    );

    const move = useCallback(
        (e) => {
            const g = gesture.current;
            if (!g || e.pointerId !== g.pointerId) return;
            const bounds = boundsRef.current;
            const dx = e.clientX - g.startX;
            const dy = e.clientY - g.startY;
            if (g.mode === 'drag') {
                g.next.x = clamp(g.start.x + dx, 0, Math.max(0, bounds.w - g.start.w));
                g.next.y = clamp(g.start.y + dy, 0, Math.max(0, bounds.h - g.start.h));
            } else {
                const { h: dirH, v: dirV } = g.dir;
                let { x, y, w, h } = g.start;
                if (dirH === 1) {
                    w = clamp(g.start.w + dx, minSize.w, bounds.w - g.start.x);
                } else if (dirH === -1) {
                    const maxX = g.start.x + g.start.w - minSize.w;
                    x = clamp(g.start.x + dx, 0, maxX);
                    w = g.start.w + (g.start.x - x);
                }
                if (dirV === 1) {
                    h = clamp(g.start.h + dy, minSize.h, bounds.h - g.start.y);
                } else if (dirV === -1) {
                    const maxY = g.start.y + g.start.h - minSize.h;
                    y = clamp(g.start.y + dy, 0, maxY);
                    h = g.start.h + (g.start.y - y);
                }
                g.next = { x, y, w, h };
            }
            schedule();
        },
        [boundsRef, minSize, schedule]
    );

    const end = useCallback(
        (e) => {
            const g = gesture.current;
            if (!g || e.pointerId !== g.pointerId) return;
            if (g.rafId != null) cancelAnimationFrame(g.rafId);
            applyFrame();
            document.body.style.userSelect = '';
            const { next, mode } = g;
            gesture.current = null;
            if (mode === 'drag') {
                dispatch({ type: ACTIONS.MOVE, id, x: next.x, y: next.y });
            } else {
                dispatch({ type: ACTIONS.RESIZE, id, ...next });
            }
        },
        [applyFrame, dispatch, id]
    );

    const dragHandleProps = {
        onPointerDown: (e) => {
            // title-bar buttons handle their own clicks
            if (e.target.closest('.win-btn')) return;
            begin(e, 'drag');
        },
        onPointerMove: move,
        onPointerUp: end,
        onPointerCancel: end,
    };

    // dir: {h: -1|0|1, v: -1|0|1} — which edges this handle moves
    const resizeHandleProps = (dir) => ({
        onPointerDown: (e) => begin(e, 'resize', dir),
        onPointerMove: move,
        onPointerUp: end,
        onPointerCancel: end,
    });

    return { nodeRef, dragHandleProps, resizeHandleProps };
};
