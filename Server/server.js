/*HTTP a Websocket server

@author Jaroslav Valdauf

*/

var WebSocketServer = require('websocket').server, //Mus� b�t nainstalov�n node.js modul websocket
    http = require('http'),
    fs = require('fs'),
    path = require('path');

  
/*HTTP server

  Naslouch� na portu 8080.
  Pri pripojen� klienta zaloguje jak� soubory po�aduje
  Pred�v� html, javascript a css soubory  


       */    
var server = http.createServer(function(request, response) {

    console.log('Request starting for: ' + request.url);
    var filePath = path.join('./Ovladac/', request.url);
    if (filePath === "Ovladac\\" ) {       // V pr�pade, �e je zad�na pouze adresa s portem, otevre se str�nka index.html ve slo�ce Ovladac
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
Server pro websocketovou komunikaci, naslouch� na portu 1367
    */        
var serverForWs = http.createServer(function(request, response) {
});
serverForWs.listen('1367', function() {
    console.log("Websocket server is listening on port 1367");
});

/*Websocket server

  Po nav�z�n� spojen� zaloguje do konzole, �e bylo p�ipojen� �sp�n�

 P�i p�ijet� zpr�vy zap�e do konzole co bylo p�ijato.
 N�sledn� p�epo�le zpr�vu v�em p�ipojen�m klient�m. 

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

     