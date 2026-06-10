import React, { useState, useRef, useEffect, useMemo } from 'react';
import Content from './content';
import Art from './art';
import DadJoke from './joke';
import Leaf from './leaf';
import { sendEmail } from './sendemail';

//style='color:#FCB26F;' orange
//style='color:#6fb9fc;' blue

// Escape user-typed text before it is rendered with dangerouslySetInnerHTML
const escapeHtml = (str) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const welcomeMessage = [
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
    { type: 'html', value: `- type <i style='color:#FCB26F'>'ls'</i> to look at what is in the current directory` },
    { type: 'html', value: `- <i style='color:#FCB26F'>'cat {file name}'</i> to print out the txt file` },
    { type: 'html', value: `- <i style='color:#6fb9fc;'>'run {script name}'</i> to run the script` },
    { type: 'html', value: `- anything highlighted when you type 'ls' <i style='color:#FCB26F;'>orange</i> can be used with <i style='color:#FCB26F;'>cat</i> and anything highlighted in <i style='color:#6fb9fc;'>blue</i> can be used with <i style='color:#6fb9fc;'>run</i>` },
    { type: 'html', value: `- an example might look like <i style='color:#FCB26F'>'cat home.txt'</i> or <i style='color:#6fb9fc;'>'run drawmesomething.js'</i>` },
    { type: 'html', value: `- type <i>'help'</i> to see this guide again or <i>'clear'</i> to clean up the terminal\n ` },
];

const Terminal = () => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState(welcomeMessage);
    const [currentDirectory, setCurrentDirectory] = useState('home');
    const [commandHistory, setCommandHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [tabIndex, setTabIndex] = useState(-1);
    const [tabPrefix, setTabPrefix] = useState('');
    const terminalRef = useRef(null); // referencing terminal
    const inputRef = useRef(null); // referencing input

    // List of possible commands
    const possibleCommands = ['cat home.txt', 'cat about.txt', 'cat projects.txt', 'cat contact.txt', 'cat resume.txt', 'run jokeoftheday.js', 'run drawmesomething.js', 'run sendemail.js', 'ls', 'help', 'clear'];

    // Define content for directories
    const content = Content;

    // Define art for drawmesomething.js
    const art = Art;

    // Leaf images to use for animation
    const leafImages = useMemo(() => ['leaf1.png', 'leaf2.png', 'leaf3.png'], []);
    const [leaves, setLeaves] = useState([]);
    useEffect(() => {
        const generateLeafStyles = () => {
            const leavesArray = [];
            for (let i = 0; i < 6; i++) {
                const randomLeft = Math.random() * 100;
                const leafStyle = {
                    left: `${randomLeft}vw`,
                    animationDuration: `${Math.random() * 5 + 6}s`,
                    backgroundImage: `url(${process.env.PUBLIC_URL}/${leafImages[Math.floor(Math.random() * leafImages.length)]})`,
                };
                leavesArray.push(<Leaf key={i} style={leafStyle} />);
            }
            return leavesArray;
        };
        setLeaves(generateLeafStyles());
    }, [leafImages]);

    // Function to return a random number
    const randomNumber = (max) => {
        return Math.floor(Math.random() * max);
    };

    // typewriter animation function
    const typeWriterEffect = (text, index, speed = 10, step = 10) => {
        let typedText = '';

        const animateText = (charIndex) => {
            if (charIndex < text.length) {
                typedText += text.slice(charIndex, charIndex + step);
                setHistory((prevHistory) => {
                    const updatedHistory = [...prevHistory];
                    updatedHistory[index] = { ...updatedHistory[index], value: typedText };
                    return updatedHistory;
                });
                setTimeout(() => animateText(charIndex + step), speed);
            }
        };
        animateText(0);
    };

    const handleCommand = async (command) => {
        // Pressing enter on an empty line just echoes a new prompt, like a real terminal
        if (!command) {
            setHistory((prev) => [...prev, { type: 'html', value: '> ' }]);
            return;
        }

        let output = '';
        const arg = command.split(' ')[1];
        if (command === 'help') {
            output = { type: 'html', value: welcomeMessage.map((line) => line.value).join('\n') };
        } else if (command === 'clear') {
            setHistory([]);
            setInput('');
            setHistoryIndex(-1);
            setTabIndex(-1);
            setCommandHistory((prev) => {
                const updatedHistory = [...prev, command];
                if (updatedHistory.length > 10) updatedHistory.shift();
                return updatedHistory;
            });
            return;
        } else if (command.startsWith('cat ') || command === 'cat') {
            if (arg && content[arg]) {
                output = content[arg].type === 'html' ? content[arg] : { type: 'html', value: content[arg] };
                setCurrentDirectory(arg);
            } else if (!arg) {
                output = { type: 'html', value: `usage: <span style='color:#FCB26F;'>cat {file name}</span> — try '<span style='color:#FCB26F;'>cat home.txt</span>'` };
            } else {
                output = { type: 'html', value: `File not found: ${escapeHtml(arg)}` };
            }
        } else if (command === 'ls') {
            output = { type: 'html', value: content.ls.value };
        } else if (command.startsWith('run ') || command === 'run') {
            const script = command.replace('run', '').trim();
            const emailMatch = command.match(/^run sendemail\.js (.+)$/);
            if (script === 'jokeoftheday.js') {
                const results = await DadJoke('https://icanhazdadjoke.com/');
                const joke = results && results.joke ? results.joke : 'I have ran out of jokes ૮(˶ㅠ︿ㅠ)ა ... try again in a little bit!';
                output = { type: 'html', value: `\n<span style='color:#6fb9fc;'>Running: ${script}</span>\n---------------------------------\n${joke}\n ` };
            } else if (script === 'drawmesomething.js') {
                let num = randomNumber(art.length);
                output = { type: 'html', value: `\n<span style='color:#6fb9fc;'>Running: ${script}:</span>\n---------------------------------\n${art[num].value}\n ` };
            } else if (emailMatch) {
                const body = emailMatch[1];
                try {
                    const result = await sendEmail(body);
                    output = { type: 'html', value: `---------------------------------\n ${result} \n` };
                } catch (error) {
                    output = { type: 'html', value: `---------------------------------\n ${error} \n` };
                }
            } else if (script === 'sendemail.js') {
                output = { type: 'html', value: `\n---------------------------------\nTo send me an email you have to add a message after '<span style='color:#FCB26F;'>run sendemail.js</span>' \nan example would be:\n'run sendemail.js Hi Andy, I really like your website and would like to connect with you! You can reach me @ {your email}\n<i style='color:#FCB26F;'>Please make sure to include a way for me to get back to you otherwise I wouldn't know who sent me the email!</i>\n` };
            } else if (!script) {
                output = { type: 'html', value: `usage: <span style='color:#6fb9fc;'>run {script name}</span> — try '<span style='color:#6fb9fc;'>run jokeoftheday.js</span>'` };
            } else {
                output = { type: 'html', value: `Script not found: ${escapeHtml(script)}` };
            }
        } else {
            output = { type: 'html', value: `Command not recognized: ${escapeHtml(command)}\ntype <i>'help'</i> to see what you can do here!` };
        }

        const echoedCommand = escapeHtml(command);
        if (command.startsWith('cat ')) {
            setHistory((prev) => [...prev, { type: 'html', value: `> <span style='color:#FCB26F;'>${echoedCommand}</span>` }, output]);
        } else if (command.startsWith('run ')) {
            setHistory((prev) => [...prev, { type: 'html', value: `> <span style='color:#6fb9fc;'>${echoedCommand}</span>` }, output]);
        } else {
            setHistory((prev) => [...prev, { type: 'html', value: `> ${echoedCommand}` }, output]);
        }

        if (output.type === 'html') {
            const index = history.length + 1;
            setTimeout(() => {
                typeWriterEffect(output.value, index);
            }, 5);
        }

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
            if (historyIndex < commandHistory.length - 1) {
                const newIndex = historyIndex + 1;
                setHistoryIndex(newIndex);
                setInput(commandHistory[commandHistory.length - 1 - newIndex]);
            }
        } else if (e.key === 'ArrowDown') {
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
            // Keep cycling through matches of the text originally typed, not the completed command
            const prefix = tabIndex === -1 ? input.trim() : tabPrefix;
            const filteredCommands = possibleCommands.filter((cmd) => cmd.startsWith(prefix));
            if (filteredCommands.length > 0) {
                if (tabIndex === -1) setTabPrefix(prefix);
                const nextTabIndex = (tabIndex + 1) % filteredCommands.length;
                setTabIndex(nextTabIndex);
                setInput(filteredCommands[nextTabIndex]);
            }
        }
    };

    useEffect(() => {
        const handleKeyPress = (e) => {
            // Don't steal focus from browser shortcuts like Ctrl+C (copying terminal text)
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            if (inputRef.current) {
                inputRef.current.focus();
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [history]);

    return (
        <div>
            {/* Terminal Container */}
            <div className='terminal-container' onClick={() => inputRef.current && inputRef.current.focus()}>
                <div className='terminal-header'>Andy's Terminal</div>
                <div className='terminal' ref={terminalRef}>
                    {history.map((item, index) => (
                        <div key={index}>{item.type === 'html' ? <span dangerouslySetInnerHTML={{ __html: item.value }} /> : <span>{item.value}</span>}</div>
                    ))}
                </div>
                <div className='input-area'>
                    <span>{`/ ${currentDirectory} > `}</span>
                    <input
                        type='text'
                        value={input}
                        ref={inputRef}
                        onChange={(e) => {
                            setInput(e.target.value);
                            setTabIndex(-1);
                        }}
                        onKeyDown={handleInput}
                        className='terminal-input'
                        autoFocus
                        aria-label='terminal command input'
                    />
                </div>
            </div>
            {leaves}
        </div>
    );
};

export default Terminal;
