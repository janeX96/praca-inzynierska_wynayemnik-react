import React from 'react'
import { useState, useEffect } from 'react'
import '../styles/App.css'
import Table from '../components/Table'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import Keycloak from 'keycloak-js'

const Owner = () => {
    const [cells, setCells] = useState([]);

    const getData = async () => {
        const resp = await fetch("/exampleData.json");
        const data = await resp.json();
        setCells(data);
      };

    
      const columns = React.useMemo(
        () => [
          {
            Header: "Adres",
            accessor: "location" // accessor is the "key" in the data
          },
          {
            Header: "Rodzaj",
            accessor: "type"
          },
          {
            Header: "Status",
            accessor: "status"
          }
        ],
        []
      );

      useEffect(() => {

        getData();
      }, []);
      const data = React.useMemo(() => cells, []);

      return(
       
          <div>
            <h1>Strona właściciela</h1>
              {cells && <Table columns={columns} data={data} />}
          </div>
         
        
      )
}

export default Owner;