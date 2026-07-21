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
        date: 'Sept 2022',
        bullets: [
            'Developed a web-based terminal interface using **ReactJS**, **JavaScript**, and **CSS** to showcase professional experience, skills, and personal information.',
            'Integrated **REST API** calls with **Promises** to dynamically fetch and display a "Joke of the Day" from a public endpoint.',
        ],
        note: "you're looking at it right now!",
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
