import { useKeycloak } from "@react-keycloak/web";
import keycloak from "./keycloak";

export default function AuthorizedFunction(roles) {
  //   const [keycloak, initialized] = useKeycloak();

  const isAutherized = () => {
    if (keycloak && roles) {
      return roles.some((r) => {
        const realm = keycloak.hasRealmRole(r);
        const resource = keycloak.hasResourceRole(r);
        return realm || resource;
      });
    }
    return false;
  };

  return isAutherized();
}
