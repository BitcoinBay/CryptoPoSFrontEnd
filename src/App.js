
import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import setAuthToken from "./utils/setAuthToken";

import { Provider } from "react-redux";
import store from "./store";

//import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Cashier from "./components/layout/Cashier";
import Customer from "./components/layout/Customer";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";
import CreatePoS from "./components/create-pos/CreatePoS";
import POSDashboard from "./components/pos-dashboard/POSDashboard";
import TransactionList from "./components/layout/TransactionList";

import "./App.css";

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
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
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/cashier" component={Cashier} />
            <Route exact path="/customer" component={Customer} />
            <Route exact path="/create-pos" component={CreatePoS} />
            <Route exact path="/pos-dashboard" component={POSDashboard} />
            <Route exact path="/transactions" component={TransactionList}/>
          </div>
        </Router>
      </Provider>
    );
  }
}
export default App;
