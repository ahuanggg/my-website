import { render, screen } from '@testing-library/react';
import App from './App';

test('boots into the terminal with welcome message and input', async () => {
    render(<App />);
    expect(screen.getByText("Andy's Terminal")).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /terminal command input/i })).toBeInTheDocument();
    // the boot sequence runs first, then hands off to the welcome message
    expect(await screen.findByText("Welcome to Andy's Terminal!", {}, { timeout: 5000 })).toBeInTheDocument();
});
