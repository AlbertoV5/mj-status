import type React from 'react'
import type { EntryData } from '../../content/config'

export interface EntryCardProps {
    data: EntryData
    slug: string
    children?: React.ReactNode
}

export const EntryCard = ({data, slug, children=null}: EntryCardProps) => {
    return (
        <a href={slug} style={{textDecoration: "none"}}>
            <section className="card text-bg-dark shadow hstack gap-2">
                <section
                    className='col-6'
                    style={{width: "200px", height: "200px", overflow: "hidden"}}
                >
                    <img src={data.thumbnail} className="card-img-top" alt={data.title}/>
                    {/* {children} */}
                </section>
                <section className="card-body col-6 d-flex flex-column justify-content-center">
                    <h3 className="card-title project-card-title">{data.title}</h3>
                    <p className='form-text pb-2' style={{lineHeight: "0.5rem"}}>
                        {`Date: ${data.date.toDateString()}`}
                    </p>
                    <p className="card-text pb-2">{data.summary}</p>
                    {/* <p className='form-text pb-1' style={{lineHeight: "0.4rem"}}>
                        {`Tags: ${tags.join(", ")}`}
                    </p> */}
                </section>
            </section>
        </a>
    )
}
