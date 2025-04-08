const net = require('net');

class TcpController {
    // Envia o comando para a placa
    static async envia(req, res) {
        const { comandoHex, nome, local, ip, porta_udp, porta_tcp, protocolo, tipo } = req.body;

        try {
                if (!comandoHex || !nome || !local || !ip || !porta_tcp) {
                    return res.status(400).json({ mensagem: 'Preencha todos os campos necessários.' });
                }

                const client = new net.Socket();
                const comandoBuffer = Buffer.from(comandoHex, 'hex');

                const timeoutDuration = 3000; // Definindo o tempo limite em milissegundos (5 segundos)

                client.connect(porta_tcp, ip, () => {
                    console.log(`Conectado à placa ${ip}:${porta_tcp}`);
                
                    // Enviar comando
                    client.write(comandoBuffer);
                    console.log(`Comando enviado: ${comandoBuffer.toString('hex').toUpperCase()}`);
                
                    // Definir timeout de resposta (3 segundos)
                    setTimeout(() => {
                        console.log('Timeout atingido. Fechando conexão...');
                        client.destroy();
                    }, timeoutDuration);
                });
                
                // Evento para receber resposta
                client.on('data', (data) => {
                    const resposta = data.toString('hex');
                    res.status(200).json({ message: `${resposta}`, nome: nome, local: local, ip: ip, porta_udp: porta_udp, porta_tcp: porta_tcp, protocolo: protocolo, tipo: tipo });
                    console.log(`Resposta da placa: ${resposta.toUpperCase()}`);
                    client.destroy(); // Fecha a conexão após a resposta
                });

                // Evento de erro
                client.on('error', (err) => {
                    // A variável `data` não está definida no contexto de erro, então removi o uso dela
                    const erroMensagem = err.message || 'Erro desconhecido';
                    res.status(500).json({ message: `Falha: ${erroMensagem}`, nome: nome, local: local, ip: ip, porta_udp: porta_udp, porta_tcp: porta_tcp, protocolo: protocolo, tipo: tipo });
                    console.log(`Erro: ${erroMensagem}`);
                    console.error(`Erro: ${erroMensagem}`);
                    client.destroy(); // Fecha a conexão em caso de erro
                });

                // Evento de fechamento da conexão
                client.on('close', () => {
                    console.log('Conexão fechada.');
                });

                

            } catch (error) {
                res.status(500).json({ message: error.message, nome: nome, local: local, ip: ip, porta_udp: porta_udp, porta_tcp: porta_tcp, protocolo: protocolo, tipo: tipo });
            }
    }
}

module.exports = TcpController;
