const express = require('express')
const app = express()

const cakeRoute = require('./routers/cake')

app.use('/api/design-a-cake', cakeRoute)

app.use(express.static('public'))

app.listen(3000, () => {
	console.log('Server is open on port 3000')
})