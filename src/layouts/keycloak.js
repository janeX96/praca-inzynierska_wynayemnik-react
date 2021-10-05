import Keycloak from 'keycloak-js'
const keycloakConfig = {
    
        realm: "wynayemnikAPI-dev",
        url: "http://188.68.236.141:8180/auth/",
        clientId: "wynayemnikAPI-dev"
  }

const keycloak = new Keycloak(keycloakConfig);
export default keycloak