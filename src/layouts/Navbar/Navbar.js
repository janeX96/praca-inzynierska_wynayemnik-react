import React, { useState, useEffect } from "react";
import { ReactComponent as MenuItem } from "../../images/icons/menu-svgrepo-com.svg";
import "./Navbar.scss";
import logo from "../../images/wynayemnik logo2.png";
import { ReactComponent as CloseMenuItem } from "../../images/icons/close-svgrepo-com.svg";
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
  const [role, setRole] = useState(keycloak.authenticated ? roles.OWNER : "");
  const changeRole = (role) => setRole(role);

  let dropdown = null;
  return (
    <div className="header">
      <div className="logo-nav">
        <div className="logo-container">
          <Link to="/" className="nav-links" onClick={closeMobileMenu}>
            <img src={logo} alt="" style={{ height: "85px" }} />
          </Link>
        </div>
        <ul className={click ? "nav-options active" : "nav-options"}>
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
                <Link
                  to="/owner-rents"
                  className="nav-links"
                  onClick={closeMobileMenu}
                >
                  Moje wynajmy
                </Link>
              </li>
              <li className="option">
                <Link
                  to="/owner-administrators"
                  className="nav-links"
                  onClick={closeMobileMenu}
                >
                  Administratorzy
                </Link>
              </li>
            </>
          ) : role === roles.ADMIN ? (
            <>
              <li className="option">
                <Link
                  to="/admin-premises"
                  className="nav-links"
                  onClick={closeMobileMenu}
                >
                  Lokale
                </Link>
              </li>
              <li className="option">
                <Link
                  to="/admin-rents"
                  className="nav-links"
                  onClick={closeMobileMenu}
                >
                  Wynajmy
                </Link>
              </li>
            </>
          ) : role === roles.CLIENT ? (
            <li className="option">
              <Link
                to="/client-rents"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Moje wynajęcia
              </Link>
            </li>
          ) : (
            ""
          )}
        </ul>
      </div>

      <div className="right-section">
        {keycloak.authenticated ? (
          <div className="user-section">
            <div
              className="user-info"
              style={{
                marginTop: "15px",
                marginRight: "15px",
              }}
            >
              <div className="email">
                {keycloak.tokenParsed.preferred_username}
              </div>

              <div className="panel-name">
                Panel{" "}
                {role === "owner"
                  ? "właściciela"
                  : role === "admin"
                  ? "administratora"
                  : "klienta"}{" "}
              </div>
            </div>
            <div className="user-menu">
              <Dropdown ref={(foo) => (dropdown = foo)}>
                <DropdownTrigger>
                  <div className="user-menu__user-icon">
                    <img src={UserIcon} alt="" />
                  </div>
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
                        <Link to="/">
                          <p
                            onClick={() => {
                              changeRole(roles.OWNER);
                              dropdown.hide();
                            }}
                          >
                            Wynajmujący
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
            </div>
          </div>
        ) : (
          <div className="login-btns">
            <div className="login-btns__btn">
              <Login />
            </div>
            <Link className="login-btns__btn" to="/registration">
              Rejestracja
            </Link>
          </div>
        )}
        <div className="mobile-menu" onClick={handleClick}>
          {click ? (
            <CloseMenuItem className="menu-icon" />
          ) : (
            <MenuItem className="menu-icon" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
