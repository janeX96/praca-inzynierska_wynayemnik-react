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
import dropdown from "react-simple-dropdown";

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
                  {AuthorizedFunction(["owner"]) && (
                    <li>
                      <Link to="/owner-premises">
                        <p
                          onClick={() => {
                            changeRole("Owner");
                            dropdown.hide();
                          }}
                        >
                          Wynajemca
                        </p>{" "}
                      </Link>
                    </li>
                  )}
                  {AuthorizedFunction(["administrator"]) && (
                    <li>
                      <Link to="/">
                        <p
                          onClick={() => {
                            changeRole("Admin");
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
                          changeRole("Client");
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
