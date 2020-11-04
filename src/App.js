import logo from './logo.svg';
import { baseUrl, dev } from './utils';
import 'rsuite/dist/styles/rsuite-default.css';
import React from 'react';
import './App.css'
import Sheet from './components/Sheet/Sheet';

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

    }
  }


  render() {

    return (
      <div className="Container">
        <Sheet/>
      </div>
    )

  }


}
