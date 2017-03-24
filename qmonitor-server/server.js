#!/usr/bin/env node

var app = require('./config/app_config');
//var db = require('./config/db_config.js');
var product = require('./models/product');
var productController = require('./controllers/productController');
var os = require("os");
var request = require('request');
var fs= require('fs');
var nodesFile= 'nodes.txt';
var body="";
fs.writeFile(nodesFile,'');
var txt;


console.log("\n######  qMonitor Server ######\n");
console.log(" Debug = "+debug);
console.log(" Verbose = "+verbose);


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
if (debug) { console.log(aliveNodes.length); }
});



app.post ('/hello', function (req,res) {
	var nome = req.body.nome;
	var tamanho = req.body.tamanho;
	var cor = req.body.cor;
	var valor = req.body.valor;

	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		if (ip.substr(0, 7) == "::ffff:") {
		  ip = ip.substr(7)
		}

	if (verbose) {
	console.log ("#VERBOSE# HELLO CLIENT: " + ip);
	}

	//aliveNodes.push(ip);
	registerNode(ip);
	res.json({cadastro:true});
});



app.post ('/cadastrar', function (req,res) {
	var nome = req.body.nome;
	var tamanho = req.body.tamanho;
	var cor = req.body.cor;
	var valor = req.body.valor;

	productController.save(nome,tamanho,cor,valor,function(resp){
		res.json(resp);
	});

	fs.writeFile(nodesFile,req.connection.remoteAddress);

});


app.get ('/api/:nome', function(req,res){
	var metodo = req.params.nome;
	var i;

//	productController.delete(id, function(resp){
//		res.json(resp);
//	});
	logger.info('Comando : %s',metodo);
	logger.info('Enviando a chamada para os nos');

	for (i = 0 ; i < aliveNodes.length ; i++){
		url = 'http://'+aliveNodes[i]+':8080'+'/'+metodo;
		console.log("URL="+url);
		request(url, function (error, response, body) {
				if (!error && response.statusCode == 200) {
				    logger.info("COMMAND Executed OK => %s ",response.request.host) // Show the HTML for the Google homepage.
					if (debug) { console.log(body); }
						//console.log(body.toString());
						//console.log(JSON.stringify(body, null, 3));
				  }
				if (response.statusCode == 500) {
					logger.error("Error 500: ao executar o comando %s no servidor: %s",url,response.body);
			          }
				if (response.statusCode != 200) {
					console.log("Ocorreu algum erro, diferente de 500, Error Code="+response.statusCode);
				}
		})

	}


	res.end();
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


