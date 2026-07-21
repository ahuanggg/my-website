import React, { useState, useRef, useEffect } from 'react';
import Content from './content';
import Art from './art';
import DadJoke from './joke';
import Snake from './Snake';
import { sendEmail } from './sendemail';
import { getGuestbookEntries, signGuestbook } from './guestbook';
import { useWindowFocus } from '../os/WindowContext';
import { socials, resumeUrl } from '../data/profile';

// accent colors are CSS variables so themes can restyle them:
// var(--accent-1) orange (cat/files), var(--accent-2) blue (run/scripts)

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
    { type: 'html', value: `- type <i style='color:var(--accent-1)'>'ls'</i> to look at what is in the current directory` },
    { type: 'html', value: `- <i style='color:var(--accent-1)'>'cat {file name}'</i> to print out the txt file` },
    { type: 'html', value: `- <i style='color:var(--accent-2);'>'run {script name}'</i> to run the script` },
    { type: 'html', value: `- anything highlighted when you type 'ls' <i style='color:var(--accent-1);'>orange</i> can be used with <i style='color:var(--accent-1);'>cat</i> and anything highlighted in <i style='color:var(--accent-2);'>blue</i> can be used with <i style='color:var(--accent-2);'>run</i>` },
    { type: 'html', value: `- an example might look like <i style='color:var(--accent-1)'>'cat home.txt'</i> or <i style='color:var(--accent-2);'>'run drawmesomething.js'</i>` },
    { type: 'html', value: `- feeling adventurous? try <i style='color:var(--accent-2);'>'run snake.js'</i>, <i>'theme'</i>, <i>'open'</i> ... and a few hidden commands 👀` },
    { type: 'html', value: `- type <i>'help'</i> to see this guide again or <i>'clear'</i> to clean up the terminal\n ` },
];

const bootLines = [
    'andy_os v2.0 — initializing...',
    'CPU: caffeine-powered @ 3.50GHz ........... OK',
    'Mounting /home/andy ....................... OK',
    'Loading personality.dll ................... OK',
    'Starting leaf_engine ...................... OK',
    'Connecting to handball court .............. OK',
    'Boot complete. Launching shell...',
];

const themes = ['default', 'matrix', 'dracula', 'light'];

const openTargets = {
    linkedin: socials.linkedin,
    github: socials.github,
    instagram: socials.instagram,
    resume: resumeUrl,
};

// Touch screens get tap-to-type instead of autofocus/focus-grabbing —
// otherwise the virtual keyboard pops and re-pops against the user's will
const isCoarsePointer = () =>
    typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches;

const Terminal = () => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState(() => (sessionStorage.getItem('terminalBooted') ? welcomeMessage : []));
    const [booting, setBooting] = useState(() => !sessionStorage.getItem('terminalBooted'));
    const [snakeActive, setSnakeActive] = useState(false);
    const [currentDirectory, setCurrentDirectory] = useState('home');
    const [commandHistory, setCommandHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [tabIndex, setTabIndex] = useState(-1);
    const [tabPrefix, setTabPrefix] = useState('');
    const terminalRef = useRef(null); // referencing terminal
    const inputRef = useRef(null); // referencing input
    const rootRef = useRef(null); // theme attribute lives here so skins stay inside this window
    const didInit = useRef(false);
    const focused = useWindowFocus(); // only the focused window may grab keystrokes

    // Themes restyle only the terminal (data-theme on the terminal root, not <html>)
    const applyTheme = (name) => {
        try {
            if (name === 'default') {
                if (rootRef.current) rootRef.current.removeAttribute('data-theme');
                localStorage.removeItem('terminal-theme');
            } else {
                if (rootRef.current) rootRef.current.setAttribute('data-theme', name);
                localStorage.setItem('terminal-theme', name);
            }
        } catch (error) {
            // storage unavailable — theme still applies for this page load
        }
    };

    // List of possible commands (sudo/exit are easter eggs — find them yourself!)
    const possibleCommands = [
        'cat home.txt',
        'cat about.txt',
        'cat projects.txt',
        'cat contact.txt',
        'cat resume.txt',
        'run jokeoftheday.js',
        'run drawmesomething.js',
        'run sendemail.js',
        'run snake.js',
        'run guestbook.js',
        'run guestbook.js sign ',
        'ls',
        'help',
        'clear',
        'history',
        'whoami',
        'pwd',
        'date',
        'echo ',
        'open linkedin',
        'open github',
        'open instagram',
        'open resume',
        'theme matrix',
        'theme dracula',
        'theme light',
        'theme default',
    ];

    // Define content for directories
    const content = Content;

    // Define art for drawmesomething.js
    const art = Art;

    // Apply saved theme + run the boot sequence once per browser session
    useEffect(() => {
        if (didInit.current) return;
        didInit.current = true;
        const savedTheme = localStorage.getItem('terminal-theme');
        if (savedTheme && themes.includes(savedTheme) && rootRef.current) {
            rootRef.current.setAttribute('data-theme', savedTheme);
        }
        if (sessionStorage.getItem('terminalBooted')) return;
        bootLines.forEach((line, i) => {
            setTimeout(() => {
                setHistory((prev) => [...prev, { type: 'html', value: line }]);
            }, i * 220);
        });
        setTimeout(() => {
            setHistory(welcomeMessage);
            setBooting(false);
            sessionStorage.setItem('terminalBooted', '1');
            if (inputRef.current && !isCoarsePointer()) inputRef.current.focus();
        }, bootLines.length * 220 + 400);
    }, []);

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

    const recordCommand = (command) => {
        setCommandHistory((prev) => {
            const updatedHistory = [...prev, command];
            if (updatedHistory.length > 50) updatedHistory.shift();
            return updatedHistory;
        });
        setHistoryIndex(-1);
        setTabIndex(-1);
    };

    const exitSnake = (score) => {
        setSnakeActive(false);
        setHistory((prev) => [...prev, { type: 'html', value: `snake.js exited — final score: <span style='color:var(--accent-1);'>${score}</span> 🐍\n ` }]);
        setTimeout(() => {
            if (inputRef.current) inputRef.current.focus();
        }, 0);
    };

    const handleCommand = async (command) => {
        // Pressing enter on an empty line just echoes a new prompt, like a real terminal
        if (!command) {
            setHistory((prev) => [...prev, { type: 'html', value: '> ' }]);
            return;
        }

        // snake takes over the terminal instead of printing output
        if (command === 'run snake.js') {
            setHistory((prev) => [...prev, { type: 'html', value: `> <span style='color:var(--accent-2);'>run snake.js</span>` }, { type: 'html', value: `\n<span style='color:var(--accent-2);'>Running: snake.js</span> — eat the *, don't hit the walls!` }]);
            setSnakeActive(true);
            recordCommand(command);
            return;
        }

        let output = '';
        const arg = command.split(' ')[1];
        if (command === 'help') {
            output = { type: 'html', value: welcomeMessage.map((line) => line.value).join('\n') };
        } else if (command === 'clear') {
            setHistory([]);
            recordCommand(command);
            return;
        } else if (command === 'whoami') {
            output = { type: 'html', value: `a curious visitor (we like those here)... but if you mean me: <span style='color:var(--accent-1);'>andy</span> — software engineer, NYC native, handball enthusiast, professional snack hunter (´▽\`)` };
        } else if (command === 'pwd') {
            output = { type: 'html', value: `/home/andy/${currentDirectory} — you're in my world now (◕‿◕)` };
        } else if (command === 'date') {
            output = { type: 'html', value: new Date().toString() };
        } else if (command === 'history') {
            const allCommands = [...commandHistory, command];
            output = { type: 'html', value: allCommands.map((c, i) => `${String(i + 1).padStart(3, ' ')}  ${escapeHtml(c)}`).join('\n') };
        } else if (command === 'exit') {
            output = { type: 'html', value: `♪ you can check out any time you like, but you can never leave ♪\n(try '<i>clear</i>' if you want a fresh start)` };
        } else if (command === 'sudo' || command.startsWith('sudo ')) {
            output = { type: 'html', value: `nice try ( ఠ ͟ʖ ఠ)\nvisitor is not in the sudoers file. This incident will be reported to Andy.` };
        } else if (command === 'echo' || command.startsWith('echo ')) {
            output = { type: 'html', value: escapeHtml(command.slice(5).trim()) || ' ' };
        } else if (command === 'open' || command.startsWith('open ')) {
            if (arg && openTargets[arg]) {
                window.open(openTargets[arg], '_blank', 'noopener');
                output = { type: 'html', value: `opening <span style='color:var(--accent-1);'>${arg}</span> in a new tab...` };
            } else if (arg) {
                output = { type: 'html', value: `I don't know how to open '${escapeHtml(arg)}'\nyou can open: ${Object.keys(openTargets).map((t) => `<span style='color:var(--accent-1);'>${t}</span>`).join(' • ')}` };
            } else {
                output = { type: 'html', value: `usage: <span style='color:var(--accent-1);'>open {target}</span>\nyou can open: ${Object.keys(openTargets).map((t) => `<span style='color:var(--accent-1);'>${t}</span>`).join(' • ')}` };
            }
        } else if (command === 'theme' || command.startsWith('theme ')) {
            if (arg && themes.includes(arg)) {
                applyTheme(arg);
                output = { type: 'html', value: `theme set to <span style='color:var(--accent-1);'>${arg}</span> ✨` };
            } else if (arg) {
                output = { type: 'html', value: `Theme not found: ${escapeHtml(arg)}\navailable themes: ${themes.join(' • ')}` };
            } else {
                output = { type: 'html', value: `usage: <span style='color:var(--accent-1);'>theme {name}</span>\navailable themes: ${themes.map((t) => `<span style='color:var(--accent-1);'>${t}</span>`).join(' • ')}` };
            }
        } else if (command.startsWith('cat ') || command === 'cat') {
            if (arg && content[arg]) {
                output = content[arg].type === 'html' ? content[arg] : { type: 'html', value: content[arg] };
                setCurrentDirectory(arg);
            } else if (!arg) {
                output = { type: 'html', value: `usage: <span style='color:var(--accent-1);'>cat {file name}</span> — try '<span style='color:var(--accent-1);'>cat home.txt</span>'` };
            } else {
                output = { type: 'html', value: `File not found: ${escapeHtml(arg)}` };
            }
        } else if (command === 'ls') {
            output = { type: 'html', value: content.ls.value };
        } else if (command.startsWith('run ') || command === 'run') {
            const script = command.replace('run', '').trim();
            const emailMatch = command.match(/^run sendemail\.js (.+)$/);
            const signMatch = command.match(/^run guestbook\.js sign (.+)$/);
            if (script === 'jokeoftheday.js') {
                const results = await DadJoke('https://icanhazdadjoke.com/');
                const joke = results && results.joke ? results.joke : 'I have ran out of jokes ૮(˶ㅠ︿ㅠ)ა ... try again in a little bit!';
                output = { type: 'html', value: `\n<span style='color:var(--accent-2);'>Running: ${script}</span>\n---------------------------------\n${joke}\n ` };
            } else if (script === 'drawmesomething.js') {
                let num = randomNumber(art.length);
                output = { type: 'html', value: `\n<span style='color:var(--accent-2);'>Running: ${script}:</span>\n---------------------------------\n${art[num].value}\n ` };
            } else if (emailMatch) {
                const body = emailMatch[1];
                try {
                    const result = await sendEmail({ message: body });
                    output = { type: 'html', value: `---------------------------------\n ${result.message} \n` };
                } catch (error) {
                    output = { type: 'html', value: `---------------------------------\n ${error} \n` };
                }
            } else if (script === 'sendemail.js') {
                output = { type: 'html', value: `\n---------------------------------\nTo send me an email you have to add a message after '<span style='color:var(--accent-1);'>run sendemail.js</span>' \nan example would be:\n'run sendemail.js Hi Andy, I really like your website and would like to connect with you! You can reach me @ {your email}\n<i style='color:var(--accent-1);'>Please make sure to include a way for me to get back to you otherwise I wouldn't know who sent me the email!</i>\n` };
            } else if (signMatch) {
                const message = signMatch[1].slice(0, 200);
                const count = signGuestbook(message);
                output = { type: 'html', value: `---------------------------------\nThanks for signing! Your message is #${count} in this browser's guestbook ⸜(｡˃ ᵕ ˂ )⸝♡\ntype '<span style='color:var(--accent-2);'>run guestbook.js</span>' to read it back!\n` };
            } else if (script === 'guestbook.js') {
                const entries = getGuestbookEntries();
                if (entries.length === 0) {
                    output = { type: 'html', value: `---------------------------------\nThe guestbook is empty — be the first to sign it!\nusage: '<span style='color:var(--accent-2);'>run guestbook.js sign {your message}</span>'\n(entries are saved in this browser)\n` };
                } else {
                    const list = entries.map((e, i) => `${i + 1}. [${e.date}] ${escapeHtml(e.message)}`).join('\n');
                    output = { type: 'html', value: `---------------------------------\n<span style='color:var(--accent-1);'>~ guestbook ~</span> (saved in this browser)\n${list}\n\nadd yours: '<span style='color:var(--accent-2);'>run guestbook.js sign {your message}</span>'\n` };
                }
            } else if (script.startsWith('guestbook.js')) {
                output = { type: 'html', value: `to sign the guestbook: '<span style='color:var(--accent-2);'>run guestbook.js sign {your message}</span>'` };
            } else if (!script) {
                output = { type: 'html', value: `usage: <span style='color:var(--accent-2);'>run {script name}</span> — try '<span style='color:var(--accent-2);'>run jokeoftheday.js</span>'` };
            } else {
                output = { type: 'html', value: `Script not found: ${escapeHtml(script)}` };
            }
        } else {
            output = { type: 'html', value: `Command not recognized: ${escapeHtml(command)}\ntype <i>'help'</i> to see what you can do here!` };
        }

        const echoedCommand = escapeHtml(command);
        if (command.startsWith('cat ')) {
            setHistory((prev) => [...prev, { type: 'html', value: `> <span style='color:var(--accent-1);'>${echoedCommand}</span>` }, output]);
        } else if (command.startsWith('run ')) {
            setHistory((prev) => [...prev, { type: 'html', value: `> <span style='color:var(--accent-2);'>${echoedCommand}</span>` }, output]);
        } else {
            setHistory((prev) => [...prev, { type: 'html', value: `> ${echoedCommand}` }, output]);
        }

        if (output.type === 'html') {
            const index = history.length + 1;
            setTimeout(() => {
                typeWriterEffect(output.value, index);
            }, 5);
        }

        recordCommand(command);
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
        // Only the focused window may pull keystrokes into its input, and never
        // on touch screens (that would keep popping the virtual keyboard)
        if (!focused || isCoarsePointer()) return;
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
    }, [focused]);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [history, snakeActive]);

    return (
        <div className='terminal-container' ref={rootRef} onClick={() => inputRef.current && inputRef.current.focus()}>
            <div className='terminal' ref={terminalRef}>
                {history.map((item, index) => (
                    <div key={index}>{item.type === 'html' ? <span dangerouslySetInnerHTML={{ __html: item.value }} /> : <span>{item.value}</span>}</div>
                ))}
                {snakeActive && <Snake onExit={exitSnake} />}
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
                    autoFocus={!isCoarsePointer()}
                    disabled={booting || snakeActive}
                    aria-label='terminal command input'
                    autoCapitalize='off'
                    autoCorrect='off'
                    autoComplete='off'
                    spellCheck={false}
                />
            </div>
        </div>
    );
};

export default Terminal;
