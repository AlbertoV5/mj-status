import { useState, useEffect } from "react";

export const HomeButton = () => {
    return (
        <span className="navbar-brand">
            <a className='btn btn-outline-secondary me-2' href='/'>Home</a>
        </span>
    )
}
export const ProjectsButton = ({outline=false}: {outline?: boolean}) => {
    const href = "/projects";
    return (
        <a className={`btn me-2 ${outline ? 'btn-outline-primary' : ''}`} href={href}>
            Projects
        </a>
    )
}
export const ArticlesButton = ({outline=false}: {outline?: boolean}) => {
    const href = "/articles";
    return (
        <a className={`btn me-2 ${outline ? 'btn-outline-secondary' : ''}`} href={href}>
            Articles
        </a>
    )
}
export const ThemeButton = () => {
    // Patch for Bootstrap theme icon. Could be much better.
    const [theme, setTheme] = useState('light');
    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    }
    useEffect(() => {
        setTheme(localStorage.getItem('theme') || 'light');
    }, []);
    return (
        <>
        {
            theme === 'dark' ?
            <button type="button" onClick={toggleTheme} className="btn" data-bs-theme-value="light">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path fill="currentColor" d="M116 32V16a12 12 0 0 1 24 0v16a12 12 0 0 1-24 0Zm80 96a68 68 0 1 1-68-68a68.07 68.07 0 0 1 68 68Zm-24 0a44 44 0 1 0-44 44a44.05 44.05 0 0 0 44-44ZM51.51 68.49a12 12 0 1 0 17-17l-12-12a12 12 0 0 0-17 17Zm0 119l-12 12a12 12 0 0 0 17 17l12-12a12 12 0 1 0-17-17ZM196 72a12 12 0 0 0 8.49-3.51l12-12a12 12 0 0 0-17-17l-12 12A12 12 0 0 0 196 72Zm8.49 115.51a12 12 0 0 0-17 17l12 12a12 12 0 0 0 17-17ZM44 128a12 12 0 0 0-12-12H16a12 12 0 0 0 0 24h16a12 12 0 0 0 12-12Zm84 84a12 12 0 0 0-12 12v16a12 12 0 0 0 24 0v-16a12 12 0 0 0-12-12Zm112-96h-16a12 12 0 0 0 0 24h16a12 12 0 0 0 0-24Z"/></svg>
            </button>
            :
            <button type="button" onClick={toggleTheme} className="btn" data-bs-theme-value="dark">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path fill="currentColor" d="M236.37 139.4a12 12 0 0 0-12-3A84.07 84.07 0 0 1 119.6 31.59a12 12 0 0 0-15-15a108.86 108.86 0 0 0-54.91 38.48A108 108 0 0 0 136 228a107.09 107.09 0 0 0 64.93-21.69a108.86 108.86 0 0 0 38.44-54.94a12 12 0 0 0-3-11.97Zm-49.88 47.74A84 84 0 0 1 68.86 69.51a84.93 84.93 0 0 1 23.41-21.22Q92 52.13 92 56a108.12 108.12 0 0 0 108 108q3.87 0 7.71-.27a84.79 84.79 0 0 1-21.22 23.41Z"/></svg>
            </button>
        }
        </>
    )
}
export const ContactButton = () => {
    const href = "https://github.com/AlbertoV5/promptry";
    return (
        <a className="btn me-2" 
            href={href}
            target="_blank"
            rel="noreferrer"
        >
            <svg width="24" height="24" viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"/></svg>
        </a>
    )
}