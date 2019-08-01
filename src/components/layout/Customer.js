import React from 'react';
import { Helmet } from 'react-helmet';
import socketClient from 'socket.io-client';
import  QRAddress21 from '../QRAddress21';
import bitcoinbay from '../../images/bitcoinbay.jpeg';

import injectSheet from 'react-jss';

const socket = socketClient('http://10.100.10.142:3000');
// const socket = socketClient('http://localhost:5000');

const defaultWebURL = 'https://www.meetup.com/The-Bitcoin-Bay';
const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);

const styles = {
  vertical_wrapper: {
    height: "100vh"
  },
  placeholder_image: {
    width: "75%",
    height: "75%"
  },
  message_text: {
    fontFamily: "Poppins, sans-serif",
    fontWeight: "400",
    textAlign: "left",
    marginTop: "0",
    marginBottom: "10px",
    marginLeft: "10px"
  },
  amount_to_pay_text: {
    fontFamily: "Poppins, sans-serif",
    fontWeight: "bold",
    textAlign: "left",
    marginTop: "0",
    marginLeft: "10px"
  },
  fiat_text: {
    fontFamily: "Roboto, sans-serif",
    textAlign: "left",
    marginTop: "30px",
    marginBottom: "0",
    marginLeft: "10px"
  },
  status_text: {
    fontWeight: "400",
    fontSize: "1.7em",
    marginBottom: "0",
    marginLeft: "10px",
    textAlign: "left"
  },
  status_message: {
    fontSize: "1.8em",
    marginTop: "0",
    marginLeft: "10px",
    textAlign: "left"
  }
};

class Customer extends React.Component {
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
    const { classes } = this.props;

    return (
      <div className={"valign-wrapper " + classes.vertical_wrapper}>
        <Helmet>
          <title>Customer POS Page</title>
          <meta name="description" content="CashierPOS Page" />
        </Helmet>
        <div className="container">
          <div className="row">
            <div className="col s6 offset-s3 m3 offset-m4 center-align">
              { this.state.isPayment === false
                ? <div>
                    <img src={bitcoinbay} className={classes.placeholder_image} alt="logo"/>
                  </div>
                : (
                  <div>
                    <h2 className={classes.message_text}>
                      Please send your 
                    </h2>
                    <h2 className={classes.message_text}>
                      {this.state.cryptoAmount.substring(0, 7)} {this.state.cryptoType}
                    </h2>
                    <h2 className={classes.message_text}>
                      To The Following Address
                    </h2>

                    <QRAddress21 value={this.state.url} />

                    <p className={classes.fiat_text}>Equivalent in {this.state.fiatType}</p>
                    <h1 className={classes.amount_to_pay_text}>$ {this.state.fiatAmount}</h1>

                    <h2 className={classes.status_text}>Status</h2>
                    <h2 className={classes.status_message}>UNPAID</h2>
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default injectSheet(styles)(Customer);
