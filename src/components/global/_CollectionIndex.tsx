import { EntryCard } from './EntryCard'
import type { Entry } from "../../content/config"

interface CollectionIndexProps {
    title: string
    description: string
    entries: Entry[]
	slugBase: string
}

const CollectionIndex = ({title, description, entries, slugBase}: CollectionIndexProps) => {
    return (
        <>
			<section className="row pt-4">
				<section className="col-md-12">
					<header className="vstack gap-2 text-center">
						<h1>{title}</h1>
						<p>{description}</p>
					</header>
				</section>
			</section>
			<section className="row">
				<section className="col-md-3 px-4 vstack gap-2">
					<h2 style={{fontSize: "1.5rem"}}>Table of Contents</h2>
					<div className="input-group mb-3">
						<span className="input-group-text" id="basic-addon1">Tags</span>
						<input type="text" className="form-control" placeholder="search"/>
					</div>
				</section>
				<section className="col-md-6">
					<ul className="list-group pt-4">
						{entries.map(entry => (
							<li 
								key={entry.slug}
								className="list-group-item btn btn-outline-primary border-0 text-start"
								style={{padding: "2px"}}
							>
								<EntryCard
									data={entry.data}
									slug={`${slugBase}/${entry.slug}`}
								/>
							</li>
						))}
					</ul>
				</section>
				<aside className="col-md-3"></aside>
			</section>
        </>
    )
}

export default CollectionIndex