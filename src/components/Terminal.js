import React, { useState, useRef, useEffect } from 'react';
import Content from './content';
import Art from './art';
import DadJoke from './joke';

const Terminal = () => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([
        { type: 'html', value: "Welcome to Andy's Terminal!" },
        { type: 'html', value: 'You can use the following commands to look around !' },
        {
            type: 'html',
            value: `
 ╱|、  
(˚ˎ 。7  
 |、˜〵          
 じしˍ,)ノ `,
        },
        { type: 'html', value: '---------------------------------' },
        { type: 'html', value: `- '<b style='color:#FCB26F'>ls</b>' to look at what is in the current directory` },
        { type: 'html', value: `- '<b style='color:#FCB26F'>cd</b>' to go into a directory` },
        { type: 'html', value: `- '<b style='color:#FCB26F'>run</b>' to run a javascript file` },
        { type: 'html', value: `- you can also use tab to autofill the command you want to run !` },
    ]);
    const [currentDirectory, setCurrentDirectory] = useState('home');
    const [commandHistory, setCommandHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [tabIndex, setTabIndex] = useState(-1);
    const terminalRef = useRef(null);
    const inputRef = useRef(null); // Reference for the input area

    // List of possible commands
    const possibleCommands = ['cd home', 'cd about', 'cd projects', 'cd contact', 'cd resume', 'run jokeoftheday.js', 'run drawmesomething.js', 'ls'];

    // Define content for directories
    const content = Content;

    // Define art for drawmesomething.js
    const art = Art;

    // Function to return a random number
    const randomNumber = (max) => {
        return Math.floor(Math.random() * max);
    };

    // typewriter animation function
    const typeWriterEffect = (text, index, speed = 10, step = 10) => {
        // `step` is the number of characters to add at once
        let typedText = '';

        const animateText = (charIndex) => {
            if (charIndex < text.length) {
                // Append the next group of `step` characters to the typed text
                typedText += text.slice(charIndex, charIndex + step);

                // Update the component state
                setHistory((prevHistory) => {
                    const updatedHistory = [...prevHistory];
                    updatedHistory[index] = { ...updatedHistory[index], value: typedText };
                    return updatedHistory;
                });

                // Move the cursor forward by `step` characters
                setTimeout(() => animateText(charIndex + step), speed);
            }
        };

        animateText(0);
    };

    const handleCommand = async (command) => {
        let output = '';

        if (command.startsWith('cd ')) {
            const dir = command.split(' ')[1];
            if (content[dir]) {
                setCurrentDirectory(dir);
                output = content[dir].type === 'html' ? content[dir] : { type: 'text', value: content[dir] };
            } else {
                output = { type: 'html', value: `Directory not found: ${dir}` };
            }
        } else if (command.startsWith('run ')) {
            let temp = command.replace('run', '').trim();
            if (temp === 'jokeoftheday.js') {
                const results = await DadJoke('https://icanhazdadjoke.com/');
                output = { type: 'html', value: `\nRunning: ${temp}\n---------------------------------\n${results.joke}\n ` }; //change something here for the joke
            } else if (temp === 'drawmesomething.js') {
                let num = randomNumber(art.length);
                output = { type: 'html', value: `\nRunning: ${temp}:\n---------------------------------\n${art[num].value}\n ` }; // change something here for the art. might have to do a random number gen to get a random picture
            }
        } else if (command.startsWith('ls')) {
            output = { type: 'html', value: content.ls.value };
        } else {
            output = { type: 'html', value: `Command not recognized: ${command}` };
        }

        setHistory((prev) => [...prev, { type: 'html', value: `> ${command}` }, output]);

        // apply typewriter here
        if (output.type === 'html') {
            const index = history.length + 1;
            setTimeout(() => {
                typeWriterEffect(output.value, index);
            }, 5);
        }

        // Update command history and reset indices
        setCommandHistory((prev) => {
            const updatedHistory = [...prev, command];
            if (updatedHistory.length > 10) updatedHistory.shift();
            return updatedHistory;
        });
        setHistoryIndex(-1);
        setTabIndex(-1);
    };

    const handleInput = (e) => {
        if (e.key === 'Enter') {
            handleCommand(input.trim());
            setInput('');
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
                setInput('');
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const filteredCommands = possibleCommands.filter((cmd) => cmd.startsWith(input.trim()));
            if (filteredCommands.length > 0) {
                const nextTabIndex = (tabIndex + 1) % filteredCommands.length;
                setTabIndex(nextTabIndex);
                setInput(filteredCommands[nextTabIndex]);
            }
        }
    };

    useEffect(() => {
        // Function to focus the input area
        const handleKeyPress = () => {
            if (inputRef.current) {
                inputRef.current.focus(); // Focus the input area whenever a key is pressed
            }
        };

        // Add event listener for keydown on the entire window
        window.addEventListener('keydown', handleKeyPress);

        // Remove event listener on component unmount
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []); // Empty dependency array to add/remove event listener once on mount/unmount

    useEffect(() => {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }, [history]);

    return (
        <div>
            {/* Terminal Container */}
            <div className='terminal-container'>
                <div className='terminal-header'>Andy's Terminal</div>
                <div className='terminal' ref={terminalRef}>
                    {history.map((item, index) => (
                        <div key={index}>{item.type === 'html' ? <span dangerouslySetInnerHTML={{ __html: item.value }} /> : <span>{item.value}</span>}</div>
                    ))}
                </div>
                <div className='input-area'>
                    <span>{`/ ${currentDirectory} > `}</span>
                    <input type='text' value={input} ref={inputRef} onChange={(e) => setInput(e.target.value)} onKeyDown={handleInput} className='terminal-input' autoFocus />
                </div>
            </div>
        </div>
    );
};

export default Terminal;
