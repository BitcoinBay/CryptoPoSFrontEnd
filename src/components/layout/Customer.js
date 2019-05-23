import React from 'react';
import { Helmet } from 'react-helmet';
import openSocket from 'socket.io-client';
import './styles/customer.css'
import  QRAddress21 from './../QRAddress21';
import { Dropdown } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import PaymentSucess from './PaymentSucess';
// var QRCode = require('qrcode.react');

//import * as BITBOXCli from "bitbox-sdk";

// initialize BITBOX
//const BITBOX = new BITBOXCli.default({ restURL: "https://trest.bitcoin.com/v2/" });

const socket = openSocket('http://localhost:3000');
const defaultWebURL = 'https://www.meetup.com/The-Bitcoin-Bay';

const options = [
  { key: 1, text: 'CAD', value: 1 },
  { key: 2, text: 'BCH', value: 2 },
  
]

const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);

export default class Customer extends React.Component {


  constructor() {
    super();
    this.state = {
      // value: '45.98',
      // url: defaultWebURL,
      cryptoType: 'BCH',
      fiatType: 'CAD',
      cryptoAmount: 0,
      fiatAmount:0,
      cryptoPrice: 40.30,
      url: defaultWebURL,
     
    } 
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
        <button  className="btn btn-large waves-effect waves-light hoverable blue accent-3" style={{
                width: "170px",
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
        <button className="btn btn-large waves-effect waves-light hoverable blue accent-3" style={{
                width: "170px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                marginTop: "5rem" ,
                textAlign:"center",
                fontFamily: "font-family: 'Lato', sans-serif;",
                color:"red",
                marginRight:"-15px",
                marginLeft: "28px"
                
              }} ><Link to={"/cashier"} className="lin">New Order</Link></button>
          </div>  

        {/* <h4>
          <b>Login</b> into cashier page is {" "}
          <span style={{ fontFamily: "monospace" }}>successful</span>. Made by Bitcoin Bay
        </h4> */}
        {/* <h1><QRCode value="http://facebook.github.io/react/" /></h1> */}
        <div className="main">
        <h3 className="heading">Please Send Your <a className="bitcoin">0.3143hBCH</a> To This Address</h3>
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
      <label className="equ">Equivalet in CAD</label>
      <h1>$ {this.state.cryptoPrice} {this.state.fiatType} / {this.state.cryptoType}</h1>
      <label className="equ">Denominated in</label>
      <p>{this.state.cryptoAmount} {this.state.cryptoType}</p>
      <p>$ {this.state.fiatAmount} {this.state.fiatType}</p>
    </article>
    <Dropdown selection options={options}  placeholder='CAD' />
    </div>
    </div>
    
    );
  }
}
