const express = require('express')
const app = express()

const {PORT: port} = require('./config')

const cakeRoute = require('./routers/cake')

app.use('/api/design-a-cake', cakeRoute)

app.use(express.static('public'))

let server;

function runServer(){
	server = app.listen(port, () => {
		console.log(`App is listening on port ${port}`)
	})
}

function closeServer(){
	console.log('Closing server')
	server.close()
}

if(require.main === module){
	runServer()
}

module.exports = {app, runServer, closeServer}