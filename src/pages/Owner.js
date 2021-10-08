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
    }

    // pobranie danych dot. endpointów
    async getResources(){
      const response = await fetch('/resources.json')
      const resources = await response.json();

      return resources;
    }

    getData = () => {
      
      this.getResources().then( res =>{
      
        fetch(res.urls.owner.premises,{ headers: { 'Authorization': ' Bearer ' + keycloak.token } })
        .then(response => {
          return response.json();
        }).then(data => {
          data.map( prem => {
            if(prem.state === 'HIRED'){
              prem.state = 'wynajęty'
            }
          })
          this.setState({ data : data })
        }).catch(err => {
          console.log("Error Reading data " + err);
        });
      }) 
    }

      render(){
        return (
          <div>
            <h1>Moje lokale</h1>
              { this.state.data.length > 0 ? <LoadData data ={this.state.data}/> : "brak" }
          </div>
             
        );
      }
}


export default Owner;