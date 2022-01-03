import React, { useState, useEffect } from "react";
import LoadData from "../LoadData";
import "../../styles/App.scss";
import PremisesDetails from "./PremisesDetails/PremisesDetails";
import { Link } from "react-router-dom";
import { BsPlusSquareFill } from "react-icons/bs";
import { owner, admin } from "../../resources/urls";
import { GET } from "../../utilities/Request";
import { toast } from "react-toastify";
import roles from "../../resources/roles";

const Owner_Premises = (props) => {
  const [state, setState] = useState({
    data: [],
  });

  const [chosenId, setChosenId] = useState(-1);

  const getData = async () => {
    let urlByRole =
      props.roles[0] === "owner"
        ? owner.premises
        : props.roles[0] === "admin"
        ? admin.premises
        : "";

    GET(urlByRole).then((res) => {
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
      setState({ ...state, data: res });
    });
  };

  //wybierając dany lokal zaamiętuję jego id, jeśi id jest >=0
  // to wyświetlam info, jeśli nie to pokazuje liste lokali
  const handleAction = (id) => {
    setChosenId(id);
  };

  useEffect(() => {
    getData();
  }, [chosenId]);

  const deleteShowMessage = (res) => {
    handleAction(-1);
    res
      ? toast.success("Lokal został usunięty")
      : toast.error("Nie udało się usunąć lokalu...");
    // console.log("Przeladowanie: ", chosenId);
    getData();
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
      {chosenId >= 0 ? (
        <PremisesDetails
          key={chosenId}
          action={handleAction}
          deleteShowMessage={(res) => deleteShowMessage(res)}
          reloadData={() => getData()}
          premisesId={chosenId}
          roles={props.roles}
        />
      ) : (
        <>
          <h1 className="content-container__title">Moje lokale</h1>

          {props.roles[0] === "owner" && (
            <div>
              <Link to="/owner-premises-new">
                <div className="icon-container">
                  <BsPlusSquareFill className="icon-container__new-icon" />
                </div>
              </Link>
            </div>
          )}

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
    </div>
  );
};

export default Owner_Premises;
