import React, { useState } from 'react';
import { projects } from '../../data/profile';
import { Toolbar, StatusBar, Emphasis } from './chrome';

// Explorer-style master–detail: project "files" on the left, details on the right
const ProjectsApp = () => {
    const [selected, setSelected] = useState(1); // default to a real project, not the teaser
    const project = projects[selected];

    return (
        <div className='xp-app'>
            <Toolbar>
                <span aria-hidden='true'>📁</span>
                <span>
                    C:\Andy\Projects\<b>{project.name}</b>
                </span>
            </Toolbar>
            <div className='explorer'>
                <div className='explorer-list'>
                    {projects.map((p, i) => (
                        <button
                            type='button'
                            key={p.name}
                            className={`explorer-item${selected === i ? ' explorer-item--selected' : ''}`}
                            onClick={() => setSelected(i)}
                        >
                            <span className='explorer-item-icon' aria-hidden='true'>
                                📄
                            </span>
                            <span className='explorer-item-name'>{p.name}</span>
                        </button>
                    ))}
                </div>
                <div className='explorer-detail'>
                    <h2 className='xp-heading'>{project.name}</h2>
                    <p className='xp-muted'>{project.date}</p>
                    <ul className='xp-list'>
                        {project.bullets.map((bullet, i) => (
                            <li key={i}>
                                <Emphasis text={bullet} />
                            </li>
                        ))}
                    </ul>
                    {project.note && <p className='xp-muted'>({project.note})</p>}
                    {project.link && !project.video && (
                        <a className='xp-btn' href={project.link} target='_blank' rel='noreferrer'>
                            🔗 Take a look
                        </a>
                    )}
                    {project.video && (
                        // preload='none' keeps the 4MB demo off the wire until play;
                        // playsInline stops iOS from hijacking into fullscreen
                        <video src={project.video} controls preload='none' playsInline aria-label={`${project.name} demo video`} />
                    )}
                </div>
            </div>
            <StatusBar>
                <span>{projects.length} object(s)</span>
                <span>My Computer</span>
            </StatusBar>
        </div>
    );
};

export default ProjectsApp;
