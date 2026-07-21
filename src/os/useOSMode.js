import { useEffect, useState } from 'react';

const QUERY = '(max-width: 768px)';

// 'phone' below 768px, 'desktop' otherwise. Width only — touch laptops and
// tablets in landscape get the real window manager.
export const useOSMode = () => {
    const [isPhone, setIsPhone] = useState(() =>
        typeof window.matchMedia === 'function' ? window.matchMedia(QUERY).matches : false
    );

    useEffect(() => {
        if (typeof window.matchMedia !== 'function') return;
        const check = () => setIsPhone(window.matchMedia(QUERY).matches);
        check(); // re-verify after mount — the initial read can be stale mid-resize
        const mql = window.matchMedia(QUERY);
        mql.addEventListener('change', check);
        // some environments (emulated viewports) resize without firing the
        // media-query change event — plain resize covers them
        window.addEventListener('resize', check);
        return () => {
            mql.removeEventListener('change', check);
            window.removeEventListener('resize', check);
        };
    }, []);

    return isPhone ? 'phone' : 'desktop';
};
