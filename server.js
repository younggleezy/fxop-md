const express = require('express')

class RunServer {
 constructor(port = 3000) {
  this.app = express()
  this.port = port

  this.setupRoutes()
 }

 setupRoutes() {
  this.app.get('/', (req, res) => {
   res.send(`
        <html>
          <head>
            <title>AstroFX Iframe</title>
            <style>
              body, html, iframe {
                margin: 0;
                padding: 0;
                height: 100%;
                width: 100%;
                border: none;
              }
            </style>
          </head>
          <body>
            <iframe src="https://astrofx.com" frameborder="0"></iframe>
          </body>
        </html>
      `)
  })
 }

 start() {
  this.server = this.app.listen(this.port, () => {
  //  console.log(`Server running on http://localhost:${this.port}`)
  })
 }
}

module.exports = RunServer