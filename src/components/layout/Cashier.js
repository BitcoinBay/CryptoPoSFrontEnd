//const command = require("shebang!../bin/command");
import React from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import openSocket from 'socket.io-client';
import QRAddress21 from '../QRAddress21';

import injectSheet, { jss } from 'react-jss';

// import styles from "./Cashier.css.js";

const BITBOXSDK = require("@chris.troutner/bitbox-js");

// initialize BITBOX
const BITBOX = new BITBOXSDK({ restURL: "https://trest.bitcoin.com/v2/" });

const socket = openSocket('http://localhost:3000');

const api_key = '897a2b25ccd5730323919dee1201a832e5d2bb9835e6ded08dd4897f7669e8f7'
const XPubKey = "tpubDCoP9xnjhwkwC8pT7DVSPFDgbYb2uq2UAdY2DQmk2YtBpiEY8XGtT26P6NgYyc38fiuTF9x3MAtKmuUR2HPd7qKQmAYD5NTpfVy5SzZntWN";
const defaultWebURL = 'https://www.meetup.com/The-Bitcoin-Bay';

const styles = {
    vertical_wrapper: {
        height: "100vh"
    },

    crypto_header: {
        marginLeft: "-125px",
        marginBottom: "7px",
        fontFamily: "Roboto, sans-serif"
    },

    fiat_header: {
        marginLeft: "-142px",
        marginBottom: "7px",
        fontFamily: "Roboto, sans-serif"
    },

    crypto_currency_button: {
        background: "#FFFFFF",
        color: "#000000",
        width: "70px",
        height: "45px",
        margin: "4px",
        boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.24), 0px 0px 2px rgba(0, 0, 0, 0.12)",
        border: "2px solid #999999",
        outline: "none",
        fontFamily: "Roboto, sans-serif",
        fontWeight: "bold"
    },

    fiat_currency_button: {
        background: "#FFFFFF",
        color: "#000000",
        width: "70px",
        height: "45px",
        margin: "4px",
        borderRadius: "40px",
        boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.24), 0px 0px 2px rgba(0, 0, 0, 0.12)",
        border: "2px solid #999999",
        outline: "none",
        fontFamily: "Roboto, sans-serif",
        fontWeight: "bold"
    },

    input_header: {
        marginLeft: "-134px",
        marginBottom: "7px",
        fontFamily: "Roboto, sans-serif",
    },
    
    amount_input: {
        fontFamily: "Poppins, sans-serif",
        fontSize: "32px !important",
        fontWeight: "bold",
    },

    confirm_payment_button: {
        background: "#289B00",
        borderRadius: "30px",
        fontFamily: "Roboto, sans-serif",
        fontWeight: "bold",
        fontSize: "14px",
        padding: "15px 30px",
        height: "50px",
        lineHeight: "16px"
    }
};

class Cashier extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.updatePrices = this.updatePrices.bind(this);
    this.calculateCryptoAmount = this.calculateCryptoAmount.bind(this);
    this.sendSocketIO = this.sendSocketIO.bind(this);
    this.toggleCurrency = this.toggleCurrency.bind(this);
    this.updateAmount = this.updateAmount.bind(this);

    this.state = {
      jsonData: null,
      cryptoType: '',
      fiatType: '',
      fiatAmount: 0,
      cryptoAmount: 0,
      cryptoPrice: 0,
      url: defaultWebURL,
      pos_id: "",
      pos_xpubs: [],
      currency_xpub_address: "",
      payment_amount_input_value: "",
      payment_amount: ""
    }
  }

  sendSocketIO(msg) {
    console.log(msg);
    socket.emit('event', msg);
  }

  componentDidMount() {
    this.updatePrices();
    setInterval(() => {
      this.updatePrices();
    }, 600000);

    this.setState({ pos_id: this.props.location.search.substring(3) }, () => {
      const pos_data = {
        pos_id: this.state.pos_id
      };

      axios.post("/api/get-all-pos-xpubs", pos_data).then((res) => {
        this.setState({ pos_xpubs: res.data.xpubs });
      });
    });
  }

  calculateCryptoAmount() {
    let cryptoAmount = this.state.payment_amount / this.state.cryptoPrice;
    if (this.state.cryptoPrice * cryptoAmount === this.state.payment_amount) {
      this.setState({ cryptoAmount: cryptoAmount }, (evt) => {
        this.sendSocketIO([
          this.state.cryptoType,
          this.state.fiatType,
          this.state.cryptoAmount,
          this.state.payment_amount,
          this.state.cryptoPrice])
      });
    }
  }

  handleClick(event) {
    let payAmount = parseFloat(event.target.value);
    console.log(payAmount);
    if (typeof payAmount !== "number" || payAmount === 0) {
      this.setState({ fiatAmount: 0 }, async() => {
        await this.calculateCryptoAmount();
      });
    }
    this.setState({ fiatAmount: payAmount }, async() => {
      await this.calculateCryptoAmount();
    });
  }

  sendSocketIO(msg) {
    console.log(msg);
    socket.emit('event', msg);
  }

  toggleCurrency(e) {
    const jsonData = this.state.jsonData;

    e.persist();

    if (e.target.value === "BTC" || e.target.value === "BCH" || e.target.value === "ETH") {
      this.setState({ cryptoType: e.target.value, cryptoPrice: jsonData[e.target.value][this.state.fiatType]}, () => {
        for (let i = 0; i < this.state.pos_xpubs.length; i++) {
          if (this.state.pos_xpubs[i].type === e.target.value) {
            this.state.currency_xpub_address = this.state.pos_xpubs[i].address;
          }
        }

        let crypto_currency_buttons = document.getElementById("crypto_currency_buttons");
        for (let i = 1; i < crypto_currency_buttons.children.length; i++) {
          crypto_currency_buttons.children[i].style.background = "#FFFFFF";
          crypto_currency_buttons.children[i].style.color = "#000000";
        }
        e.target.style.background = "#00A3FF";
        e.target.style.color = "#FFFFFF";

        let fiat_currency_buttons = document.getElementById("fiat_currency_buttons");
        for (let i = 1; i < fiat_currency_buttons.children.length; i++) {
          fiat_currency_buttons.children[i].disabled = false;
        }
      });
    } else if (e.target.value === "USD" || e.target.value === "CAD" || e.target.value === "EUR") {
      this.setState({ fiatType: e.target.value, cryptoPrice: jsonData[this.state.cryptoType][e.target.value]}, () => {
        let fiat_currency_buttons = document.getElementById("fiat_currency_buttons");
        for (let i = 1; i < fiat_currency_buttons.children.length; i++) {
          fiat_currency_buttons.children[i].style.background = "#FFFFFF";
          fiat_currency_buttons.children[i].style.color = "#000000";
        }
        e.target.style.background = "#00A3FF";
        e.target.style.color = "#FFFFFF";

        if (this.state.fiatType === "CAD" || this.state.fiatType === "USD") {
          this.setState({ payment_amount_input_value: "$" }, () => {

            // let event = document.createEvent('HTMLEvents');
            // event.initEvent('change', true, false);
            // this.amount_input.dispatchEvent(event);
          });
        } else if (this.state.fiatType === "EUR") {
          this.setState({ payment_amount_input_value: "€" });
        }
      });
    }
  }

  updatePrices() {
    axios
      .get('/api/datafeed')
      .then(res => {
        this.setState({ jsonData: res.data.status }, () => {
          console.log(this.state.jsonData)
        });
      })
      .catch(err => {
        console.log(err);
      })
  }

  updateAmount(event) {
    let amount_string;

    if (event.target.value.length === 1 && event.target.value.match("^[0-9]")) {
      amount_string = event.target.value;
    } else {
      amount_string = event.target.value.substring(1);
    }

    this.setState({ payment_amount: amount_string }, (event) => {
      let currency_character;
      if (this.state.fiatType === "CAD" || this.state.fiatType === "USD") {
        currency_character = "$";
      } else if (this.state.fiatType === "EUR") {
        currency_character = "€"
      }

      this.setState({ payment_amount_input_value: currency_character + this.state.payment_amount });
    });
  }

  render() {
    const { classes } = this.props;
    return(
        <div className="feature-page">
          <Helmet>
            <title>Cashier Page</title>
            <meta
              name="description"
              content="Feature page of React.js Boilerplate application"
            />
          </Helmet>
          <div className={"valign-wrapper " + classes.vertical_wrapper}>
            <div className="container">
              <div className="row">
                { /* TODO: Conditionally render these buttons based on available currencies */ }
                <div className="col s12 m6 offset-m3 center-align" id="crypto_currency_buttons">
                  <p className={classes.crypto_header}>Cryptocurrency</p>
                  <button className={"btn " + classes.crypto_currency_button}
                      value="BTC" onClick={this.toggleCurrency}>BTC</button>
                  <button className={"btn " + classes.crypto_currency_button}
                      value="BCH" onClick={this.toggleCurrency}>BCH</button>
                  <button className={"btn " + classes.crypto_currency_button}
                      value="ETH" onClick={this.toggleCurrency}>ETH</button>
                </div>
              </div>

              <div className="row">
                <div className="col s12 m6 offset-m3 center-align" id="fiat_currency_buttons">
                  <p className={classes.fiat_header}>Fiat currency</p>
                  <button disabled={this.state.cryptoType === ''} className={"btn " + classes.fiat_currency_button}
                      value="USD" onClick={this.toggleCurrency}>USD</button>
                  <button disabled={this.state.cryptoType === ''} className={"btn " + classes.fiat_currency_button}
                      value="CAD" onClick={this.toggleCurrency}>CAD</button>
                  <button disabled={this.state.cryptoType === ''} className={"btn " + classes.fiat_currency_button}
                      value="EUR" onClick={this.toggleCurrency}>EUR</button>
                </div>
              </div>

              <div className="row">
                <div className="col s8 offset-s2 m4 offset-m4 xl2 offset-xl5 center-align">
                  <p hidden={ this.state.fiatType === '' } className={classes.input_header}>Amount {this.state.fiatType != '' ? "(" + this.state.fiatType + ")" : ""} </p>
                  <input disabled={this.state.fiatType === ''} className={classes.amount_input} onChange={ this.updateAmount }
                      value={ this.state.payment_amount_input_value } type="text" id="amount_input" ref={(input) => {this.amount_input = input}}/>
                </div>
              </div>

              <div className="row">
                <div className="col s12 m6 offset-m3 center-align">
                  <button disabled={this.state.payment_amount === ""}
                      onClick={() => {
                        this.calculateCryptoAmount();
                      }}
                      className={"btn " + classes.confirm_payment_button}>
                    CONFIRM PAYMENT
                  </button>
                </div>
              </div>

                {/* { this.state.url === ''
                  ? <QRAddress21 value={defaultWebURL}  />
                  : (
                    <div>
                      <QRAddress21 value={this.state.url} />
                    </div>
                  )
                } */}

              {/* <div className="row">
                <div className="col s6 offset-s3 center-align">
                  <button class="btn btn-large waves-effect waves-light hoverable blue accent-3" onClick={this.updatePrices}>Update Price</button>
                  <button class="btn btn-large waves-effect waves-light hoverable blue accent-3" type="button" onClick={() => this.sendSocketIO([this.state.cryptoType, this.state.fiatType, this.state.cryptoAmount, this.state.fiatAmount, this.state.cryptoPrice,])}>Pay Now</button>
                  <p>  {this.state.cryptoPrice} {this.state.fiatType} / {this.state.cryptoType}</p>
                  <p>{this.state.cryptoAmount} {this.state.cryptoType}</p>
                  <p>$ {this.state.fiatAmount} {this.state.fiatType}</p>
                </div>
              </div> */}
            </div>
          </div>
        </div>
  )}
}

export default injectSheet(styles)(Cashier);
