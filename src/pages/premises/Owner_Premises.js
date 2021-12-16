import React, { useState, useEffect } from "react";
import LoadData from "../LoadData";
import keycloak from "../../auth/keycloak";
import "../../styles/App.scss";
import PremisesDetails from "./PremisesDetails/PremisesDetails";
import { Link } from "react-router-dom";
import { BsPlusSquareFill } from "react-icons/bs";
import { owner } from "../../resources/urls";
import { GET } from "../../utilities/Request";

const Owner_Premises = () => {
  const [state, setState] = useState({
    data: [],
    choosenId: -1,
    deleteURL: "",
    deletedMessage: "",
  });

  const getData = async () => {
    let deleteURL = "";

    deleteURL = owner.premisesDelete;

    GET(owner.premises).then((res) => {
      res.map((prem) => {
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
      setState({ ...state, deleteURL: deleteURL, data: res });
    });
  };

  const findDataById = (id) => {
    // console.log("Odczyt: ", state.data);
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
    });

    setTimeout(() => {
      setState({
        ...state,
        deletedMessage: "",
      });
    }, 3000);
  };

  const columns = [
    {
      Header: "Id",
      accessor: "premisesId",
    },
    {
      Header: "Adres",
      accessor: "location.locationName",
    },
    {
      Header: "Numer",
      accessor: "premisesNumber",
    },
    {
      Header: "m2",
      accessor: "area",
    },
    {
      Header: "Poziom",
      accessor: "premisesLevel",
    },
    {
      Header: "Stan",
      accessor: "state",
    },
    {
      Header: "Rodzaj",
      accessor: "premisesType.type",
    },
    {
      Header: "Akcja",
      accessor: "action",
      Cell: ({ cell }) => (
        <button
          className="content-container__button"
          value={cell.row.values.actions}
          onClick={() => handleAction(cell.row.values.premisesId)}
        >
          Szczegóły
        </button>
      ),
    },
  ];
  const initialState = { pageSize: 5, hiddenColumns: "premisesId" };

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
          <h1 className="content-container__title">Moje lokale</h1>

          <div>
            <Link to="/owner-premises-new">
              <div className="icon-container">
                <BsPlusSquareFill className="icon-container__new-icon" />
              </div>
            </Link>
          </div>

          {state.data.length > 0 ? (
            <LoadData
              data={state.data}
              columns={columns}
              initialState={initialState}
            />
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
