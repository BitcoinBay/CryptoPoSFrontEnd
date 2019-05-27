import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { Link } from "react-router-dom";
import axios from "axios";

class POSDashboard extends Component {

  constructor() {
    super();

    this.state = {
      pos_id: ""
    };
  }

  componentDidMount() {
    this.setState({ pos_id: this.props.location.query });
  }

  render() {
    return (
      <div className="container"> 
        <div style={{ marginTop: "4rem" }} className="row">
          <div className="col s8 offset-s2">
            <Link to="/dashboard" className="btn-flat waves-effect">
              <i className="material-icons left">keyboard_backspace</i> Back to dashboard
            </Link>
          </div>
          <div className="landing-copy col s12 center-align">
            <Link
              to = {{ pathname: "/cashier", query: this.state.pos_id }}
              style={{
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                marginTop: "1rem"
              }}
              className="btn btn-large waves-effect waves-light hoverable blue accent-3"
            >
              Cashier
            </Link>

            <Link
              to = "/customer"
              style={{
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                marginTop: "1rem"
              }}
              className="btn btn-large waves-effect waves-light hoverable blue accent-3"
            >
              Customer
            </Link>
          </div>
        </div>
      </div>
    );
  }

}

POSDashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(POSDashboard);
