import React, {Component} from 'react'


import ImageContainer from '../image'

export default class ImageForm extends Component{

	updateBaseSrc(){
		this.props.updateSrc('base', this.baseSrc.value)
	}

	updateLogoSrc(){
		this.props.updateSrc('logo', this.logoSrc.value)
	}

	submitImages(e){
		console.log('hi')
		e.preventDefault()
		this.props.getCoordinate()
	}

	render(){
		return(
			<form id="imageForm" onSubmit={(e) => this.submitImages(e)}>
				<div className="form-row">
					<div className="form-group  col-md-6">
						<label htmlFor="baseInput">Base Image</label>
						<input 
							type="text" 
							className="form-control" 
							name="baseImage" 
							id="baseInput" 
							ref={(input) => {this.baseSrc = input;}} 
							onChange={() => this.updateBaseSrc()} 
						/>
						<ImageContainer 
				            src={this.props.baseSrc} 
				            updateDimensions={this.props.updateDimensions}
				            id="base" alt="baseImage"
				         />
					</div>
					<div className="form-group col-md-6">
						<label htmlFor="logoInput">Logo Image</label>
						<input 
							type="text" 
							name="logoImage" 
							className="form-control"
							id="logoInput" 
							ref={(input) => {this.logoSrc = input}} 
							onChange={() => this.updateLogoSrc()} 
						/>
			          <ImageContainer 
			            src={this.props.logoSrc} 
			            updateDimensions={this.props.updateDimensions}
			            id="logo" alt="logoImage"
			          />
					</div>
				</div>
					<button type="submit" className="btn btn-primary" id="submit">Design the Cake</button>
			</form>
		)
	}
}