import React from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import openSocket from 'socket.io-client';

//import * as BITBOXCli from "bitbox-sdk";

// initialize BITBOX
//const BITBOX = new BITBOXCli.default({ restURL: "https://trest.bitcoin.com/v2/" });

const socket = openSocket('http://localhost:3000');

export default class Cashier extends React.Component {
  constructor() {
    super();
  }

  render() {
    return(
      <div className="cashier-page">
        <Helmet>
          <title>Cashier Page</title>
          <meta
            name="description"
            content="Cashier Page for CryptoPoS"
          />
        </Helmet>
        <h4>
          <b>Login</b> into cashier page is {" "}
          <span style={{ fontFamily: "monospace" }}>successful</span>. Made by Bitcoin Bay
        </h4>
      </div>
    );
  }
}
