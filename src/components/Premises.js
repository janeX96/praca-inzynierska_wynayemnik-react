import React, { Component } from 'react'
 class Premises extends Component{
     render() {
         return (
             <div>
                 <p>-------------------</p>
                 <p>{this.props.info.premisesNumber}</p>
                 <p>{this.props.info.area}</p>
                 <p>{this.props.info.premisesLevel}</p>
                 <p>{this.props.info.state}</p>
                 <p>{this.props.info.type}</p>
             </div>
         )
     }
 }

 export default Premises;


//  <div>
//  <p>-------------------</p>
//  <p>{this.props.info.premisesNumber}</p>
//  <p>{this.props.info.area}</p>
//  <p>{this.props.info.premisesLevel}</p>
//  <p>{this.props.info.state}</p>
//  <p>{this.props.info.type}</p>
// </div>