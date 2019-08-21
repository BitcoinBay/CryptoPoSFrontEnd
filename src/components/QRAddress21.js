
import React from 'react';
import PropTypes from 'prop-types';
// import QRCode from 'qrcode-react';

var QRCode = require('qrcode.react');

export default class QRAddress21 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size : "280"
    }
  }
  render() {
    const { value } = this.props;

    return(
      <div  >
        <QRCode value={ value } size={parseInt(this.state.size)} />
        <p>{ value.substring(0, 8) + "..." + value.substring(value.length - 8) }</p>
      </div>
    );
  }
};

QRAddress21.propTypes = {
  value: PropTypes.string
};
