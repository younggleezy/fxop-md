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
       <!DOCTYPE html>
<html lang="en">
 <head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>FXOP</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&display=swap" rel="stylesheet" />
  <style>
   *{margin: 0; padding: 0; box-sizing: border-box; font-family: Fira Code;} body{display: flex; justify-content: center; align-items: center; min-height: 100vh; strong{font-size: 5em;}
  </style>
 </head>
 <body>
  <strong>BOT CONNECTED</strong>
 </body>
</html>

      `)
  })
 }

 start() {
  this.server = this.app.listen(this.port, () => {})
 }
}

module.exports = RunServer
