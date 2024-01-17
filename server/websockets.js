const ws = require('ws')

const wss = new ws.Server({
  port: 5000
}, () => console.log(`SERVER STARTED ON PORT 5000`))

const broadcastMessage = (message) => {
  wss.clients.forEach((client) => {
    client.send(JSON.stringify(message))
  })
}

wss.on('connection', (ws) => {
  ws.on(
    'message',
    (message) => {
      /** @type {{ 
       * event: 'message' | 'connection'; 
       * id: number; 
       * date: number; 
       * username: string; 
       * message: string }} */
      const msg = JSON.parse(message)
      switch (msg.event) {
        case 'connection':
          broadcastMessage(msg)
          break;
        case 'message':
          broadcastMessage(msg)
          break;
      }
    })
})

