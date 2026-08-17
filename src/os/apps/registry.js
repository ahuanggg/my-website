import TerminalApp from './TerminalApp';
import AboutApp from './AboutApp';
import ProjectsApp from './ProjectsApp';
import ResumeApp from './ResumeApp';
import GamesApp from './GamesApp';
import ContactApp from './ContactApp';
import GuestbookApp from './GuestbookApp';

// The single contract between the shell and the apps. The shell never
// hardcodes app knowledge — it enumerates this map.
export const APPS = {
    terminal: {
        title: 'Command Prompt',
        icon: '🖥️',
        component: TerminalApp,
        defaultSize: { w: 660, h: 460 },
        minSize: { w: 360, h: 240 },
        singleton: true,
    },
    about: {
        title: 'About Me',
        icon: '👤',
        component: AboutApp,
        defaultSize: { w: 560, h: 540 },
        minSize: { w: 360, h: 320 },
        singleton: true,
    },
    projects: {
        title: 'My Projects',
        icon: '📁',
        component: ProjectsApp,
        defaultSize: { w: 680, h: 480 },
        minSize: { w: 380, h: 300 },
        singleton: true,
    },
    resume: {
        title: 'resume.pdf',
        icon: '📄',
        component: ResumeApp,
        defaultSize: { w: 700, h: 640 },
        minSize: { w: 400, h: 400 },
        singleton: true,
    },
    games: {
        title: 'Games',
        icon: '🎮',
        component: GamesApp,
        defaultSize: { w: 560, h: 560 },
        minSize: { w: 380, h: 420 },
        singleton: true,
    },
    contact: {
        title: 'Contact Andy',
        icon: '✉️',
        component: ContactApp,
        defaultSize: { w: 480, h: 500 },
        minSize: { w: 340, h: 380 },
        singleton: true,
    },
    guestbook: {
        title: 'Guestbook',
        icon: '📖',
        component: GuestbookApp,
        defaultSize: { w: 460, h: 500 },
        minSize: { w: 320, h: 340 },
        singleton: true,
    },
};

// Desktop shows a curated set; everything is reachable from the Start menu
export const DESKTOP_ICONS = ['terminal', 'about', 'projects', 'resume', 'games', 'contact', 'guestbook'];
