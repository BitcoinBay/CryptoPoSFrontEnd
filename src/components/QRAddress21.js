import React from 'react';
var QRCode = require('qrcode.react');
export default class QRAddress21 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        value: '',
      }
  }

  onValueChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  }

  render() {
    const { value } = this.props;

    return(
      <div className="qrcode wrapper">
      {/* <QRCode value="mtXWDB6k5yC5v7TcwKZHB89SUp85yCKshy"/> */}
        <p>{ value }</p>
        <h1>QR CODE GENERATOR</h1>
            <QRCode value={this.state.value}  />
            <br></br>
            <div>
              <input type="text" value={this.state.value} onChange={this.onValueChange}  />
            </div>
      </div>
    );
  }
};
