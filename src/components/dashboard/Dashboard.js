import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { Link } from "react-router-dom";
import axios from "axios";

import './style.scss';

class Dashboard extends Component {

  constructor() {
    super();

    this.state = {
      user_pos_systems: []
    };
  }

  componentDidMount() {
    const user_data = {
      user_id: this.props.auth.user.id
    };

    axios.post("/api/get-all-user-pos", user_data).then((res) => {
      this.setState({ user_pos_systems: res.data });
    });
  }

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="row">
          <div className="landing-copy col s12 center-align">
<<<<<<< HEAD
            <h4>
              {/* <b>Hey there,</b> {user.name.split(" ")[0]} */}
              <p className="flow-text grey-text text-darken-1">
                You are logged into a full-stack{" "}
                <span style={{ fontFamily: "monospace" }}>MERN</span> app 👏
              </p>
            </h4>
            <div className="col s6">
              <Link
                to="/cashier"
                style={{
                  width: "140px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px"
                }}
                className="btn btn-large waves-effect waves-light hoverable blue accent-3"
              >
                Cashier
              </Link>
            </div><div className="col s6">
              <Link
                to="/customer"
                style={{
                  width: "140px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px"
                }}
                className="btn btn-large waves-effect waves-light hoverable blue accent-3"
              >
                Customer
              </Link>
            </div>
=======
            <Link
              to= "/cashier"
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
>>>>>>> 85f57fe7eea587ea04da2fbf84f451616e98fd5a
            <button
              style={{
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                marginTop: "1rem"
              }}
              onClick={this.onLogoutClick}
              className="btn btn-large waves-effect waves-light hoverable blue accent-3"
            >
              Logout
            </button>
          </div>
          <div className="s12 center-align">
            <Link
              to = "/create-pos"
              style={{
                width: "210px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                marginTop: "1rem"
              }}
              className="btn btn-large waves-effect waves-light hoverable blue accent-3"
            >
              Create New PoS
            </Link>
          </div>
          
          <div className="s12 center-align" id="pos_list">
            {
              this.state.user_pos_systems.map((pos, i) =>
                  <button className="btn btn-large waves-effect waves-light hoverable green accent-3" key={i}>{pos.name}</button>
              )
            }
          </div>
        </div>
      </div>
    );
  }

}

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Dashboard);
