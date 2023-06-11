import type React from 'react'
import type { EntryData } from '../../content/config'

export interface EntryCardProps {
    data: EntryData
    slug: string
    children?: React.ReactNode
}

export const EntryCard = ({data, slug, children=null}: EntryCardProps) => {
    return (
        <a id={`entry-${slug}`} href={slug} style={{textDecoration: "none"}}>
            <section className="card shadow hstack gap-2">
                <section
                    className='col-6'
                    style={{width: "10rem", height: "10rem"}}
                >
                    <img
                        src={data.thumbnail} 
                        className='img-fluid rounded'
                        alt={data.title}
                        style={{overflow: "hidden"}}
                    />
                </section>
                <section className="card-body col-6 vstack gap-1">
                    <header>
                        <h3 className="card-title project-card-title" 
                            style={{fontSize: "1.2rem", marginBottom: "0.1rem"}}
                        >
                            {data.title}
                        </h3>
                        <span className='form-text'>
                            {`${data.date.toDateString()}`}
                        </span>
                    </header>
                    <section>
                        <p className="card-text" 
                            style={{fontSize: "1rem", marginBottom: "0.1rem", height: "3.2rem", overflow: "scroll"}}
                        >
                            {data.summary}
                        </p>
                        <span 
                            className='form-text'
                        >
                            {`${data.tags.join(", ")}`}
                        </span>
                    </section>
                </section>
            </section>
        </a>
    )
}
