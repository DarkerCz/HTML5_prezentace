/*HTTP a Websocket server

@author Jaroslav Valdauf

*/

var WebSocketServer = require('websocket').server, //Musí být nainstalován node.js modul websocket
    http = require('http'),
    fs = require('fs'),
    path = require('path');

  
/*HTTP server

  Naslouchá na portu 8080.
  Pri pripojení klienta zaloguje jaké soubory požaduje
  Predává html, javascript a css soubory  


       */    
var server = http.createServer(function(request, response) {

    console.log('Request starting for: ' + request.url);
    var filePath = path.join('./Ovladac/', request.url);
    if (filePath === "Ovladac\\" ) {       // V prípade, že je zadána pouze adresa s portem, otevre se stránka index.html ve složce Ovladac
	  filePath = './Ovladac/index.html';
    }
    fs.exists(filePath, function(exists) {
        if (exists) {
            var extname = path.extname(filePath);
            var contentType = 'text/html';
            switch (extname) {
          	 case '.js':
                contentType = 'text/javascript';
                break;
           	 case '.css':
                contentType = 'text/css';
                break;
            }
 		 fs.readFile(filePath, function(error, content) {
                if (error) {
                    response.writeHead(500);
                    response.end(); }
                else {
                    response.writeHead(200, {
                        'Content-Type': contentType
                    });
                    response.end(content, 'utf-8');
                }}); }
		else {
            response.writeHead(404);
            response.end();
        }});
	
}).listen('8080','0.0.0.0');
    
console.log("HTTP server is listening on port 8080");

  /*
Server pro websocketovou komunikaci, naslouchá na portu 1367
    */        
var serverForWs = http.createServer(function(request, response) {
});
serverForWs.listen('1367', function() {
    console.log("Websocket server is listening on port 1367");
});

/*Websocket server

  Po navázání spojení zaloguje do konzole, že bylo pøipojení úspìšné

 Pøi pøijetí zprávy zapíše do konzole co bylo pøijato.
 Následnì pøepošle zprávu všem pøipojeným klientùm. 

     */

wsServer = new WebSocketServer({
    httpServer: serverForWs
});

    
	wsServer.on('request', function(request) {

    var connection = request.accept(null, request.origin);
	console.log('Websocket connection accepted');
	   
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
           switch(message.utf8Data) {
				case 'next':
					console.log('Received: Next slide');
					wsServer.broadcast( "next"); 
					break;
				case 'prev':
					console.log('Received: Previous slide');
                    wsServer.broadcast("prev");                     
					break;
				case 'play':
               		console.log('Received: Play');
                    wsServer.broadcast("play");
					break;
				case 'pause':
                	console.log('Received: Pause');
				 	wsServer.broadcast("pause");
					break;
				case 'stop':
                	console.log('Received: Stop');
				 	wsServer.broadcast("stop");
					break;
				default:
                	console.log('Received: Note');
					wsServer.broadcast('note' + message.utf8Data);
					break;
			}}});});

     