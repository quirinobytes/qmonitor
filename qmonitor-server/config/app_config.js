var express = require('express');
var bodyParser = require('body-parser');
var conf = require("./config.js");
var log4js = require('log4js');

log4js.configure({
appenders: [
   { type: 'console' },
   { type: 'file', filename: "logs/qmonitor-server.log", category: 'qmonitor' }
  ]
});

global.logger  = log4js.getLogger('qmonitor');
logger.setLevel('DEBUG');
//Object.defineProperty(exports, "LOG", { value:logger, });

//YARGS
var argv = require('yargs')
    .usage('Usage: $0 -d [str] -v [str] ')
//    .demandOption(['d','v'])
	.default({ d : false, v : false })
	.alias ('v','verbose')
	.alias ('d','debug')
    .argv;

if (argv.d){ global.debug = true; }
else {global.debug = false;}

if (argv.v){ global.verbose = true; }
else{ global.verbose = false;}



// #### VARIAVEIS GLOBAIS
global.qmonitorserverip = '189.55.194.115' ;
global.port = 8080;

var app = module.exports = express();

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

