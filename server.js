#!/usr/bin/env node

var app = require('./config/app_config');
var db = require('./config/db_config.js');
var product = require('./models/product');
var productController = require('./controllers/productController');
var os = require("os");
var request = require('request');
var fs= require('fs');
var nodesFile= 'nodes.txt';
var body="";
fs.writeFile(nodesFile,'');
var txt;

var aliveNodes = [];
var active_nodes = [];
var death_nodes = [];


//############################ HOME PAGE ######################
app.get ('/',function (req,res) {
	//Montando a pagina
	//res.write('<br> Servidor: '+os.hostname()+'<hr>');

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
		console.log(aliveNodes.length);

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
	console.log ("HELLO: " + ip);


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
	console.log('Metodo : '+metodo);



	console.log('Enviando a chamada para os nos');

	for (i = 0 ; i < aliveNodes.length ; i++){
		url = 'http://'+aliveNodes[i]+':3000/'+metodo;
		console.log("URL="+url);
		request(url, aliveNodes, function (error, response, body) {
				  if (!error && response.statusCode == 200) {
				    console.log("Retorno do servidor | GET "+url+" => "+body) // Show the HTML for the Google homepage.
				  }
		})

	}


	res.end();
});

//funcao que faz o registro de aliveNodes.
function registerNode(node){
	if (aliveNodes.indexOf(node) < 0){
		aliveNodes.push(node);
		console.log("AliveNodes.add:"+node); 
	}
}

//funcao de remove da lista de aliveNodes.
function removeNodes(node){
	if (aliveNodes.indexOf(node) >= 0){
		aliveNodes.pop(node);
		console.log("AliveNodes.del:"+node); 
	}
}


//executar o sanitize em loop de 5minutos.
setInterval(function () {
     console.log('Sanitizing....');
     sanitize();
}, 20000);




function sanitize(){
error_times=0;
for (i = 0 ; i < aliveNodes.length ; i++){
		node = aliveNodes[i];

options = { method: 'GET',
    		uri: 'http://'+node+':3000/ping',
			timeout: 3000,
		 };

		//request( 'http://'+node+':3000/ping', function (error, response, body) {
		request( options, function (error, response, body) {
				  if (!error && response.statusCode == 200) {
				    console.log("Retorno do servidor | GET "+node+" => "+body) // Show the HTML for the Google homepage.
				  }
			console.log(body);
			if (body != 'alive'){
				
				//error_times = numero de vezes que o node nao respondeu.
				if (error_times >= 0){
					removeNodes(node);
					console.log("Chamado remover para: "+node);
					error_times = 0;
				}
				else{
					console.log("Remover #"+error_times);
					error_times++;
				}
			}
		});
	}
}


