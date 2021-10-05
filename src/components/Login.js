import React from 'react';
import { useKeycloak } from '@react-keycloak/web';

const Login = () => {
    const {keycloak, initialized} = useKeycloak();
    return (
        <div>
             {keycloak && !keycloak.authenticated &&
                 <button onClick={() => keycloak.login()}>Login</button>
            }

            {keycloak && keycloak.authenticated &&
                    <button onClick={() => keycloak.logout()}>
                        Logout ({keycloak.tokenParsed.preferred_username })  
                    </button>
            }
        </div>
    )
}

export default Login