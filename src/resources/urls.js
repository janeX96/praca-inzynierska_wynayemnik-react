const httpPrefix = "http://";
// const port = "188.68.236.176:8080";
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
  productsForLocation: {
    getAllPatternsPath: "/product/patterns",
    addCalculatedPath: "/product/calculated/add",
    addDisposablePath: "/product/disposable/add",
    addMiediaQuantityPath: "/product/media-quantity/add",
    addMediaStandardPath: "/product/media-standard/add",
    addStatePath: "/product/state/add",
    productsForTypePath: "/products?productType=",
    getAllMediaStandardPath: "/productsMediaStandard",
    updateProductPath: "/product/", //{id}
    productDetailsPath: "/product/", //{id}
  },
  rent: {
    newRentPath: "/new-rent",
    rentsPath: "/rents",
    rentDetails: "/rent/", //{id}
    productsSuffix: "/productsMediaStandard",
    paymentsPrefix: "/rent/", //{id}
    paymentsSuffix: "/payments",
    newPaymentPrefix: "/rent/", //{id}
    newPaymentSuffix: "/payment",
    addAllMediaCountersPrefix: "/rent/", //{id}
    addAllMediaCountersSuffix: "/allMediaRent",
    getAllMediaRentPrefix: "/rent/", //{id},
    getAllMediaRentSuffix: "/allMediaRent",
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
    updateProduct: `${paths.productsForLocation.updateProductPath}`,
    productDetails: `${paths.productsForLocation.updateProductPath}`,
  },
  rent: {
    new: `${httpPrefix}${port}${ownerPrefix}${paths.rent.newRentPath}`,
    rents: `${httpPrefix}${port}${ownerPrefix}${paths.rent.rentsPath}/`, //{id}
    all: `${httpPrefix}${port}${ownerPrefix}${paths.rent.rentsPath}`,
    details: `${httpPrefix}${port}${ownerPrefix}${paths.rent.rentDetails}`,
    products: `${httpPrefix}${port}${ownerPrefix}${paths.rent.rentDetails}`, //{id}
    payments: `${httpPrefix}${port}${ownerPrefix}${paths.rent.paymentsPrefix}`, //{id}
    addAllMediaCounters: `${httpPrefix}${port}${ownerPrefix}${paths.rent.addAllMediaCountersPrefix}`, //{id}
    getAllMediaRent: `${httpPrefix}${port}${ownerPrefix}${paths.rent.getAllMediaRentPrefix}`, //{id}
    newPayment: `${httpPrefix}${port}${ownerPrefix}${paths.rent.newPaymentPrefix}`, //{id}
  },
};

const adminPrefix = "/administrator";
const admin = {
  premises: `${httpPrefix}${port}${adminPrefix}${paths.premisesPath}`,
  premisesDetails: `${httpPrefix}${port}${adminPrefix}${paths.premisesDetails}`, // +id
  locations: `${httpPrefix}${port}${adminPrefix}${paths.locationsPath}`,
  // newPremises: `${httpPrefix}${port}${adminPrefix}${paths.newPremisesPath}`,
  // premisesUpdate: `${httpPrefix}${port}${adminPrefix}${paths.premisesUpdatePath}`, //premises id at the end
  // premisesDelete: `${httpPrefix}${port}${adminPrefix}${paths.premisesDeletePath}`, //premises id at the end
  // newLocation: `${httpPrefix}${port}${adminPrefix}${paths.newLocationPath}`,
  // updateLocation: `${httpPrefix}${port}${adminPrefix}${paths.updateLocationPath}`,
  locationDetails: `${httpPrefix}${port}${adminPrefix}${paths.locationDetailsPath}`, //location id at the end
  rents: `${httpPrefix}${port}${adminPrefix}${paths.rentsPath}/`, //{id}
  productsForLocation: {
    prefix: `${httpPrefix}${port}${adminPrefix}/location/`, // location id must be after /location/
    allProductsSuffix: "/productGroupType",
    addCalculated: `${paths.productsForLocation.addCalculatedPath}`,
    addDisposable: `${paths.productsForLocation.addDisposablePath}`,
    addMiediaQuantity: `${paths.productsForLocation.addMiediaQuantityPath}`,
    addMediaStandard: `${paths.productsForLocation.addMediaStandardPath}`,
    addState: `${paths.productsForLocation.addStatePath}`,
    productsForType: `${paths.productsForLocation.productsForTypePath}`,
    getAllMediaStandard: `${paths.productsForLocation.getAllMediaStandardPath}`,
    updateProduct: `${paths.productsForLocation.updateProductPath}`,
    productDetails: `${paths.productsForLocation.updateProductPath}`,
  },
  rent: {
    new: `${httpPrefix}${port}${adminPrefix}${paths.rent.newRentPath}`,
    rents: `${httpPrefix}${port}${adminPrefix}${paths.rent.rentsPath}/`, //{id}
    all: `${httpPrefix}${port}${adminPrefix}${paths.rent.rentsPath}`,
    details: `${httpPrefix}${port}${adminPrefix}${paths.rent.rentDetails}`,
    products: `${httpPrefix}${port}${adminPrefix}${paths.rent.rentDetails}`, //{id}
    payments: `${httpPrefix}${port}${adminPrefix}${paths.rent.paymentsPrefix}`, //{id}
    addAllMediaCounters: `${httpPrefix}${port}${adminPrefix}${paths.rent.addAllMediaCountersPrefix}`, //{id}
    getAllMediaRent: `${httpPrefix}${port}${adminPrefix}${paths.rent.getAllMediaRentPrefix}`, //{id}
    newPayment: `${httpPrefix}${port}${adminPrefix}${paths.rent.newPaymentPrefix}`, //{id}
  },
};

const clientPrefix = "/client";
const client = {
  rent: {
    all: `${httpPrefix}${port}${clientPrefix}${paths.rent.rentsPath}`,
    details: `${httpPrefix}${port}${clientPrefix}${paths.rent.rentDetails}`,
    payments: `${httpPrefix}${port}${clientPrefix}${paths.rent.paymentsPrefix}`, //{id}
    getAllMediaRent: `${httpPrefix}${port}${clientPrefix}${paths.rent.getAllMediaRentPrefix}`, //{id}
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
  patterns: `${httpPrefix}${port}${paths.productsForLocation.getAllPatternsPath}`,

  rent: {
    productsSuffix: paths.rent.productsSuffix,
    paymentsSuffix: paths.rent.paymentsSuffix,
    addAllMediaCountersSuffix: paths.rent.addAllMediaCountersSuffix,
    getAllMediaRentSuffix: paths.rent.getAllMediaRentSuffix,
    newPaymentSuffix: paths.rent.newPaymentSuffix,
  },
};

export { owner, admin, user, general, client };
