//const command = require("shebang!../bin/command");
import React from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import openSocket from 'socket.io-client';
import QRAddress21 from '../QRAddress21';

const BITBOXSDK = require("@chris.troutner/bitbox-js");

// initialize BITBOX
const BITBOX = new BITBOXSDK({ restURL: "https://trest.bitcoin.com/v2/" });

const socket = openSocket('http://localhost:3000');

const XPubKey = "tpubDCoP9xnjhwkwC8pT7DVSPFDgbYb2uq2UAdY2DQmk2YtBpiEY8XGtT26P6NgYyc38fiuTF9x3MAtKmuUR2HPd7qKQmAYD5NTpfVy5SzZntWN";
const defaultWebURL = 'https://www.meetup.com/The-Bitcoin-Bay';


export default class Cashier extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.updatePrices = this.updatePrices.bind(this);
    this.calculateCryptoAmount = this.calculateCryptoAmount.bind(this);
    this.generateAddress = this.generateAddress.bind(this);
    this.sendSocketIO = this.sendSocketIO.bind(this);
    this.toggleCryptoType = this.toggleCryptoType.bind(this);
    this.state = {
      jsonData: null,
      cryptoType: 'BCH',
      fiatType: 'CAD',
      fiatAmount: 0,
      cryptoAmount: 0,
      cryptoPrice: 0,
      url: defaultWebURL,
    }
  }

  componentDidMount() {
    this.updatePrices();
    setInterval(() => {
      this.updatePrices();
    }, 600000);
  }

  generateAddress() {
    let options = {
      amount: this.state.cryptoAmount,
      label: '#BitcoinBay',
    };
    let XPubAddress = BITBOX.Address.fromXPub(XPubKey, "0/0");
    let payQRAddress21 = BITBOX.BitcoinCash.encodeBIP21(XPubAddress, options);
    console.log(payQRAddress21)
    this.setState({ url: payQRAddress21 });
  }

  calculateCryptoAmount() {
    let cryptoAmount = this.state.fiatAmount / this.state.cryptoPrice;
    if (this.state.cryptoType === "ETH") {
      this.setState({ cryptoAmount: cryptoAmount.toFixed(18) }, () => {
        this.generateAddress();
      });
    } else {
      this.setState({ cryptoAmount: cryptoAmount.toFixed(8) }, () => {
        this.generateAddress();
      })
    }
  }

  handleClick(event) {
    let payAmount = parseFloat(event.target.value);
    console.log(payAmount);
    if (typeof payAmount !== "number" || payAmount === 0) {
      this.setState({ fiatAmount: 0 }, async() => {
        await this.calculateCryptoAmount();
      });
    } else {
      this.setState({ fiatAmount: payAmount }, async() => {
        await this.calculateCryptoAmount();
      });
    }
  }

  sendSocketIO(msg) {
    console.log(msg);
    socket.emit('event', msg);
  }

  toggleCryptoType(e) {
    console.log(e.target.value);
    const jsonData = this.state.jsonData;

    if (e.target.value === "BTC" || e.target.value === "BCH" || e.target.value === "ETH") {
      this.setState({ cryptoType: e.target.value, cryptoPrice: jsonData[e.target.value][this.state.fiatType]}, () => {
        console.log(this.state);
        this.calculateCryptoAmount();
      });
    } else if (e.target.value === "USD" || e.target.value === "CAD" || e.target.value === "EUR") {
      this.setState({ fiatType: e.target.value, cryptoPrice: jsonData[this.state.cryptoType][e.target.value]}, () => {
        console.log(this.state);
        this.calculateCryptoAmount();
      })
    }
  }

  updatePrices() {
    axios
      .get('/api/datafeed')
      .then(res => {
        this.setState({ jsonData: res.data.status }, () => {
          console.log(this.state.jsonData);
          this.setState({ cryptoPrice: res.data.status[this.state.cryptoType][this.state.fiatType]});
        });
      })
      .catch(err => {
        console.log(err);
      })
  }

  render() {
    return(
        <div className="feature-page">
        <Helmet>
          <title>Cashier Page</title>
          <meta
            name="description"
            content="Feature page of React.js Boilerplate application"
          />
        </Helmet>
        <div>
          <h3>Choose payment Option</h3>
          <li value={this.state.cryptoType} onClick={this.toggleCryptoType}>
            <button class="btn btn-large waves-effect waves-light hoverable blue accent-3" style={{
                    width: "170px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "5rem" ,
                    textAlign:"center",
                    fontFamily: "font-family: 'Lato', sans-serif;",
                    color:"white",
                    marginRight:"-15px",
                    marginLeft: "28px"
                  }}
                  value="BTC">BTC</button>
            <button class="btn btn-large waves-effect waves-light hoverable blue accent-3" style={{
                    width: "170px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "5rem" ,
                    textAlign:"center",
                    fontFamily: "font-family: 'Lato', sans-serif;",
                    color:"white",
                    marginRight:"-15px",
                    marginLeft: "28px"
                  }}
                  value="BCH">BCH</button>
            <button class="btn btn-large waves-effect waves-light hoverable blue accent-3" style={{
                    width: "170px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "5rem" ,
                    textAlign:"center",
                    fontFamily: "font-family: 'Lato', sans-serif;",
                    color:"white",
                    marginRight:"-15px",
                    marginLeft: "28px"
                  }}
                  value="ETH">ETH</button>
          </li>
          <li value={this.state.fiatType} onClick={this.toggleCryptoType}>
            <button class="btn btn-large waves-effect waves-light hoverable blue accent-3" style={{
                    width: "170px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "5rem" ,
                    textAlign:"center",
                    fontFamily: "font-family: 'Lato', sans-serif;",
                    color:"white",
                    marginRight:"-15px",
                    marginLeft: "28px"
                  }}
                  value="USD">USD</button>
            <button class="btn btn-large waves-effect waves-light hoverable blue accent-3" style={{
                    width: "170px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "5rem" ,
                    textAlign:"center",
                    fontFamily: "font-family: 'Lato', sans-serif;",
                    color:"white",
                    marginRight:"-15px",
                    marginLeft: "28px"
                  }}
                  value="CAD">CAD</button>
            <button class="btn btn-large waves-effect waves-light hoverable blue accent-3" style={{
                    width: "170px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "5rem" ,
                    textAlign:"center",
                    fontFamily: "font-family: 'Lato', sans-serif;",
                    color:"white",
                    marginRight:"-15px",
                    marginLeft: "28px"
                  }}
                  value="EUR">EUR</button>
          </li>
          { this.state.url === ''
            ? <QRAddress21 value={defaultWebURL}  />
            : (
              <div>
                <QRAddress21 value={this.state.url} />
              </div>
            )
          }
          <input type="text" onChange={(e) => {this.handleClick(e)}} defaultValue={1} />
          <button class="btn btn-large waves-effect waves-light hoverable blue accent-3" style={{
                  width: "170px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px",
                  marginTop: "5rem" ,
                  textAlign:"center",
                  fontFamily: "font-family: 'Lato', sans-serif;",
                  color:"white",
                  marginRight:"-15px",
                  marginLeft: "28px"
                }} onClick={this.updatePrices}>Update Price</button>
          <button class="btn btn-large waves-effect waves-light hoverable blue accent-3" style={{
                  width: "170px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px",
                  marginTop: "5rem" ,
                  textAlign:"center",
                  fontFamily: "font-family: 'Lato', sans-serif;",
                  color:"white",
                  marginRight:"-15px",
                  marginLeft: "28px"
                }}
                  type="button" onClick={() => this.sendSocketIO([this.state.cryptoType, this.state.fiatType, this.state.cryptoAmount, this.state.fiatAmount, this.state.cryptoPrice, this.state.url])}>Pay Now</button>
          <p>$ {this.state.cryptoPrice} {this.state.fiatType} / {this.state.cryptoType}</p>
          <p>{this.state.cryptoAmount} {this.state.cryptoType}</p>
          <p>$ {this.state.fiatAmount} {this.state.fiatType}</p>
        </div>
        </div>

    );
  }
}
