import { useState, useEffect } from "react";
import { BsPlusSquareFill } from "react-icons/bs";
import { owner, admin, client, general } from "../../resources/urls";
import { GET } from "../../utilities/Request";
import LoadData from "../LoadData";
import BailForm from "./BailForm";

const BailsForRent = (props) => {
  const [bails, setBails] = useState();
  const [showBailForm, setShowBailForm] = useState(false);

  const getBails = () => {
    let urlByRole =
      props.roles[0] === "owner"
        ? owner.rent.allBailsPrefix
        : props.roles[0] === "admin"
        ? admin.rent.allBailsPrefix
        : "";

    GET(`${urlByRole}${props.rentId}${general.rent.allBailsSuffix}`).then(
      (res) => {
        res.map((b) => {
          let isCome = b.come;
          b.come = isCome ? "tak" : "nie";
        });
        setBails(res);
      }
    );
  };

  useEffect(() => {
    getBails();
  }, []);

  const handleReturn = () => {
    setShowBailForm(false);
  };
  const columns = [
    {
      Header: "Id",
      accessor: "bailId",
    },
    {
      Header: "Wartość",
      accessor: "cost",
    },
    {
      Header: "Rodzaj",
      accessor: "bailType",
    },
    {
      Header: "Opis",
      accessor: "description",
    },
    {
      Header: "Przychodząca",
      accessor: "come",
    },
  ];
  const initialState = { pageSize: 5, hiddenColumns: "bailId" };

  return (
    <>
      {showBailForm ? (
        <BailForm rentId={props.rentId} handleReturn={handleReturn} />
      ) : (
        <>
          <h1 className="content-container__title">Kaucje</h1>
          <div className="icon-container">
            <BsPlusSquareFill
              className="icon-container__new-icon"
              onClick={() => setShowBailForm(true)}
            />
          </div>
          <LoadData
            data={bails}
            columns={columns}
            initialState={initialState}
          />
          <div className="content-btns">
            <button
              className="content-container__button"
              onClick={props.handleReturn}
            >
              Powrót
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default BailsForRent;
