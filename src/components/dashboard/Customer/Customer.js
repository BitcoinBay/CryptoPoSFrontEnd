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

const api_key = '897a2b25ccd5730323919dee1201a832e5d2bb9835e6ded08dd4897f7669e8f7'
const XPubKey = "tpubDCoP9xnjhwkwC8pT7DVSPFDgbYb2uq2UAdY2DQmk2YtBpiEY8XGtT26P6NgYyc38fiuTF9x3MAtKmuUR2HPd7qKQmAYD5NTpfVy5SzZntWN";
const defaultWebURL = 'https://www.meetup.com/The-Bitcoin-Bay';


export default class Cashier extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.updatePrices = this.updatePrices.bind(this);
    this.calculateCryptoAmount = this.calculateCryptoAmount.bind(this);
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

  sendSocketIO(msg) {
    console.log(msg);
    socket.emit('event', msg);
  }

  componentDidMount() {
    this.updatePrices();
    setInterval(() => {
      this.updatePrices();
    }, 600000);
  }

  calculateCryptoAmount() {
    let cryptoAmount = this.state.fiatAmount / this.state.cryptoPrice;
    if (this.state.cryptoPrice * cryptoAmount === this.state.fiatAmount) {
      this.setState({ cryptoAmount: cryptoAmount });
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

  toggleCryptoType(e) {
    console.log(e.target.value);
    const jsonData = this.state.jsonData;

    if (e.target.value === "BTC" || e.target.value === "BCH" || e.target.value === "ETH") {
      this.setState({ cryptoType: e.target.value, cryptoPrice: jsonData[e.target.value][this.state.fiatType]}, () => {
        console.log(this.state);
      });
    } else if (e.target.value === "USD" || e.target.value === "CAD" || e.target.value === "EUR") {
      this.setState({ fiatType: e.target.value, cryptoPrice: jsonData[this.state.cryptoType][e.target.value]}, () => {
        console.log(this.state);
      })
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
                  type="button" onClick={() => this.sendSocketIO([this.state.cryptoType, this.state.fiatType, this.state.cryptoAmount, this.state.fiatAmount, this.state.cryptoPrice,])}>Pay Now</button>
          <p>$ {this.state.cryptoPrice} {this.state.fiatType} / {this.state.cryptoType}</p>
          <p>{this.state.cryptoAmount} {this.state.cryptoType}</p>
          <p>$ {this.state.fiatAmount} {this.state.fiatType}</p>
        </div>
        </div>

    );
  }
}