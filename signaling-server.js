const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8081 });
console.log("testando")
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    // Envia a mensagem para todos os clientes conectados
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        console.log("teste")
        client.send(message);
      }
    });
  });
});

console.log('Servidor de sinalização rodando na porta 8081');
