import React, { Component } from 'react';
import axios from 'axios';
import injectSheet from 'react-jss';

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

class TransactionList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      users: [],
      transactions: []
    }
  }

  componentDidMount() {
    this.setState({ pos_id: this.props.location.search.substring(3) }, () => {
      const pos_data = {
        pos_id: this.state.pos_id
      };

      axios.post('/api/get-all-pos-transactions', pos_data)
        .then(res => this.setState({ transactions: res.data.transactions.reverse() }));
    });
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
                    <TableCell align="right">Block Number</TableCell>
                    <TableCell align="right">Transaction Amount</TableCell>
                    <TableCell align="right">Crypto Currency</TableCell>
                    <TableCell align="right">Market Price</TableCell>
                    <TableCell align="right">Fiat Currency</TableCell>
                  </TableRow>
                </TableHead>
                
                <TableBody>
                  {
                    this.state.transactions.map((transaction, i) =>
                      <TableRow key={i}>
                        <TableCell>
                            <a href={"https://ropsten.etherscan.io/tx/" + transaction.hash} target="_blank">
                              {transaction.hash.substring(0, 10)}...{transaction.hash.substring(57)}
                            </a>
                        </TableCell>
                        <TableCell align="right">{transaction.block_number}</TableCell>
                        <TableCell align="right">{(transaction.amount / 1000000000000000000)}</TableCell>
                        <TableCell align="right">{transaction.crypto_currency}</TableCell>
                        <TableCell align="right">{transaction.market_price}</TableCell>
                        <TableCell align="right">{transaction.fiat_currency}</TableCell>
                      </TableRow> 
                    )
                  }
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
