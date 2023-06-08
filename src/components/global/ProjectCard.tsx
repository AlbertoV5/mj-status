import React from 'react'

interface ProjectCardProps {
    date: Date
    title: string
    tags: string[]
    summary: string
    link: string
    thumbnail: string
}

export const ProjectCard = ({date, title, tags, summary, link, thumbnail}: ProjectCardProps) => {
    const handleClick = () => {
        window.open(link)
    }
    return (
        <section onClick={handleClick} className="card text-bg-dark shadow-sm hstack gap-2 project-card">
            <section className="card-body col-6">
                <a href={link} style={{textDecoration: "none"}}>
                    <h3 className="card-title">{title}</h3>
                </a>
                <p className="card-text">{summary}</p>
                <p className='form-text'>{date.toDateString()}</p>
            </section>
            <section className='col-6'>
                <a href={link}>
                    <img src={thumbnail} className="card-img-top" style={{width: "100%"}} alt={title}/>
                </a>
            </section>
        </section>
    )
}
