const WebSocket = require('ws');
const http = require('http');

// Create HTTP server
const server = http.createServer((req, res) => {
  if (req.headers.upgrade && req.headers.upgrade.toLowerCase() === 'websocket') {
    res.writeHead(426, {
      'Content-Type': 'text/plain',
      'Upgrade': 'WebSocket'
    });
    res.end('Upgrade Required');
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('WebSocket server running');
  }
});

// Create WebSocket server
const wss = new WebSocket.Server({ 
  noServer: true,
  clientTracking: true
});

// Handle upgrade
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

// Start server
server.listen(8080, () => {
  console.log('WebSocket server started on port 8080');
});

// Handle connections
wss.on('connection', (ws) => {
  console.log('New connection established');

  // Keep connection alive
  const pingInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.ping();
    }
  }, 30000);

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received data:', data);
      
      // Echo back the data for testing
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ status: 'received', data }));
      }
    } catch (error) {
      console.error('Error processing message:', error);
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ error: 'Invalid message format' }));
      }
    }
  });

  ws.on('close', () => {
    console.log('Connection closed');
    clearInterval(pingInterval);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clearInterval(pingInterval);
  });

  // Send initial connection success message
  ws.send(JSON.stringify({ status: 'connected' }));
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
});

wss.on('error', (error) => {
  console.error('WebSocket server error:', error);
});