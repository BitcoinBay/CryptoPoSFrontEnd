
import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";

import { setCurrentUser, logoutUser } from "./actions/authActions";
import { Provider } from "react-redux";
import store from "./store";

//import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Cashier from "./components/layout/Cashier";
import Customer from "./components/layout/Customer";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/dashboard/Dashboard";
import CreatePoS from "./components/create-pos/CreatePoS";
import POSDashboard from "./components/pos-dashboard/POSDashboard";
import Order from "./components/layout/Order";

import "./App.css";
import PaymentSucess from "./components/layout/PaymentSucess";

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());

    // Redirect to login
    window.location.href = "./login";
  }
}
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Route exact path="/" component={Landing} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute exact path="/cashier" component={Cashier} />
              <PrivateRoute exact path="/customer" component={Customer} />
              <PrivateRoute exact path="/PaymentSucess" component= {PaymentSucess}/>
              <PrivateRoute exact path="/create-pos" component={CreatePoS} />
              <PrivateRoute exact path="/pos-dashboard" component={POSDashboard} />
              <PrivateRoute exact path="/order" component={Order}/>
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}
export default App;
