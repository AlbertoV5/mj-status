import { Icon } from "astro-icon"

export const HomeButton = () => {
    return (
        <span className="navbar-brand">
            <a className='btn btn-outline-secondary me-2' href='/'>Home</a>
        </span>
    )
}
export const ProjectsButton = ({dark=false}: {dark?: boolean}) => {
    const href = "/projects";
    return (
        <a className={`btn me-2 btn-outline-primary`} href={href}>
            Projects
        </a>
    )
}
export const ArticlesButton = ({dark=false}: {dark?: boolean}) => {
    const href = "/articles";
    return (
        <a className={`btn me-2 btn-outline-secondary`} href={href}>
            Articles
        </a>
    )
}
export const ThemeButton = () => {
    return (
        <button 
            id="bd-theme"
            className="btn btn-outline-secondary"
        >
            Theme
        </button>
    )
}