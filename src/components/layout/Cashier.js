import React from 'react';
//import { Helmet } from 'react-helmet';
import axios from 'axios';
import socketClient from 'socket.io-client';
import QRAddress21 from '../QRAddress21';
import './styles/cashier.scss';
import bitcoinbay from '../../images/bitcoinbay.jpeg';

import injectSheet from 'react-jss';

const HDKey = require('ethereumjs-wallet/hdkey');
const BITBOXSDK = require("@chris.troutner/bitbox-js");
// initialize BITBOX
const BITBOX = new BITBOXSDK({ restURL: "https://rest.bitcoin.com/v2/" });
const TESTBOX = new BITBOXSDK({ restURL: "https://trest.bitcoin.com/v2/" });
const socket = socketClient('http://localhost:3000');
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
//        height: "50px",
        lineHeight: "16px",
        marginLeft: "0"
    }
};

class Cashier extends React.Component {
  constructor() {
    super();
    this.toggleBip21 = this.toggleBip21.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.newOrder = this.newOrder.bind(this);
    this.cancelOrder = this.cancelOrder.bind(this);
    this.updatePrices = this.updatePrices.bind(this);
    this.calculateCryptoAmount = this.calculateCryptoAmount.bind(this);
    this.sendSocketIO = this.sendSocketIO.bind(this);
    this.toggleCurrency = this.toggleCurrency.bind(this);
    this.updateAmount = this.updateAmount.bind(this);

    this.state = {
      bip21: false,
      jsonData: null,
      cryptoType: "BCH",
      fiatType: "CAD",
      blockHeight: 0,
      fiatAmount: 0,
      cryptoAmount: 0,
      cryptoPrice: 0,
      url: defaultWebURL,
      utxo: null,
      pos_id: null,
      pos_name: null,
      pos_xpub_id: null,
      pos_xpub_array: [],
      pos_xpub_address: null,
      pos_xpub_index: 0,
      index_counter: {
        BCH: 0,
        BTC: 0,
        ETH: 0
      },
      pos_address: null,
      paymentListening: 0,
      color : "blue",
    }
  }

  onChange = () => {
    this.setState({ color: 'green' });
  }

  componentDidMount() {
    this.setState({ pos_id: this.props.location.search.substring(3) }, async () => {
      const pos_data = {
        pos_id: this.state.pos_id
      };

      socket.emit('add-user', pos_data);

      await this.updatePrices();

      axios.post("/api/get-all-pos-xpubs", pos_data).then((res) => {
        this.setState({
          pos_xpub_array: res.data.xpubs
        });
      });
    });

    setInterval(async () => {
      await this.updatePrices();
    }, 600000);
  }

  calculateCryptoAmount() {
    let cryptoAmount = this.state.fiatAmount/this.state.cryptoPrice;
    //console.log("calculate: ", cryptoAmount)
    if (cryptoAmount > 0) {
      if (this.state.cryptoType === "ETH") {
        this.setState({ cryptoAmount: cryptoAmount.toFixed(18) }, () => {
          this.generateEthereumnAddress();
        });
      } else if (this.state.cryptoType === "TSN") {
        this.setState({ cryptoAmount: 0.0001}, () => {
          this.generateTestnetAddress();
        })
      }else {
        this.setState({ cryptoAmount: cryptoAmount.toFixed(8) }, () => {
          this.generateBitcoinAddress();
        });
      }
    } else {
      this.setState({ cryptoAmount: 0, url: defaultWebURL });
    }
  }

  cancelOrder() {
    clearInterval(this.state.paymentListening);
    this.setState({ paymentListening: 0 });
  }

  generateBitcoinAddress() {
    let options = {
      amount: this.state.cryptoAmount,
      label: '#BitcoinBay',
    };
    let Bip21URL;
    console.log(this.state.pos_xpub_address, "\n", this.state.pos_xpub_index)
    let XPubAddress = BITBOX.Address.fromXPub(this.state.pos_xpub_address, `0/${this.state.pos_xpub_index + this.state.index_counter[this.state.cryptoType]}`);
    if (this.state.cryptoType === "BTC") {
      XPubAddress = BITBOX.Address.toLegacyAddress(XPubAddress);
    }
    if (this.state.bip21 === true) {
      Bip21URL = BITBOX.BitcoinCash.encodeBIP21(XPubAddress, options);
      this.setState({ url: Bip21URL, pos_address: XPubAddress });
    } else {
      this.setState({ url: XPubAddress, pos_address: XPubAddress });
    }
  }

  generateEthereumnAddress() {
    let fromXPub = HDKey.fromExtendedKey(this.state.pos_xpub_address);
    //console.log(XPubAddress);
    let paymentAddress = fromXPub.deriveChild(`${this.state.pos_xpub_index + this.state.index_counter[this.state.cryptoType]}`).getWallet().getAddressString();
    this.setState({ url: paymentAddress, pos_address: paymentAddress });
  }

  generateTestnetAddress() {
    let options = {
      amount: 0.0001,
      label: '#BitcoinBay',
    };

    let XPubAddress = TESTBOX.Address.fromXPub(this.state.pos_xpub_address, `0/0`);

    let Bip21URL = TESTBOX.BitcoinCash.encodeBIP21(XPubAddress, options);
    this.setState({ url: Bip21URL, pos_address: XPubAddress });
  }

  handleClick(e) {
    try {
      let payAmount = parseFloat(e.target.value);
      if (typeof payAmount !== "number" || payAmount === 0 || isNaN(payAmount)) {
        this.setState({ fiatAmount: 0 }, async() => {
          await this.calculateCryptoAmount();
        });
      } else {
        this.setState({ fiatAmount: payAmount }, async() => {
          await this.calculateCryptoAmount();
        });
      }
    } catch (err) {
      this.setState({ fiatAmount: 0 }, async() => {
        await this.calculateCryptoAmount();
      });
    }
  }

  sendSocketIO(msg) {
    console.log("Socket: ", msg);
    socket.emit('event', msg);
    let listen = setInterval(() => {
      axios
        .get(`/api/balance${this.state.cryptoType}/${this.state.pos_address}`)
        .then((res) => {
          console.log(res.data.utxo[0]);
          if (res.data.utxo) {
            if (res.data.utxo[0].confirmations === 0) {
              if (this.state.cryptoType === 'BCH') {
                this.setState({ utxo: res.data.utxo[0].txid });
              } else {
                this.setState({ utxo: res.data.utxo[0].tx_hash });
              }
              clearInterval(listen);
            }
          } else {
            return;
          };
        })
        .catch((err) => {
          console.log(err);
          return;
        })}
      , 5000);
    this.setState({ paymentListening: listen }, () => {
//      console.log(this.state.paymentListening);
    })
  }

  toggleAddressIndex(e) {
    const { index_counter } = { ...this.state };
//    console.log("index counter: ", index_counter);
//    console.log("event.target: ", e.target.value);
    let currentCrypto = index_counter;
    let value = parseInt(e.target.value);
    if (isNaN(value)) {
      value = 0;
    }

    currentCrypto[this.state.cryptoType] = value;
//    console.log("Toggle: ", currentCrypto);

    try {
      this.setState({ index_counter: currentCrypto }, () => {
        if (this.state.cryptoType === "ETH") {
          this.generateEthereumnAddress();
        } else if (this.state.cryptoType === "TSN") {
          this.generateTestnetAddress();
        } else {
          this.generateBitcoinAddress();
        }
      });
    } catch (err) {
      console.log(err);
      return;
    }
  }

  toggleBip21() {
    if (this.state.bip21 === true) {
      this.setState({ bip21: false });
    } else {
      this.setState({ bip21: true });
    }
  }

  toggleCurrency(e) {
    const jsonData = this.state.jsonData;

    e.persist();

    if (e.target.value === "BTC" || e.target.value === "BCH" || e.target.value === "ETH") {
      this.setState({ cryptoType: e.target.value, cryptoPrice: jsonData[e.target.value][this.state.fiatType]}, () => {
        let xpub_array = this.state.pos_xpub_array;
        for (let i = 0; i < this.state.pos_xpub_array.length; i++) {
          if (this.state.pos_xpub_array[i].type === this.state.cryptoType) {
            this.setState({ pos_xpub_address: xpub_array[i].address, pos_xpub_index: xpub_array[i].address_index});
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

        this.calculateCryptoAmount();
      });
    } else if (e.target.value === "TSN") {
      this.setState({ cryptoType: e.target.value, cryptoPrice: 1}, () => {
        let xpub_array = this.state.pos_xpub_array;
        for (let i = 0; i < this.state.pos_xpub_array.length; i++) {
          if (this.state.pos_xpub_array[i].type === this.state.cryptoType) {
            this.setState({ pos_xpub_address: xpub_array[i].address, pos_xpub_index: xpub_array[i].address_index});
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

        this.calculateCryptoAmount();
      })
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
          this.setState({ payment_amount_input_value: "$" });
        } else if (this.state.fiatType === "EUR") {
          this.setState({ payment_amount_input_value: "€" });
        }

        this.calculateCryptoAmount();
      });
    }
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

  // updateXPubIndex is currently not in usage
  updateXPubIndex() {
    let indexTotal = this.state.pos_xpub_index + this.state.index_counter[this.state.cryptoType];

    const pos_data = {
      id: this.state.pos_xpub_id,
      address_index: indexTotal
    };

    axios.post("/api/update-xpub-index", pos_data)
    .then((res) => {
      //        console.log(res);
    }).catch((err) => {
      //        console.log(err);
    });
  }

  async newOrder() {
    clearInterval(this.state.paymentListening);
    await this.setState({ cryptoType: 'BCH', fiatType: 'CAD', fiatAmount: 0, cryptoAmount: 0, url: defaultWebURL, paymentListening: 0, pos_address: null }, () => {
      socket.emit('event', ['BCH', 'CAD', 0, 0, 0, this.state.url, false]);
    });
  }

  async updatePrices() {
    await axios
      .get('/api/datafeed')
      .then(res => {
        this.setState({ jsonData: res.data.status }, () => {
//        console.log(this.state.jsonData);
          if (this.state.cryptoType === "TSN") {
            this.setState({ cryptoPrice: 0.0001});
          } else if (this.state.cryptoType === "BTC" || this.state.cryptoType === "BCH" || this.state.cryptoType === "ETH") {
            this.setState({ cryptoPrice: res.data.status[this.state.cryptoType][this.state.fiatType]});
            this.calculateCryptoAmount();
          }
        });
      })
      .catch(err => {
        console.log(err);
        return;
      });

    await axios
      .get('/api/blockHeight')
      .then(res => {
        this.setState({ blockHeight: res.data }, () => {
//          console.log(`${this.state.cryptoType} Block Height: `, this.state.blockHeight[this.state.cryptoType]);
          return;
        });
      });
  }

  render() {
    const { classes } = this.props;
    return(
      <div className={"valign-wrapper " + classes.vertical_wrapper}>
        <div className="container">
          { this.state.paymentListening === 0
            ? (
              <div>
                <div className="row">
                  <div className="col s12 m6 offset-m3 center-align" id="crypto_currency_buttons">
                    <p className={classes.crypto_header}>Cryptocurrency</p>
                    <button disabled={this.state.jsonData === null}
                        className={"btn " + classes.crypto_currency_button}
                        value="BTC" onClick={this.toggleCurrency}>BTC</button>
                    <button disabled={this.state.jsonData === null}
                        className={"btn " + classes.crypto_currency_button}
                        value="BCH" onClick={this.toggleCurrency}>BCH</button>
                    <button disabled={this.state.jsonData === null}
                        className={"btn " + classes.crypto_currency_button}
                        value="ETH" onClick={this.toggleCurrency}>ETH</button>
                    <button disabled={this.state.jsonData === null}
                        className={"btn " + classes.crypto_currency_button}
                        value="TSN" onClick={this.toggleCurrency}>TSN</button>
                  </div>
                </div>

                <div className="row">
                  <div className="col s12 m6 offset-m3 center-align" id="fiat_currency_buttons">
                    <p className={classes.fiat_header}>Fiat currency</p>
                    <button disabled={this.state.jsonData === null}
                        className={"btn " + classes.fiat_currency_button}
                        value="USD" onClick={this.toggleCurrency}>USD</button>
                    <button disabled={this.state.jsonData === null}
                        className={"btn " + classes.fiat_currency_button}
                        value="CAD" onClick={this.toggleCurrency}>CAD</button>
                    <button disabled={this.state.jsonData === null}
                        className={"btn " + classes.fiat_currency_button}
                        value="EUR" onClick={this.toggleCurrency}>EUR</button>
                  </div>
                </div>

                <div className="row">
                  <div className="col s8 offset-s2 m4 offset-m4 xl2 offset-xl5 center-align">
                    <p className={classes.input_header}>Amount {this.state.fiatType !== '' ? "(" + this.state.fiatType + ")" : ""} </p>
                    <input disabled={this.state.jsonData === null} value={ this.state.fiatAmount } type="number" id="amount_input" min="0" step="0.01" onChange={(e) => { this.handleClick(e) }} />
                  </div>
                </div>

                <div className="row">
                  <div className="col s8 offset-s2 m4 offset-m4 xl2 offset-xl5 center-align">
                    <img src={bitcoinbay} alt="logo" width="100%" height="100%"/>
                    {/* <input type="number" placeholder="Enter Payment Amount" min="0" step="0.01" pattern="^\d+(?:\.\d{1,2})?$" onChange={(e) => {this.handleClick(e)}} /> */}
                    <input disabled={!this.state.pos_address} type="number" placeholder="Address Index" min="0" step="1" onChange={(e) => {this.toggleAddressIndex(e)}} />
                  </div>
                </div>
              </div>
            )
            : <div className="row">
                { this.state.url === defaultWebURL
                  ? (
                    <div className="col s8 offset-s2 m4 offset-m4 xl2 offset-xl5 center-align">
                      <QRAddress21 value={defaultWebURL}  />
                    </div>
                  )
                  : (
                    <div className="col s8 offset-s2 m4 offset-m4 xl2 offset-xl5 center-align">
                      <QRAddress21 value={this.state.url} />
                    </div>
                  )
                }
              </div>
          }
          <div className="row">
            <div className="col s12 m6 offset-m3 center-align" id="crypto_currency_buttons">
              <button value="ETH" onClick={this.toggleBip21}>
                Bip21
              </button>
              <p>$ {this.state.cryptoPrice} {this.state.fiatType} / {this.state.cryptoType}</p>
              <p>{this.state.cryptoAmount} {this.state.cryptoType}</p>
              <p>$ {this.state.fiatAmount} {this.state.fiatType}</p>
              { this.state.pos_address
                ? <strong style={{ textAlign:"center" }}>{this.state.cryptoType} Address (index: {this.state.index_counter[this.state.cryptoType]}): {this.state.pos_address}</strong>
                : <strong style={{ textAlign:"center" }}>{this.state.cryptoType} Address (index: {this.state.index_counter[this.state.cryptoType]}):</strong>
              }
              <br/>
              { this.state.blockHeight
                ? (
                  <b>
                    {this.state.cryptoType} Block Height: {this.state.blockHeight[this.state.cryptoType]}
                  </b>
                )
                : <b>Block Height: </b>
              }
            </div>
          </div>
          {/* <p>$ {this.state.cryptoPrice} {this.state.fiatType} / {this.state.cryptoType}</p>
          <p>{this.state.cryptoAmount} {this.state.cryptoType}</p>
          <p>$ {this.state.fiatAmount} {this.state.fiatType}</p>
          <button className="btn btn-large  waves-light hoverable blue accent-3" onClick={() => {this.newOrder()}} style={{
                width: "170px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                textAlign:"center",
                fontFamily: "font-family: 'Lato', sans-serif",
                marginRight:"-15px",
                marginLeft: "28px"
              }} >New Order</button>
          <button className="btn btn-large  waves-light hoverable blue accent-3" style={{
                  width: "170px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px",
                  textAlign:"center",
                  fontFamily: "font-family: 'Lato', sans-serif",
                  color:"white",
                  marginRight:"-15px",
                  marginLeft: "28px"
                }} onClick={this.updatePrices}>Update Price</button>
          <button className="btn btn-large  waves-light hoverable blue accent-3" style={{
                  width: "170px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px",
                  textAlign:"center",
                  fontFamily: "font-family: 'Lato', sans-serif",
                  color:"white",
                  marginRight:"-15px",
                  marginLeft: "28px"
                }}
                  type="button" onClick={() => this.sendSocketIO([this.state.cryptoType, this.state.fiatType, this.state.cryptoAmount, this.state.fiatAmount, this.state.cryptoPrice, this.state.url, true])}>Pay Now</button>
          <button className="btn btn-large  waves-light hoverable red accent-3" onClick={() => {this.cancelOrder()}} style={{
                width: "170px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                textAlign:"center",
                fontFamily: "font-family: 'Lato', sans-serif",
                marginRight:"-15px",
                marginLeft: "28px"
              }} >Cancel Order</button>
          { this.state.paymentListening === 0
            ? <div>
                <h3>PoS XPub</h3>
                <p style={{ textAlign:"center" }}>{this.state.pos_xpub_address}</p>
              </div>
            : <h1 style={{ textAlign:"center" }}>Powered By: Bitcoin Bay</h1>
          } */}

        <div className="row">
          <div className="col s12 m4 offset-m4 center-align">
            <button onClick={async () => {
                  await this.newOrder();
                }}
                className={"btn " + classes.confirm_payment_button}>
              NEW ORDER
            </button>
          </div>
          <div className="col s12 m4 offset-m4 center-align">
            <button onClick={() => {
                  this.updatePrices();
                }}
                className={"btn " + classes.confirm_payment_button}>
              UPDATE PRICES
            </button>
          </div><div className="col s12 m4 offset-m4 center-align">
            <button onClick={() => {
                  this.sendSocketIO([this.state.cryptoType, this.state.fiatType, this.state.cryptoAmount, this.state.fiatAmount, this.state.cryptoPrice, this.state.url, true]);
                }}
                className={"btn " + classes.confirm_payment_button}>
              CONFIRM PAYMENT
            </button>
          </div><div className="col s12 m4 offset-m4 center-align">
            <button onClick={() => {
                  this.cancelOrder();
                }}
                className={"btn " + classes.confirm_payment_button}>
              CANCEL ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
    );
  }
}

export default injectSheet(styles)(Cashier);
