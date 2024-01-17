const express = require('express')
const cors = require('cors')
const events = require('events')

const emitter = new events.EventEmitterAsyncResource({ name: 'newMessage' })

emitter.setMaxListeners(Infinity)

const PORT = 5000

const app = express()

app.use(cors())
app.use(express.json())

app.get('/get-messages', (req, res) => {
  emitter.once('newMessage', (message) => {
    res.json(message).end()
  })
})

app.post('/new-message', (req, res) => {
  const message = req.body
  emitter.emit('newMessage', message)
  res.status(200).end()
})

app.listen(PORT, () => console.log(`SERVER STARTED ON PORT ${PORT}`))
