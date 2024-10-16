export const setLoginToken = (token) =>
  localStorage.setItem("authToken", token);

export const setCurrentLoginUser = (loginUserData) =>
  localStorage.setItem("rebemberme", loginUserData);

export const setfaviocon = (data) => localStorage.setItem("favicon", data);

export const getLoginToken = () => localStorage.getItem("authToken");

export const handleRememberData = () => {
  let rebembermedata = localStorage.getItem("rebemberme");
  localStorage.clear();
  if (rebembermedata != "undefined" && rebembermedata != null) {
    localStorage.setItem("rebemberme", rebembermedata);
  }
};

export const setcommonData = (type, commonData) => {
  if (type == "logout") {
    let rebembermedata = localStorage.getItem("rebemberme");
    localStorage.clear();
    if (rebembermedata != "undefined" && rebembermedata != null) {
      setCurrentLoginUser(rebembermedata);
    }
  }

  if (type == "companyData" && commonData?.companyDetails) {
    localStorage.setItem("favicon", commonData?.companyDetails?.favicon);
    localStorage.setItem(
      "companyData",
      JSON.stringify(commonData?.companyDetails)
    );
  }

  if (type == "profileData" && commonData?.profileDetails) {
    localStorage.setItem(
      "profileData",
      JSON.stringify(commonData?.profileDetails)
    );
  }

  if (type == "currencyData" && commonData?.currencySymbol) {
    localStorage.setItem("currencyData", commonData?.currencySymbol);
  }

  if (type == "all") {
    localStorage.setItem("favicon", commonData?.companyDetails?.favicon);
    localStorage.setItem(
      "companyData",
      JSON.stringify(commonData?.companyDetails)
    );
    localStorage.setItem(
      "profileData",
      JSON.stringify(commonData?.profileDetails)
    );
    localStorage.setItem("currencyData", commonData?.currencySymbol);
  }
};

export const handleKeyDown = (event) => {
  const invalidKeys = ["e", "-", "."];
  if (
    invalidKeys.includes(event.key) ||
    event.key === "ArrowUp" ||
    event.key === "ArrowDown"
  ) {
    event.preventDefault();
  }
};

export const handleNumberRestriction = (event) => {
  const keyCode = event.keyCode || event.which;
  const keyValue = String.fromCharCode(keyCode);

  // Allow only numbers (0-9)
  if (!/^[0-9]+$/.test(keyValue)) {
    event.preventDefault();
  }
};

export const handleCharacterRestriction = (event) => {
  const keyCode = event.keyCode || event.which;
  const keyValue = String.fromCharCode(keyCode);

  // Allow only characters (A-Z and a-z)
  if (!/^[A-Za-z ]+$/.test(keyValue)) {
    event.preventDefault();
  }
};

export const handleSpecialCharacterRestriction = (event) => {
  const keyCode = event.keyCode || event.which;
  const keyValue = String.fromCharCode(keyCode);

  // Prevent special characters
  if (/[^A-Za-z0-9]/.test(keyValue)) {
    event.preventDefault();
  }
};

// Characters with allow spaces

export const handleCharacterRestrictionSpace = (event) => {
  const keyCode = event.keyCode || event.which;
  const keyValue = String.fromCharCode(keyCode);

  // Disallow space at the beginning
  if (/^\s$/.test(keyValue) && event.target.selectionStart === 0) {
    event.preventDefault();
    return;
  }

  // Continue allowing characters (A-Z, a-z, and space)
  if (!/^[A-Za-z\s]+$/.test(keyValue)) {
    event.preventDefault();
  }
};

export const handleSpecialCharacterSpaceRestriction = (event) => {
  const keyCode = event.keyCode || event.which;
  const keyValue = String.fromCharCode(keyCode);

  // Disallow space at the beginning
  if (/^\s$/.test(keyValue) && event.target.selectionStart === 0) {
    event.preventDefault();
    return;
  }

  // Continue preventing other special characters
  if (/[^A-Za-z0-9\s]/.test(keyValue)) {
    event.preventDefault();
  }
};
