import React from 'react';
import { Helmet } from 'react-helmet';
import socketClient from 'socket.io-client';
import  QRAddress21 from '../QRAddress21';
import bitcoinbay from '../../images/bitcoinbay.jpeg';

const socket = socketClient('http://192.168.1.10:3000');
//const socket = socketClient('http://192.168.1.10:5000');

const defaultWebURL = 'https://www.meetup.com/The-Bitcoin-Bay';
const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);

export default class Customer extends React.Component {
  constructor() {
    super();
    this.update = this.update.bind(this);
    this.state = {
      cryptoType: 'BCH',
      fiatType: 'CAD',
      cryptoAmount: 0,
      fiatAmount:0,
      cryptoPrice: 0,
      url: defaultWebURL,
      isToggleuPaid: true,
      isPayment: false,
      pos_id: null
    }
  }

  componentDidMount() {
    this.setState({ pos_id: this.props.location.search.substring(3) }, async () => {
      const pos_data = {
        pos_id: this.state.pos_id
      };

      socket.on('connect', () => {
        console.log(socket.id);
        socket.emit('add-user', pos_data);
        socket.on('paymentRequest', msg => this.update(msg));
      })
    });
  }

  update(data) {
    console.log(data);
    if (data.paymentData) {
      this.setState({
        cryptoType: data.paymentData[0],
        fiatType: data.paymentData[1],
        cryptoAmount: data.paymentData[2],
        fiatAmount: data.paymentData[3],
        cryptoPrice: data.paymentData[4],
        url: data.paymentData[5],
        isPayment: true
      }, () => console.log(this.state));
    } else {
      this.setState({
        url: defaultWebURL,
        isPayment: false
      })
    }
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
            { this.state.isPayment === false
              ? <div>
                  <h1>Bitcoin Bay Point of Sales</h1>
                  <img src={bitcoinbay} alt="logo" width="100%" height="100%"/>
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
        </div>
      </div>
    );
  }
}
