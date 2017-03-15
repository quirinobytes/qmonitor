#!/usr/bin/env node

//Config
var app = require('./config/app_config');
var os = require("os");
var request = require('request');
var sys = require('sys');
var exec = require('child_process').exec;

//Iniciando o client
console.log("qMonitor client: Iniciado..... OK");


//	API  //
//####################################### LISTAR NODES ###############
app.get ('/listar' ,function (req,res) {
function puts(error, stdout, stderr){ sys.puts(stdout); }
var saida =	exec("ls -la", puts);
res.write("executei o comando");
res.write(saida.stdout.toString());
res.end();
});

//####################################### UPTIME NODES ###############
app.get ('/uptime' ,function (req,res) {
function puts(error, stdout, stderr){ sys.puts(stdout); }
	exec("uptime", puts);
//res.write(stdout);
res.end();
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
		console.log("REPLY SERVER PING");
});



//####################################### HELLO() ###############
function hello () {

 var options = { method: 'POST',
     url: 'http://'+qmonitorserverip+':'+port+'/hello',
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
        if(error) throw new Error(error)
	});
}




//final do programa, mas nao para, fica em loop infinito chamando hello.

//chama e depois chama a cada 5minutos.
hello();
setInterval(function () { 
    console.log('HELLO SERVER: '+qmonitorserverip); 
	hello();
}, 30000); 
