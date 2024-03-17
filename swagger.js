const swaggerAutogen = require('swagger-autogen')()

const doc = {
	info: {
		title: 'E-center',
		description: 'E-center api documentation',
	},
	host: ['localhost:5000'],
	schemes: ['http', 'https'],
}

const outputfile = './swagger-output.json'
const endpoint = ['./server.js']

swaggerAutogen(outputfile, endpoint, doc).then(() => {
	require('./server.js')
})
