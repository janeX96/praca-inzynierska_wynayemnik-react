import React from 'react'
import { Component } from 'react';
import '../styles/App.css'
import LoadData from './LoadData';
import keycloak from '../auth/keycloak';


class Owner extends Component{
    constructor(props) {
        super(props);
        this.state = { 
          data:[]
        };
    }

    componentDidMount() {
      this.getData();
      console.log("CompDidM. data: ", this.state.data)
    }

    getData = () => {
      // http://localhost:8080/owner/premises
        fetch('http://localhost:8080/owner/premises',{ headers: { 'Authorization': ' Bearer ' + keycloak.token } })
        .then(response => {
          // console.log(response);
          return response.json();
        }).then(data => {

          data.map( prem => {
            if(prem.state === 'HIRED'){
              prem.state = 'wynajęty'
            }
          })
          this.setState({ data : data })
        // console.log(data);
        }).catch(err => {
          // Do something for an error here
          console.log("OJOJOJ- Error Reading data " + err);
        });
      }

      render(){
        return (
          <div>
            <h1>Moje lokale</h1>
              { this.state.data.length > 0 ? <LoadData data ={this.state.data}/> : "nope" }
          </div>
             
        );
      }
}


export default Owner;