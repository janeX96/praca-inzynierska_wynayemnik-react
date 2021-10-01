import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import { Button } from '../components/Button';
import '../styles/Navbar.css';

function Navbar() {
    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    const showButton = () =>{
        if(window.innerWidth <=960){
            setButton(false)
        }else{
            setButton(true);
        }
    };

    useEffect(()=>{
        showButton()
    },[]);

    window.addEventListener('resize',showButton);
    return (
        <>
           <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
                    WYNAYEMNIK.PL
                </Link>
                <div className='menu-icon' onClick={handleClick}>
                    <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
                </div>
                <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                    <li className='nav-item'>
                        <Link to="/" className='nav-links' onClick={closeMobileMenu}>
                        Strona główna
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link to="/najemca" className='nav-links' onClick={closeMobileMenu}>
                        Najemca
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link to="/wlasciciel" className='nav-links' onClick={closeMobileMenu}>
                        Właściciel
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link to="/sign-up" className='nav-links-mobile' onClick={closeMobileMenu}>
                        Logowanie
                        </Link>
                    </li>
                </ul>
                {button && <Button buttonStyle='btn--outline' >Logowanie</Button>}
            </div>
           </nav>
        </>
    )
}

export default Navbar
