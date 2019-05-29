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
       <div className= "wrap">
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
              }} ><Link to={"/PaymentSucess"} className="lin">Ordersucess</Link>
              </button>
          </div>
        <div className="main">
        <p className="heading">Please Send </p>
        <h1 className="amt">Your {this.state.fiatAmount} {this.state.cryptoType}</h1>
        <p className="sen">To This Address</p>
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
      <h3 className="equ">Equivalet in CAD</h3>
      <h1>$ {this.state.cryptoPrice} {this.state.fiatType} / {this.state.cryptoType}</h1>
      <label className="equ" style={{
        fontSize: '15px',
        fontWeight: 'bold',
        marginTop: '30px'
      }}
        >Denominated in</label>
      <p>{this.state.cryptoAmount} {this.state.cryptoType}</p>
      <p>$ {this.state.fiatAmount} {this.state.fiatType}</p>
    </article>
    <h3 className="status">Status</h3>
    <button onClick={this.handleClick}>
        {this.state.isToggleuPaid ? 'UNPAID'  : 'PAID'}
      </button>
    </div>
    </div>

    );
  }
}
