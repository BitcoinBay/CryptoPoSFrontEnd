import React, { Component } from 'react';
import axios from 'axios';
import './styles/order.scss';
export default class Order extends React.Component {
    constructor(props) {
      super(props)

      this.state = { users: [] }
    }

    componentDidMount() {
      axios.get('https://api.blockcypher.com/v1/btc/main/addrs/1DEP8i3QJCsomS4BSMY2RpU1upv62aGvhD')
        .then(response => this.setState({ users: response.data.txrefs }))
    }

    renderUsers() {
      const { users } = this.state
      console.log(users);

      return users.map( user => (
        <tr key={user.id}> <td>{user.tx_hash}</td> <td>{user.block_height}</td> <td>{user.value}</td> <td>{user.confirmed}</td></tr>
      ))
    }

    render() {
    return (
    
        <div className="order_wrapper" >
           <h1 id='title'>Orders</h1>
           <table id='txrefs'>
              <tbody>
                 {/* <tr>{this.renderTableHeader()}</tr> */}
                 <tr>
                 <th>tx_hash</th><th>block_height</th><th>Value</th><th>confirmed</th>
                 </tr>
                 {this.renderUsers()}
              </tbody>
           </table>
       
        </div>
     )

    }
  }
