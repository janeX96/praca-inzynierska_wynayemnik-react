import React from "react";
import "./Home.css";
import { useKeycloak } from "@react-keycloak/web";

function Home() {
  const { keycloak, initialized } = useKeycloak();

  return (
    //     <div>
    //     <h1>Home Page</h1>

    //     <strong>Anyone can access this page</strong>

    //     {initialized ?
    //       keycloak.authenticated && <pre >{JSON.stringify(keycloak, undefined, 2)}</pre>
    //       : <h2>keycloak initializing ....!!!!</h2>
    //     }
    //   </div>
    <div className="content-container-home">
      <h1>Wynajmuj na wysokim poziomie</h1>
    </div>
  );
}

export default Home;