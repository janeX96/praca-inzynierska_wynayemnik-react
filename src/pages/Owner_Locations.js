import { useEffect, useState } from "react";
import keycloak from "../auth/keycloak";

const Owner_Locations = () => {
  const [locations, setLocations] = useState([]);

  const getResources = async () => {
    const response = await fetch("/resources.json");
    const resources = await response.json();
    return resources;
  };

  const getData = async () => {
    getResources().then((res) => {
      fetch(res.urls.owner.locations, {
        headers: { Authorization: " Bearer " + keycloak.token },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setLocations(data);
        })
        .catch((err) => {
          console.log("Error Reading data " + err);
        });
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div>Lokacje</div>
    </>
  );
};

export default Owner_Locations;
