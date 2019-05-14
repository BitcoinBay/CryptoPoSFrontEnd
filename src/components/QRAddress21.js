import React from 'react';
var QRCode = require('qrcode.react');
export default class QRAddress21 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        value: '',
         cryptoAmount: '0'
        
      }
  }

  onValueChange = (e) => {
    this.setState({
      value: e.target.value,
      cryptoAmount : this.state.cryptoAmount
    });
  }

  render() {
    // const { value } = this.props;

    // let options = {
    //         amount: this.state.cryptoAmount,
    //         label: '#BitcoinBay',
    //       };
    //      let XPubAddress = BITBOX.Address.fromXPub(XPubKey, "0/0");
    //      let payQRAddress21 = BITBOX.BitcoinCash.encodeBIP21(XPubAddress, options);
      

    return(
      <div className="qrcode wrapper">
      {/* <QRCode value="mtXWDB6k5yC5v7TcwKZHB89SUp85yCKshy"/> */}
        {/* <p>{ value }</p> */}
        <h1>QR CODE GENERATOR</h1>
            <QRCode value={this.state.value} color="#fff" />
          
            <br></br>
            <div>
              <input type="text" value={this.state.value} onChange={this.onValueChange}  />
            </div>
            <div>
           <h1>Amount={this.state.value}  </h1>
            </div>
      </div>
    );
  }
};



// import React from 'react';
// import PropTypes from 'prop-types';
// import QRCode from 'qrcode-react';

// export default class QRAddress21 extends React.Component {
//   constructor(props) {
//     super(props);
//   }

//   render() {
//     const { value } = this.props;

//     return(
//       <div>
//         <QRCode value={ value } />
//         <p>{ value }</p>
//       </div>
//     );
//   }
// };

