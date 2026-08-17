import React, { useState } from 'react';
import { sendEmail, isMailConfigured, SEND_FAILURE_MESSAGE } from '../../components/sendemail';
import { socials } from '../../data/profile';
import { Toolbar, StatusBar } from './chrome';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Visually hidden rather than display:none (some bots skip that check) so
// real visitors never see it and tabIndex keeps keyboard users from landing
// on it; the label text means a screen reader that does read it explains
// itself instead of confusing someone. app-chrome.css is owned by another
// concurrent change, hence inline style instead of a shared class.
const honeypotWrapStyle = {
    position: 'absolute',
    left: '-9999px',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
};

const errorTextStyle = {
    margin: 0,
    color: '#b00000',
    fontSize: 11,
    fontWeight: 'bold',
};

const buildMailtoHref = (message, from) => {
    const subject = encodeURIComponent('Portfolio Contact');
    const lines = [message.trim() || '(no message)'];
    if (from.trim()) lines.push('', `— reply to: ${from.trim()}`);
    const body = encodeURIComponent(lines.join('\n'));
    return `mailto:${socials.email}?subject=${subject}&body=${body}`;
};

const ContactApp = () => {
    const [from, setFrom] = useState('');
    const [message, setMessage] = useState('');
    const [botcheck, setBotcheck] = useState(false);
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState('Ready');
    const [errors, setErrors] = useState({ from: '', message: '' });
    const [sendFailed, setSendFailed] = useState(false);

    const mailConfigured = isMailConfigured();

    const validate = () => {
        const next = { from: '', message: '' };
        if (!message.trim()) next.message = 'Write a message first!';
        if (from.trim() && !EMAIL_RE.test(from.trim())) next.from = "That doesn't look like a valid email address.";
        return next;
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (sending) return;

        const nextErrors = validate();
        setErrors(nextErrors);
        if (nextErrors.from || nextErrors.message) {
            setStatus('Fix the highlighted field first.');
            return;
        }

        if (!mailConfigured) {
            setStatus("Direct send isn't set up yet — opening your email app instead...");
            window.location.href = buildMailtoHref(message, from);
            return;
        }

        setSending(true);
        setSendFailed(false);
        setStatus('Sending...');
        try {
            const result = await sendEmail({ email: from.trim(), message: message.trim(), botcheck });
            if (result.ok) {
                setStatus(result.message);
                setMessage('');
                setSendFailed(false);
            } else {
                console.error('Contact form send failed:', result.error);
                setStatus(result.message);
                setSendFailed(true);
            }
        } catch (error) {
            // sendEmail resolves rather than throws, but guard against the unexpected
            console.error('Contact form send threw unexpectedly:', error);
            setStatus(SEND_FAILURE_MESSAGE);
            setSendFailed(true);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className='xp-app'>
            <Toolbar>
                <span aria-hidden='true'>📨</span>
                <span>
                    New Message — to: <b>Andy</b>
                </span>
            </Toolbar>
            {/* noValidate: type='email' would otherwise let the browser block
                submit with its own native bubble — modern chrome popping up
                inside a fake XP window, and it would stop handleSend (and the
                styled inline errors below) from ever running. Our validation
                is the authority here. */}
            <form className='xp-form' onSubmit={handleSend} noValidate>
                {!mailConfigured && (
                    <p className='xp-muted'>Direct send isn't configured yet — Send will open your email app instead.</p>
                )}
                <label htmlFor='contact-from'>From (your email, so I can reply):</label>
                <input
                    id='contact-from'
                    className='xp-input'
                    type='email'
                    inputMode='email'
                    value={from}
                    onChange={(e) => {
                        setFrom(e.target.value);
                        if (errors.from) setErrors((prev) => ({ ...prev, from: '' }));
                    }}
                    placeholder='you@example.com'
                    aria-invalid={Boolean(errors.from)}
                    aria-describedby={errors.from ? 'contact-from-error' : undefined}
                />
                {errors.from && (
                    <p id='contact-from-error' style={errorTextStyle} role='alert'>
                        {errors.from}
                    </p>
                )}
                <label htmlFor='contact-message'>Message:</label>
                <textarea
                    id='contact-message'
                    className='xp-textarea'
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value);
                        if (errors.message) setErrors((prev) => ({ ...prev, message: '' }));
                    }}
                    placeholder='Hi Andy!'
                    rows={6}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'contact-message-error' : undefined}
                />
                {errors.message && (
                    <p id='contact-message-error' style={errorTextStyle} role='alert'>
                        {errors.message}
                    </p>
                )}
                <label htmlFor='contact-botcheck' style={honeypotWrapStyle}>
                    Leave this field blank
                    <input
                        id='contact-botcheck'
                        name='botcheck'
                        type='checkbox'
                        checked={botcheck}
                        onChange={(e) => setBotcheck(e.target.checked)}
                        tabIndex={-1}
                        autoComplete='off'
                    />
                </label>
                <div>
                    <button type='submit' className='xp-btn' disabled={sending}>
                        {sending ? '📧 Sending…' : mailConfigured ? '📧 Send' : '📧 Open Email App'}
                    </button>
                </div>
                {sendFailed && (
                    <p className='xp-muted'>
                        Or email me directly:{' '}
                        <a className='xp-link' href={buildMailtoHref(message, from)}>
                            {socials.email}
                        </a>
                    </p>
                )}
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
