import { useCallback } from "react";
import { useState, useEffect } from "react";
import { AiFillEdit } from "react-icons/ai";
import { BsPlusSquareFill, BsTrashFill } from "react-icons/bs";
import { toast } from "react-toastify";
import { owner, admin, general } from "../../resources/urls";
import { DELETE, GET, PATCH } from "../../utilities/Request";
import LoadData from "../LoadData";
import BailForm from "./BailForm";

const BailsForRent = (props) => {
  const [bails, setBails] = useState();
  const [showBailForm, setShowBailForm] = useState(false);
  const [sending, setSending] = useState(false);
  const [updateBailId, setUpdateBailId] = useState(-1);
  const [updateBailObj, setUpdateBailObj] = useState();

  const getBails = useCallback(() => {
    let urlByRole =
      props.roles[0] === "owner"
        ? owner.rent.allBailsPrefix
        : props.roles[0] === "administrator"
        ? admin.rent.allBailsPrefix
        : "";

    GET(`${urlByRole}${props.rentId}${general.rent.allBailsSuffix}`).then(
      (res) => {
        if (res !== null) {
          res.map((b) => {
            let isCome = b.come;
            b.come = isCome ? "tak" : "nie";

            return b;
          });
          setBails(res);
        } else {
          toast.error("Błąd połączenia z serwerem...");
        }
      }
    );
  }, [props.rentId, props.roles]);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      getBails();
    }
    return () => {
      mounted = false;
    };
  }, [getBails]);

  const handleReturn = () => {
    setShowBailForm(false);
    setUpdateBailId(-1);
    getBails();
  };

  const handleDelete = (id) => {
    if (!sending) {
      if (window.confirm("Czy na pewno chcesz usunąć ten lokal?")) {
        setSending(true);
        let urlByRole =
          props.roles[0] === "owner"
            ? owner.rent.deleteBail
            : props.roles[0] === "administrator"
            ? admin.rent.deleteBail
            : "";
        DELETE(
          `${urlByRole}${props.rentId}${general.rent.deleteBailPrefix}${id}`
        ).then((res) => {
          if (res) {
            toast.success("Kaucja została usunięta");
            setSending(false);
            getBails();
          } else {
            toast.error("Nie udało się usunąć kaucji...");
            setSending(false);
          }
        });
      }
    }
  };

  const handleEdit = (values) => {
    setUpdateBailId(values.bailId);
    setUpdateBailObj(values);
  };

  const handleChangeIsCome = (id) => {
    if (window.confirm("Czy chcesz zmienić rodzaj kaucji?")) {
      let urlByRole =
        props.roles[0] === "owner"
          ? owner.bail.inverseIsCome
          : props.roles[0] === "administrator"
          ? admin.bail.inverseIsCome
          : "";
      PATCH(`${urlByRole}${id}`).then((res) => {
        if (res) {
          toast.success("Zmieniono rodzaj kaucji");
          getBails();
        } else {
          toast.error("Nie udało się zmienić rodzaju kaucji");
        }
      });
    }
  };

  const translateType = (val) => {
    switch (val) {
      case "CARD_PAYMENT":
        return "Wpłata kart/got";
      case "CARD_WITHDRAW":
        return "Wypłata kart/got";
      case "CONFIRMATION_PAYMENT":
        return "Wpłata przel.";
      case "CONFIRMATION_WITHDRAW":
        return "Wypłata przel.";
      default:
        return "UNKNOWN";
    }
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
      Cell: ({ cell }) => <>{translateType(cell.row.values.bailType)}</>,
    },
    {
      Header: "Opis",
      accessor: "description",
    },
    {
      Header: "Przychodząca",
      accessor: "come",
      Cell: ({ cell }) => (
        <>
          <b
            className="details-container__history"
            onClick={() => handleChangeIsCome(cell.row.values.bailId)}
          >
            {cell.row.values.come}
          </b>
        </>
      ),
    },
    {
      Header: "Akcja",
      accessor: "action",
      Cell: ({ cell }) => (
        <>
          <div className="icon-container">
            <AiFillEdit
              className="icon-container__edit-icon"
              onClick={() => handleEdit(cell.row.values)}
            />
            <p>Edycja</p>
          </div>

          <div className="icon-container">
            <BsTrashFill
              className="icon-container__delete-icon"
              onClick={() => handleDelete(cell.row.values.bailId)}
            />
            <p>Usuń</p>
          </div>
        </>
      ),
    },
  ];
  const initialState = { pageSize: 5, hiddenColumns: "bailId" };

  return (
    <>
      {showBailForm ? (
        <BailForm
          rentId={props.rentId}
          handleReturn={handleReturn}
          roles={props.roles}
        />
      ) : updateBailId > -1 ? (
        <BailForm
          roles={props.roles}
          rentId={props.rentId}
          handleReturn={handleReturn}
          data={updateBailObj}
        />
      ) : (
        <>
          <h1 className="content-container__title">Kaucje</h1>
          <div className="table-container">
            <div className="icon-container">
              <BsPlusSquareFill
                className="icon-container__new-icon"
                onClick={() => setShowBailForm(true)}
              />
            </div>

            {bails !== undefined && bails.length > 0 ? (
              <LoadData
                data={bails}
                columns={columns}
                initialState={initialState}
              />
            ) : (
              <h1>Brak</h1>
            )}

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
