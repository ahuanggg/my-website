// Terminal presentation adapter — renders the shared profile data (src/data/profile.js)
// as the accent-colored HTML strings the terminal prints. GUI apps read profile.js directly.
//style='color:var(--accent-1);' orange
//style='color:var(--accent-2);' blue

import { about, experience, skills, projects, socials, resumeUrl } from '../data/profile';

// **text** -> accent-2 bold italic (tech names in bullets)
const tech = (text) => text.replace(/\*\*(.+?)\*\*/g, `<b style='color:var(--accent-2);'><i>$1</i></b>`);

const linkStyle = `style="color: var(--accent-1); text-decoration: none; font-weight: bold; border-bottom: 2px solid transparent; transition: border-bottom 0.3s ease, color 0.3s ease;" onmouseover="this.style.borderBottom='2px solid var(--accent-1)';"  onmouseout="this.style.borderBottom='2px solid transparent';"`;
const link = (href, label) => `<a ${linkStyle} href="${href}" target="_blank" rel="noreferrer">${label}</a>`;

const heading = (text) => `<b style='color:var(--accent-1); font-size: 20px;'><i>${text}</i></b>`;

const projectBlock = (p) => {
    const title = p.link ? `<b>${link(p.link, p.name)}</b>` : `<b style="color: var(--accent-1)">${p.name}</b>`;
    return `${title} | ${p.date}\n${p.bullets.map((b) => `- ${tech(b)}`).join('\n')}`;
};

const experienceBlock = (e) => `<b>${e.role} @ ${e.company}</b> | ${e.dates}\n${e.bullets.map((b) => `- ${tech(b)}`).join('\n')}`;

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
Hi I’m <b>${link(socials.linkedin, about.name)}</b> !!!
---------------------------------
${about.blurb.join('\n\n')}
        `,
    },
    'projects.txt': {
        type: 'html',
        value: `
${heading('Projects')}
---------------------------------
${projects.map(projectBlock).join('\n\n')}

`,
    },
    'contact.txt': {
        type: 'html',
        value: `
Find me here ! ! ! <b style='color:var(--accent-2);'>⸜( ˃ ᵕ ˂ )⸝</b>
---------------------------------

Connect with me professionally: ${link(socials.linkedin, 'Linkedin')}
See more into my life: ${link(socials.instagram, 'Instagram')}
Get in touch: ${link(`mailto:${socials.email}`, socials.email)}
        `,
    },
    'resume.txt': {
        type: 'html',
        value: `
${heading('Experience')}
---------------------------------

${experience.map(experienceBlock).join('\n\n')}

${heading('Skills')}
----------------------------------

<b>Technical Skills</b> : ${skills.technical.join(' • ')}
<b>Programs</b> : ${skills.programs.join(' • ')}

<a ${linkStyle.replace('font-weight: bold;', 'font-size: 16px; font-weight: bold;')} href="${resumeUrl}" target="_blank" rel="noreferrer">full resume here!</a>

`,
    },
};

export default Content;
