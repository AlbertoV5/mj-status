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
					<header className="vstack gap-3 text-center">
						<section className="hstack gap-2 d-flex justify-content-center">
							<h1>{title}</h1>
						</section>
						<p>{description}</p>
						<section className="hstack gap-2 d-flex justify-content-center">
						</section>
					</header>
				</section>
			</section>
			<section className="row pt-2">
				<aside className="col-md-2"></aside>
				<section className="col-md-8">
					<ul className="list-group">
						{entries.map(entry => (
							<li 
								key={entry.slug}
								className="list-group-item list-group-item-dark border-0 project-wrapper" 
								style={{padding: "1px"}}
							>
								<EntryCard
									data={entry.data}
									slug={`${slugBase}/${entry.slug}`}
								/>
							</li>
						))}
					</ul>
				</section>
				<aside className="col-md-2"></aside>
			</section>
        </>
    )
}

export default CollectionIndex