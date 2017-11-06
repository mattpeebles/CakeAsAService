import React, {Component} from 'react'

import './index.css'


export default class ImageContainer extends Component{
	constructor(props){
		super(props)
	}

	render(){
		return(
			<div className="ImageContainer">
				<img src={this.props.src} id={this.props.id} className="image" alt={this.props.alt}/>
			</div>
		)
	}
}