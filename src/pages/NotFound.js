import NotFoundImg from "../images/wynayemnik 404.png";

const NotFound = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginTop: "15px",
        marginBottom: "100px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src={NotFoundImg}
          alt="404 not found"
          style={{ width: "60%", margin: "auto" }}
        />
        <h1 style={{ fontSize: "70px", marginTop: "5px" }}>PAGE NOT FOUND</h1>
      </div>
    </div>
  );
};

export default NotFound;
