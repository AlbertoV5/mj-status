import React from 'react'

import { HomeButton, BuildButton, LoginButton } from './Buttons'

export const NavBar = () => {
    return (
        <section className="navbar navbar bg-dark shadow mb-2">
            <section className="container-fluid px-4 d-flex justify-content-between">
                <HomeButton></HomeButton>
                <section className="d-flex">
                    <BuildButton></BuildButton>
                    {/* <LoginButton></LoginButton> */}
                </section>
            </section>
        </section>
    )
}