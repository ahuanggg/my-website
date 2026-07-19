import { render, screen } from '@testing-library/react';
import Terminal from './Terminal';

afterEach(() => {
    sessionStorage.clear();
});

test('terminal boots with welcome message and input', async () => {
    render(<Terminal />);
    expect(screen.getByRole('textbox', { name: /terminal command input/i })).toBeInTheDocument();
    // the boot sequence runs first, then hands off to the welcome message
    expect(await screen.findByText("Welcome to Andy's Terminal!", {}, { timeout: 5000 })).toBeInTheDocument();
});
