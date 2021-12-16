const httpPrefix = "http//";
const port = "localhost:8080";

const paths = {
  premisesPath: "/premises",
  locationsPath: "/locations",
  newPremisesPath: "/new-premises",
  premisesUpdatePath: "/premises/",
  premisesDeletePath: "/premises/",
  newLocationPath: "/location/new",
  locationDetailsPath: "/location/",
  newRentPath: "/new-rent",
  productsForLocation: {
    addCalculatedPath: "/product/calculated/add",
    addDisposablePath: "/product/disposable/add",
    addMiediaQuantityPath: "/product/miedia-quantity/add",
    addMediaStandardPath: "/product/media-standard/add",
    addStatePath: "/product/state/add",
  },
};

const ownerPrefix = "/owner";
const owner = {
  premises: `${httpPrefix}${port}${ownerPrefix}${paths.premisesPath}`,
  locations: `${httpPrefix}${port}${ownerPrefix}${paths.locationsPath}`,
  newPremises: `${httpPrefix}${port}${ownerPrefix}${paths.newPremisesPath}`,
  premisesUpdate: `${httpPrefix}${port}${ownerPrefix}${paths.premisesUpdatePath}`, //premises id at the end
  premisesDelete: `${httpPrefix}${port}${ownerPrefix}${paths.premisesDeletePath}`, //premises id at the end
  newLocation: `${httpPrefix}${port}${ownerPrefix}${paths.newLocationPath}`,
  locationDetails: `${httpPrefix}${port}${ownerPrefix}${paths.locationDetailsPath}`, //location id at the end
  productsForLocation: {
    prefix: `${httpPrefix}${port}${ownerPrefix}/location/`, // location id must be after /location/
    addCalculated: `${paths.productsForLocation.addCalculatedPath}`,
    addDisposable: `${paths.productsForLocation.addDisposablePath}`,
    addMiediaQuantity: `${paths.productsForLocation.addMiediaQuantityPath}`,
    addMediaStandard: `${paths.productsForLocation.addMediaStandardPath}`,
    addState: `${paths.productsForLocation.addStatePath}`,
  },
  rent: {
    new: `${httpPrefix}${port}${ownerPrefix}${paths.newRentPath}`,
  },
};

const user = {
  info: `${httpPrefix}${port}/user`,
  register: `${httpPrefix}${port}/auth/register`,
};

//for all roles
const general = {
  premises: {
    premisesTypes: `${httpPrefix}${port}/premisesType/all`,
  },
};

export { owner, user, general };
