import React, { Component } from 'react';
import './App.css';
import MainPage from './components/MainPage'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <MainPage/>
        </header>
      </div>
    );
  }
}

export default App;
