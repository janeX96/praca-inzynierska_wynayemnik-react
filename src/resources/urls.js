const httpPrefix = "http://";
// const port = "188.68.236.176:8080";
const port = "localhost:8080";

const paths = {
  clientsAll: "/user/clients",
  administrators: {
    all: "/administrators",
    set: "/set-administrator/",
    logs: "/administrator-logs/",
    ownAndNot: "/administrators/premises/user-permission/",
  },
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
    premisesTypesForProduct: "/premisesType/product/", //{id}
  },

  rent: {
    defaultPrefix: "/rent/", //{id}
    newRentPath: "/new-rent",
    rentsPath: "/rents",
    rentDetails: "/rent/", //{id}
    productsSuffix: "/productsMediaStandard",
    productsAllSuffix: "/products",
    paymentsPrefix: "/rent/", //{id}
    paymentsSuffix: "/payments",
    newPaymentPrefix: "/rent/", //{id}
    newPaymentSuffix: "/payment",
    paymentDetailsSuffix: "/payment/",
    addAllMediaCountersPrefix: "/rent/", //{id}
    addAllMediaCountersSuffix: "/allMediaRent",
    getAllMediaRentPrefix: "/rent/", //{id},
    getAllMediaRentSuffix: "/allMediaRent",
    changeUserAccess: "/change-user-access/", //{id}
    deleteRent: "/delete-rent/", //{id}
    cancelRent: "/cancel-rent/", //{id}
    allBailsSuffix: "/bails",
    sumMediaQuantitySuffix: "/mediaRent",
    newBailSuffix: "/new-bail",
    sumOfBailsPrefix: "/rent/sum-bails/", //{ id },
    addProductPrefix: "/product/",
    deleteBailPrefix: "/bail/",
    updateBailPrefix: "/bail/",
    changeUserCountersAccessPrefix: "/change-counter-media-rent/",
    checkIssuedAllMediaRentSuffix: "/checkIssuedAllMediaRent",
  },
  bail: {
    inverseIsComePrefix: "/inverse-isCome/", //{id}
  },
};

const ownerPrefix = "/owner";
const owner = {
  clientsAll: `${httpPrefix}${port}${paths.clientsAll}`,
  administrators: {
    all: `${httpPrefix}${port}${ownerPrefix}${paths.administrators.all}`,
    set: `${httpPrefix}${port}${ownerPrefix}${paths.administrators.set}`,
    logs: `${httpPrefix}${port}${ownerPrefix}${paths.administrators.logs}`,
    ownAndNot: `${httpPrefix}${port}${ownerPrefix}${paths.administrators.ownAndNot}`,
  },

  defaultPrefix: `${httpPrefix}${port}${ownerPrefix}`,
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
    changeUserAccess: `${httpPrefix}${port}${ownerPrefix}${paths.rent.changeUserAccess}`, //{id}
    deleteRent: `${httpPrefix}${port}${ownerPrefix}${paths.rent.deleteRent}`, //{id}
    cancelRent: `${httpPrefix}${port}${ownerPrefix}${paths.rent.cancelRent}`, //{id}
    allProducts: `${httpPrefix}${port}${ownerPrefix}${paths.rent.getAllMediaRentPrefix}`, //{id}
    allBailsPrefix: `${httpPrefix}${port}${ownerPrefix}${paths.rent.defaultPrefix}`, //{id}
    sumMediaQuantity: `${httpPrefix}${port}${ownerPrefix}${paths.rent.defaultPrefix}`, //{id}
    newBail: `${httpPrefix}${port}${ownerPrefix}${paths.rent.defaultPrefix}`, //{id}
    sumOfBails: `${httpPrefix}${port}${ownerPrefix}${paths.rent.sumOfBailsPrefix}`, //{id}
    deleteProductPrefix: `${httpPrefix}${port}${ownerPrefix}${paths.rent.defaultPrefix}`, //{id}
    addProduct: `${httpPrefix}${port}${ownerPrefix}${paths.rent.defaultPrefix}`, //{id}
    deleteBail: `${httpPrefix}${port}${ownerPrefix}${paths.rent.defaultPrefix}`, //{id}
    updateBail: `${httpPrefix}${port}${ownerPrefix}${paths.rent.defaultPrefix}`, //{id}
    changeUserCountersAccess: `${httpPrefix}${port}${ownerPrefix}${paths.rent.changeUserCountersAccessPrefix}`, //{id}
    paymentDetails: `${httpPrefix}${port}${ownerPrefix}${paths.rent.defaultPrefix}`, //{id}
    checkIssuedAllMediaRentPrefix: `${httpPrefix}${port}${ownerPrefix}${paths.rent.defaultPrefix}`, //{id}
  },
  bail: {
    inverseIsCome: `${httpPrefix}${port}${ownerPrefix}${paths.bail.inverseIsComePrefix}`,
  },
};

const adminPrefix = "/administrator";
const admin = {
  defaultPrefix: `${httpPrefix}${port}${adminPrefix}`,
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
    changeUserAccess: `${httpPrefix}${port}${adminPrefix}${paths.rent.changeUserAccess}`, //{id}
    deleteRent: `${httpPrefix}${port}${adminPrefix}${paths.rent.deleteRent}`, //{id}
    cancelRent: `${httpPrefix}${port}${adminPrefix}${paths.rent.cancelRent}`, //{id}
    allProducts: `${httpPrefix}${port}${adminPrefix}${paths.rent.getAllMediaRentPrefix}`, //{id}
    allBailsPrefix: `${httpPrefix}${port}${adminPrefix}${paths.rent.defaultPrefix}`, //{id}
    sumMediaQuantity: `${httpPrefix}${port}${adminPrefix}${paths.rent.defaultPrefix}`, //{id}
    newBail: `${httpPrefix}${port}${adminPrefix}${paths.rent.defaultPrefix}`, //{id}
    sumOfBails: `${httpPrefix}${port}${adminPrefix}${paths.rent.sumOfBailsPrefix}`, //{id}
    deleteProductPrefix: `${httpPrefix}${port}${adminPrefix}${paths.rent.defaultPrefix}`, //{id}
    addProduct: `${httpPrefix}${port}${adminPrefix}${paths.rent.defaultPrefix}`, //{id}
    deleteBail: `${httpPrefix}${port}${adminPrefix}${paths.rent.defaultPrefix}`, //{id}
    updateBail: `${httpPrefix}${port}${adminPrefix}${paths.rent.defaultPrefix}`, //{id}
    changeUserCountersAccess: `${httpPrefix}${port}${adminPrefix}${paths.rent.changeUserCountersAccessPrefix}`, //{id}
    checkIssuedAllMediaRentPrefix: `${httpPrefix}${port}${adminPrefix}${paths.rent.defaultPrefix}`, //{id}
  },
  bail: {
    inverseIsCome: `${httpPrefix}${port}${adminPrefix}${paths.bail.inverseIsComePrefix}`,
  },
};

const clientPrefix = "/client";
const client = {
  rent: {
    all: `${httpPrefix}${port}${clientPrefix}${paths.rent.rentsPath}`,
    details: `${httpPrefix}${port}${clientPrefix}${paths.rent.rentDetails}`,
    payments: `${httpPrefix}${port}${clientPrefix}${paths.rent.paymentsPrefix}`, //{id}
    getAllMediaRent: `${httpPrefix}${port}${clientPrefix}${paths.rent.getAllMediaRentPrefix}`, //{id}
    products: `${httpPrefix}${port}${clientPrefix}${paths.rent.rentDetails}`, //{id}
  },
};

const userPrefix = "/user";
const user = {
  info: `${httpPrefix}${port}/user`,
  register: `${httpPrefix}${port}/auth/register`,
  findByEmail: `${httpPrefix}${port}/user/`,
  changeIsFakturownia: `${httpPrefix}${port}${userPrefix}/isFakturownia`,
  updateFakturowniaSettings: `${httpPrefix}${port}${userPrefix}/fakturownia`,
  changeIsDepartmentFakturownia: `${httpPrefix}${port}${userPrefix}/isDepartmentFakturownia`,
  updateIsNaturalPerson: `${httpPrefix}${port}${userPrefix}/isNaturalPerson`,
  getCompany: `${httpPrefix}${port}${userPrefix}/company`,
  createCompany: `${httpPrefix}${port}${userPrefix}/company`,
  userAccountGetByEmail: `${httpPrefix}${port}${userPrefix}/user-account/get/`,
};

//for all roles
const general = {
  premises: {
    premisesTypes: `${httpPrefix}${port}/premisesType/all`,
  },
  patterns: `${httpPrefix}${port}${paths.productsForLocation.getAllPatternsPath}`,
  productsForLocation: {
    allProductsSuffix: "/productGroupType",
    premisesTypesForProductPrefix: `${httpPrefix}${port}${paths.productsForLocation.premisesTypesForProduct}`,
  },

  rent: {
    productsSuffix: paths.rent.productsSuffix,
    productsAllSuffix: paths.rent.productsAllSuffix,
    paymentsSuffix: paths.rent.paymentsSuffix,
    addAllMediaCountersSuffix: paths.rent.addAllMediaCountersSuffix,
    getAllMediaRentSuffix: paths.rent.getAllMediaRentSuffix,
    newPaymentSuffix: paths.rent.newPaymentSuffix,
    allBailsSuffix: paths.rent.allBailsSuffix,
    sumMediaQuantitySuffix: paths.rent.sumMediaQuantitySuffix,
    newBailSuffix: paths.rent.newBailSuffix,
    deleteProductPrefix: "/product/", //{id}
    addProductPrefix: paths.rent.addProductPrefix,
    deleteBailPrefix: paths.rent.deleteBailPrefix,
    updateBailPrefix: paths.rent.updateBailPrefix,
    paymentDetailsSuffix: paths.rent.paymentDetailsSuffix,
    checkIssuedAllMediaRentSuffix: paths.rent.checkIssuedAllMediaRentSuffix,
  },
};

export { owner, admin, user, general, client };
