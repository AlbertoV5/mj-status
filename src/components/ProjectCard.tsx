import React from 'react'

export const ProjectCard = ({title, summary, image, link}: {title: string, summary: string, image: string, link: string}) => {
    const handleClick = () => {
        window.open(link)
    }
    return (
        <section id="project-card" onClick={handleClick} className="card text-bg-dark shadow-sm hstack gap-2">
            <section className="card-body col-6">
                <a href={link} style={{textDecoration: "none"}}>
                    <h3 className="card-title">{title}</h3>
                </a>
                <p className="card-text">{summary}</p>
            </section>
            <section className='col-6'>
                <a href={link}>
                    <img src={image} className="card-img-top" style={{width: "100%"}} alt={title}/>
                </a>
            </section>
        </section>
    )
}
