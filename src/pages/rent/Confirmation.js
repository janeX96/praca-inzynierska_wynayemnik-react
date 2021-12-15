const Confirmation = () => {
  return (
    <div
      style={{
        marginLeft: "12%",
        marginTop: "5%",
        marginRight: "45%",
        backgroundColor: "#909091",
        borderColor: "#474747",
        borderStyle: "solid",
        padding: "15px",
      }}
    >
      <h1 style={{ fontSize: "30px", color: "#154f0c", marginLeft: "10%" }}>
        Wynajęcie zostało pomyślnie dodane
      </h1>
      <button className="action-button" style={{ marginLeft: "40%" }}>
        Powrót
      </button>
    </div>
  );
};

export default Confirmation;
