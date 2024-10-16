import React, { createContext, useState } from "react";
const AuthContext = createContext({});

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [isToken, setToken] = useState("");
  return (
    <AuthContext.Provider value={{ isToken, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
