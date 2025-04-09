const DispositivoService = require('../services/DispositivoServices');

class UdpController {
    // Envia o comando para a placa
    static async envia(req, res) {
        const { tipo_solicitacao, nome, local, ip, porta_udp, porta_tcp, protocolo, tipo } = req.body;
        //const comandoHex = "";

        const comandoHex =  await DispositivoService.getComando(tipo_solicitacao, tipo, protocolo);

        // condição do protocolo caso essa funcao seja chamada sem passar pelo router principal
        if(protocolo === "TCP"){
            res.status(200).json({ message: tipo, nome: nome, local: local, ip: ip, porta_udp: porta_udp, porta_tcp: porta_tcp, protocolo: protocolo, tipo: tipo });
        }
        if(protocolo === "UDP"){

            try {
                    if (!comandoHex || !nome || !local || !ip || !porta_udp) {
                        return res.status(400).json({ mensagem: 'Preencha todos os campos necessários.' });
                    }

                    const dgram = require('dgram');
                    const comandoBuffer = Buffer.from(comandoHex, 'hex');
                    // Cria um socket UDP
                    const client = dgram.createSocket('udp4');

                    const timeoutDuration = 5000; // Definindo o tempo limite em milissegundos (5 segundos)


                    // Envia o comando para a placa
                    client.send(comandoBuffer, porta_udp, ip, (err) => {
                        if (err) {
                            res.status(500).json({ message: `Erro ao enviar comando:  ${err}`, nome: nome, local: local, ip: ip, porta_udp: porta_udp, porta_tcp: porta_tcp, protocolo: protocolo, tipo: tipo });
                            client.close();
                        } else {
                            //console.log(`Comando enviado com sucesso. Aguardando resposta...`, ip);
                        }
                    });

                    // Aguarda a resposta da placa
                    client.on('message', (msg, rinfo) => {
                        const resposta = msg.toString('hex');
                        //console.log(`Resposta recebida da placa: ${resposta}`, ip);
                        res.status(200).json({ message: `${resposta}`, nome: nome, local: local, ip: ip, porta_udp: porta_udp, porta_tcp: porta_tcp, protocolo: protocolo, tipo: tipo });

                        client.close();    
                    });

                    
                    // Timeout manual usando setTimeout
                    const timeout = setTimeout(() => {
                        //console.log('Nenhuma resposta recebida dentro do tempo limite.', ip);
                        res.status(408).json({ message: 'Nenhuma resposta recebida dentro do tempo limite.', nome: nome, local: local, ip: ip, porta_udp: porta_udp });
                        client.close(); // Fecha o socket após o timeout
                    }, timeoutDuration);

                    // Cancela o timeout se a resposta for recebida
                    client.on('message', () => {
                        clearTimeout(timeout); // Cancela o timeout se uma resposta for recebida
                    });


                    // Trata erros no socket
                    client.on('error', (err) => {
                        //console.error(`Erro ao enviar o comando: ${err}`, ip);
                        res.status(500).json({ message: `Erro ao enviar o comando: ${err}`, nome: nome, local: local, ip: ip, porta_udp: porta_udp, porta_tcp: porta_tcp, protocolo: protocolo, tipo: tipo });
                        client.close();
                    });

                } catch (error) {
                    res.status(500).json({ message: error.message, nome: nome, local: local, ip: ip, porta_udp: porta_udp, porta_tcp: porta_tcp, protocolo: protocolo, tipo: tipo });
                }
        }
    }
}

module.exports = UdpController;
