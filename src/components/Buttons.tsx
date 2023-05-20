import React from 'react'

export const HomeButton = () => {
    return (
        <span className="navbar-brand">
            <a className='btn btn-outline-light me-2' href='/'>Home</a>
        </span>
    )
}
export const BuildButton = () => {
    return (
        <a className="btn btn-outline-light me-2" href="/stats/mj">
            Stats
        </a>
    )
}
export const LoginButton = () => {
    return (
        <a className="btn btn-outline-light me-2" href="/login">
            Login
        </a>
    )
}