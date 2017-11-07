const url = require('url')
const http = require('http')
const https = require('https')
const sizeOf = require('image-size')

function getSizeFromImageUrl(imageUrl){
	let imgUrl = url.parse(imageUrl)

	let protocolType = imgUrl.protocol

	return new Promise((resolve, reject) => {
		if(protocolType == 'http:'){
			return http.get(imgUrl, (res) => {
				let chunks = [];
				let kbDownloaded = 0;
				res.on('data', (chunk) => {
					kbDownloaded += Buffer.byteLength(chunk)
					chunks.push(chunk)
					
					if(kbDownloaded >= 3000){
						let buffer = Buffer.concat(chunks)
						let dimensions = sizeOf(buffer)
						let {height, width} = dimensions
						
						let area = calculateArea(width, height)

						return resolve({
							width,
							height,
							area	
						})
					}
				})
				// .on('end', () => {
				// 	console.log()
				// })
			})
		} else{
			return https.get(imgUrl, (res) => {
				let chunks = [];
				let kbDownloaded = 0;
				res.on('data', (chunk) => { 
					kbDownloaded += Buffer.byteLength(chunk)
					chunks.push(chunk)
					
					if(kbDownloaded >= 3000){
						let buffer = Buffer.concat(chunks)
						let dimensions = sizeOf(buffer)
						let {height, width} = dimensions
						
						let area = calculateArea(width, height)

						return resolve({
							width,
							height,
							area	
						})
					}
				})
			})
		}
	})
}

// function getSizeFromImage(imageLocation){
// 	return new Promise((resolve, reject) => {
// 		let dimensions = sizeOf(imageLocation)
// 		let {height, width} = dimensions
		
// 		let area = calculateArea(width, height)

// 		return resolve({
// 			width,
// 			height,
// 			area	
// 		})	
// 	})
// }

function calculateArea(width, height){
	return width * height
}

function canContain(base, logo){
	
	// let getBaseImageSize = ((/https?/).test(base)) ? getSizeFromImageUrl(base) : getSizeFromImage(base),
	// 	getLogoImageSize = ((/https?/).test(logo)) ? getSizeFromImageUrl(logo) : getSizeFromImage(logo);


	let getBaseImageSize = getSizeFromImageUrl(base),
		getLogoImageSize = getSizeFromImageUrl(logo);

	return new Promise((resolve, reject) => {
		getBaseImageSize
			.then(baseDimensions => {
				getLogoImageSize
					.then(logoDimensions => {
						
						let dimensions = {
							base: baseDimensions,
							logo: logoDimensions
						}
						
						if(dimensions.base.area > dimensions.logo.area){
							resolve({possible: true, dimensions})
						}else{
							resolve({possible: false})
						}
				})
				.catch(e => {
					return reject(e)
				})
			}).catch(e => {
				return reject(e)
			})
	})
}

function rotateImage(image){
	let temp = image.height;
	image.height = image.width;
	image.width = temp;
	image.rotated = true;

	return image;
}

function calculateTopLeftXPos(baseWidth, logoWidth){
	let widthDifference = baseWidth - logoWidth

	let xPos = widthDifference/2

	return xPos
}

function calculateTopLeftYPos(baseHeight, logoHeight){
	let heightDifference = baseHeight - logoHeight

	let yPos = heightDifference/2

	return yPos
}

function centerLogo(base, logo){
	if(base.area < logo.area){
		throw new Error('Logo is larger than base, cannot center')
	}

	if(base.width < logo.width || base.height < logo.height){
		base = rotateImage(base)
	}

	let x = calculateTopLeftXPos(base.width, logo.width),
		y = calculateTopLeftYPos(base.height, logo.height);

	if(isCentered(x, y, base, logo)){
		return { 
			x: Math.floor(x),
			y: Math.floor(y)
		}
	}
}

function isCentered(topX, topY, base, logo){
	let topLeft = {x: topX, y: topY}
		bottomLeft = {x: topLeft.x, y: topLeft.y + logo.height},
		topRight = {x: topLeft.x + logo.width, y: topLeft.y},
		bottomRight = {x: topLeft.x + logo.width, y: topLeft.y + logo.height};

	let areaAboveLogo = calculateArea(base.width, base.height - topLeft.y),
		areaBelowLogo = calculateArea(base.width, bottomLeft.y);

	let areaLeftLogo = calculateArea(topLeft.x, base.height),
		areaRightLogo = calculateArea(base.width - topRight.x, base.height);

	if(areaAboveLogo == areaBelowLogo && areaLeftLogo == areaRightLogo){
		return true
	} else{
		return false
	}
}

module.exports = {
	canContain, 
	centerLogo,
	getSizeFromImageUrl,
	//getSizeFromImage,
	calculateArea,
	calculateTopLeftXPos,
	calculateTopLeftYPos,
	rotateImage,
	isCentered
}