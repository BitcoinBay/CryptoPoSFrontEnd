import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import M from "materialize-css";

class POSDashboard extends Component {
  constructor() {
    super();
    this.state = {
      pos_id: "",
      pos_name: "",
      pos_currencies: [],
      value: "",
      xpub_type: "",
      xpub_address: ""
    };
  }

  componentDidMount() {
    M.FormSelect.init(this.select);

    this.setState({ pos_id: this.props.location.search.substring(3) }, () => {
      const pos_data = {
        pos_id: this.state.pos_id
      };

      axios.post('/api/get-pos-by-id', pos_data).then((res) => {
        this.setState({ pos_name: res.data.name });
        let db_currencies = [];
        for (let i = 0; i < res.data.xpubs.length; i++) {
          db_currencies.push(res.data.xpubs[i].type);
        }
        this.setState({ pos_currencies: db_currencies });
      });
    });
  }

  deletePOS = () => {
    const pos_data = {
      user_id: this.props.auth.user.id,
      pos_id: this.state.pos_id
    };

    axios.post('/api/delete-pos', pos_data).then((res) => {
      this.props.history.push('/dashboard');
    });
  }

  onChange = (event) => {
      this.setState({ [event.target.id]: event.target.value });
  }

  addNewPaymentMethod = () => {
    const xpub_data = {
      pos_id: this.state.pos_id,
      type: this.state.xpub_type,
      address: this.state.xpub_address
    };

    axios.post('/api/add-xpub', xpub_data).then((res) => {
      let updated_currencies = this.state.pos_currencies.slice();
      updated_currencies.push(xpub_data.type);
      this.setState({ pos_currencies: updated_currencies });
    });
  }

  render() {
    return (
      <div className="container">
        <div style={{ marginTop: "4rem" }} className="row">
          <div className="col s8 offset-s2">
            <Link to="/dashboard" className="btn-flat waves-effect">
              <i className="material-icons left">keyboard_backspace</i> Back to dashboard
            </Link>

            <div className="col s12" style={{ paddingLeft: "18px" }}>
              <h3>
                {this.state.pos_name} is currently accepting payments in
                {
                  this.state.pos_currencies.map((currency, i) =>
                    { if (i === 0) {
                        return (<span key={i}> {currency}</span>);
                      } else {
                        return (<span key={i}>, {currency}</span>);
                      }
                    }
                  )
                }
              </h3>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="landing-copy col s12 center-align">
            <Link
              to = {{ pathname: "/cashier/", search: "?p=" + this.state.pos_id }}
              style={{
                width: '198.5px',
                borderRadius: "3px",
                letterSpacing: "1.5px",
                marginTop: "1rem",
                margin: "14px"
              }}
              className="btn btn-large waves-light hoverable blue
                  accent-3"
            >
              Cashier Page
            </Link>

            <Link
              to = {{ pathname: "/customer/", search: "?p=" + this.state.pos_id }}
              style={{
                width: '198.5px',
                borderRadius: "3px",
                letterSpacing: "1.5px",
                marginTop: "1rem",
                margin: "14px"
              }}
              className="btn btn-large  waves-light hoverable blue accent-3"
            >
              Customer Page
            </Link>

            <Link
              to = {{ pathname: "/order/", search: "?p=" + this.state.pos_id }}
              style={{
                width: "190px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                marginTop: "1rem",
                margin: "14px",
                textAlign:"center"
              }}
              className="btn btn-large  waves-light hoverable blue accent-3"
            >
              Transcation
            </Link>
          </div>
        </div>

        <div className="row">
          <div className="col s8 offset-s2">
            <hr/>
          </div>
        </div>

        <div className="row">
          <div className="col s8 offset-s2">
            <h3>Add a new payment method</h3>
              <div className="input-field col s12">
                  <select id="xpub_type" defaultValue=""
                          onChange={ this.onChange }
                          value={ this.state.xpub_type }
                          ref={ (select) => this.select = select }>
                      <option value="">Choose a currency</option>
                      <option value="BTC">Bitcoin</option>
                      <option value="BCH">Bitcoin Cash</option>
                      <option value="ETH">Ethereum</option>
                      <option value="TSN">TestNet</option>
                  </select>
              </div>

              <div className="input-field col s12">
                  <input id="xpub_address" type="text"
                          onChange={ this.onChange }
                          value={ this.state.xpub_address } />
                  <label htmlFor="xpub_address">
                      Wallet xPub Address
                  </label>
              </div>

              <div className="col s12"
                      style={{ paddingLeft: "10px" }}>
                  <button
                  style={{
                      borderRadius: "3px",
                      letterSpacing: "1.5px",
                      marginTop: "1rem"
                  }}
                  onClick={this.addNewPaymentMethod}
                  className="btn btn-large  waves-light
                          hoverable blue accent-3">Add new payment method</button>
              </div>
          </div>
        </div>

        <div className="row">
          <div className="col s8 offset-s2">
            <hr/>
          </div>
        </div>

        <div className="row">
          <div className="col s12 center-align">
            <button className="btn btn-large  waves-light hoverable red
                accent-3"
              style={{
                borderRadius: "3px",
                letterSpacing: "1.5px",
                marginTop: "1rem",
                margin: "14px"
              }}
              onClick={this.deletePOS}
            >Delete '{ this.state.pos_name }'</button>
          </div>
        </div>
      </div>
    );
  }
}

POSDashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  pos: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  pos: state.pos
});

export default connect(mapStateToProps)(POSDashboard);
