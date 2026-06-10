import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the terminal with welcome message and input', () => {
    render(<App />);
    expect(screen.getByText("Andy's Terminal")).toBeInTheDocument();
    expect(screen.getByText("Welcome to Andy's Terminal!")).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /terminal command input/i })).toBeInTheDocument();
});
