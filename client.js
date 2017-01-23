#!/usr/bin/env node

var app = require('./config/app_config');
var os = require("os");
var request = require('request');
var sys = require('sys');
var exec = require('child_process').exec;

console.log("qMonitor client: Iniciado..... OK");

//####################################### LISTAR NODES ###############
app.get ('/listar' ,function (req,res) {
function puts(error, stdout, stderr){ sys.puts(stdout); }
	exec("ls -la", puts);
//res.write(stdout);
res.end();
});

//####################################### LISTAR NODES ###############
app.get ('/uptime' ,function (req,res) {
function puts(error, stdout, stderr){ sys.puts(stdout); }
	exec("uptime", puts);
//res.write(stdout);
res.end();
});


app.get ('/x/uptime' ,function (req,res) {
		res.write(""+aliveNodes.length);
		res.end();
		console.log(aliveNodes.length);

});

app.get ('/ping' ,function (req,res) {
		res.write("alive");
		res.end();
		console.log("ping - alive");
});



function hello () {

 var options = { method: 'POST',
     url: 'http://172.23.2.134:3000/hello',
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
		console.log("erro: "+error);
	});
}


//chama e depois chama a cada 5minutos.
hello();
setInterval(function () { 
    console.log('second passed'); 
	hello();
}, 30000); 
