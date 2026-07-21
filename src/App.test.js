import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

beforeEach(() => {
    // skip the once-per-session boot splash in tests
    sessionStorage.setItem('osBooted', '1');
});

afterEach(() => {
    sessionStorage.clear();
});

test('boots into the desktop with taskbar and icons', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Command Prompt/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /About Me/i })).toBeInTheDocument();
});

test('opening an app from a desktop icon creates a window', () => {
    render(<App />);
    fireEvent.dblClick(screen.getByRole('button', { name: /About Me/i }));
    expect(screen.getByRole('dialog', { name: 'About Me' })).toBeInTheDocument();
});

test('window minimize and close controls work', () => {
    render(<App />);
    fireEvent.dblClick(screen.getByRole('button', { name: /Guestbook/i }));
    const win = screen.getByRole('dialog', { name: 'Guestbook' });
    expect(win).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Minimize' }));
    expect(win).toHaveClass('window--minimized');

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog', { name: 'Guestbook' })).not.toBeInTheDocument();
});
