const express = require('express');
const cakeRouter = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {canContain, centerLogo, combineBaseAndLogo} = require('../index.js')

cakeRouter.use(jsonParser);

cakeRouter.post('/', (req, res) => {
	const requiredImagesCheck = ['base', 'logo']

	requiredImagesCheck.forEach(item => {
		if(!req.body[item]){
			return res.status(400).json({message: `Design a cake requires a ${item} image`})
		}
	})

	const {base, logo} = req.body

	canContain(base, logo).then(data => {
		if(data.possible){
			let {base: baseDimensions, logo: logoDimensions} = data.dimensions

			let topLeft = centerLogo(baseDimensions, logoDimensions)
			return res.json(topLeft)
		}
		else{
			res.status(400).end()
		}
	}).catch(e => {
		console.error(e)
		res.status(400).end()
	})
})

module.exports = cakeRouter