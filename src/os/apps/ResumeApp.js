import React from 'react';
import { experience, skills, resumeUrl } from '../../data/profile';
import { Toolbar, Emphasis } from './chrome';
import { useOSMode } from '../useOSMode';

const HtmlResume = () => (
    <div className='xp-pane'>
        <h2 className='xp-heading'>Experience</h2>
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
        <h2 className='xp-heading'>Skills</h2>
        <p>
            <b>Technical:</b> {skills.technical.join(' • ')}
        </p>
        <p>
            <b>Programs:</b> {skills.programs.join(' • ')}
        </p>
    </div>
);

const ResumeApp = () => {
    // Mobile browsers usually refuse inline PDFs — phones get the HTML version
    const phone = useOSMode() === 'phone';
    const pdfSrc = process.env.PUBLIC_URL + resumeUrl;

    return (
        <div className='xp-app'>
            <Toolbar>
                <a className='xp-btn' href={pdfSrc} download='Andy_Huang_Ling_Resume.pdf'>
                    💾 Download
                </a>
                <a className='xp-btn' href={pdfSrc} target='_blank' rel='noreferrer'>
                    🔗 Open in new tab
                </a>
            </Toolbar>
            {phone ? (
                <HtmlResume />
            ) : (
                <iframe src={pdfSrc} title='Resume PDF' style={{ flex: 1, width: '100%', border: 'none' }} />
            )}
        </div>
    );
};

export default ResumeApp;
