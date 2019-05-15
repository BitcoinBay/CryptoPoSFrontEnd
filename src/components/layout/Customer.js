import React from 'react';
import { Helmet } from 'react-helmet';
import openSocket from 'socket.io-client';

//import * as BITBOXCli from "bitbox-sdk";

// initialize BITBOX
//const BITBOX = new BITBOXCli.default({ restURL: "https://trest.bitcoin.com/v2/" });

const socket = openSocket('http://localhost:3000');
const defaultWebURL = 'https://www.meetup.com/The-Bitcoin-Bay';

export default class Customer extends React.Component {
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.state = {
      cryptoType: 'BCH',
      fiatType: 'CAD',
      cryptoAmount: 0,
      fiatAmount: 0,
      cryptoPrice: 0,
      url: defaultWebURL,
    };
  }

  componentDidMount() {
    socket.on('event', msg => this.update(msg));
  }

  update(data) {
    console.log(data);
    this.setState({
      cryptoType: data[0],
      fiatType: data[1],
      cryptoAmount: data[2],
      fiatAmount: data[3],
      cryptoPrice: data[4],
      url: data[5],
    }, () => console.log(this.state));
  }

  render() {
    return (
      <div className="cashier-page">
        <Helmet>
          <title>Customer Page</title>
          <meta
            name="description"
            content="Customer Page for CryptoPoS"
          />
        </Helmet>
        <h4>
          <b>Login</b> into cashier page is {" "}
          <span style={{ fontFamily: "monospace" }}>successful</span>. Made by Bitcoin Bay
        </h4>
        <p>$ {this.state.cryptoPrice} {this.state.fiatType} / {this.state.cryptoType}</p>
        <p>{this.state.cryptoAmount} {this.state.cryptoType}</p>
        <p>$ {this.state.fiatAmount} {this.state.fiatType}</p>
      </div>
    );
  }
}
