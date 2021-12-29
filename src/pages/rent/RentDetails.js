const RentDetails = (props) => {
  return (
    <>
      <div>{props.rent.startDate}</div>
      <div className="contant-btns">
        <button
          className="content-container__button"
          onClick={props.handleReturn}
        >
          Powrót
        </button>
      </div>
    </>
  );
};

export default RentDetails;
