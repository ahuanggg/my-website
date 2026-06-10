// Guestbook storage layer. Currently backed by localStorage (per-browser).
// To make it shared across visitors, swap these two functions for calls to a
// hosted backend (e.g. a Supabase table) — the Terminal only uses this API.

const STORAGE_KEY = 'terminal-guestbook';

export const getGuestbookEntries = () => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (error) {
        return [];
    }
};

export const signGuestbook = (message) => {
    const entries = getGuestbookEntries();
    entries.push({ message, date: new Date().toISOString().slice(0, 10) });
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
        // storage unavailable (private mode) — entry just won't persist
    }
    return entries.length;
};
