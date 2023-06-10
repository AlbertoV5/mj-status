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
        <section className="hstack gap-2">
            <button type="button" className="btn" data-bs-theme-value="light">
                Light
            </button>
            <button type="button" className="btn" data-bs-theme-value="dark">
                Dark
            </button>
        </section>
    )
}