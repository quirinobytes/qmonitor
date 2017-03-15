#!/usr/bin/env node

//Config
var app = require('./config/app_config');
var os = require("os");
var request = require('request');
var sys = require('util');
var exec = require('child_process').exec;
var fs = require('fs');

var connection_error_count = 0;

//Iniciando o client
console.log("qMonitor client: Iniciado..... OK");


//	API  //
//####################################### LISTAR NODES ###############
app.get ('/listar' ,function (req,res) {
function puts(error, stdout, stderr){ sys.puts(stdout); }
//var saida =	exec("ls -la", puts);
//
exec("ls -la", function(err,stdout,stderr){
	console.log(stdout);
	res.write(stdout);
	res.end();
	});

//#res.write("executei o comando");
//#res.write(saida.stdout.toString());
//res.end();
});


//########### UPTIME NODES ###############
app.get ('/uptime' ,function (req,res) {
function puts(error, stdout, stderr){ sys.puts(stdout); }
	exec("uptimee", function(err,stdout,stderr){
	console.log(stdout);
	if (stderr) {
		console.log("saida de erro="+stderr);
		res.status(500);
		res.write(stdout+" no servidor"+os.hostname());
		res.end();
	}
	else{
		console.log(os.hostname()+"comando executado com sucesso: uptime");
		res.status(200);
		res.write(" Sucesso no servidor"+os.hostname());
		res.end();

	}
		
	});
//res.write(stdout);
});


//####################################### ###############
app.get ('/x/uptime' ,function (req,res) {
		res.write(""+aliveNodes.length);
		res.end();
		console.log(aliveNodes.length);

});

//####################################### PING - ALIVE ###############
app.get ('/ping' ,function (req,res) {
		res.write("alive");
		res.end();
		console.log("REPLY PING");
});



//####################################### HELLO() ###############
function hello () {

 var options = { method: 'POST',
     url: 'http://'+qmonitorserverip+':'+serverport+'/hello',
     headers:
      { 'postman-token': '0c17b7e5-ee61-6514-60af-a7384edb97dc',
        'cache-control': 'no-cache',
        'content-type': 'application/x-www-form-urlencoded' },
     form:
      { ativo: "teste",
        quantidade: "teste",
        valor: 111,
        token: '1234abcd'
      }
    };

    req = request(options, function (error, response, body) {
       // if(error) throw new Error('Falha na conexão com o servidor')
       str_erro = "Erro ao conectar no "+qmonitorserverip+" Porta:"+serverport;
	datetime = new Date();
        if (error) {
	//	console.log(erro);
		if (connection_error_count >= 3){
			connection_error_count = 0;
			fs.appendFile(logfile,datetime+":"+str_erro+"\n");
			if (debug) console.log("#DEBUG# Erro de conexao ao servidor: "+qmonitorserverip+":"+serverport);
			return false;
		}
		else {
			connection_error_count++;
			if (verbose) console.log("#VERBOSE# Servidor indisponível #:"+connection_error_count+" Retentando em instantes");
		}
	}
	return true;
	});
}




//final do programa, mas nao para, fica em loop infinito chamando hello.

//chama e depois chama a cada 5minutos.

//so para já sair chamando...
hello();


setInterval(function () {
	if (verbose) { console.log('#VERSOSE# HELLO SERVER: '+qmonitorserverip); }
	hello()	

}, timeout); //Intervalo de 30 segundos para o HELLO 
