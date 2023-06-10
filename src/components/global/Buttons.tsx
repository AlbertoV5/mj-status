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
        // <button
        //     id="bd-theme"
        //     type="button"
        //     className="btn btn-outline-secondary"
        // >
        //     Theme
        // </button>
        <section className="hstack gap-2">
            {/* <button className="btn btn-link nav-link py-2 px-0 px-lg-2 dropdown-toggle d-flex align-items-center" id="bd-theme" type="button" aria-expanded="false" data-bs-toggle="dropdown" data-bs-display="static" aria-label="Toggle theme (dark)">
                <svg className="bi my-1 theme-icon-active"><use href="#moon-stars-fill"></use></svg>
                <span className="d-lg-none ms-2" id="bd-theme-text">Toggle theme</span>
            </button> */}
            {/* <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="bd-theme-text"> */}
                <button type="button" className="btn" data-bs-theme-value="light">
                    Light
                </button>
                <button type="button" className="btn" data-bs-theme-value="dark">
                    Dark
                </button>
                {/* <li>
                <button type="button" className="dropdown-item d-flex align-items-center" data-bs-theme-value="auto" aria-pressed="false">
                    <svg className="bi me-2 opacity-50 theme-icon"><use href="#circle-half"></use></svg>
                        Auto
                    <svg className="bi ms-auto d-none"><use href="#check2"></use></svg>
                </button>
                </li> */}
            {/* </ul> */}
        </section>
    )
}