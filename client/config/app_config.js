var express = require('express');
var bodyParser = require('body-parser');

// #### VARIAVEIS GLOBAIS
global.qmonitorserverip = 'dev1' ;
global.port = 8080;
serverport = 8080;
logfile='/var/log/qmonitor.log';

//setting timeout 20s
timeout=20000;


var app = module.exports = express();
console.log("\n######  qMonitor Client ######\n");

//Abrindo a porta da aplicação Client
app.listen(port);

//Configurar o uso do body-parser para receber URL encoded
app.use(bodyParser.urlencoded({extended:true}));

//Configurar o bodyparser para receber Json tmb.
app.use(bodyParser.json());

// Configurar outras aplicações que possam usar a API.
app.use (function (req,res,next){
// Permitindo acesso a todo mundo * / definir do cliente IP.
res.setHeader ('Access-Control-Allow-Origin', '*');
// Definir os metodos HTTP que poderão ser aceitos.
res.setHeader ('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
 // Definir os cabeçalhos que serão aceitos.
res.setHeader ('Access-Control-Allow-Headers', 'X-Requested-With', 'content-type','Authorization');
next();
})

