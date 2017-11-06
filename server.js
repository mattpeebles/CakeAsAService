const express = require('express')
const path = require('path')
const app = express()

const {PORT: port} = require('./config')

const cakeRoute = require('./routers/cake')


app.use(express.static(path.join(__dirname, 'client/build')))

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
});

app.use('/api/design-a-cake', cakeRoute)



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