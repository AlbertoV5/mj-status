import React from 'react'

export const ProjectCard = ({title, summary, image, link}: {title: string, summary: string, image: string, link: string}) => {
    return (
        <section id="project-card" className="card text-bg-dark shadow-sm hstack gap-2">
            <div className="card-body col-6">
                <a href={link} style={{textDecoration: "none"}}>
                    <h3 className="card-title">{title}</h3>
                </a>
                <p className="card-text">{summary}</p>
            </div>
            <div className='col-6'>
                <a href={link}>
                    <img src={image} className="card-img-top" style={{width: "100%"}} alt={title}/>
                </a>
            </div>
        </section>
    )
}
