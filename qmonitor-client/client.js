#!/usr/bin/env node

//Config
var app = require('./config/app_config');
var os = require("os");
var request = require('request');
var sys = require('util');
var exec = require('child_process').exec;
var fs = require('fs');
var connection_error_count = 0;


//###############
//#             #
//#	  CLIENT    #
//#	            #
//###############



var argv = require('yargs')
    .usage('Usage: $0 -v [str] -d [str]')
    .demandOption(['v','d','s'])
	.alias('v', 'verbose')
	.alias('d', 'debug')
	.alias('s', 'server')
	.alias('p', 'port')
	.alias('t', 'timeout')
	
	.default({v:false,d:false,s:false})
    .argv;

if (argv.d) { global.debug = true; }
else { global.debug = false; }
if (argv.v) { global.verbose = true; }
else { global.verbose = false ; }
if (argv.s) { server = argv.s; }
else {global.server = false};
if (argv.p) { global.port = argv.p; }
else {global.port = false};
if (argv.t) { global.timeout = argv.t*1000; }
else {global.timeout = false};


if (server) { qmonitorserverip = global.server }
if (port) { serverport = global.port }


//Iniciando o client
console.log("qMonitor client: Iniciado..... OK");
console.log("Verbose = "+global.verbose);
console.log("Debug = "+global.debug);
console.log("Server= "+qmonitorserverip);
console.log("Port = "+serverport);


//	API  //
//####################################### LISTAR NODES ###############
app.get ('/flushzone/:fqdn' ,function (req,res) {

	var fqdn = req.params.fqdn
	fqdn = fqdn.replace(/[;$`]/gi,"");

	if (fqdn === undefined ){
	exit ;
	}

	if(debug) console.log("fqdn= "+fqdn);
	function puts(error, stdout, stderr){
		sys.puts(stdout);
	}
	exec("unbound-control flush "+fqdn, function(err,stdout,stderr){
		if(debug) { 
			console.log(stdout);
			console.log("#DEBUG# Comando executado: "+ "unbound-control flush "+fqdn);
		}
		res.write(os.hostname()+': '+stdout);
		res.end();
		var log = {hostame:os.hostname(),logstring:stdout,time:date()};
		envialog(log);
	});

//#res.write("executei o comando");
//#res.write(saida.stdout.toString());
//res.end();
});


//########### UPTIME NODES ###############
app.get ('/flushhost/:fqdn' ,function (req,res) {

	var fqdn = req.params.fqdn
	function puts(error, stdout, stderr){ sys.puts(stdout); }
	exec("unbound-control flush gibati.com.br", function(err,stdout,stderr){
		if(debug) console.log(stdout);
	    if (stderr) {
		   if (debug) console.log("#DEBUG# Erro: Saida de erro => "+stderr);
		   res.status(500);
		   res.write(stdout+" node: "+os.hostname());
		   res.end();
	    }
	    else{
		    if (debug) {  console.log(os.hostname()+"#DEBUG# Flush Zone executado com sucesso: "+"unbound-control flush HOST => "+stdout);  }
			//EXECUTADO COM SUCESSO
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
		if (debug) console.log(aliveNodes.length);

});

//####################################### PING - ALIVE ###############
app.get ('/ping' ,function (req,res) {
		res.write("alive");
		res.end();
		if (debug) console.log("REPLY PING");
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
			if (debug) console.log("#ERROR# Servidor indisponível #:"+connection_error_count+" Retentando em instantes");
		}
	}
	return true;
	});
}


//####################################### HELLO() ###############
function envialog (log) {
	var options = {
		method: 'POST',
		url: 'http://'+qmonitorserverip+':'+serverport+'/setlogboard',
	    headers: {
				'postman-token': '0c17b7e5-ee61-6514-60af-a7384edb97dc',
			  	'cache-control': 'no-cache',
		      	'content-type': 'application/x-www-form-urlencoded'
				},
		form:{
				hostname: log.hostname,
				logstring: log.logstring,
				time: log.time,
				token: '1234abcd'
			 }
	    };

    req = request(options, function (error, response, body) {
        if (error) {
				if (debug) console.log("#DEBUG# Error in envialog(log) => Erro de conexao ao servidor: "+qmonitorserverip+":"+serverport);
				return false;
			}
			else {
				if (debug) console.log("#DEBUG# Success: log sent with success! => "+body+"  | SERVER RESPONSE => " + response.body );
				return true;
			}
		});
}



//final do programa, mas nao para, fica em loop infinito chamando hello.

//chama e depois chama a cada 5minutos.

//so para já sair chamando...
hello();


setInterval(function () {
	if (verbose) { console.log('#VERSOSE# HELLO SERVER: '+qmonitorserverip); }
	hello()	

}, global.timeout); //Intervalo de 30 segundos para o HELLO 
