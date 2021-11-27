import { useState, useEffect } from "react";
import keycloak from "../../auth/keycloak";

const LocationDetails = (props) => {
  const [location, setLocation] = useState();

  const getResources = async () => {
    const response = await fetch("/resources.json");
    const resources = await response.json();
    return resources;
  };

  const getData = async () => {
    getResources().then((res) => {
      const url = res.urls.owner.locationDetails + props.id;
      fetch(url, {
        headers: { Authorization: " Bearer " + keycloak.token },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setLocation(data);
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
      <h1 className="content-title">Lokacja id={props.id}</h1>
    </>
  );
};

export default LocationDetails;
