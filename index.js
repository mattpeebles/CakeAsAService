const url = require('url')
const http = require('http')
const https = require('https')
const sizeOf = require('image-size')

function getSizeFromImageUrl(imageUrl){
	if(typeof imageUrl !== 'string'){
		return null
	}

	let imgUrl;

	try{
		imgUrl = url.parse(imageUrl)
	} catch(e){
		return null
	}

	let protocolType = imgUrl.protocol

	if(protocolType === null){
		return null
	}

	let obtainedSize = false;

	return new Promise((resolve, reject) => {
		if(protocolType == 'http:'){
			return http.request(imgUrl, (res) => {
				let totalChunk;
				let length = 0;
				res.on('data', (chunk) => {
					if(obtainedSize == false){
						length += chunk.length;
						let newBuffer = new Buffer(length)

						if(!totalChunk){
							totalChunk = new Buffer(chunk.length)
							chunk.copy(totalChunk, 0)
						}

						totalChunk.copy(newBuffer, 0)
						totalChunk = newBuffer;

						let dimensions;

						try{
							dimensions = sizeOf(totalChunk)
							
							if(dimensions){
								let {height, width} = dimensions
								let area = calculateArea(width, height)
								console.log('Obtained size')
								obtainedSize = true
								return resolve({
										width,
										height,
										area	
									})
							}
						}catch(e){
							console.log(e)
							reject(e)
						}
					}
				})
			})
			.on('error', (err) => {
				console.log(err)
			})
			.on('close', () => {
				console.log('Stream ended')
			})
			.end()
		} 
		else{
			return https.request(imgUrl, (res) => {
				
				let totalChunk;
				let length = 0;
				res.on('data', (chunk) => {
					if(!obtainedSize){
						length += chunk.length;
						let newBuffer = new Buffer(length)

						if(!totalChunk){
							totalChunk = new Buffer(chunk.length)
							chunk.copy(totalChunk, 0)
						}

						totalChunk.copy(newBuffer, 0)
						totalChunk = newBuffer;

						let dimensions;

						try{
							dimensions = sizeOf(totalChunk)
							
							if(dimensions){
								let {height, width} = dimensions
								let area = calculateArea(width, height)
								console.log(`Obtained size of: $img{}`)
								obtainedSize = true
								return resolve({
										width,
										height,
										area	
									})
							}
						}catch(e){
							console.log(e)
							reject(e)
						}
					}
				})
			})
			.on('close', () => {
				console.log('Stream ended')
			})
			.on('error', (err) => {
				console.log(err)
			})
			.end()
		} 
	})
}

function calculateArea(width, height){
	return width * height
}

function canContain(base, logo){

	let getBaseImageSize = getSizeFromImageUrl(base),
		getLogoImageSize = getSizeFromImageUrl(logo);

	return new Promise((resolve, reject) => {
		
		if(getBaseImageSize == null || getLogoImageSize == null){
			resolve({possible: false})
		}

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
			}).catch(e => {
				resolve({possible: false})
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
	calculateArea,
	calculateTopLeftXPos,
	calculateTopLeftYPos,
	rotateImage,
	isCentered
}