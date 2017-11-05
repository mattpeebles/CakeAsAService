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
			getImages()
			displayImage()
	})
}

function getImages(){
	let base = $('#base').val()
	let logo = $('#logo').val()

	fetchTopLeftCoordinate(base, logo)
		.then(res => {
			return res.json()
		}).then(data => {
			console.log(data)
		})
};

function displayImage(){
	let images = [
	{
		type: 'base',
		imageSrc: $('#base').val()
	},
	{
		type: 'logo',
		imageSrc: $('#logo').val()
	}
	]




    images.forEach(image => {
    	let {type, imageSrc} = image

		let template = `<div id="${type}ImageDiv" class="image">
					<image src="${imageSrc}" id="${type}" />
					</div>`

		$('#images').append(template)

    })

}


$(() => {
	onImageFormSubmit()
})