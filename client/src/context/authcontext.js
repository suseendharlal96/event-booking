import React, { useState, createContext } from "react";

export const AuthContext = createContext();

const AuthProvider = (props) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  return (
    <AuthContext.Provider value={{ token, setToken, userId, setUserId }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
