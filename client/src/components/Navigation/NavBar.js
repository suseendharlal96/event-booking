import React, { useState, useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";

import { Menu } from "semantic-ui-react";

import { AuthContext } from "../../context/authcontext";

const NavBar = (props) => {
  const { token, setToken } = useContext(AuthContext);
  // const [path, setPath] = useState("");
  // const [activeItem, setActiveItem] = useState(path);
  // useEffect(() => {
  //   const pathname = window.location.pathname;
  //   const path = pathname === "/" ? "authenticate" : pathname.substr(1);
  //   setPath(path);
  //   // setActiveItem(path);
  // }, [path]);

  // const handleItemClick = (e, { name }) => {
  //   // setActiveItem(name);
  // };

  const logout = () => {
    setToken(null);
  };

  const menuContent = (
    <Menu inverted size="large" color="blue">
      {token ? (
        <React.Fragment>
          <Menu.Item name="events" as={NavLink} to="/events" />
          <Menu.Item name="bookings" as={NavLink} to="/bookings" />
          <Menu.Menu position="right">
            <Menu.Item
              name="logout"
              onClick={logout}
              as={NavLink}
              to="/authenticate"
            />
          </Menu.Menu>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Menu.Item name="events" as={NavLink} to="/events" />
          <Menu.Menu position="right">
            <Menu.Item name="authenticate" as={NavLink} to="/authenticate" />
          </Menu.Menu>
        </React.Fragment>
      )}
    </Menu>
  );

  return menuContent;
};

export default NavBar;
