import { Icon } from "astro-icon"
const githubLink = "https://github.com/albertoV5"


export const HomeButton = () => {
    return (
        <span className="navbar-brand">
            <a className='btn btn-outline-light me-2' href='/'>Home</a>
        </span>
    )
}
export const ProjectsButton = () => {
    return (
        <a className="btn btn-outline-light me-2" href="/projects">
            Projects
        </a>
    )
}
export const BlogButton = () => {
    return (
        <a className="btn btn-primary me-2" href="/blog">
            Blog
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