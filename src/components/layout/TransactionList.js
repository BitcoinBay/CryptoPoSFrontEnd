import React, { Component } from 'react';
import axios from 'axios';
import injectSheet, { jss } from 'react-jss';

import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";

const styles = {
  page_header_container: {
    marginTop: "54px"
  },
  page_header: {
    margin: "0",
    fontFamily: "Poppins",
    fontSize: "32px",
    fontWeight: "900"
  },
  order_table_container: {
    overflowX: "auto"
  }
};

class TransactionList extends React.Component {
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
    const { classes } = this.props;

    return (
      <div className="container-fluid">
        <div className="row">
          <div className={"col s10 offset-s1 " + classes.page_header_container }>
            <h2 className={ classes.page_header }>Transaction</h2>
            <h2 className={ classes.page_header }>History</h2>
          </div>
        </div>

        <div className="row">
          <div className="col s10 offset-s1">
            <Paper className={classes.order_table_container}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Transaction Hash</TableCell>
                    <TableCell align="right">Transaction Amount</TableCell>
                    <TableCell align="right">Crypto Currency</TableCell>
                    <TableCell align="right">Fiat Currency</TableCell>
                    <TableCell align="right">Market Price</TableCell>
                  </TableRow>
                </TableHead>
                
                <TableBody>
                  <TableRow>
                    <TableCell>43ab5b0e4f...35894fccb1</TableCell>
                    <TableCell align="right">10.01</TableCell>
                    <TableCell align="right">BCH</TableCell>
                    <TableCell align="right">CAD</TableCell>
                    <TableCell align="right">528.42</TableCell>
                  </TableRow> 
                </TableBody>
              </Table>
            </Paper>
          </div>
        </div>
      </div>
    )
  }
}

export default injectSheet(styles)(TransactionList);
