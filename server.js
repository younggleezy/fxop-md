const express = require('express')

const app = express()

app.get('/', (req, res) => {
 res.send('Bot Connected')
})

const server = app.listen(8000, () => {
 console.log('Server is running on http://localhost:8000')
})

module.exports = server
