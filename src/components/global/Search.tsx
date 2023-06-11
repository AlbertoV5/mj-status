import React from 'react'
import Fuse from 'fuse.js'
import { useState } from 'react';

const Search = ({items}: {items: string[]}) => {
    const fuse = new Fuse(items, {});
    const [results, setResults] = useState(() => items.slice(0, 10));
    return (
        <>
            <div className="input-group">
                <span className="input-group-text">Tags</span>
                <input 
                    id="tag-search" 
                    type="text"
                    className="form-control"
                    defaultValue={''}
                    placeholder="search"
                    onInput={(e) => {
                        const value = e.currentTarget.value;
                        value ? 
                        setResults(fuse.search(value).map(x => x.item))
                        : setResults(items.slice(0, 10));
                    }}
                />
            </div>
            <ul className='list-group'>
                {
                    results.map((r, i) => (
                        <a key={r} className='text-decoration-none text-body rounded' href={`?tag=${r}`}>
                            <li className='list-group-item'>
                                {r}
                            </li>
                        </a>
                    ))
                }
            </ul>
        </>
    )
}

export default Search