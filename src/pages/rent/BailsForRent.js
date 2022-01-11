import { useState, useEffect } from "react";
import { AiFillEdit } from "react-icons/ai";
import { BsPlusSquareFill, BsTrashFill } from "react-icons/bs";
import { toast } from "react-toastify";
import { owner, admin, client, general } from "../../resources/urls";
import { DELETE, GET, PATCH } from "../../utilities/Request";
import LoadData from "../LoadData";
import BailForm from "./BailForm";

const BailsForRent = (props) => {
  const [bails, setBails] = useState();
  const [showBailForm, setShowBailForm] = useState(false);
  const [sending, setSending] = useState(false);
  const [updateBailId, setUpdateBailId] = useState(-1);
  const [updateBailObj, setUpdateBailObj] = useState();

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
            : props.roles[0] === "admin"
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
          : props.roles[0] === "admin"
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
            <LoadData
              data={bails}
              columns={columns}
              initialState={initialState}
            />

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
