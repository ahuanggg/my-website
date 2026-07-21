import React, { useState } from 'react';

// **text** markers in profile data become bold in GUI apps
export const emphasize = (text) => text.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');

export const Emphasis = ({ text }) => <span dangerouslySetInnerHTML={{ __html: emphasize(text) }} />;

// Classic Windows control-panel tabs. tabs: [{ id, label, render }]
export const Tabs = ({ tabs }) => {
    const [active, setActive] = useState(tabs[0].id);
    const current = tabs.find((t) => t.id === active) || tabs[0];
    return (
        <div className='xp-tabs-wrap'>
            <div className='xp-tabs' role='tablist'>
                {tabs.map((t) => (
                    <button
                        type='button'
                        key={t.id}
                        role='tab'
                        aria-selected={active === t.id}
                        className={`xp-tab${active === t.id ? ' xp-tab--active' : ''}`}
                        onClick={() => setActive(t.id)}
                    >
                        {t.label}
                    </button>
                ))}
            </div>
            <div className='xp-tab-panel xp-pane' role='tabpanel'>
                {current.render()}
            </div>
        </div>
    );
};

export const Toolbar = ({ children }) => <div className='xp-toolbar'>{children}</div>;

export const StatusBar = ({ children }) => <div className='xp-statusbar'>{children}</div>;
