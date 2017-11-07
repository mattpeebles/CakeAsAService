const chai = require('chai')
const chaiHTTP = require('chai-http')

const {app, runServer, closeServer} = require('../server')
const {HOST_URL} = require('../config')

chai.use(chaiHTTP)
const should = chai.should()


describe('Cake Router', () => {
	
	let image1Url = 'http://media.salon.com/2015/04/shutterstock_187788812.jpg',
 		image2Url = 'https://img.utdstc.com/icons/128/lucky-patcher-android.png',
 		badImageUrl1 = 'http://media.salon.om/2015/04/shutterstock_187788812.jpg',
 		badImage1 = 'http://media.salon.com/2015/04/shutterstock_187788812.jp'

	before(function () {
		runServer()
	})

	after(function(){
		closeServer()
	})

	describe('/api/design-a-cake', () => {
		describe('POST', () => {
			it('should return the coordinates of the top left corner of the logo', () => {
				let data = {
					base: image1Url,
					logo: image2Url
				}

				return chai.request(app)
					.post(`/api/design-a-cake`)
					.send(data)
					.then(res => {
						res.should.have.status(200)
						res.should.be.json
						res.body.placement.x.should.be.a('number')
						res.body.placement.y.should.be.a('number')
					})
			});
			it('should return status 400 if base cannot contain logo', () => {
				let data = {
					base: image2Url,
					logo: image1Url
				}
				return chai.request(app)
					.post('/api/design-a-cake')
					.send(data)
					.then(res => {})
					.catch(e => {
						e.should.have.status(400)
					})
			});
			it('should return status 400 if input is a bad URL', () => {
				let data = {
					base:badImageUrl1,
					logo: image2Url
				}

				return chai.request(app)
					.post('/api/design-a-cake')
					.send(data)
					.then(res => {})
					.catch(e => {
						e.should.have.status(400)
					})			
			});
			it('should return status 400 if input is not an image url', () => {
				let data = {
					base:badImage1,
					logo: image2Url
				}

				return chai.request(app)
					.post('/api/design-a-cake')
					.send(data)
					.then(res => {})
					.catch(e => {
						e.should.have.status(400)
					})						
			})
			it('should return status 400 if input is not a URL', () => {
				let data = {
					base: image1Url,
					logo: 'cheese'
				}
				return chai.request(app)
					.post('/api/design-a-cake')
					.send(data)
					.then(res => {})
					.catch(e => {
						e.should.have.status(400)
					})			
			})
		})
	})

})