import { Link, useLocation } from "react-router-dom";

export default function PersonalWebsiteNavigation() {
  const { pathname } = useLocation();

  const links = [
    { label: "home", path: "/home", image: "./images/home.png" },
    { label: "about", path: "/about", image: "./images/about_me.png" },
    { label: "projects", path: "/projects", image: "./images/projects.png" },
    { label: "contact", path: "/contact", image: "./images/contact.png" },
  ];

  return (
    <nav className="navbar">
      <div className="container-fluid">
        <div className="row w-100 justify-content-between align-items-center">
          {links
            .filter((link) => !pathname.includes(link.label))
            .map((link) => (
              <div className="col text-center" key={link.path}>
                <Link to={link.path} className="nav-link">
                  <img
                    className="navbar-image"
                    src={link.image}
                    alt={link.label}
                  />
                </Link>
              </div>
            ))}
          <div className="col text-center">
            <Link
              to="https://github.com/al3xand3rw0ng/Portfolio"
              className="nav-link"
            >
              <img
                className="navbar-image"
                src={"./images/github.png"}
                alt={"github"}
              />
            </Link>
          </div>
          <div className="col text-center">
            <Link
              to="https://www.linkedin.com/in/a13xanderw0ng/"
              className="nav-link"
            >
              <img
                className="navbar-image"
                src={"./images/linkedin.png"}
                alt={"linkedin"}
              />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
