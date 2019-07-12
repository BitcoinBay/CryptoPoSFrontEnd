import React, { Component } from 'react';
import axios from 'axios';
export default class Order extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      pos_id: null,
      transactions: []
    }
  }

  componentDidMount() {
    this.setState({ pos_id: this.props.location.search.substring(3) }, async () => {
      const pos_data = {
        pos_id: this.state.pos_id
      };

      axios.post("/api/get-all-pos-txs", pos_data)
      .then((res) => {
        console.log(res);
        console.log(this.state);
      })
      .catch((err) => {
        console.log(err);
      })
    });
  }

  render() {
    return (
      <div className="order_wrapper">
           <h1 id='title'>Orders</h1>
              <table id='txrefs'>
                <tbody>
                  <tr>
                    <th>coin_type</th><th>fiat_type</th><th>tx_hash</th><th>block_height</th><th>send_amount</th><th>confirmations</th>
                  </tr>
                </tbody>
              </table>
      </div>
    );
  }
}
