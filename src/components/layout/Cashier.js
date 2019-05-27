import React from 'react';
import { Helmet } from 'react-helmet';

//import * as BITBOXCli from "bitbox-sdk";

// initialize BITBOX
//const BITBOX = new BITBOXCli.default({ restURL: "https://trest.bitcoin.com/v2/" });

var QRCode = require('qrcode.react');


export default class Cashier extends React.Component {
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

        <QRCode value="hey" />,
        document.getElementById('Container')
      </div>
    );
  }
}
