import React from 'react'
import { Component } from 'react';
import '../styles/App.css'
import LoadData from './LoadData';



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
      
        fetch('/exampleData.json',{ headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
         }})
        .then(response => {
          // console.log(response);
          return response.json();
        }).then(data => {
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
              { this.state.data.length > 0 ? <LoadData data ={this.state.data}/> : "sdds" }
          </div>
             
        );
      }
}


export default Owner;