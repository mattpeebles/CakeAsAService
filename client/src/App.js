import React, { Component } from 'react';


import ImageForm from './components/form'
import Canvas from './components/canvas'
import NoCake from './components/noresult'

import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      topLeft: null,
      showUncombinedImages: true,
      baseImageSrc: null,
      logoImageSrc: null,
      baseDimensions: null,
      logoDimensions: null,
      canvas: false,
      updatedCanvas: false,
      canCombine: null,
      rotate: false
    }
  }

  updateImageSrc(type, src){
    if(type === 'base'){
      this.setState({
        baseImageSrc: src,
        baseDimensions: null,
        topLeft: null,
        showUncombinedImages: true,
      })
    }
    else if(type === 'logo'){
      this.setState({
        logoImageSrc: src,
        logoDimensions: null,
        topLeft: null,
        showUncombinedImages: true
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

    if(this.state.baseDimensions && this.state.logoDimensions){
      if(this.state.baseDimensions.width < this.state.logoDimensions.width){
        this.setState({
          rotate: true
        })
      }
    }else{
      this.setState({
        rotate: false
      })
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
      .then(data => {
        let {placement: topLeft} = data
        this.setState({
          topLeft, 
          canCombine: true
        })
      })
      .catch(e => {
        this.setState({canCombine: false})
      })
  }

  hideFormImages(){
    this.setState({
      showUncombinedImages: false
    })
  }

  render() {

    let combinedImage;

    if(this.state.topLeft && this.state.baseDimensions && this.state.logoDimensions && !this.state.canvas){
        combinedImage = <Canvas 
                          rotate={this.state.rotate} 
                          baseDimensions={this.state.baseDimensions} 
                          baseSrc={this.state.baseImageSrc} 
                          topLeft={this.state.topLeft}
                          hideFormImages={this.hideFormImages.bind(this)}
                        />
    }

    if(this.state.canCombine === false){
      combinedImage = <NoCake />
    }

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
              show={this.state.showUncombinedImages}
          />
        </header>

        {combinedImage}

      </div>
    );
  }
}

export default App;
