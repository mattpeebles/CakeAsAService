import React, {Component} from 'react'

import './index.css'

export default class Canvas extends Component{
	constructor(props){
		super(props);
		this.state = {
			drawImage: false
		}
	}


	componentDidMount(){
		this.drawImage()
	}

	componentDidUpdate(nextProps){
		if(nextProps.baseSrc !== this.props.baseSrc){
			this.drawImage()
		}
	}

	drawImage(){
	        let canvas = document.getElementById('cakeCanvas')
	        let ctx = canvas.getContext('2d')
	        
	        ctx.canvas.width = this.props.baseDimensions.width
	        ctx.canvas.height = this.props.baseDimensions.height

	        let backgroundImage = document.getElementById('base')
	        let logo = document.getElementById('logo')
	        ctx.drawImage(backgroundImage, 0, 0)
	        ctx.drawImage(logo, this.props.topLeft.x, this.props.topLeft.y) 

	        this.setState({
	        	drawImage: true
	        })
	}
	render(){
		return(
			<canvas id="cakeCanvas"></canvas>
		)
	}
}