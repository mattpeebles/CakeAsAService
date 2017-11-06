import React, {Component} from 'react'

import './index.css'


export default class ImageContainer extends Component{
	constructor(props){
		super(props)
		this.state = {
			imageId: null,
			validSrc: false,
			dimensions: null
		}
	}

	componentDidMount(){
		this.setState({imageId: this.props.id})
		this.validImage(this.props.src)
	}

	componentWillReceiveProps(nextProps){
		this.validImage(nextProps.src)
	}

	componentDidUpdate(){
		
		if(this.state.dimensions === null && this.state.validSrc !== false){
			let image = new Image()

			image.onload = () => {
				let dimensions = {
					height: image.height,
					width: image.width
				}

				

				this.setState({
					dimensions
				})

				this.props.updateDimensions(this.props.id, dimensions)
			}

			image.src = this.props.src
		}
	};

	validImage(src){
		fetch(src)
			.then(res => {
				this.setState({validSrc: res.ok})
			})
			.catch(e =>{
					//image location does not have CORS enabled
					//so this prints the image to screen anyway
				this.setState({validSrc: true})
			})
	}



	render(){
		if(this.state.validSrc && this.state.dimensions){
			return(
				<div className="imageContainer col">
					<img src={this.props.src} id={this.props.id} className="image" alt={this.props.alt}/>
					<p>Size: {this.state.dimensions.width}x{this.state.dimensions.height}</p>
				</div>
			)
		}

		return null
	}
}