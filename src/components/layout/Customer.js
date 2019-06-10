import React from 'react';
import { Helmet } from 'react-helmet';
import openSocket from 'socket.io-client';
import './styles/customer.scss'
import  QRAddress21 from '../QRAddress21';
import bitcoinbay from '../../images/bitcoinbay.jpeg';

//import { Dropdown } from 'semantic-ui-react'
//import { Link } from 'react-router-dom';
//import PaymentSucess from './PaymentSucess';

//import * as BITBOXCli from "bitbox-sdk";

// initialize BITBOX
//const BITBOX = new BITBOXCli.default({ restURL: "https://trest.bitcoin.com/v2/" });

const socket = openSocket('http://localhost:3000');

const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);

export default class Customer extends React.Component {
  constructor() {
    super();
    this.state = {
      cryptoType: 'BCH',
      fiatType: 'CAD',
      cryptoAmount: 0,
      fiatAmount:0,
      cryptoPrice: 0,
      url: null,
      isToggleuPaid: true,

    }
    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
		this.setState(function(prevState) {
			return {isToggleuPaid: !prevState.isToggleuPaid};
		});
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
      <div className="cashier-page wrapper">
        <div className="main">
          <br />
          <article>
            <Helmet>
              <title>Customer POS Page</title>
              <meta name="description" content="CashierPOS Page" />
            </Helmet>
            { !this.state.url
              ? <div>
                  <h1>Bitcoin Bay Point of Sales</h1>
                  <img src={bitcoinbay} alt="image" width="100%" height="100%"/>
                  <br/>
                  <br/>
                  <QRAddress21 value="https://www.meetup.com/The-Bitcoin-Bay"/>
                </div>
              : (
                <div>
                  <h2>
                    Please Send Your {this.state.cryptoAmount} {this.state.cryptoType} To The Following Address
                  </h2>
                  <QRAddress21 value={this.state.url} />
                  <h3>$ {this.state.fiatAmount} {this.state.fiatType}</h3>
                  <h3>@ $ {this.state.cryptoPrice} {this.state.fiatType} / {this.state.cryptoType}</h3>
                </div>
              )
            }
        </article>
        {/*
          <button onClick={this.handleClick}>
            {this.state.isToggleuPaid ? 'UNPAID'  : 'PAID'}
          </button>
        */}
        </div>
      </div>
    );
  }
}
