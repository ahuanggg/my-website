const Content = {
    ls: { type: 'html', value: `---------------------------------\n- /home\n- /about\n- /projects\n- /resume\n- jokeoftheday.js\n- drawmesomething.js\n ` },
    home: {
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
From here you can type 'ls' to see what you can cd into or what files you can run!`,
    },
    about: {
        type: 'html',
        value: `
Hi I’m <b style='color:#6fb9fc;'><i>Andy Huang Ling</i></b> !!! 
---------------------------------
a New York City native with a passion for blending creativity and technology to craft engaging user experiences.

I am currently a Software Engineer at KeHE Distributors, where I build and optimize UI components using AngularJS, C#, and SQL. I’ve led projects upgrading systems to .NET 6, developed APIs to streamline front-end and back-end connectivity, and delivered solutions that contributed to $24 million in revenue growth through targeted enhancements.

I’m excited to continue growing as a Full Stack Developer, aiming to collaborate with a diverse team of designers and developers to create meaningful and interactive digital experiences like this one!

In my free time, you can usually find me on the handball court or hunting for the best food spots around the city. 
        `,
    },
    projects: {
        type: 'html',
        value: `
<b style='color:#FCB26F; font-size: 20px;'><i>Projects</i></b>
---------------------------------   
<b>A terrible experience</b> | ? ? ?
- coming soon

<b>Personal Website</b> | Sept 2022
- blah
- blah
- blah

<b><a style="color: #FCB26F; text-decoration: none; font-weight: bold; border-bottom: 2px solid transparent; transition: border-bottom 0.3s ease, color 0.3s ease;" onmouseover="this.style.borderBottom='2px solid #FCB26F';"  onmouseout="this.style.borderBottom='2px solid transparent';" href="https://www.instagram.com/junglejamrit/ target="_blank""'>Jungle Jam</a></b> | May 2022 | 
- Collaborated with a team of 7 to develop an interactive game using <b style='color:#6fb9fc;'><i>Python</i></b>, <b style='color:#6fb9fc;'><i>OpenCV</i></b>, and <b style='color:#6fb9fc;'><i>PyGame</i></b>, where players use an oversized slingshot to launch food at projected jungle animals.
- Developed object recognition functionality using <b style='color:#6fb9fc;'><i>OpenCV</i></b> to detect and track the thrown objects' position and impact.          
- Designed and implemented gameplay features in <b style='color:#6fb9fc;'><i>PyGame</i></b>, incorporating object tracking and jungle-themed elements to enhance user engagement.

<b>Online Chatroom</b> | April 2021 <a href='/public/chatroom.mp4'> here</a>
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
Get in touch: <a style="color: #FCB26F; text-decoration: none; font-weight: bold; border-bottom: 2px solid transparent; transition: border-bottom 0.3s ease, color 0.3s ease;" onmouseover="this.style.borderBottom='2px solid #FCB26F';"  onmouseout="this.style.borderBottom='2px solid transparent';" href="mailto:andyhuangling@gmail.com" target="_blank">Email andyhuangling@gmail.com</a>
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

export default Content;
