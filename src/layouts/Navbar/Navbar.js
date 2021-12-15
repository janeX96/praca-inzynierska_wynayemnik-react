import React, { useState, useEffect, useRef } from "react";
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
import roles from "../../resources/roles";

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const [role, setRole] = useState("");
  const [menu, setMenu] = useState();

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

  let dropdown = null;

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
            {role === roles.OWNER ? (
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
                  <Link
                    to="/owner-locations"
                    className="nav-links"
                    onClick={closeMobileMenu}
                  >
                    Moje Lokacje
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
            ) : role === roles.ADMIN ? (
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
            ) : role === roles.CLIENT ? (
              <li className="nav-item">
                <Link to="/" className="nav-links" onClick={closeMobileMenu}>
                  Moje wynajęcia
                </Link>
              </li>
            ) : (
              ""
            )}
          </ul>
        </div>
        {keycloak.authenticated ? (
          <>
            <a>{keycloak.tokenParsed.preferred_username}</a>
            <Dropdown ref={(foo) => (dropdown = foo)}>
              <DropdownTrigger>
                <img src={UserIcon} alt="" />
              </DropdownTrigger>
              <DropdownContent>
                <ul>
                  <li>
                    <Link
                      onClick={() => {
                        dropdown.hide();
                      }}
                      to="/user-profile"
                    >
                      <p>Profil</p>
                    </Link>
                  </li>
                  {AuthorizedFunction([roles.OWNER]) && (
                    <li>
                      <Link to="/owner-premises">
                        <p
                          onClick={() => {
                            changeRole(roles.OWNER);
                            dropdown.hide();
                          }}
                        >
                          Wynajemca
                        </p>{" "}
                      </Link>
                    </li>
                  )}
                  {AuthorizedFunction([roles.ADMIN]) && (
                    <li>
                      <Link to="/">
                        <p
                          onClick={() => {
                            changeRole(roles.ADMIN);
                            dropdown.hide();
                          }}
                        >
                          Administrator
                        </p>
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link to="/">
                      <p
                        onClick={() => {
                          changeRole(roles.CLIENT);
                          dropdown.hide();
                        }}
                      >
                        Najemca
                      </p>
                    </Link>
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
              <p>Rejestracja</p>
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;
