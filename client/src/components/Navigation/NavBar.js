import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Menu } from "semantic-ui-react";

const NavBar = () => {
  const pathname = window.location.pathname;
  const path = pathname === "/" ? "auth" : pathname.substr(1);

  const [activeItem, setActiveItem] = useState(path);

  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
  };

  const menuContent = (
    <Menu pointing secondary size="massive" color="blue">
      <Menu.Item
        name="events"
        active={activeItem === "events"}
        onClick={handleItemClick}
        as={Link}
        to="/events"
      />
      <Menu.Item
        name="bookings"
        active={activeItem === "bookings"}
        onClick={handleItemClick}
        as={Link}
        to="/bookings"
      />
      <Menu.Menu position="right">
        <Menu.Item
          name="authenticate"
          active={activeItem === "authenticate"}
          onClick={handleItemClick}
          as={Link}
          to="/authenticate"
        />
      </Menu.Menu>
    </Menu>
  );

  return menuContent;
};

export default NavBar;
