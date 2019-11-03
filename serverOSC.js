// $ npm run package-win  
//import '/dist/css/grapes.min.css';
// If you need plugins, put them below the main grapesjs script
// import 'grapesjs-some-plugin';

//var grapesjs = require('grapejs')
var express = require('express')
var app = express()
app.use(express.static(__dirname + '/public'));
var osc = require('osc');
//BRIDGE Between Client and Server
var io = require('socket.io')(8081);
var config = require("./public/config.js");

//Connection between Server and App to be controlled
var oscConnections = [];
var isConnected = [];

var udpPortGlobal = new osc.UDPPort({
	localAddress: "localhost",
	localPort: 5000,
	metadata: true,
});
udpPortGlobal.open()

//Send OSC Message over UDP
function sendOSCMessage(ip, port, addressp, type, value) {
	var msg = {
		address: addressp,
		args: [
			{
				type: type,
				value: value
			}
		]
	};
	console.log("Sending message", msg.address, msg.args, "to", ip + ":" + port);
	udpPortGlobal.send(msg, ip, port);
}

io.sockets.on('connection', function (socket) {
	console.log('Web sockect is connected between OSCAR and Local Server');
	socket.on("config", function (obj) {
		console.log("Receive Config: ", obj.client.host, obj.client.port)
		var device = { ip: obj.client.host, port: obj.client.port }
		oscConnections.push(device);
		isConnected.push(true);
	})
	socket.on("message", function (ip, port, addressp, type, value) {
			try {
				sendOSCMessage(ip, port, addressp, type, value);
			}
			catch (err) {
				console.log("ERROR: ", err)
			}
	});
	socket.on("code", function (obj) {
		//console.log(code);
	});
})

//SERVER
app.get('/server', function (req, res) {
	res.send(code);
})

app.listen(8080, config.ip, function () {
	console.log('Example app listening on port 8080!')
})




