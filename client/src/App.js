import React, { Component } from 'react';


import ImageForm from './components/form'
import ImageContainer from './components/image'

import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      topLeft: {},
      baseImageSrc: null,
      logoImageSrc: null
    }
  }

  // componentDidMount(){
  //   fetch('http://localhost:3030/api/design-a-cake', {
  //       method: 'POST',
  //       headers: {
  //         "Content-Type": 'application/json'
  //       },
  //       body: JSON.stringify({
  //         base: 'http://media.salon.com/2015/04/shutterstock_187788812.jpg', 
  //         logo: 'https://img.utdstc.com/icons/128/lucky-patcher-android.png'
  //       })
  //     })
  //     .then(res => res.json())
  //     .then(topLeft => {
  //       this.setState({topLeft})
  //     })
  // }

  updateImageSrc(type, src){
    if(type === 'base'){
      this.setState({baseImageSrc: src})
    }
    else if(type === 'logo'){
      this.setState({logoImageSrc: src})
    }
  }

  getTopLeftCoordinate(){
     fetch('http://localhost:3030/api/design-a-cake', {
        method: 'POST',
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify({
          base: this.state.baseImageSrc, 
          logo: this.state.logoImageSrc
        })
      })
      .then(res => res.json())
      .then(topLeft => {
        console.log(topLeft)
        this.setState({topLeft})
      })
  }

  render() {

    let baseImage,
        logoImage;

    if(this.state.baseImageSrc){
      baseImage = <ImageContainer src={this.state.baseImageSrc} id="base" alt="baseImage"/>
    }

    if(this.state.logoImageSrc){
      logoImage = <ImageContainer src={this.state.logoImageSrc} id="logo" alt="logoImage"/>
    }

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <ImageForm getCoordinate={this.getTopLeftCoordinate.bind(this)} updateSrc={this.updateImageSrc.bind(this)}/>
        {baseImage}
        {logoImage}
      </div>
    );
  }
}

export default App;
