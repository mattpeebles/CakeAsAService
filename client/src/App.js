import React, { Component } from 'react';


import ImageForm from './components/form'
import Canvas from './components/canvas'

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
      updatedCanvas: false,
      canCombine: null
    }
  }

  updateImageSrc(type, src){
    if(type === 'base'){
      this.setState({
        baseImageSrc: src,
        baseDimensions: null,
        topLeft: null
      })
    }
    else if(type === 'logo'){
      this.setState({
        logoImageSrc: src,
        logoDimensions: null,
        topLeft: null
      })
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
     fetch('https://fast-anchorage-86250.herokuapp.com/api/design-a-cake', {
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
        this.setState({topLeft, canCombine: true})
      })
      .catch(e => {
        this.setState({canCombine: false})
      })
  }



  render() {

    let combinedImage;

    if(this.state.topLeft && this.state.baseDimensions && this.state.logoDimensions && !this.state.canvas){
        combinedImage = <Canvas baseDimensions={this.state.baseDimensions} baseSrc={this.state.baseImageSrc} topLeft={this.state.topLeft}/>
    }

    // if(this.state.canCombine === false){
    //   console.log('errroorrr')
    // }

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Design A Cake</h1>
          <ImageForm 
              baseSrc={this.state.baseImageSrc}
              logoSrc={this.state.logoImageSrc}
              getCoordinate={this.getTopLeftCoordinate.bind(this)} 
              updateSrc={this.updateImageSrc.bind(this)}
              updateDimensions={this.updateImageDimensions.bind(this)}
          />
        </header>

        {combinedImage}

      </div>
    );
  }
}

export default App;
