import React from 'react';
import logo from './logo.svg';
import './App.scss';
 import QRAddress21 from './components/QRAddress21';
import Cashier from './components/Cashier';


function App() {
  return (
    <div className="App">
      <QRAddress21 />
      {/* <Cashier/> */}
    </div>
  );
}

export default App;
