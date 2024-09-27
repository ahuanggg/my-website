import React, { useState, useRef, useEffect } from 'react';

const Terminal = () => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState(["Welcome to Andy's Terminal!", 'You can use the following commands:', '- cd home', '- cd about', '- cd projects', '- cd contact', '- cd resume', '- run jokeoftheday.js', '- run drawmesomething.js']); // Initial welcome message
    const [currentDirectory, setCurrentDirectory] = useState('home');
    const [commandHistory, setCommandHistory] = useState([]); // Stores the last 10 commands
    const [historyIndex, setHistoryIndex] = useState(-1); // Tracks the index for command navigation
    const [tabIndex, setTabIndex] = useState(-1); // Tracks cycling of commands with Tab
    const terminalRef = useRef(null);

    // List of possible commands (expand this list with more commands like `run` later)
    const possibleCommands = [
        'cd home',
        'cd about',
        'cd projects',
        'cd contact',
        'cd resume',
        'run jokeoftheday.js', // Example placeholder for future 'run' commands
        'run drawmesomething.js',
    ];

    const content = {
        home: `Welcome to the Home Page! Here you will find some general information.`,
        about: `About Us: We are a team of passionate developers.`,
        projects: `Projects: 1. Project Alpha, 2. Project Beta.`,
        contact: `Contact Us: Email: contact@ourcompany.com.`,
        resume: `Resume: We are highly skilled professionals.`,
    };

    const typeWriterEffect = (text, index) => {
        const characters = text.split('');
        let typedText = '';

        const animateText = (charIndex) => {
            if (charIndex < characters.length) {
                typedText += characters[charIndex];
                setHistory((prevHistory) => {
                    const updatedHistory = [...prevHistory];
                    updatedHistory[index] = typedText;
                    return updatedHistory;
                });

                setTimeout(() => animateText(charIndex + 1), 3); // Speed of typing (50ms per character)
            }
        };

        animateText(0);
    };

    const handleCommand = (command) => {
        let output = '';

        if (command.startsWith('cd ')) {
            const dir = command.split(' ')[1];
            if (Object.keys(content).includes(dir)) {
                setCurrentDirectory(dir);
                output = content[dir]; // Directory content
            } else {
                output = `Directory not found: ${dir}`;
            }
        } else if (command.startsWith('run ')) {
            let temp = command.replace('run', '').trim();
            output = `Running: ${temp}`; // Example placeholder for future 'run' commands
        } else {
            output = `Command not recognized: ${command}`;
        }

        // Add command to history
        const commandWithTypewriterEffect = () => {
            setHistory((prev) => [...prev, `> ${command}`, '']); // Add empty string to history for animation
            setTimeout(() => {
                typeWriterEffect(output, history.length + 1); // Typewriter effect for the output
            }, 500); // Delay before starting the typewriter effect
        };

        commandWithTypewriterEffect();

        // Update command history and reset indices
        setCommandHistory((prev) => {
            const updatedHistory = [...prev, command];
            if (updatedHistory.length > 10) updatedHistory.shift(); // Keep only the last 10 commands
            return updatedHistory;
        });
        setHistoryIndex(-1); // Reset the history index
        setTabIndex(-1); // Reset Tab cycling
    };

    const handleInput = (e) => {
        if (e.key === 'Enter') {
            handleCommand(input.trim());
            setInput(''); // Clear input after processing command
        } else if (e.key === 'ArrowUp') {
            // Navigate backward through command history
            if (historyIndex < commandHistory.length - 1) {
                const newIndex = historyIndex + 1;
                setHistoryIndex(newIndex);
                setInput(commandHistory[commandHistory.length - 1 - newIndex]);
            }
        } else if (e.key === 'ArrowDown') {
            // Navigate forward through command history
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setInput(commandHistory[commandHistory.length - 1 - newIndex]);
            } else if (historyIndex === 0) {
                setHistoryIndex(-1);
                setInput(''); // Clear input when history index is reset
            }
        } else if (e.key === 'Tab') {
            e.preventDefault(); // Prevent default tab behavior

            // Filter matching commands based on input
            const filteredCommands = possibleCommands.filter((cmd) => cmd.startsWith(input.trim()));

            // If there are matching commands, cycle through them
            if (filteredCommands.length > 0) {
                const nextTabIndex = (tabIndex + 1) % filteredCommands.length; // Cycle through matches
                setTabIndex(nextTabIndex);
                setInput(filteredCommands[nextTabIndex]); // Update input with the matched command
            }
        }
    };

    // Automatically scroll to the bottom of the terminal when new input is added
    useEffect(() => {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }, [history]);

    return (
        <div className='terminal-container'>
            <div className='terminal-header'>Andy's Terminal</div>
            <div className='terminal' ref={terminalRef}>
                {history.map((line, index) => (
                    <div key={index}>{line}</div>
                ))}
            </div>
            <div className='input-area'>
                <span>{`/ ${currentDirectory} > `}</span>
                <input
                    type='text'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleInput} // Handle input keys (Enter, ArrowUp, ArrowDown, Tab)
                    className='terminal-input'
                    autoFocus
                />
            </div>
        </div>
    );
};

export default Terminal;
