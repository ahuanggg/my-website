//style='color:var(--accent-1);' orange
//style='color:var(--accent-2);' blue

const Content = {
    'ls': { type: 'html', value: `---------------------------------\n- <span style='color:var(--accent-1);'>home.txt</span>\n- <span style='color:var(--accent-1);'>about.txt</span>\n- <span style='color:var(--accent-1);'>projects.txt</span>\n- <span style='color:var(--accent-1);'>contact.txt</span>\n- <span style='color:var(--accent-1);'>resume.txt</span>\n- <span style='color:var(--accent-2);'>jokeoftheday.js</span>\n- <span style='color:var(--accent-2);'>drawmesomething.js</span>\n- <span style='color:var(--accent-2);'>sendemail.js</span>\n- <span style='color:var(--accent-2);'>snake.js</span>\n- <span style='color:var(--accent-2);'>guestbook.js</span>\n` },
    'home.txt': {
        type: 'html',
        value: `
Welcome home ! <span style='color:pink'>

⠀⠀⠀⠰⡄⣶⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣤⡤⠤⠤⠤⣤⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠘⠃⠀⠀⠀⠀⠀⠀⢀⡤⠞⠋⠁⠀⠀⠀⠀⠀⠀⠀⠉⠛⢦⣤⠶⠦⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢀⣴⠞⢋⡽⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠃⠀⠀⠙⢶⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣰⠟⠁⠀⠘⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⡀⠀⠀⠉⠓⠦⣤⣤⣤⣤⣤⣤⣄⣀⠀⠀⠀
⠀⠀⠀⠀⣠⠞⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⣷⡄⠀⠀⢻⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣆⠀
⠀⠀⣠⠞⠁⠀⠀⣀⣠⣏⡀⠀⢠⣶⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⠿⡃⠀⠀⠀⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⡆
⢀⡞⠁⠀⣠⠶⠛⠉⠉⠉⠙⢦⡸⣿⡿⠀⠀⠀⡼⣇⣀⣀⡶⠀⠀⠀⢀⡄⣀⠀⣢⠟⢦⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⠃
⡞⠀⠀⠸⠁⠀⠀⠀⠀⠀⠀⠀⢳⢀⣠⠀⠀⠀⠉⠙⠃⠀⣀⠀⠀⠀⢀⣠⡴⠞⠁⠀⠀⠈⠓⠦⣄⣀⠀⠀⠀⠀⣀⣤⠞⠁⠀
⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⠀⠁⠀⢀⣀⣀⡴⠋⢻⡉⠙⠾⡟⢿⣅⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠙⠛⠉⠉⠀⠀⠀⠀
⠘⣦⡀⠀⠀⠀⠀⠀⠀⣀⣤⠞⢉⣹⣯⣍⣿⠉⠟⠀⠀⣸⠳⣄⡀⠀⠀⠙⢧⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠈⠙⠒⠒⠒⠒⠚⠋⠁⠀⡴⠋⢀⡀⢠⡇⠀⠀⠀⠀⠃⠀⠀⠀⠀⠀⢀⡾⠋⢻⡄⠀⠀⠀⠀⠻⣦⣼⠇⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢀⠀⠀⠀⠀⠀⠀⢸⡇⠀⢸⡀⠸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠀⢠⡇⠀⠀⠀⠀⠀⠀⠀⠈⠋⠀⠀⠀⠀⠀⠀
⠀⢳⣴⠃⠀⠀⠀⠀⠀⠀⠘⣇⠀⠀⠉⠋⠻⣄⠀⠀⠀⠀⠀⣀⣠⣴⠞⠋⠳⠶⠞⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠛⠀⠀⠀⠀⠀⠀⠀⠀⠈⠳⠦⢤⠤⠶⠋⠙⠳⣆⣀⣈⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
</span>
From here you can type 'ls' to see what files you can print out or what scripts you can run! \nAnything that ends in a <span style='color:var(--accent-1);'>.txt</span> can be used with the command '<span style='color:var(--accent-1);'>cat</span>' ie: <span style='color:var(--accent-1);'>cat about.txt</span> \nAnything that ends with a <span style='color:var(--accent-2);'>.js</span> can be used with the command '<span style='color:var(--accent-2);'>run</span>' ie: <span style='color:var(--accent-2);'>run jokeoftheday.js</span>`,
    },
    'about.txt': {
        type: 'html',
        value: `
Hi I’m <b><a style="color: var(--accent-1); text-decoration: none; font-weight: bold; border-bottom: 2px solid transparent; transition: border-bottom 0.3s ease, color 0.3s ease;" onmouseover="this.style.borderBottom='2px solid var(--accent-1)';"  onmouseout="this.style.borderBottom='2px solid transparent';" href="https://www.linkedin.com/in/ahuanggg/" target="_blank" rel="noreferrer">Andy Huang Ling</a></b> !!!
---------------------------------
a New York City native with a passion for blending creativity and technology to craft engaging user experiences.

I am currently a Software Engineer at KeHE Distributors, where I build and optimize UI components using AngularJS, C#, and SQL. I’ve led projects upgrading systems to .NET 6, developed APIs to streamline front-end and back-end connectivity, and delivered solutions that contributed to $24 million in revenue growth through targeted enhancements.

I’m excited to continue growing as a Full Stack Developer, aiming to collaborate with a diverse team of designers and developers to create meaningful and interactive digital experiences like this one!

In my free time, you can usually find me on the handball court or hunting for the best food spots around the city. 
        `,
    },
    'projects.txt': {
        type: 'html',
        value: `
<b style='color:var(--accent-1); font-size: 20px;'><i>Projects</i></b>
---------------------------------   
<b style="color: var(--accent-1)">A terrible experience</b> | ? ? ?
- coming soon ٩(^ᗜ^ )و´-

<b style="color: var(--accent-1)">Personal Website</b> | Sept 2022
- Developed a web-based terminal interface using <b style='color:var(--accent-2);'><i>ReactJS</i></b>, <b style='color:var(--accent-2);'><i>JavaScript</i></b>, and <b style='color:var(--accent-2);'><i>CSS</i></b> to showcase professional experience, skills, and personal information.
- Integrated <b style='color:var(--accent-2);'><i>REST API</i></b>  calls with <b style='color:var(--accent-2);'><i>Promises</i></b>  to dynamically fetch and display a "Joke of the Day" from a public endpoint.

<b><a style="color: var(--accent-1); text-decoration: none; font-weight: bold; border-bottom: 2px solid transparent; transition: border-bottom 0.3s ease, color 0.3s ease;" onmouseover="this.style.borderBottom='2px solid var(--accent-1)';"  onmouseout="this.style.borderBottom='2px solid transparent';" href="https://www.instagram.com/junglejamrit/" target="_blank" rel="noreferrer">Jungle Jam</a></b> | May 2022 | 
- Collaborated with a team of 7 to develop an interactive game using <b style='color:var(--accent-2);'><i>Python</i></b>, <b style='color:var(--accent-2);'><i>OpenCV</i></b>, and <b style='color:var(--accent-2);'><i>PyGame</i></b>, where players use an oversized slingshot to launch food at projected jungle animals.
- Developed object recognition functionality using <b style='color:var(--accent-2);'><i>OpenCV</i></b> to detect and track the thrown objects' position and impact.          
- Designed and implemented gameplay features in <b style='color:var(--accent-2);'><i>PyGame</i></b>, incorporating object tracking and jungle-themed elements to enhance user engagement.

<b><a style="color: var(--accent-1); text-decoration: none; font-weight: bold; border-bottom: 2px solid transparent; transition: border-bottom 0.3s ease, color 0.3s ease;" onmouseover="this.style.borderBottom='2px solid var(--accent-1)';"  onmouseout="this.style.borderBottom='2px solid transparent';" href="/chatroom.mp4" target="_blank" rel="noreferrer">Online Chatroom</a></b> | April 2021 
- Architected and developed a full-stack web application using <b style='color:var(--accent-2);'><i>ReactJS</i></b>, <b style='color:var(--accent-2);'><i>MongoDB</i></b>, <b style='color:var(--accent-2);'><i>Redis</i></b>, and <b style='color:var(--accent-2);'><i>Handlebars</i></b> to enable peer communication during the pandemic.
- Designed and integrated user account management systems utilizing <b style='color:var(--accent-2);'><i>Promises</i></b> and <b style='color:var(--accent-2);'><i>REST APIs</i></b>, enhancing security and user experience.
- Performed detailed end-to-end testing to ensure smooth and reliable integration across front-end and back-end components.

`,
    },
    'contact.txt': {
        type: 'html',
        value: `
Find me here ! ! ! <b style='color:var(--accent-2);'>⸜( ˃ ᵕ ˂ )⸝</b>
---------------------------------

Connect with me professionally: <a style="color: var(--accent-1); text-decoration: none; font-weight: bold; border-bottom: 2px solid transparent; transition: border-bottom 0.3s ease, color 0.3s ease;" onmouseover="this.style.borderBottom='2px solid var(--accent-1)';"  onmouseout="this.style.borderBottom='2px solid transparent';" href="https://www.linkedin.com/in/ahuanggg/" target="_blank">Linkedin</a>
See more into my life: <a  style="color: var(--accent-1); text-decoration: none; font-weight: bold; border-bottom: 2px solid transparent; transition: border-bottom 0.3s ease, color 0.3s ease;" onmouseover="this.style.borderBottom='2px solid var(--accent-1)';"  onmouseout="this.style.borderBottom='2px solid transparent';" href="https://www.instagram.com/a.huanggg/" target="_blank">Instagram</a>
Get in touch: <a style="color: var(--accent-1); text-decoration: none; font-weight: bold; border-bottom: 2px solid transparent; transition: border-bottom 0.3s ease, color 0.3s ease;" onmouseover="this.style.borderBottom='2px solid var(--accent-1)';"  onmouseout="this.style.borderBottom='2px solid transparent';" href="mailto:andyhuangling@gmail.com" target="_blank">andyhuangling@gmail.com</a>
        `,
    },
    'resume.txt': {
        type: 'html',
        value: `
<b style='color:var(--accent-1); font-size: 20px;'><i>Experience</i></b>
---------------------------------

<b>Software Engineer @ KeHE</b> | May 2023 - Present
- Developed and enhanced UI components, including modals and interactive elements using <b style='color:var(--accent-2);'><i>AngularJS</i></b> and <b style='color:var(--accent-2);'><i>BootStrap</i></b>. Resulted in a 42% improvement in customer usability and satisfaction.
- Built robust APIs with the <b style='color:var(--accent-2);'><i>.NET</i></b> Framework, integrated them with <b style='color:var(--accent-2);'><i>MySQL</i></b> to provide seamless front-end to back-end connectivity, significantly improving user experience.
- Upgraded projects from <b style='color:var(--accent-2);'><i>.NET 2</i></b> to <b style='color:var(--accent-2);'><i>.NET 6</i></b>, improved security and refactored code to leverage new <b style='color:var(--accent-2);'><i>.NET 6</i></b> functions and libraries.
- Generated over $24 million in revenue utilizing <b style='color:var(--accent-2);'><i>C#</i></b>, <b style='color:var(--accent-2);'><i>AngularJS</i></b>, <b style='color:var(--accent-2);'><i>BootStrap</i></b> and <b style='color:var(--accent-2);'><i>SQL</i></b> by handling ad-hoc project enhancements provided by stakeholders.

<b>UI Developer @ MarkLogic</b> | May 2021 - Aug 2021
- Collaborated with an Agile team of 4 to implement UI enhancements on a web application, improving usability and efficiency using <b style='color:var(--accent-2);'><i>AngularJS</i></b> and <b style='color:var(--accent-2);'><i>Bootstrap</i></b>.
- Updated and expanded end-to-end testing procedures, utilizing <b style='color:var(--accent-2);'><i>CodeceptJS</i></b> and <b style='color:var(--accent-2);'><i>Selenium</i></b> to ensure seamless compatibility with UI changes, improving the overall quality assurance process.
- Revamped the company’s website to enhance clarity and user flow, leading to improved user experience and increased customer engagement.
- Documented UI enhancements and changes to support team knowledge sharing and facilitate future development efforts.

<b style='color:var(--accent-1); font-size: 20px;'><i>Skills</i></b>
----------------------------------

<b>Technical Skills</b> : Angular • React • TypeScript • C# • SQL • Python • HTML/CSS • .Net6 • Git
<b>Programs</b> : Visual Studio Code • Visual Studio • Adobe Photoshop • Adobe Illustrator

<a style="color: var(--accent-1); font-size: 16px; text-decoration: none; font-weight: bold; border-bottom: 2px solid transparent; transition: border-bottom 0.3s ease, color 0.3s ease;" onmouseover="this.style.borderBottom='2px solid var(--accent-1)';"  onmouseout="this.style.borderBottom='2px solid transparent';" href="/resume.pdf" target="_blank" rel="noreferrer">full resume here!</a>

`,
    },
};

export default Content;
