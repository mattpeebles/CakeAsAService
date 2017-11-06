function fetchTopLeftCoordinate(base, logo){
	return fetch('http://localhost:3030/api/design-a-cake', {
		method: 'POST',
		headers: {
			"Content-Type": 'application/json'
		},
		body: JSON.stringify({base, logo})
	})
}

function onImageFormSubmit(){
	$('#imageForm').on('submit', (e) => {
		e.preventDefault()
			drawFinishedImage()
	})
}

function getTopLeftCoordinate(){
	let base = $('#baseInput').val()
	let logo = $('#logoInput').val()

	return new Promise((resolve, reject) => {
		fetchTopLeftCoordinate(base, logo)
			.then(res => {
				return res.json()
			}).then(data => {
				resolve(data)
			})
	})
};

function displayImage(){
	
	return new Promise((resolve, reject) => {
		let images = [
		{
			type: 'base',
			imageSrc: $('#baseInput').val()
		},
		{
			type: 'logo',
			imageSrc: $('#logoInput').val()
		}
		]



	    images.forEach(image => {
	    	let {type, imageSrc} = image

			let template = `<div id="${type}ImageDiv" class="image">
						<image src="${imageSrc}" id="${type}" />
						</div>`

			$('#images').append(template)
	    })



		resolve()
	})
}

function getSizeFromLoadedImage(src){
	return new Promise((resolve, reject) => {
		let image = new Image()

		image.onload = function(){
			let height = image.height,
				width = image.width

			resolve({height, width})
		}

		image.src = src
	})
}


function drawFinishedImage(){
	return getTopLeftCoordinate()
		.then(topLeft => {
			return displayImage()
				.then(() => {
					return getSizeFromLoadedImage($('#base').attr('src'))
						.then(baseDimensions => {
							return getSizeFromLoadedImage($('#logo').attr('src'))
							.then(logoDimensions => {
									combineBaseAndLogo(baseDimensions, logoDimensions, topLeft)
							})
						})
				})
		})
}

function combineBaseAndLogo(baseDimensions, logoDimensions, topLeft){
	let canvas = document.getElementById('c')
	let ctx = canvas.getContext('2d')
	
	ctx.canvas.width = baseDimensions.width
	ctx.canvas.height = baseDimensions.height

	let backgroundImage = document.getElementById('base')
	let logo = document.getElementById('logo')
	ctx.drawImage(backgroundImage, 0, 0)
	ctx.drawImage(logo, topLeft.x, topLeft.y)	
}

$(() => {
	onImageFormSubmit()
})