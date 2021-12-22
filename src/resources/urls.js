const httpPrefix = "http://";
const port = "localhost:8080";

const paths = {
  premisesPath: "/premises",
  premisesDetails: "/premises/",
  locationsPath: "/locations",
  newPremisesPath: "/new-premises",
  premisesUpdatePath: "/premises/",
  premisesDeletePath: "/premises/",
  newLocationPath: "/location/new",
  updateLocationPath: "/location/",
  locationDetailsPath: "/location/",
  newRentPath: "/new-rent",
  rentsPath: "/rents",
  productsForLocation: {
    addCalculatedPath: "/product/calculated/add",
    addDisposablePath: "/product/disposable/add",
    addMiediaQuantityPath: "/product/miedia-quantity/add",
    addMediaStandardPath: "/product/media-standard/add",
    addStatePath: "/product/state/add",
    productsForTypePath: "/products?productType=",
    getAllMediaStandardPath: "/productsMediaStandard",
  },
};

const ownerPrefix = "/owner";
const owner = {
  premises: `${httpPrefix}${port}${ownerPrefix}${paths.premisesPath}`,
  premisesDetails: `${httpPrefix}${port}${ownerPrefix}${paths.premisesDetails}`, // +id
  locations: `${httpPrefix}${port}${ownerPrefix}${paths.locationsPath}`,
  newPremises: `${httpPrefix}${port}${ownerPrefix}${paths.newPremisesPath}`,
  premisesUpdate: `${httpPrefix}${port}${ownerPrefix}${paths.premisesUpdatePath}`, //premises id at the end
  premisesDelete: `${httpPrefix}${port}${ownerPrefix}${paths.premisesDeletePath}`, //premises id at the end
  newLocation: `${httpPrefix}${port}${ownerPrefix}${paths.newLocationPath}`,
  updateLocation: `${httpPrefix}${port}${ownerPrefix}${paths.updateLocationPath}`,
  locationDetails: `${httpPrefix}${port}${ownerPrefix}${paths.locationDetailsPath}`, //location id at the end
  rents: `${httpPrefix}${port}${ownerPrefix}${paths.rentsPath}`,
  productsForLocation: {
    prefix: `${httpPrefix}${port}${ownerPrefix}/location/`, // location id must be after /location/
    allProductsSuffix: "/productGroupType",
    addCalculated: `${paths.productsForLocation.addCalculatedPath}`,
    addDisposable: `${paths.productsForLocation.addDisposablePath}`,
    addMiediaQuantity: `${paths.productsForLocation.addMiediaQuantityPath}`,
    addMediaStandard: `${paths.productsForLocation.addMediaStandardPath}`,
    addState: `${paths.productsForLocation.addStatePath}`,
    productsForType: `${paths.productsForLocation.productsForTypePath}`,
    getAllMediaStandard: `${paths.productsForLocation.getAllMediaStandardPath}`,
  },
  rent: {
    new: `${httpPrefix}${port}${ownerPrefix}${paths.newRentPath}`,
  },
};

const user = {
  info: `${httpPrefix}${port}/user`,
  register: `${httpPrefix}${port}/auth/register`,
  findByEmail: `${httpPrefix}${port}/user/`,
};

//for all roles
const general = {
  premises: {
    premisesTypes: `${httpPrefix}${port}/premisesType/all`,
  },
};

export { owner, user, general };
