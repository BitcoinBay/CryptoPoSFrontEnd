import React, { Component } from 'react';
import { render } from 'react-dom';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import cashier from './Cashier';
import './styles/customer.css'
export default class PaymentSucess extends React.Component{
    render(){
        return(
          <div className="pay wrap">
              <h2 className="title">Bitcoin Bay </h2>
              <h1 className="title">Pay with</h1>
              <div className="logo">
              <img src="https://secure.meetupstatic.com/photos/event/d/8/a/2/600_479095458.jpeg" ></img>
              </div>
              <h1 className="title">BitcoinBay Cash</h1>

          </div>

        )
    }
}