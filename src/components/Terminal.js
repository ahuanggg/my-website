import React, { useState, useRef, useEffect, useMemo } from 'react';
import Content from './content';
import Art from './art';
import DadJoke from './joke';
import Leaf from './leaf';
import { sendEmail } from './sendemail';

//style='color:#FCB26F;' orange
//style='color:#6fb9fc;' blue

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
        { type: 'html', value: `- type <i style='color:#FCB26F'>'ls'</i> to look at what is in the current directory` },
        { type: 'html', value: `- <i style='color:#FCB26F'>'cat {file name}'</i> to print out the txt file` },
        { type: 'html', value: `- <i style='color:#6fb9fc;'>'run {script name}'</i> to run the script` },
        { type: 'html', value: `- anything highlighted when you type 'ls' <i style='color:#FCB26F;'>orange</i> can be used with <i style='color:#FCB26F;'>cat</i> and anything highlighted in <i style='color:#6fb9fc;'>blue</i> can be used with <i style='color:#6fb9fc;'>run</i>` },
        { type: 'html', value: `- an example might look like <i style='color:#FCB26F'>'cat home.txt'</i> or <i style='color:#6fb9fc;'>'run drawmesomething.js'</i>\n ` },
    ]);
    const [currentDirectory, setCurrentDirectory] = useState('home');
    const [commandHistory, setCommandHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [tabIndex, setTabIndex] = useState(-1);
    const terminalRef = useRef(null); // referencing terminal
    const inputRef = useRef(null); // referencing input

    // List of possible commands
    const possibleCommands = ['cat home.txt', 'cat about.txt', 'cat projects.txt', 'cat contact.txt', 'cat resume.txt', 'run jokeoftheday.js', 'run drawmesomething.js', 'run sendemail.js', 'ls'];

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
        let output = '';
        const dir = command.split(' ')[1];
        setCurrentDirectory(dir);
        if (command.startsWith('cat ')) {
            if (content[dir]) {
                output = content[dir].type === 'html' ? content[dir] : { type: 'html', value: content[dir] };
            } else {
                output = { type: 'html', value: `File not found: ${dir}` };
            }
        } else if (command.startsWith('ls')) {
            output = { type: 'html', value: content.ls.value };
        } else if (command.startsWith('run ')) {
            let temp = command.replace('run', '').trim();
            const regex = /^run sendemail.js (.+)$/;
            const match = command.match(regex);
            console.log(match);
            if (temp === 'jokeoftheday.js') {
                const results = await DadJoke('https://icanhazdadjoke.com/');
                output = { type: 'html', value: `\n<span style='color:#6fb9fc;'>Running: ${temp}</span>\n---------------------------------\n${results.joke}\n ` }; //change something here for the joke
            } else if (temp === 'drawmesomething.js') {
                let num = randomNumber(art.length);
                output = { type: 'html', value: `\n<span style='color:#6fb9fc;'>Running: ${temp}:</span>\n---------------------------------\n${art[num].value}\n ` }; // change something here for the art. might have to do a random number gen to get a random picture
            } else if (match) {
                const body = match[1];
                try {
                    const result = await sendEmail(body);
                    output = { type: 'html', value: `---------------------------------\n ${result} \n` };
                } catch (error) {
                    output = { type: 'html', value: `---------------------------------\n ${error} \n` };
                }
            } else if (match === null) {
                output = output = { type: 'html', value: `\n---------------------------------\nTo send me an email you have to add a message after '<span style='color:#FCB26F;'>run sendemail.js</span>' \nan example would be:\n'run sendemail.js Hi Andy, I really like your website and would like to connect with you! You can reach me @ {your email}\n<i style='color:#FCB26F;'>Please make sure to include a way for me to get back to you otherwise I wouldn't know who sent me the email!</i>\n` };
            }
        } else {
            output = { type: 'html', value: `Command not recognized: ${command}` };
        }

        if (command.startsWith('cat ')) {
            setHistory((prev) => [...prev, { type: 'html', value: `> <span style='color:#FCB26F;'>${command}</span>` }, output]);
        } else if (command.startsWith('run ')) {
            setHistory((prev) => [...prev, { type: 'html', value: `> <span style='color:#6fb9fc;'>${command}</span>` }, output]);
        } else {
            setHistory((prev) => [...prev, { type: 'html', value: `> ${command}` }, output]);
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
            const filteredCommands = possibleCommands.filter((cmd) => cmd.startsWith(input.trim()));
            if (filteredCommands.length > 0) {
                const nextTabIndex = (tabIndex + 1) % filteredCommands.length;
                setTabIndex(nextTabIndex);
                setInput(filteredCommands[nextTabIndex]);
            }
        }
    };

    useEffect(() => {
        const handleKeyPress = () => {
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
            {leaves}
        </div>
    );
};

export default Terminal;
