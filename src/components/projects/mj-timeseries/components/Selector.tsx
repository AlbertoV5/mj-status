import type React from 'react'
import type { Key } from '../utils'

interface SelectorProps {
    selected: {key: Key, sel: boolean}[]
    setSelected: React.Dispatch<React.SetStateAction<{key: Key, sel: boolean}[]>>
    keyLabels: {key: Key, label: string}[]
    colors: {[key: string]: string}
    storeSelected: (selected: {key: string, sel: boolean}[]) => void;
}

export const Selector = ({selected, setSelected, keyLabels, colors, storeSelected}: SelectorProps) => {
    return (
        <section className="container hstack gap-2 d-flex justify-content-center align-content-center flex-wrap">
            <div className='form-check form-check-inline'>
                <input
                    className='btn-check' 
                    id={`btn-check-unselect`}
                    type='checkbox'
                    onChange={(e) => setSelected(prev => {
                        const s = prev.map((s) => ({...s, sel: false}));
                        storeSelected(s);
                        return s;
                    })}
                    checked={!selected.find(({sel}) => sel === true)}
                />
                <label className='btn btn-outline-light' htmlFor={`btn-check-unselect`}>Reset</label>
            </div>
        {
            keyLabels.map(({key: k, label}) => (
                <div key={k} className='form-check form-check-inline hstack gap-2'>
                    <input
                        className='btn-check' 
                        id={`btn-check-${k}`}
                        type='checkbox'
                        onChange={() => setSelected(prev => {
                            const s = [...prev.filter(({key}) => key !== k), {key: k, sel: !prev.find(({key}) => key === k)?.sel}]
                            storeSelected(s);
                            return s;
                        })}
                        checked={selected.find(({key}) => key === k)?.sel}
                    />
                    <label className='btn btn-outline-primary'htmlFor={`btn-check-${k}`}>{label}</label>
                    <svg style={{width: '15px', height: '15px', borderRadius: '50%', backgroundColor: colors[k as Key]}}></svg>
                </div>
            ))
        }
        </section>
    )
}
