import React from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import Auth from "./pages/Auth";
import Events from "./pages/Events";
import Bookings from "./pages/Bookings";
import NavBar from "./components/Navigation/NavBar";
import AuthProvider from "./context/authcontext";
import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <main>
          <NavBar />
          <Switch>
            <Redirect exact from="/" to="/authenticate" />
            <Route path="/authenticate" component={Auth} />
            <Route path="/events" component={Events} />
            <Route path="/bookings" component={Bookings} />
            <Redirect from="**" to="/auth" />
          </Switch>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
