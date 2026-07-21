// Single source of truth for all portfolio content.
// The terminal (components/content.js) and the OS apps (os/apps/*) both render from this data.
// Bullets use **text** to mark tech/emphasis — each renderer decides how to style it.

export const socials = {
    linkedin: 'https://www.linkedin.com/in/ahuanggg/',
    github: 'https://github.com/ahuanggg',
    instagram: 'https://www.instagram.com/a.huanggg/',
    email: 'andyhuangling@gmail.com',
};

export const resumeUrl = '/resume.pdf';

export const about = {
    name: 'Andy Huang Ling',
    tagline: 'Software Engineer • NYC native • handball enthusiast',
    blurb: [
        'a New York City native with a passion for blending creativity and technology to craft engaging user experiences.',
        'I am currently a Software Engineer at KeHE Distributors, where I build and optimize UI components using AngularJS, C#, and SQL. I’ve led projects upgrading systems to .NET 6, developed APIs to streamline front-end and back-end connectivity, and delivered solutions that contributed to $24 million in revenue growth through targeted enhancements.',
        'I’m excited to continue growing as a Full Stack Developer, aiming to collaborate with a diverse team of designers and developers to create meaningful and interactive digital experiences like this one!',
        'In my free time, you can usually find me on the handball court or hunting for the best food spots around the city.',
    ],
};

export const experience = [
    {
        role: 'Software Engineer',
        company: 'KeHE',
        dates: 'May 2023 - Present',
        bullets: [
            'Developed and enhanced UI components, including modals and interactive elements using **AngularJS** and **BootStrap**. Resulted in a 42% improvement in customer usability and satisfaction.',
            'Built robust APIs with the **.NET** Framework, integrated them with **MySQL** to provide seamless front-end to back-end connectivity, significantly improving user experience.',
            'Upgraded projects from **.NET 2** to **.NET 6**, improved security and refactored code to leverage new **.NET 6** functions and libraries.',
            'Generated over $24 million in revenue utilizing **C#**, **AngularJS**, **BootStrap** and **SQL** by handling ad-hoc project enhancements provided by stakeholders.',
        ],
    },
    {
        role: 'UI Developer',
        company: 'MarkLogic',
        dates: 'May 2021 - Aug 2021',
        bullets: [
            'Collaborated with an Agile team of 4 to implement UI enhancements on a web application, improving usability and efficiency using **AngularJS** and **Bootstrap**.',
            'Updated and expanded end-to-end testing procedures, utilizing **CodeceptJS** and **Selenium** to ensure seamless compatibility with UI changes, improving the overall quality assurance process.',
            'Revamped the company’s website to enhance clarity and user flow, leading to improved user experience and increased customer engagement.',
            'Documented UI enhancements and changes to support team knowledge sharing and facilitate future development efforts.',
        ],
    },
];

export const skills = {
    technical: ['Angular', 'React', 'TypeScript', 'C#', 'SQL', 'Python', 'HTML/CSS', '.Net6', 'Git'],
    programs: ['Visual Studio Code', 'Visual Studio', 'Adobe Photoshop', 'Adobe Illustrator'],
};

export const projects = [
    {
        name: 'A terrible experience',
        date: '? ? ?',
        bullets: ['coming soon ٩(^ᗜ^ )و´-'],
    },
    {
        name: 'Personal Website',
        date: 'Sept 2022 - Present',
        bullets: [
            'Rebuilt the site from a single terminal component into **AndyOS**, a Windows XP-style desktop environment with a hand-rolled window manager — drag, 8-direction resize, minimize/maximize/restore, z-order, a taskbar, Start menu, and boot screen — driven by a framework-agnostic **useReducer** state machine with zero added npm dependencies.',
            'Engineered 60fps window drag/resize from scratch with raw **Pointer Events**: during a gesture, position updates write straight to the DOM inside **requestAnimationFrame** and React only receives a single dispatch on pointer release, keeping the drag loop off the render path entirely.',
            'Added a responsive phone-OS mode (**matchMedia**, sub-768px) that reuses the same window-manager reducer through a completely different renderer — icon-grid home screen, fullscreen apps, back/home/close navigation — with a single app registry as the contract between the shell and all seven apps.',
            'Preserved the original terminal as an in-OS Command Prompt app, added in-window **Snake** and **Minesweeper** games, covered the window manager and shell with **Jest** unit tests, and wired up **GitHub Actions** CI/CD to auto-build and deploy to GitHub Pages on every push to main.',
        ],
        note: "you're using it right now — this whole desktop is the website!",
    },
    {
        name: 'Jungle Jam',
        date: 'May 2022',
        link: 'https://www.instagram.com/junglejamrit/',
        bullets: [
            'Collaborated with a team of 7 to develop an interactive game using **Python**, **OpenCV**, and **PyGame**, where players use an oversized slingshot to launch food at projected jungle animals.',
            "Developed object recognition functionality using **OpenCV** to detect and track the thrown objects' position and impact.",
            'Designed and implemented gameplay features in **PyGame**, incorporating object tracking and jungle-themed elements to enhance user engagement.',
        ],
    },
    {
        name: 'Online Chatroom',
        date: 'April 2021',
        link: '/chatroom.mp4',
        video: '/chatroom.mp4',
        bullets: [
            'Architected and developed a full-stack web application using **ReactJS**, **MongoDB**, **Redis**, and **Handlebars** to enable peer communication during the pandemic.',
            'Designed and integrated user account management systems utilizing **Promises** and **REST APIs**, enhancing security and user experience.',
            'Performed detailed end-to-end testing to ensure smooth and reliable integration across front-end and back-end components.',
        ],
    },
];
