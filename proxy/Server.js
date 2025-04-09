const service = require('../services/DispositivoServices');
const { startProxyInstance } = require('./startProxyInstance');

async function main() {
  const dispositivos = await service.getDispositivosProxies();
  const dispositivosPlanos = dispositivos.flat();
  
  dispositivosPlanos.forEach(dispositivo => {
 
    const device = {
      ip: dispositivo.ip,
      porta_tcp: dispositivo.TCPport,
      porta_proxy: dispositivo.porta_proxy,
    };
    startProxyInstance(device);
  });
}

main();
