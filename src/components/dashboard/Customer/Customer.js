/*
 * Cashier
 *
 * Cashier-facing Point of Sale page
 */
import React from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import openSocket from 'socket.io-client';

import QRAddress21 from '../../components/QRAddress21';
import './style.scss';

const socket = openSocket('http://localhost:3000');
const defaultWebURL = 'https://www.meetup.com/The-Bitcoin-Bay';

export default class Customer extends React.Component {
  constructor(props) {
    super(props);
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
      <article>
        <Helmet>
          <title>Customer POS Page</title>
          <meta name="description" content="CashierPOS Page" />
        </Helmet>
        { this.state.url === ''
          ? <QRAddress21 value={defaultWebURL} />
          : (
            <div>
              <QRAddress21 value={this.state.url} />
            </div>
          )
        }
        <p>$ {this.state.cryptoPrice} {this.state.fiatType} / {this.state.cryptoType}</p>
        <p>{this.state.cryptoAmount} {this.state.cryptoType}</p>
        <p>$ {this.state.fiatAmount} {this.state.fiatType}</p>
      </article>
    );
  }
}
