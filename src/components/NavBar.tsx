import React from 'react'

import { HomeButton, ProjectsButton, BlogButton } from './Buttons'

const Buttons = ({mobile=false}: {mobile?: boolean}) => (
    <section className={`container-fluid ${mobile ? 'd-flex d-md-none' : 'd-none d-md-flex'} justify-content-between`}>
        <HomeButton></HomeButton>
        <section className="hstack gap-1">
            <ProjectsButton></ProjectsButton>
            <BlogButton></BlogButton>
        </section>
    </section>
)
export const NavBar = () => {
    return (
        <section className="navbar bg-dark shadow mb-2">
            <section className="container-fluid">
                <Buttons></Buttons>
                <section className='d-flex d-md-none'>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation">
                        <svg viewBox="0 0 100 80" width="24" height="24">
                            <rect        width="100" height="10" fill="#eee"></rect>
                            <rect y="30" width="100" height="10" fill="#eee"></rect>
                            <rect y="60" width="100" height="10" fill="#eee"></rect>
                        </svg>
                    </button>
                </section>
            </section>
            <section className="collapse" id="navbarToggleExternalContent">
                <section className='container-fluid pt-2'>
                    <Buttons mobile></Buttons> 
                </section>
            </section>
        </section>
    )
}