import React, {Component} from 'react'


export default class ImageForm extends Component{
	constructor(props){
		super(props)
	}

	updateBaseSrc(){
		this.props.updateSrc('base', this.baseSrc.value)
	}

	updateLogoSrc(){
		this.props.updateSrc('logo', this.logoSrc.value)
	}

	submitImages(e){
		e.preventDefault()
		this.props.getCoordinate()
	}

	render(){
		return(
			<form id="imageForm" onSubmit={(e) => this.submitImages(e)}>
				<label>Base Image</label>
				<input type="text" ref={(input) => {this.baseSrc = input;}} onChange={() => this.updateBaseSrc()} name="baseImage" id="baseInput" />
				<label>Logo Image</label>
				<input type="text" ref={(input) => {this.logoSrc = input}} onChange={() => this.updateLogoSrc()} name="logoImage" id="logoInput" />
				<input type="submit" name="submit" id="submit" />
			</form>
		)
	}
}