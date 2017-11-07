const chai = require('chai')
const chaiPromise = require('chai-as-promised')
const {expect, should, assert} = chai;
chai.use(chaiPromise)

const {	canContain, centerLogo, getSizeFromImageUrl, isCentered, 
	calculateArea, calculateTopLeftXPos, calculateTopLeftYPos, rotateImage} = require('../index');

let image1Url = 'http://media.salon.com/2015/04/shutterstock_187788812.jpg',
 	image2Url = 'https://img.utdstc.com/icons/128/lucky-patcher-android.png';

let image1Dimension = {width: 1000, height: 750, area: 750000},
	image2Dimension = {width: 128, height: 128, area: 16384},
	image3Dimension = {width: 750, height: 1000},
	smallBaseImage = {width: 10, height: 10, area: 100},
	smallLogoImage = {width: 4, height: 4, area: 25}

describe('Index', () => {

	describe('calculateArea', () => {
		it('should return the area of a rectangle', () => {
			let {width, height, area} = image1Dimension

			expect(calculateArea(width, height)).to.be.equal(area)
		})
	});

	describe('getSizeFromImageUrl', () => {
		it('should return an object with width, height, area from https url', () => {
			getSizeFromImageUrl(image1Url).then(dimensions => {
				expect(dimensions).to.be.a('object')
				expect(dimensions).to.deep.equal(image1Dimension)
			})
		});
		it('should return an object with width, height, area from http url', () => {
			getSizeFromImageUrl(image2Url).then(dimensions => {
				expect(dimensions).to.be.a('object')
				expect(dimensions).to.deep.equal(image2Dimension)
			})
		});

		it('should return null for a non-url string', () => {
			let size = getSizeFromImageUrl('cheese')
			expect(size).to.be.equal(null)
		})

		it('should return null for an object', () => {
			let size = getSizeFromImageUrl({'a': 1})
			expect(size).to.be.equal(null)
		})

		it('should return null for a number', () => {
			let size = getSizeFromImageUrl(134134)
			expect(size).to.be.equal(null)
		})

		it('should return null for an array', () => {
			let size = getSizeFromImageUrl([1, 2, 3, 4])
			expect(size).to.be.equal(null)
		})
	});

	describe('canContain', () => {
		it('should return true and dimension data if base can contain logo', () => {
			canContain(image1Url, image2Url).then(data => {
				
				const {possible, dimensions} = data

				expect(possible).to.be.equal(true)
				expect(dimensions).to.be.a('object')
				expect(dimensions).to.have.own.property('base')
				expect(dimensions).to.have.own.property('logo')

				const {base, logo} = dimensions
				
				expect(base).to.be.a('object')
				expect(base).to.have.own.property('height')
				expect(base.height).to.be.a('number')
				expect(base).to.have.own.property('width')
				expect(base.width).to.be.a('number')
				expect(base).to.have.own.property('area')
				expect(base.area).to.be.a('number')

				expect(logo).to.be.a('object')
				expect(logo).to.have.own.property('height')
				expect(logo.height).to.be.a('number')
				expect(logo).to.have.own.property('width')
				expect(logo.width).to.be.a('number')
				expect(logo).to.have.own.property('area')
				expect(logo.area).to.be.a('number')
			})
		});

		it('should return false and no dimensions data if base cannot contain logo', () => {
			canContain(image2Url, image1Url).then(data => {
				expect(data.possible).to.be.equal(false)
				expect(data).to.not.have.own.property('dimensions')
			})
		});
	});

	describe('rotateImage', () => {
		it('should rotate image by switching height and width', () => {
			let tempObject = Object.assign({}, image3Dimension, {})
			let rotatedImage = rotateImage(tempObject)

			expect(rotatedImage.height).to.be.equal(image3Dimension.width)
			expect(rotatedImage.width).to.be.equal(image3Dimension.height)
		})
	});

	describe('centerLogo', () => {
		it('should return to left coordinate of centered logo', () => {
			let coordinate = centerLogo(image1Dimension, image2Dimension);

			expect(coordinate).to.be.a('object');
			expect(coordinate).to.have.own.property('x');
			expect(coordinate.x).to.be.a('number');
			expect(coordinate).to.have.own.property('y');
			expect(coordinate.y).to.be.a('number');
		});

		it('should rotate base if base area is larger than logo and logo width is larger than base width', () => {
			let base = {'width': 850, 'height': 1000, 'area': 850*1000},
				logo = {'width': 950, 'height': 950, 'area': 950*750}

			let coordinate = centerLogo(base, logo)

			expect(coordinate).to.be.a('object')
			expect(coordinate).to.have.own.property('x')
			expect(coordinate.x).to.be.a('number')
			expect(coordinate).to.have.own.property('y')
			expect(coordinate.y).to.be.a('number')
			expect(base).to.have.own.property('rotated')
			expect(base.rotated).to.be.equal(true)
		})

		it('should throw error if it cannot center', () => {
			assert.throws(() => {centerLogo(image2Dimension, image1Dimension)}, Error, 'Logo is larger than base, cannot center')
		})
	});

	describe('calculateTopLeftXPos', () => {
		it('should calculate the x coordinate of the top left corner of logo', () => {
			expect(calculateTopLeftXPos(image1Dimension.width, image2Dimension.width)).to.be.a('number')
		})
	});

	describe('calculateTopLeftYPos', () => {
		it('should calculate the y coordinate of the top left corner of logo', () => {
			expect(calculateTopLeftYPos(image1Dimension.height, image2Dimension.height)).to.be.a('number')			
		})
	})

	describe('isCentered', () => {
		it('should return true if logo is centered', () => {
			let x = calculateTopLeftXPos(image1Dimension.width, image2Dimension.width),
				y = calculateTopLeftYPos(image1Dimension.height, image2Dimension.height);

			expect(isCentered(x, y, image1Dimension, image2Dimension)).to.be.equal(true)
		})
	})

})