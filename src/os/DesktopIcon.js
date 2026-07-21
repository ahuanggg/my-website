import React from 'react';

const isCoarsePointer = () =>
    typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches;

// XP desktop icon: single-click selects, double-click (or Enter/Space, or a
// single tap on touch screens) opens.
const DesktopIcon = ({ appId, icon, label, selected, onSelect, onOpen }) => {
    const handleClick = () => {
        if (isCoarsePointer()) onOpen(appId);
        else onSelect(appId);
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpen(appId);
        }
    };
    return (
        <button
            type='button'
            className={`desktop-icon${selected ? ' desktop-icon--selected' : ''}`}
            onClick={handleClick}
            onDoubleClick={() => onOpen(appId)}
            onKeyDown={handleKeyDown}
            onFocus={() => onSelect(appId)}
        >
            <span className='desktop-icon-glyph' aria-hidden='true'>
                {icon}
            </span>
            <span className='desktop-icon-label'>{label}</span>
        </button>
    );
};

export default DesktopIcon;
