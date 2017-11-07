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
		this.props.hideFormImages()
	}

	componentDidUpdate(nextProps){
		if(nextProps.baseSrc !== this.props.baseSrc){
			this.drawImage()
			this.props.hideFormImages()
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

	        if(this.props.rotate){
	        	ctx.clearRect(0,0, canvas.width, canvas.height)
	        	ctx.canvas.width = this.props.baseDimensions.height
	        	ctx.canvas.height = this.props.baseDimensions.width
	        	ctx.save()
	        	ctx.translate(canvas.width/2, canvas.height/2);
	        	ctx.rotate(90*Math.PI/180)
	        	ctx.drawImage(backgroundImage, -this.props.baseDimensions.width/2, -this.props.baseDimensions.height/2)
	       		ctx.restore()
	        }

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