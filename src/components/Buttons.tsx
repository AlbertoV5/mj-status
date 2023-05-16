import React from 'react'

export const HomeButton = () => {
    return (
        <span className="navbar-brand">
            <a className='btn btn-outline-light me-2' href='/'>Promptry</a>
        </span>
    )
}
export const BuildButton = () => {
    return (
        <a className="btn btn-outline-light me-2" href="/build">
            Build
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