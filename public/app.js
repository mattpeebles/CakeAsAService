function fetchTopLeftCoordinate(base, logo){
	return fetch('http://localhost:3000/api/design-a-cake', {
		method: 'POST',
		headers: {
			"Content-Type": 'application/json'
		},
		body: JSON.stringify({base, logo})
	})
}

function getImages(){
	$('#imageForm').on('submit', (e) => {
		e.preventDefault()
		let base = $('#base').val()
		let logo = $('#logo').val()

		fetchTopLeftCoordinate(base, logo)
			.then(res => {
				return res.json()
			}).then(data => {
				console.log(data)
			})
	});
}


$(() => {
	getImages()
})