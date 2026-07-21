// emailService.js
//
// Contact-form delivery via Web3Forms (https://web3forms.com) — a free,
// backend-less service: the browser POSTs directly to their API and they
// relay the submission to an inbox. No SDK, no account dashboard, no server
// (this site is static, deployed straight to GitHub Pages).
//
// WEB3FORMS_ACCESS_KEY is a PUBLIC, client-side key by design — same
// rationale the old EmailJS keys had (see HANDOFF.md): it only authorizes
// submissions into the inbox tied to this key, it isn't a secret that grants
// broader account access, so it's fine to ship inside the JS bundle. To get
// your own: enter your email at https://web3forms.com and they email you a
// key — paste it in below.
export const WEB3FORMS_ACCESS_KEY = '00cc032a-b1a2-40ff-bf6b-741f2f81b3da';

// Lets the UI degrade gracefully (fall back to mailto:) if the key above is
// ever unset — e.g. cleared out, or the service is down and someone forks
// this repo without their own key yet.
export const isMailConfigured = () => Boolean(WEB3FORMS_ACCESS_KEY && WEB3FORMS_ACCESS_KEY.trim());

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
const REQUEST_TIMEOUT_MS = 15000;

export const SEND_SUCCESS_MESSAGE = 'I have gotten your email! I will respond to your message as soon as possible! ٩(^ᗜ^ )و´-';
export const SEND_FAILURE_MESSAGE =
    'Uh oh I am broken ૮(˶ㅠ︿ㅠ)ა ... In the meantime send me an email at andyhuangling@gmail.com!';

const resolveFromName = (fromName, email) => {
    if (fromName && fromName.trim()) return fromName.trim();
    if (email && email.trim()) return `Portfolio visitor <${email.trim()}>`;
    return 'Portfolio site visitor';
};

// Sends a contact-form submission through Web3Forms.
//
// Always RESOLVES (never rejects/throws) with a discriminated result so
// callers branch on `.ok` instead of relying on try/catch — the old EmailJS
// wrapper resolved with a friendly string on both success AND failure, which
// made the caller's catch block dead code and turned real failures into
// silent "successes". `error` carries the raw HTTP status / Web3Forms
// message for debugging; `message` carries the user-facing (playful) copy.
//
// fields: { email, fromName, message, subject, botcheck }
//   email    — visitor's address, used as the Web3Forms reply-to
//   fromName — optional display name; falls back to a generic label
//   message  — required, the body of the message
//   subject  — optional, defaults to 'Portfolio Contact'
//   botcheck — honeypot; Web3Forms silently discards submissions where truthy
export const sendEmail = async ({ email = '', fromName = '', message, subject = 'Portfolio Contact', botcheck = false } = {}) => {
    if (!message || !message.trim()) {
        return { ok: false, error: 'Message is empty.', message: SEND_FAILURE_MESSAGE };
    }
    if (!isMailConfigured()) {
        return { ok: false, error: 'WEB3FORMS_ACCESS_KEY is not set.', message: SEND_FAILURE_MESSAGE };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(WEB3FORMS_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                access_key: WEB3FORMS_ACCESS_KEY,
                subject,
                from_name: resolveFromName(fromName, email),
                email,
                message: message.trim(),
                botcheck: Boolean(botcheck),
            }),
            signal: controller.signal,
        });

        let data = null;
        try {
            data = await response.json();
        } catch (parseError) {
            data = null; // non-JSON error page etc. — fall through to status-based error below
        }

        if (response.ok && data && data.success) {
            return { ok: true, message: SEND_SUCCESS_MESSAGE };
        }

        const detail = (data && data.message) || response.statusText || 'unknown error';
        return {
            ok: false,
            error: `Web3Forms request failed (${response.status}): ${detail}`,
            message: SEND_FAILURE_MESSAGE,
        };
    } catch (error) {
        const reason =
            error && error.name === 'AbortError' ? `timed out after ${REQUEST_TIMEOUT_MS}ms` : String((error && error.message) || error);
        return { ok: false, error: `Web3Forms request errored: ${reason}`, message: SEND_FAILURE_MESSAGE };
    } finally {
        clearTimeout(timeoutId);
    }
};
