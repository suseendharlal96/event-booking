import React, { useEffect, useContext } from "react";

import { AuthContext } from "../context/authcontext";

const Bookings = (props) => {
  const { token } = useContext(AuthContext);
  useEffect(() => {
    if (!token) {
      props.history.push("/authenticate");
    }
  }, []);
  return <div>Bookings</div>;
};
export default Bookings;
