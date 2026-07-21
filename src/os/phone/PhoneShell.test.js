import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../App';

// Force phone mode: the shell's width query matches, everything else doesn't
const phoneMatchMedia = (query) => ({
    matches: query.includes('max-width: 768px'),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
});

let originalMatchMedia;

beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    window.matchMedia = phoneMatchMedia;
    sessionStorage.setItem('osBooted', '1');
});

afterEach(() => {
    window.matchMedia = originalMatchMedia;
    sessionStorage.clear();
});

test('phone mode shows the home grid instead of the desktop', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /About Me/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^start$/i })).not.toBeInTheDocument();
});

test('tapping an icon opens the app fullscreen; Home returns to the grid', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Guestbook/i }));
    expect(screen.getByRole('button', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByText(/saved in your browser only/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Home' }));
    expect(screen.queryByRole('button', { name: 'Home' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /About Me/i })).toBeInTheDocument();
});
