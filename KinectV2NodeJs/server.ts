import http = require('http');
var edge = require('edge');

var port = process.env.port || 1337

var hello = edge.func('WrapperController.cs');

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    hello('Node.js', function (error, result) {
        if (error) throw error;
        res.end(result + '\n');
    });
   
}).listen(port);

process.on('SIGTERM', function () {

});