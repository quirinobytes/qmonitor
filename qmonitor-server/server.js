#!/usr/bin/env node

//#################################################################################################################
// qMonitor - unbound Commander
// @author Rafael Castro
// @date 2017-03-24 
//#################################################################################################################


var app = require('./config/app_config');
//var db = require('./config/db_config.js');
var product = require('./models/product');
var productController = require('./controllers/productController');
var os = require("os");
var request = require('request');
var fs= require('fs');
var nodesFile= 'nodes.txt';
var body="";
var txt;
var argv = require('yargs')
    .usage('Usage: $0 -v [str] -d [str]')
    .demandOption(['v','d','s'])
    .alias('v', 'verbose')
    .alias('d', 'debug')
    .alias('s', 'server')
    .alias('p', 'port')
    .default({v:false,d:false,s:false})
    .argv;

//########################################################## SERVER ################################################

if (argv.s) { qmonitorserverip = argv.s; }
if (argv.p) { port = argv.p; }

console.log("\n######  qMonitor Server ######\n");
console.log(" Debug = "+debug);
console.log(" Verbose = "+verbose);
console.log("Server= "+qmonitorserverip);
console.log("Port = "+port);



//Zerando o arquivo de nodes/// Parece que isso nao sera mais necessário, tentar excluir na proxima versão.
fs.writeFile(nodesFile,'');


var aliveNodes = [];
var active_nodes = [];
var death_nodes = [];


//############################ HOME PAGE ######################
app.get ('/',function (req,res) {
	fs.readFile('body.html','utf8',function(err,body){
		console.log('%s',body.toString());
		res.write(body);
	res.end('</html>');
	});
});

//####################################### LISTAR NODES ###############
app.get ('/listar' ,function (req,res) {
		res.json({servidores:aliveNodes});
});

app.get ('/total' ,function (req,res) {
		res.write(""+aliveNodes.length);
		res.end();
		var ip = req.connection.remoteAddress;

		if (ip.length < 15) 
			{   
			    ip = ip;
			}
		else
		{
		    var nyIP = ip.slice(7);
		    ip = nyIP;
		}

if (debug) { console.log("#DEBUG# CLIENT ("+ip+") REQUEST API: /total | Resp => "+aliveNodes.length); }
});



app.post ('/hello', function (req,res) {
	var nome = req.body.nome;
	var token = req.body.token;
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		if (ip.substr(0, 7) == "::ffff:") {
		  ip = ip.substr(7)
		}

	if (verbose) {	console.log ("#VERBOSE# HELLO CLIENT: adding(" + ip+")");	}
	registerNode(ip);
	res.json({cadastro:true});
});

// FUNCAO PRINCIPAL PARA ENVIO DAS CHAMADAS API AOS NOS
app.get ('/api/:nome/:parametro', function(req,res){
	var metodo = req.params.nome;
	var parametro = req.params.parametro;
	var i;

	// NAO ESQUECER DE TRATAR AS FUNCOES POSSIVEIS... SENAO MANDA TUDO

	logger.info('Comando enviado: %s',metodo);
	logger.info('Enviando a chamada para os nos '+ JSON.stringify(aliveNodes));

	for (i = 0 ; i < aliveNodes.length ; i++){
		url = 'http://'+aliveNodes[i]+':8080'+'/'+metodo+'/'+parametro;
		console.log("URL="+url);
		request(url, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					//devolvendo o retorno
					res.write(response.body);
					res.end();
				    logger.info("COMMAND Executed OK => %s ",response.request.host) // Show the HTML for the Google homepage.
					if (verbose) { console.log(body); }
						//console.log(body.toString());
						//console.log(JSON.stringify(body, null, 3));
				  }
				if (response && response.statusCode == 500) {
					logger.error("Error 500: ao executar o comando %s no servidor: %s",url,response.body);
			          }
				if (response && response.statusCode != 200) {
					console.log("Ocorreu algum erro, diferente de 500, Error Code="+response.statusCode);
				}
		})

	}


});

//funcao que faz o registro de aliveNodes.
function registerNode(node){
	if (aliveNodes.indexOf(node) < 0){
		aliveNodes.push(node);
		if (debug) console.log("AliveNodes.add:"+node);
	}
}

//funcao de remove da lista de aliveNodes.
function removeNodes(node){
	if (aliveNodes.indexOf(node) >= 0){
		aliveNodes.pop(node);
		if (debug) console.log("AliveNodes.del:"+node); 
	}
}


//executar o sanitize em loop de 5minutos.
setInterval(function () {
	if (debug) console.log('Sanitizing....');
     sanitize();
}, 20000);




function sanitize(){
error_times=0;
for (i = 0 ; i < aliveNodes.length ; i++){
		node = aliveNodes[i];

options = { method: 'GET',
    		uri: 'http://'+node+':8080/ping',
			timeout: 3000,
		 };

		//request( 'http://'+node+':3000/ping', function (error, response, body) {
		request( options, function (error, response, body) {
				  if (!error && response.statusCode == 200) {
					if (debug) console.log("PING "+node+" ?" ) // Show the HTML for the Google homepage.
					if (body === 'alive' ){
						if (debug) console.log(node+" => I am "+body+"!");
					}
				  }
				  else{
					if (debug) {
						console.log(node+" => ???");
						body='';
					}
			      }


			if (body != 'alive'){

				//error_times = numero de vezes que o node nao respondeu.
				if (error_times >= 0){
					removeNodes(node);
					if (debug) console.log("Chamado remover para: "+node);
					error_times = 0;
				}
				else{
					if (debug) console.log("Remover #"+error_times);
					error_times++;
				}
			}
		});

	}
}


