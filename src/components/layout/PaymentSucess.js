import React, { Component } from 'react';
import { render } from 'react-dom';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import cashier from './Cashier';
import './styles/customer.css'
export default class PaymentSucess extends React.Component{
    render(){
        return(
          <div>
              <h2>Bitcoin Bay </h2>
              <h1>Pay with</h1>
              <img src="https://pbs.twimg.com/profile_images/1060984321207484417/3AQYcyex.jpg"></img>
              <h1>BitcoinBay Cash</h1>

          </div>

        )
    }
}