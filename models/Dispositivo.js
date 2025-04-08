

class Dispositivo {
    constructor(nome,local,ip, UDPport, TCPport, protocolo, tipo, ativo){
        this.nome = nome;
        this.local = local;
        this.ip = ip;
        this.UDPport = UDPport,
        this.TCPport = TCPport,
        this.protocolo = protocolo,
        this.tipo = tipo,
        this.ativo = ativo
    }
};

module.exports = Dispositivo;