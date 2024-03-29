const express = require('express')
const cors = require('cors')
const events = require('events')

const emitter = new events.EventEmitter()

const PORT = 5000

const app = express()

app.use(cors())
app.use(express.json())

app.get('/connect', (req, res) => {
  console.log('CONNECTION')
  res.writeHead(200, {
    'connection': 'keep-alive',
    'content-type': 'text/event-stream',
    'cache-control': 'no-cache'
  })
  emitter.on('newMessage', (message) => {
    res.write(`data: ${JSON.stringify(message)} \n\n`)
  })
})

app.post('/new-message', (req, res) => {
  const message = req.body
  emitter.emit('newMessage', message)
  res.status(200)
})

app.listen(PORT, () => console.log(`SERVER STARTED ON PORT ${PORT}`))
