const httpPrefix = "http//";
const port = "localhost:8080";

const ownerPrefix = "/owner";
const owner = {
  premises: `${httpPrefix}${port}${ownerPrefix}/premises`,
  locations: `${httpPrefix}${port}${ownerPrefix}/locations`,
  newPremises: `${httpPrefix}${port}${ownerPrefix}/new-premises`,

  premisesUpdate: `${httpPrefix}${port}${ownerPrefix}/premises/`,
  premisesDelete: `${httpPrefix}${port}${ownerPrefix}/premises/`,
  newLocation: `${httpPrefix}${port}${ownerPrefix}/location/new`,
  locationDetails: `${httpPrefix}${port}${ownerPrefix}/location/`,
  productsForLocation: {
    prefix: `${httpPrefix}${port}${ownerPrefix}/location/`, // location id must be after /location/
    addCalculated: "/product/calculated/add",
    addDisposable: "/product/disposable/add",
    addMiediaQuantity: "/product/miedia-quantity/add",
    addMediaStandard: "/product/media-standard/add",
    addState: "/product/state/add",
  },
  rent: {
    new: `${httpPrefix}${port}${ownerPrefix}/new-rent`,
  },
};

const user = {
  info: `${httpPrefix}${port}/user`,
  register: `${httpPrefix}${port}/auth/register`,
};

const premises = {
  premisesTypes: "/premisesType/all",
};

export { owner, user, premises };
