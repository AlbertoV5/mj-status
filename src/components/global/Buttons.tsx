import { Icon } from "astro-icon"
const githubLink = "https://github.com/albertoV5"


export const HomeButton = () => {
    return (
        <span className="navbar-brand">
            <a className='btn btn-outline-light me-2' href='/'>Home</a>
        </span>
    )
}
export const ProjectsButton = ({dark=false}: {dark?: boolean}) => {
    const href = "/projects";
    return (
        <a className={`btn me-2 ${dark ? "btn-outline-secondary" : "btn-outline-primary"}`} href={href}>
            Projects
        </a>
    )
}
export const ArticlesButton = ({dark=false}: {dark?: boolean}) => {
    const href = "/articles";
    return (
        <a className={`btn me-2 ${dark ? "btn-outline-dark" : "btn-outline-light"}`} href={href}>
            Articles
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