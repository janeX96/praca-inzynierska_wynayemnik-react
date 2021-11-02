import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import Login from "../../components/Login/Login.js";
import Dropdown, {
  DropdownTrigger,
  DropdownContent,
} from "react-simple-dropdown";
import AuthorizedFunction from "../../auth/AuthorizedFunction";
import UserIcon from "../../images/icons/icon_user1.png";
import keycloak from "../../auth/keycloak";

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const [role, setRole] = useState("");

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const changeRole = (role) => setRole(role);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener("resize", showButton);
  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            WYNAYEMNIK.PL
          </Link>
          <div className="menu-icon" onClick={handleClick}>
            <i className={click ? "fas fa-times" : "fas fa-bars"} />
          </div>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <Link to="/" className="nav-links" onClick={closeMobileMenu}>
                Strona główna
              </Link>
            </li>
            {role === "Owner" ? (
              <>
                <li className="nav-item">
                  <Link
                    to="/owner-premises"
                    className="nav-links"
                    onClick={closeMobileMenu}
                  >
                    Moje lokale
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/" className="nav-links" onClick={closeMobileMenu}>
                    Moje wynajmy
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/" className="nav-links" onClick={closeMobileMenu}>
                    Administratorzy
                  </Link>
                </li>
              </>
            ) : role === "Admin" ? (
              <>
                <li className="nav-item">
                  <Link to="/" className="nav-links" onClick={closeMobileMenu}>
                    Wynajmy
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/" className="nav-links" onClick={closeMobileMenu}>
                    Lokale
                  </Link>
                </li>
              </>
            ) : role === "Client" ? (
              <li className="nav-item">
                <Link to="/" className="nav-links" onClick={closeMobileMenu}>
                  Moje wynajęcia
                </Link>
              </li>
            ) : (
              ""
            )}
          </ul>
          {/* {button && <Login />} */}
        </div>
        {keycloak.authenticated ? (
          <>
            <a>{keycloak.tokenParsed.preferred_username}</a>
            <Dropdown>
              <DropdownTrigger>
                <img src={UserIcon} alt="" />
              </DropdownTrigger>
              <DropdownContent>
                <ul>
                  <li>
                    <Link to="/user-profile">
                      <a>Profil</a>
                    </Link>
                  </li>
                  {AuthorizedFunction(["owner"]) && (
                    <li>
                      <a onClick={() => changeRole("Owner")}>Wynajemca</a>
                    </li>
                  )}
                  {AuthorizedFunction(["administrator"]) && (
                    <li>
                      <a onClick={() => changeRole("Admin")}>Administrator</a>
                    </li>
                  )}
                  <li>
                    <a onClick={() => changeRole("Client")}>Najemca</a>
                  </li>
                  <li>
                    <a>
                      <Login />
                    </a>
                  </li>
                </ul>
              </DropdownContent>
            </Dropdown>
          </>
        ) : (
          <div className="login-btns">
            <a>
              <Login />
            </a>

            <Link to="/registration">
              <a>Rejestracja</a>
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;
