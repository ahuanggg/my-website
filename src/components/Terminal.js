import React, { useState, useRef, useEffect } from 'react';

const Terminal = () => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([]);
    const [currentDirectory, setCurrentDirectory] = useState('home');
    const terminalRef = useRef(null);

    // Directory content (simulating different pages)
    const content = {
        home: `
        Welcome to the Home Page!
        Here you will find some general information.
        - Type 'cd about' to learn more about us
        - Type 'cd projects' to see our projects
        - Type 'cd contact' to get in touch
        `,
        about: `
        About Us:
        We are a team of passionate developers building awesome stuff!
        - Type 'cd home' to go back
        - Type 'cd projects' to see our projects
        - Type 'cd contact' for more info
        `,
        projects: `
        Projects:
        1. Project Alpha
        2. Project Beta
        3. Project Gamma
        - Type 'cd home' to go back
        - Type 'cd about' to learn more about us
        `,
        contact: `
        Contact Us:
        Email: contact@ourcompany.com
        Phone: +123-456-7890
        - Type 'cd home' to go back
        - Type 'cd about' to learn more about us
        `,
        resume: `
        Resume:
        We are highly skilled professionals with expertise in React, Node.js, and more!
        - Type 'cd home' to go back
        - Type 'cd about' to learn more about us
        `,
    };

    // Simulate a terminal directory structure
    const directories = ['home', 'about', 'projects', 'contact', 'resume'];

    const handleCommand = (command) => {
        let output = '';

        if (command.startsWith('cd ')) {
            const dir = command.split(' ')[1];
            if (directories.includes(dir)) {
                setCurrentDirectory(dir);
                output = content[dir]; // Display directory content
            } else {
                output = `Directory not found: ${dir}`;
            }
        } else {
            output = `Command not recognized: ${command}`;
        }

        // Add the input and output to the history
        setHistory([...history, `> ${command}`, output]);
    };

    const handleInput = (e) => {
        if (e.key === 'Enter') {
            handleCommand(input.trim());
            setInput('');
        }
    };

    // Automatically scroll to the bottom of the terminal when new input is added
    useEffect(() => {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }, [history]);

    return (
        <div className='terminal-container'>
            {/* Header Bar */}
            <div className='terminal-header'>Andy's Terminal</div>
            <div className='terminal' ref={terminalRef}>
                {history.map((line, index) => (
                    <div key={index}>{line}</div>
                ))}
            </div>
            <div className='input-area'>
                <span>{`/ ${currentDirectory} > `}</span>
                <input type='text' value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleInput} className='terminal-input' autoFocus />
            </div>
        </div>
    );
};

export default Terminal;
