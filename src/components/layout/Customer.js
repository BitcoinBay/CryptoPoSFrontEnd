import React from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import openSocket from 'socket.io-client';

//import * as BITBOXCli from "bitbox-sdk";

// initialize BITBOX
//const BITBOX = new BITBOXCli.default({ restURL: "https://trest.bitcoin.com/v2/" });

const socket = openSocket('http://localhost:3000');

export default class Customer extends React.Component {
  constructor() {
    super();
  }

  render() {
    return(
      <div className="customer-page">
        <Helmet>
          <title>Customer Page</title>
          <meta
            name="description"
            content="Customer Page for CryptoPoS"
          />
        </Helmet>
        <h4>
          <b>Login</b> into customer page is {" "}
          <span style={{ fontFamily: "monospace" }}>successful</span>. Made by Bitcoin Bay
        </h4>

        <h2>choose payment option</h2>
        <button>Bitcoin <b>BTC</b></button>
        <button>Bitcoin Cash <b>BCH</b></button>
        <button>Ethereum <b>ETH</b></button>
  
      </div>
    );
  }
}