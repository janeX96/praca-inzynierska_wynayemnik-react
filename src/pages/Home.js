import React from 'react';
import '../styles/App.css';
import { Button } from '../components/Button';


function Home(){
    
    return(
        <div className='content-container'>
           <h1>Wynajmuj na wysokim poziomie</h1>
           <div className="content-btns">
           <Button 
                className='btns' 
                buttonStyle='btn--primary'
                buttonSize='btn--large'>
                    Logowanie
                </Button>
           </div>
        </div>

    );
}

export default Home;