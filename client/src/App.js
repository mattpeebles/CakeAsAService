import React, { Component } from 'react';


import ImageForm from './components/form'
import ImageContainer from './components/image'
import Canvas from './components/canvas'

import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      topLeft: null,
      baseImageSrc: null,
      logoImageSrc: null,
      baseDimensions: null,
      logoDimensions: null,
      canvas: false,
      updatedCanvas: false
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

  updateImageDimensions(type, dimensions){
    if(type === 'base'){
      this.setState({baseDimensions: dimensions})
    }
    else if(type === 'logo'){
      this.setState({logoDimensions: dimensions})
    }
  }

  getTopLeftCoordinate(){
     console.log(this.state)
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
        logoImage,
        combinedImage;

    if(this.state.baseImageSrc){
      baseImage = 
        <ImageContainer 
          src={this.state.baseImageSrc} 
          updateDimensions={this.updateImageDimensions.bind(this)}
          id="base" alt="baseImage"
        />
    }

    if(this.state.logoImageSrc){
      logoImage = 
        <ImageContainer 
          src={this.state.logoImageSrc} 
          updateDimensions={this.updateImageDimensions.bind(this)}
          id="logo" alt="logoImage"
        />
    }

    if(this.state.topLeft && this.state.baseDimensions && this.state.logoDimensions && !this.state.canvas){
      combinedImage = <Canvas baseDimensions={this.state.baseDimensions} topLeft={this.state.topLeft}/>
    }

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <ImageForm 
            getCoordinate={this.getTopLeftCoordinate.bind(this)} 
            updateSrc={this.updateImageSrc.bind(this)}
        />
        {baseImage}
        {logoImage}
        {combinedImage}
      </div>
    );
  }
}

export default App;
