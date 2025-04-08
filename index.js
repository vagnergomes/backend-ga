require('dotenv').config();
const express = require('express');
const session = require('express-session');
const fileupload = require('express-fileupload');
const fs = require('fs');
const cors = require('cors');
const app = express();
var path = require('path');
const { userInfo } = require('os');

const userRoutes = require('./routes/UserRoutes');
const udpRoutes = require('./routes/UdpRoutes');
const tcpRoutes = require('./routes/TcpRoutes');
const dispositivoRoutes = require('./routes/DispositivoRoutes')

const port = 5001;

//chave teste
app.use(session({secret: 'shauidxgbsaiuxsavbxsiauxvxuiaxvsaxsauisavasui'}));
app.use(express.json());
app.use(fileupload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'temp')
}));
app.use(cors());
app.use('/user', userRoutes);
app.use('/udp', udpRoutes);
app.use('/tcp', tcpRoutes);
app.use('/dispositivo', dispositivoRoutes);


app.get('/noticias', (req,res)=>{
    res.json([{'titulo':'Uma notícia!'}]);
});

app.listen(port, '0.0.0.0', () => {
    console.log('Rodando na porta '+port+'...');
})