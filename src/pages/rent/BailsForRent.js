import { useState, useEffect } from "react";
import { owner, admin, client, general } from "../../resources/urls";
import { GET } from "../../utilities/Request";
import LoadData from "../LoadData";

const BailsForRent = (props) => {
  const [bails, setBails] = useState();

  const getBails = () => {
    let urlByRole =
      props.roles[0] === "owner"
        ? owner.rent.allBailsPrefix
        : props.roles[0] === "admin"
        ? admin.rent.allBailsPrefix
        : "";

    GET(`${urlByRole}${props.rentId}${general.rent.allBailsSuffix}`).then(
      (res) => {
        setBails(res);
      }
    );
  };

  useEffect(() => {
    getBails();
  }, []);

  const columns = [
    {
      Header: "Id",
      accessor: "rentId",
    },
    {
      Header: "Adres",
      accessor: "premises.location.locationName",
    },
    {
      Header: "Numer",
      accessor: "premises.premisesNumber",
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
      Header: "Początek",
      accessor: "startDate",
    },
    {
      Header: "Koniec",
      accessor: "endDate",
    },
    {
      Header: "Akcja",
      accessor: "action",
      //   Cell: ({ cell }) => (
      //     <button
      //       className="content-container__button"
      //       value={cell.row.values.actions}
      //       onClick={() => handleAction(cell.row.values.rentId)}
      //     >
      //       Szczegóły
      //     </button>
      //   ),
    },
  ];
  const initialState = { pageSize: 5, hiddenColumns: "rentId" };

  return <>bails</>;
};

export default BailsForRent;
