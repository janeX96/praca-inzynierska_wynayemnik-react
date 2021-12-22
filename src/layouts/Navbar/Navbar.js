import React, { useState, useEffect } from "react";
import { ReactComponent as MenuItem } from "../../images/icons/menu-svgrepo-com.svg";
import "./Navbar.scss";
import logo from "../../images/logo wynayemnik.png";
import Login from "../../components/Login/Login.js";
import Dropdown, {
  DropdownTrigger,
  DropdownContent,
} from "react-simple-dropdown";
import { Link } from "react-router-dom";
import AuthorizedFunction from "../../auth/AuthorizedFunction";
import UserIcon from "../../images/icons/icon_user1.png";
import keycloak from "../../auth/keycloak";
import roles from "../../resources/roles";

const Navbar = () => {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);
  const [role, setRole] = useState("");
  const changeRole = (role) => setRole(role);

  let dropdown = null;
  return (
    <div className="header">
      <div className="logo-nav">
        <div className="logo-container">
          <a href="#">
            <img src={logo} alt="" style={{ height: "50px" }} />
          </a>
        </div>
        <ul className={click ? "nav-options active" : "nav-options"}>
          <li className="option">
            <Link to="/" className="nav-links" onClick={closeMobileMenu}>
              Strona główna
            </Link>
          </li>
          {role === roles.OWNER ? (
            <>
              <li className="option">
                <Link
                  to="/owner-premises"
                  className="nav-links"
                  onClick={closeMobileMenu}
                >
                  Moje lokale
                </Link>
              </li>
              <li className="option">
                <Link
                  to="/owner-locations"
                  className="nav-links"
                  onClick={closeMobileMenu}
                >
                  Moje Lokacje
                </Link>
              </li>
              <li className="option">
                <Link to="/" className="nav-links" onClick={closeMobileMenu}>
                  Moje wynajmy
                </Link>
              </li>
              <li className="option">
                <Link to="/" className="nav-links" onClick={closeMobileMenu}>
                  Administratorzy
                </Link>
              </li>
            </>
          ) : role === roles.ADMIN ? (
            <>
              <li className="option">
                <Link to="/" className="nav-links" onClick={closeMobileMenu}>
                  Wynajmy
                </Link>
              </li>
              <li className="option">
                <Link to="/" className="nav-links" onClick={closeMobileMenu}>
                  Lokale
                </Link>
              </li>
            </>
          ) : role === roles.CLIENT ? (
            <li className="option">
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

      {/* <ul className="signin-up"> */}
      {/* </ul> */}
      <div className="mobile-menu" onClick={handleClick}>
        {click ? "X" : <MenuItem className="menu-icon" />}
      </div>
    </div>
  );
};

export default Navbar;
