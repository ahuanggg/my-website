import React, { useState } from 'react';
import { getGuestbookEntries, signGuestbook } from '../../components/guestbook';
import { Toolbar, StatusBar } from './chrome';

const GuestbookApp = () => {
    const [entries, setEntries] = useState(() => getGuestbookEntries());
    const [message, setMessage] = useState('');

    const handleSign = (e) => {
        e.preventDefault();
        const trimmed = message.trim().slice(0, 200);
        if (!trimmed) return;
        signGuestbook(trimmed);
        setEntries(getGuestbookEntries());
        setMessage('');
    };

    return (
        <div className='xp-app'>
            <Toolbar>
                <span aria-hidden='true'>📖</span>
                <span>
                    <b>Guestbook</b> — leave your mark
                </span>
            </Toolbar>
            <div className='xp-pane' style={{ margin: 8, marginBottom: 0 }}>
                {entries.length === 0 ? (
                    <p className='xp-muted'>The guestbook is empty — be the first to sign it!</p>
                ) : (
                    <ul className='xp-list' style={{ listStyle: 'none', paddingLeft: 0 }}>
                        {entries.map((entry, i) => (
                            <li key={i}>
                                <span className='xp-muted'>[{entry.date}]</span> {entry.message}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <form className='xp-form' style={{ flex: '0 0 auto' }} onSubmit={handleSign}>
                <label htmlFor='guestbook-message'>Your message (200 chars max):</label>
                <input
                    id='guestbook-message'
                    className='xp-input'
                    type='text'
                    maxLength={200}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder='andy is pretty cool i guess'
                />
                <div>
                    <button type='submit' className='xp-btn'>
                        ✒️ Sign
                    </button>
                </div>
            </form>
            <StatusBar>
                <span>Entries are saved in your browser only</span>
            </StatusBar>
        </div>
    );
};

export default GuestbookApp;
