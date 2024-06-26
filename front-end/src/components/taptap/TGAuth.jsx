import React from "react";
import { Navigate } from "react-router-dom";

import { isAuth } from "../../utlis/localstorage";

function TGAuth({ children }) {
  return isAuth() === true ? (
    children
  ) : (
    <Navigate
      to={{
        pathname: "/game",
      }}
    />
  );
}

export default TGAuth;
