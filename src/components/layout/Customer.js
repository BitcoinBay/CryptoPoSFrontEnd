import React from 'react';
import { Helmet } from 'react-helmet';
import openSocket from 'socket.io-client';
import './styles/customer.scss'
import  QRAddress21 from '../QRAddress21';
import { Dropdown } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import PaymentSucess from './PaymentSucess';

//import * as BITBOXCli from "bitbox-sdk";

// initialize BITBOX
//const BITBOX = new BITBOXCli.default({ restURL: "https://trest.bitcoin.com/v2/" });

const socket = openSocket('http://localhost:3000');
const defaultWebURL = 'https://www.meetup.com/The-Bitcoin-Bay';


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
      url: defaultWebURL,
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
        <Helmet>
          <title>Customer Page</title>
          <meta
            name="description"
            content="Customer Page for CryptoPoS"
          />
        </Helmet>
       {/*<div className= "wrap">
        <button  className="btn btn-large waves-effect waves-light hoverable blue accent-3"  style={{
            width: "200px",
            borderRadius: "3px",
            letterSpacing: "1.5px",
            marginTop: "5rem" ,
            textAlign:"center",
            fontFamily: "font-family: 'Lato', sans-serif;",
            color:"red",
            marginRight:"-15px",
            marginLeft: "28px"


            }} ><Link to={"/PaymentSucess"} className="lin">Order success</Link>
          </button>
        </div>*/}
        <div className="main">
        <br />
        <h2 className="send">
          Please Send Your {this.state.cryptoAmount} {this.state.cryptoType} To The Following Address
        </h2>
      <article>
      <Helmet>
        <title>Customer POS Page</title>
        <meta name="description" content="CashierPOS Page" />
      </Helmet>
      { this.state.url === ''
        ? <QRAddress21 value={defaultWebURL}  />
        : (
          <div>
            <QRAddress21 value={this.state.url} />
          </div>
        )
      }
      <h3>$ {this.state.fiatAmount} {this.state.fiatType}</h3>
      <h3>@ $ {this.state.cryptoPrice} {this.state.fiatType} / {this.state.cryptoType}</h3>
    </article>
    <button onClick={this.handleClick}>
        {this.state.isToggleuPaid ? 'UNPAID'  : 'PAID'}
      </button>
    </div>
    </div>

    );
  }
}
