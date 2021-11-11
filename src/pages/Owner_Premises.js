import React, { useState, useEffect } from "react";
import LoadData from "./LoadData";
import keycloak from "../auth/keycloak";
import "../styles/App.css";
import PremisesDetails from "./PremisesDetails/PremisesDetails";
import { Link } from "react-router-dom";

const Owner_Premises = () => {
  const [state, setState] = useState({
    data: [],
    choosenId: -1,
    deleteURL: "",
    deletedMessage: "",
  });

  //pobiernie danych
  // useEffect(() => {
  //   getData();
  // }, []);

  // pobranie danych dot. endpointów
  const getResources = async () => {
    const response = await fetch("/resources.json");
    const resources = await response.json();
    return resources;
  };

  const getData = async () => {
    let deleteURL = "";
    getResources().then((res) => {
      deleteURL = res.urls.owner.premisesDelete;

      //pobranie danych z wyciągniętego adresu url
      fetch(res.urls.owner.premises, {
        headers: { Authorization: " Bearer " + keycloak.token },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          data.map((prem) => {
            if (prem.state === "HIRED") {
              prem.state = "wynajęty";
            } else {
              prem.state = "wolny";
            }

            if (prem.furnished) {
              prem.furnished = "tak";
            } else {
              prem.furnished = "nie";
            }
          });
          setState({ ...state, deleteURL: deleteURL, data: data });
        })
        .catch((err) => {
          console.log("Error Reading data " + err);
        });
    });
  };

  const findDataById = (id) => {
    console.log("Odczyt: ", state.data);
    const res = state.data.find((premises) => {
      return premises.premisesId === id;
    });

    return res;
  };

  //wybierając dany lokal zaamiętuję jego id, jeśi id jest >=0
  // to wyświetlam info, jeśli nie to pokazuje liste lokali
  const handleAction = (id) => {
    setState({
      ...state,
      choosenId: id,
    });
  };

  useEffect(() => {
    getData();
  }, [state.choosenId]);

  const deleteShowMessage = (res) => {
    handleAction(-1);
    const msg = res
      ? "Lokal został usunięty"
      : "Nie udało się usunąć lokalu...";
    setState({
      ...state,
      deletedMessage: msg,
      // toReload: true,
    });

    setTimeout(() => {
      setState({
        ...state,
        deletedMessage: "",
      });
    }, 3000);
  };

  return (
    <div className="content-container">
      {state.choosenId >= 0 ? (
        <PremisesDetails
          key={state.choosenId}
          action={handleAction}
          deleteURL={state.deleteURL}
          deleteShowMessage={(res) => deleteShowMessage(res)}
          reloadData={() => getData()}
          {...findDataById(state.choosenId)}
        />
      ) : (
        <>
          <h1 className="content-title">Moje lokale</h1>
          <div>
            <Link to="/owner-premises-new">
              <button className="add-button">Dodaj nowy</button>
            </Link>
          </div>
          {state.data.length > 0 ? (
            <LoadData data={state.data} action={handleAction} />
          ) : (
            "brak"
          )}
        </>
      )}
      {state.deletedMessage && (
        <h2 className="submit-message">{state.deletedMessage}</h2>
      )}
    </div>
  );
};

export default Owner_Premises;
