import React, { Component } from 'react';
import axios from 'axios';
import './styles/order.scss';
export default class Order extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      users: null
    }
  }

  componentDidMount() {
    // Temporary populating table
    axios.get('/api/balanceBCH/bitcoincash:qrk8wdymmmm8ep590kdupz5643llvywlwcm3d7mq8a')
      .then((res) => {
        console.log(res.data);
        this.setState({ users: res.data });
      });
  }

  renderUsers() {
    const { users } = this.state;
    console.log(typeof users);

    let txMap = users.map( user => (
      <tr key={user.id}> <td>{user.tx_hash}</td> <td>{user.block_height}</td> <td>{user.value}</td> <td>{user.confirmed}</td></tr>
    ));
    return txMap;
  }

  render() {
    return (
        <div className="order_wrapper">
           <h1 id='title'>Orders</h1>
           <table id='txrefs'>
              <tbody>
                <tr>
                <th>tx_hash</th><th>block_height</th><th>Value</th><th>confirmed</th>
                </tr>
                { this.state.users
                  ? this.renderUsers()
                  : <p>waiting</p>
                }
              </tbody>
           </table>
        </div>
     );
  }
}
