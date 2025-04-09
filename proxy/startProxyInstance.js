const net = require('net');

function startProxyInstance({ ip, porta_tcp, porta_proxy }) {
  let clients = new Set();
  let lastActivity = Date.now();
  const TIMEOUT = 5000;
  console.log("---Instance", ip, porta_tcp, porta_proxy)
  
  const createPlaqueConnection = () => {
    const plaqueSocket = new net.Socket();
    plaqueSocket.connect(porta_tcp, ip, () => {
      console.log(`Conectado à placa ${ip}:${porta_tcp}`);
    });

    plaqueSocket.on('error', (err) => {
      if (err.code === 'ETIMEDOUT') {
        console.warn(`Timeout ao conectar com a placa ${ip}:${porta_tcp}`);
        } else {
            console.error(`Erro com a placa ${ip}:${porta_tcp}: ${err.message}`);
        }

        plaqueSocket.destroy();
    });

    plaqueSocket.on('close', () => {
      //console.log(`Conexão com a placa ${ip}:${porta_tcp} fechada`);
      setTimeout(createPlaqueConnection, 5000);
    });

    plaqueSocket.on('data', (data) => {
      lastActivity = Date.now();
      clients.forEach(client => client.write(data));
    });

    return plaqueSocket;
  };

  let plaqueSocket = createPlaqueConnection();

  setInterval(() => {
    if (Date.now() - lastActivity > TIMEOUT) {
      console.log(`Placa ${ip}:${porta_tcp} inativa. Reconectando...`);
      plaqueSocket.destroy();
      plaqueSocket = createPlaqueConnection();
    }
  }, 1000);

  const server = net.createServer((clientSocket) => {
    console.log(`Cliente conectado na porta ${porta_proxy}`);
    clients.add(clientSocket);

    clientSocket.on('close', () => clients.delete(clientSocket));
    clientSocket.on('error', () => clients.delete(clientSocket));
  });

  server.listen(porta_proxy, '0.0.0.0', () => {
    console.log(`Proxy iniciado em ${porta_proxy} -> ${ip}:${porta_tcp}`);
  });
}

module.exports = { startProxyInstance };
