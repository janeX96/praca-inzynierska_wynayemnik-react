import { Link } from "react-router-dom";

const Confirmation = () => {
  return (
    <div className="details-container">
      <h1 style={{ fontSize: "30px", color: "#154f0c", marginLeft: "10%" }}>
        Wynajęcie zostało pomyślnie dodane
      </h1>
      <Link
        to={{
          pathname: "/owner-rents",
        }}
      >
        <button
          className="content-container__button"
          style={{ marginLeft: "40%" }}
        >
          Powrót
        </button>
      </Link>
    </div>
  );
};

export default Confirmation;
