import React from 'react';
import { about, experience, skills, socials } from '../../data/profile';
import { Tabs, Emphasis } from './chrome';

const Bio = () => (
    <div>
        <h2 className='xp-heading'>{about.name}</h2>
        <p className='xp-muted'>{about.tagline}</p>
        {about.blurb.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
        ))}
        <a className='xp-btn' href={socials.linkedin} target='_blank' rel='noreferrer'>
            💼 Connect on LinkedIn
        </a>
    </div>
);

const Experience = () => (
    <div>
        {experience.map((job) => (
            <div key={job.company}>
                <h3 className='xp-subheading'>
                    {job.role} @ {job.company} <span className='xp-muted'>| {job.dates}</span>
                </h3>
                <ul className='xp-list'>
                    {job.bullets.map((bullet, i) => (
                        <li key={i}>
                            <Emphasis text={bullet} />
                        </li>
                    ))}
                </ul>
            </div>
        ))}
    </div>
);

const Skills = () => (
    <div>
        <h3 className='xp-subheading'>Technical Skills</h3>
        <div>
            {skills.technical.map((skill) => (
                <span key={skill} className='xp-chip'>
                    {skill}
                </span>
            ))}
        </div>
        <h3 className='xp-subheading'>Programs</h3>
        <div>
            {skills.programs.map((program) => (
                <span key={program} className='xp-chip'>
                    {program}
                </span>
            ))}
        </div>
    </div>
);

const AboutApp = () => (
    <div className='xp-app'>
        <Tabs
            tabs={[
                { id: 'bio', label: 'Bio', render: () => <Bio /> },
                { id: 'experience', label: 'Experience', render: () => <Experience /> },
                { id: 'skills', label: 'Skills', render: () => <Skills /> },
            ]}
        />
    </div>
);

export default AboutApp;
