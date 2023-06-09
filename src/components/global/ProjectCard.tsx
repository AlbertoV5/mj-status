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
    return (
        <a href={link} style={{textDecoration: "none"}}>
            <section className="card text-bg-dark shadow hstack gap-2">
                <section
                    className='col-6'
                    style={{width: "200px", height: "200px", overflow: "hidden"}}
                >
                    <img src={thumbnail} className="card-img-top" alt={title}/>
                </section>
                <section className="card-body col-6 d-flex flex-column justify-content-center">
                    <h3 className="card-title project-card-title">{title}</h3>
                    <p className='form-text pb-2' style={{lineHeight: "0.5rem"}}>
                        {`Date: ${date.toDateString()}`}
                    </p>
                    <p className="card-text pb-2">{summary}</p>
                    {/* <p className='form-text pb-1' style={{lineHeight: "0.4rem"}}>
                        {`Tags: ${tags.join(", ")}`}
                    </p> */}
                </section>
            </section>
        </a>
    )
}
