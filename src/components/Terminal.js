import React, { useState, useRef, useEffect } from 'react';

const Terminal = () => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([
        { type: 'text', value: "Welcome to Andy's Terminal!" },
        { type: 'text', value: 'You can use the following commands:' },
        { type: 'text', value: '- cd home' },
        { type: 'text', value: '- cd about' },
        { type: 'text', value: '- cd projects' },
        { type: 'text', value: '- cd contact' },
        { type: 'text', value: '- cd resume' },
        { type: 'text', value: '- run jokeoftheday.js' },
        { type: 'text', value: '- run drawmesomething.js' },
    ]);
    const [currentDirectory, setCurrentDirectory] = useState('home');
    const [commandHistory, setCommandHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [tabIndex, setTabIndex] = useState(-1);
    const terminalRef = useRef(null);

    // List of possible commands
    const possibleCommands = ['cd home', 'cd about', 'cd projects', 'cd contact', 'cd resume', 'run jokeoftheday.js', 'run drawmesomething.js'];

    // Define content for directories
    const content = {
        home: {
            type: 'html',
            value: `
            
            
            
            `,
        },
        about: {
            type: 'html',
            value: `
            
            
            
            `,
        },
        projects: {
            type: 'html',
            value: `
<b style='color:#FCB26F; font-size: 20px;'><i>Projects</i></b>
---------------------------------   

<b>Personal Website</b> | Sept 2022
- blah
- blah
- blah

<b>Jungle Jam</b> | May 2022
- Collaborated with a team of 7 to develop an interactive game using <b style='color:#6fb9fc;'><i>Python</i></b>, <b style='color:#6fb9fc;'><i>OpenCV</i></b>, and <b style='color:#6fb9fc;'><i>PyGame</i></b>, where players use an oversized slingshot to launch food at projected jungle animals.
- Developed object recognition functionality using <b style='color:#6fb9fc;'><i>OpenCV</i></b> to detect and track the thrown objects' position and impact.          
- Designed and implemented gameplay features in <b style='color:#6fb9fc;'><i>PyGame</i></b>, incorporating object tracking and jungle-themed elements to enhance user engagement.

<b>Online Chatroom</b> | April 2021
- Architected and developed a full-stack web application using <b style='color:#6fb9fc;'><i>ReactJS</i></b>, <b style='color:#6fb9fc;'><i>MongoDB</i></b>, <b style='color:#6fb9fc;'><i>Redis</i></b>, and <b style='color:#6fb9fc;'><i>Handlebars</i></b> to enable peer communication during the pandemic.
- Designed and integrated user account management systems utilizing <b style='color:#6fb9fc;'><i>Promises</i></b> and <b style='color:#6fb9fc;'><i>REST APIs</i></b>, enhancing security and user experience.
- Performed detailed end-to-end testing to ensure smooth and reliable integration across front-end and back-end components.

`,
        },
        contact: {
            type: 'html',
            value: `
Find me here ! ! ! <b style='color:#6fb9fc;'>⸜( ˃ ᵕ ˂ )⸝</b>
---------------------------------

Connect with me professionally: <a style="color: #FCB26F; text-decoration: none; font-weight: bold; border-bottom: 2px solid transparent; transition: border-bottom 0.3s ease, color 0.3s ease;" onmouseover="this.style.borderBottom='2px solid #FCB26F';"  onmouseout="this.style.borderBottom='2px solid transparent';" href="https://www.linkedin.com/in/ahuanggg/ target="_blank"">Linkedin</a>
See more into my life: <a  style="color: #FCB26F; text-decoration: none; font-weight: bold; border-bottom: 2px solid transparent; transition: border-bottom 0.3s ease, color 0.3s ease;" onmouseover="this.style.borderBottom='2px solid #FCB26F';"  onmouseout="this.style.borderBottom='2px solid transparent';" href="https://www.instagram.com/a.huanggg/ target="_blank"">Instagram</a>
Get in touch: <a style="color: #FCB26F; text-decoration: none; font-weight: bold; border-bottom: 2px solid transparent; transition: border-bottom 0.3s ease, color 0.3s ease;" onmouseover="this.style.borderBottom='2px solid #FCB26F';"  onmouseout="this.style.borderBottom='2px solid transparent';" href="mailto:andyhuangling@gmail.com" target="_blank">Email Andy</a>
            `,
        },
        resume: {
            type: 'html',
            value: `
<b style='color:#FCB26F; font-size: 20px;'><i>Experience</i></b>
---------------------------------

<b>Software Engineer @ KeHE</b> | May 2023 - Present
- Developed and enhanced UI components, including modals and interactive elements using <b style='color:#6fb9fc;'><i>AngularJS</i></b> and <b style='color:#6fb9fc;'><i>BootStrap</i></b>. Resulted in a 42% improvement in customer usabillity and satisfaction.
- Build robust APIs with the <b style='color:#6fb9fc;'><i>.NET</i></b> Frame work, interfrated them with <b style='color:#6fb9fc;'><i>NySQL</i></b> to provide seamless front-end to back-end connectivity, significantly improving user experience.
- Upgraded projects from <b style='color:#6fb9fc;'><i>.NET 2</i></b> to <b style='color:#6fb9fc;'><i>.NET 6</i></b>, improved security and refactored code to leverage new <b style='color:#6fb9fc;'><i>.NET 6</i></b> functions and libraries.
- Generated over $24 million in revenue utilizing <b style='color:#6fb9fc;'><i>C#</i></b>, <b style='color:#6fb9fc;'><i>AngularJS</i></b>, <b style='color:#6fb9fc;'><i>BootStrap</i></b> and <b style='color:#6fb9fc;'><i>SQL</i></b> by handling ad-hoc project enhancements provided by stakeholders.

<b>UI Developer @ MarkLogic</b> | May 2021 - Aug 2021
- Collaborated with an Agile team of 4 to implement UI enhancements on a web application, improving usability and efficiency using <b style='color:#6fb9fc;'><i>AngularJS</i></b> and <b style='color:#6fb9fc;'><i>Bootstrap</i></b>.
- Updated and expanded end-to-end testing procedures, utilizing <b style='color:#6fb9fc;'><i>CodeceptJS</i></b> and <b style='color:#6fb9fc;'><i>Selenium</i></b> to ensure seamless compatibility with UI changes, improving the overall quality assurance process.
- Revamped the company’s website to enhance clarity and user flow, leading to improved user experience and increased customer engagement.
- Documented UI enhancements and changes to support team knowledge sharing and facilitate future development efforts.

<b style='color:#FCB26F; font-size: 20px;'><i>Skills</i></b>
----------------------------------

<b>Technical Skills</b> : Angular • React • TypeScript • C# • SQL • Python • HTML/CSS • .Net6 • Git
<b>Programs</b> : Visual Studio Code • Visual Studio • Adobe Photoshop • Adobe Illustrator

`,
        },
    };

    // Function to animate the typewriter effect
    const typeWriterEffect = (text, index) => {
        const characters = text.split('');
        let typedText = '';

        const animateText = (charIndex) => {
            if (charIndex < characters.length) {
                typedText += characters[charIndex];
                setHistory((prevHistory) => {
                    const updatedHistory = [...prevHistory];
                    updatedHistory[index] = { ...updatedHistory[index], value: typedText };
                    return updatedHistory;
                });

                setTimeout(() => animateText(charIndex + 1), 2); // Adjust speed of typing here
            }
        };

        animateText(0);
    };

    const handleCommand = (command) => {
        let output = '';

        if (command.startsWith('cd ')) {
            const dir = command.split(' ')[1];
            if (content[dir]) {
                setCurrentDirectory(dir);
                output = content[dir].type === 'html' ? content[dir] : { type: 'text', value: content[dir] };
            } else {
                output = { type: 'text', value: `Directory not found: ${dir}` };
            }
        } else if (command.startsWith('run ')) {
            let temp = command.replace('run', '').trim();
            output = { type: 'text', value: `Running: ${temp}` };
        } else {
            output = { type: 'text', value: `Command not recognized: ${command}` };
        }

        // Add command to history with type `text`
        setHistory((prev) => [
            ...prev,
            { type: 'text', value: `> ${command}` }, // User command
            output, // The generated output
        ]);

        // If the output is of type 'text', apply typewriter effect
        if (output.type === 'html') {
            const index = history.length + 1; // Determine the index of the new history item
            setTimeout(() => {
                typeWriterEffect(output.value, index);
            }, 500); // Apply the typewriter effect with a delay
        }

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
            const filteredCommands = possibleCommands.filter((cmd) => cmd.startsWith(input.trim()));
            if (filteredCommands.length > 0) {
                const nextTabIndex = (tabIndex + 1) % filteredCommands.length;
                setTabIndex(nextTabIndex);
                setInput(filteredCommands[nextTabIndex]);
            }
        }
    };

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
                        <div key={index}>
                            {/* Render HTML safely for HTML type entries */}
                            {item.type === 'html' ? <span dangerouslySetInnerHTML={{ __html: item.value }} /> : <span>{item.value}</span>}
                        </div>
                    ))}
                </div>
                <div className='input-area'>
                    <span>{`/ ${currentDirectory} > `}</span>
                    <input type='text' value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleInput} className='terminal-input' autoFocus />
                </div>
            </div>
        </div>
    );
};

export default Terminal;
