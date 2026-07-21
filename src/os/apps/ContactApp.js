import React, { useState } from 'react';
import { sendEmail } from '../../components/sendemail';
import { socials } from '../../data/profile';
import { Toolbar, StatusBar } from './chrome';

const ContactApp = () => {
    const [from, setFrom] = useState('');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState('Ready');

    const handleSend = async (e) => {
        e.preventDefault();
        if (!message.trim()) {
            setStatus('Write a message first!');
            return;
        }
        setSending(true);
        setStatus('Sending...');
        const body = from.trim() ? `${message.trim()}\n\n— reply to: ${from.trim()}` : message.trim();
        try {
            const result = await sendEmail(body);
            setStatus(String(result));
            setMessage('');
        } catch (error) {
            setStatus(String(error));
        }
        setSending(false);
    };

    return (
        <div className='xp-app'>
            <Toolbar>
                <span aria-hidden='true'>📨</span>
                <span>
                    New Message — to: <b>Andy</b>
                </span>
            </Toolbar>
            <form className='xp-form' onSubmit={handleSend}>
                <label htmlFor='contact-from'>From (your email, so I can reply):</label>
                <input
                    id='contact-from'
                    className='xp-input'
                    type='email'
                    inputMode='email'
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder='you@example.com'
                />
                <label htmlFor='contact-message'>Message:</label>
                <textarea
                    id='contact-message'
                    className='xp-textarea'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder='Hi Andy!'
                    rows={6}
                />
                <div>
                    <button type='submit' className='xp-btn' disabled={sending}>
                        📧 Send
                    </button>
                </div>
                <div>
                    <a className='xp-btn' href={socials.linkedin} target='_blank' rel='noreferrer'>
                        💼 LinkedIn
                    </a>{' '}
                    <a className='xp-btn' href={socials.instagram} target='_blank' rel='noreferrer'>
                        📷 Instagram
                    </a>{' '}
                    <a className='xp-btn' href={`mailto:${socials.email}`}>
                        ✉️ {socials.email}
                    </a>
                </div>
            </form>
            <StatusBar>
                <span aria-live='polite'>{status}</span>
            </StatusBar>
        </div>
    );
};

export default ContactApp;
