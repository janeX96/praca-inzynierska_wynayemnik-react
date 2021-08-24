import React from 'react';
import '../App.css';
import './ContentSection.css'
import { Button } from './Button';

function ContentSection() {
    return (
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
    )
}

export default ContentSection
