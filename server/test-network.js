const net = require('net');

const HOST = 'cluster0-shard-00-00.oqwzwzq.mongodb.net';
const PORT = 27017;
const TIMEOUT_MS = 7000;

console.log(`Attempting TCP connection to ${HOST}:${PORT}...`);

const socket = new net.Socket();
socket.setTimeout(TIMEOUT_MS);

socket.on('connect', () => {
  console.log('TCP port 27017 is OPEN and reachable.');
  socket.destroy();
  process.exit(0);
});

socket.on('timeout', () => {
  console.log('TCP port 27017 is BLOCKED or unreachable: Connection timed out after 7 seconds.');
  socket.destroy();
  process.exit(1);
});

socket.on('error', (err) => {
  console.log('TCP port 27017 is BLOCKED or unreachable: ' + err.message);
  socket.destroy();
  process.exit(1);
});

socket.connect(PORT, HOST);
